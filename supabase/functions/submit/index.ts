import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FORM_TABLE: Record<string, string> = {
  '임상가': 'submissions_ceu_clinician',
  '학생': 'submissions_ceu_student',
  '대학원생 워크숍': 'submissions_workshop',
  '포스터 및 구두발표 접수': 'submissions_poster',
  '우수 학위논문 접수': 'submissions_oral',
  '캡스톤 디자인 접수': 'submissions_capstone',
};

const REQUIRED_FILES: Record<string, string[]> = {
  '포스터 및 구두발표 접수': ['abstract_file'],
  '우수 학위논문 접수': [
    'recommendation_file',
    'grad_cert_file',
    'similarity_file',
    'thesis_file',
  ],
  '캡스톤 디자인 접수': ['capstone_file'],
};

const FILE_FIELDS: Record<string, { path: string; url: string }> = {
  abstract_file: { path: 'abstract_file_path', url: 'abstract_file_url' },
  recommendation_file: { path: 'recommendation_file_path', url: 'recommendation_file_url' },
  grad_cert_file: { path: 'grad_cert_file_path', url: 'grad_cert_file_url' },
  similarity_file: { path: 'similarity_file_path', url: 'similarity_file_url' },
  thesis_file: { path: 'thesis_file_path', url: 'thesis_file_url' },
  capstone_file: { path: 'capstone_file_path', url: 'capstone_file_url' },
};

const SKIP_FIELDS = new Set(['form_type']);
const META_FIELDS = new Set(['id', 'status', 'synced_at', 'sync_error', 'created_at']);

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXT = new Set(['pdf', 'doc', 'docx', 'ppt', 'pptx', 'hwp']);
const BUCKET = 'submissions-2026';
const SIGNED_URL_TTL = 60 * 60 * 24 * 90;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ ok: false, message: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const gasUrl = Deno.env.get('GAS_WEBHOOK_URL')!;
  const webhookSecret = Deno.env.get('WEBHOOK_SECRET')!;
  const admin = createClient(supabaseUrl, serviceKey);

  let table = '';
  let rowId = '';
  let inserted = false;
  const uploadedPaths: string[] = [];

  try {
    const formData = await req.formData();
    const fields: Record<string, string> = {};
    const files: Record<string, File> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size > 0) files[key] = value;
      } else {
        fields[key] = key in fields ? `${fields[key]}, ${value}` : String(value);
      }
    }

    const formType = fields.form_type;
    if (!formType || !FORM_TABLE[formType]) {
      return json({ ok: false, message: '알 수 없는 신청 유형입니다.' }, 400);
    }

    table = FORM_TABLE[formType];
    rowId = crypto.randomUUID();

    const required = REQUIRED_FILES[formType] || [];
    for (const name of required) {
      if (!files[name]) {
        return json({ ok: false, message: `필수 파일이 누락되었습니다: ${name}` }, 400);
      }
    }

    for (const [name, file] of Object.entries(files)) {
      validateFile(file);
    }

    const row: Record<string, string> = { status: 'pending' };
    for (const [key, value] of Object.entries(fields)) {
      if (SKIP_FIELDS.has(key) || META_FIELDS.has(key)) continue;
      row[key] = value;
    }

    const sheetRecord: Record<string, string> = { ...row };
    sheetRecord.timestamp = formatKST(new Date().toISOString());

    for (const [inputName, file] of Object.entries(files)) {
      const mapping = FILE_FIELDS[inputName];
      if (!mapping) continue;

      const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
      const path = `${table}/${rowId}/${inputName}.${ext}`;

      const buffer = await file.arrayBuffer();
      const { error: upErr } = await admin.storage
        .from(BUCKET)
        .upload(path, buffer, { contentType: file.type || 'application/octet-stream', upsert: false });

      if (upErr) throw new Error(`파일 업로드 실패: ${upErr.message}`);

      uploadedPaths.push(path);
      row[mapping.path] = path;

      const { data: signed, error: signErr } = await admin.storage
        .from(BUCKET)
        .createSignedUrl(path, SIGNED_URL_TTL);

      if (signErr) throw new Error(`파일 URL 생성 실패: ${signErr.message}`);
      row[mapping.url] = signed.signedUrl;
      sheetRecord[mapping.url] = signed.signedUrl;
    }

    const { error: insertErr } = await admin.from(table).insert({ id: rowId, ...row });
    if (insertErr) throw new Error(`DB 저장 실패: ${insertErr.message}`);
    inserted = true;

    const gasRes = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'supabase',
        secret: webhookSecret,
        form_type: formType,
        supabase_id: rowId,
        record: { ...sheetRecord, created_at: new Date().toISOString() },
      }),
    });

    const gasText = await gasRes.text();
    let gasJson: { result?: string; message?: string } = {};
    try { gasJson = JSON.parse(gasText); } catch { /* ignore */ }

    if (!gasRes.ok || gasJson.result === 'error') {
      const errMsg = gasJson.message || gasText || 'Google Sheets 동기화 실패';
      await admin.from(table).update({ status: 'failed', sync_error: errMsg }).eq('id', rowId);
      return json({ ok: false, message: errMsg }, 500);
    }

    await admin.from(table).update({
      status: 'synced',
      synced_at: new Date().toISOString(),
      sync_error: null,
    }).eq('id', rowId);

    return json({ ok: true, id: rowId }, 200);
  } catch (err) {
    if (uploadedPaths.length) {
      await admin.storage.from(BUCKET).remove(uploadedPaths);
    }
    if (inserted && table && rowId) {
      await admin.from(table).update({
        status: 'failed',
        sync_error: String(err),
      }).eq('id', rowId);
    }
    return json({ ok: false, message: String(err) }, 500);
  }
});

function validateFile(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error(`허용되지 않는 파일 형식: ${file.name}`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`파일 크기는 10MB 이하여야 합니다: ${file.name}`);
  }
}

function formatKST(iso: string): string {
  return new Date(iso).toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).replace('T', ' ').slice(0, 19);
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
