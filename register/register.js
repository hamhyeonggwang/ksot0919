/* ===== 신청 폼 공통 JS =====
 * 단일 제출: Supabase Edge Function `submit` (DB + Storage + Sheets)
 * 설정: docs/SUBMIT-SETUP.md
 */

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXT = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'hwp'];

/** form_type → 필수 파일 input name */
const REQUIRED_FILES = {
  '포스터 및 구두발표 접수': ['abstract_file'],
  '우수 학위논문 접수': [
    'recommendation_file',
    'grad_cert_file',
    'similarity_file',
    'thesis_file',
  ],
  '캡스톤 디자인 접수': ['capstone_file'],
};

function isSubmitReady() {
  return typeof getSubmitUrl === 'function' && getSubmitUrl().length > 0
    && typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 0;
}

function validateFiles(form, formType) {
  const required = REQUIRED_FILES[formType] || [];
  for (const name of required) {
    const input = form.querySelector(`input[name="${name}"]`);
    const file = input?.files?.[0];
    if (!file) {
      throw new Error('필수 파일을 모두 첨부해 주세요.');
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      throw new Error(`허용되지 않는 파일 형식입니다: ${file.name}`);
    }
    if (file.size > MAX_FILE_BYTES) {
      throw new Error(`파일 크기는 10MB 이하여야 합니다: ${file.name}`);
    }
  }

  for (const input of form.querySelectorAll('input[type="file"]')) {
    const file = input.files?.[0];
    if (!file) continue;
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      throw new Error(`허용되지 않는 파일 형식입니다: ${file.name}`);
    }
    if (file.size > MAX_FILE_BYTES) {
      throw new Error(`파일 크기는 10MB 이하여야 합니다: ${file.name}`);
    }
  }
}

async function submitForm(form) {
  if (!isSubmitReady()) {
    throw new Error('현재 신청 시스템을 준비 중입니다.\n잠시 후 다시 시도해 주세요.');
  }

  const formType = new FormData(form).get('form_type');
  validateFiles(form, formType);

  const body = new FormData(form);

  const res = await fetch(getSubmitUrl(), {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON_KEY },
    body,
  });

  let result;
  try {
    result = await res.json();
  } catch {
    throw new Error('서버 응답을 처리할 수 없습니다.');
  }

  if (!res.ok || !result.ok) {
    throw new Error(result.message || '제출에 실패했습니다.');
  }
}

function renderFormDownloads() {
  const container = document.getElementById('form-downloads');
  if (!container || typeof FORM_DOWNLOADS === 'undefined') return;

  const key = container.dataset.form;
  const items = FORM_DOWNLOADS[key] || [];
  if (!items.length) {
    container.innerHTML = '<p class="hint">양식 파일 준비 중입니다.</p>';
    return;
  }

  container.innerHTML = items.map((item) => {
    const url = getTemplatePublicUrl(item.path);
    if (!url) {
      return `<p class="hint">${item.label} — URL 설정 필요</p>`;
    }
    return `<a class="download-btn" href="${url}" download target="_blank" rel="noopener noreferrer">${item.label} 다운로드</a>`;
  }).join('');
}

function showSuccess(form) {
  form.style.display = 'none';
  const roleSelect = document.getElementById('role-select');
  if (roleSelect) roleSelect.style.display = 'none';
  document.getElementById('success-msg').classList.add('visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function defaultBtnLabel(btn) {
  return btn.dataset.defaultLabel || '신청하기';
}

document.addEventListener('DOMContentLoaded', () => {
  renderFormDownloads();

  const form = document.getElementById('reg-form');
  const btn = document.getElementById('submit-btn');
  if (!form || !btn) return;

  btn.dataset.defaultLabel = btn.textContent.trim();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    for (const group of form.querySelectorAll('[data-min-check]')) {
      if (group.closest('fieldset')?.disabled) continue;
      if (group.querySelectorAll('input[type="checkbox"]:checked').length === 0) {
        alert(group.dataset.minCheckMsg || '항목을 1개 이상 선택해 주세요.');
        group.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    btn.disabled = true;
    btn.textContent = '제출 중...';

    try {
      await submitForm(form);
      showSuccess(form);
    } catch (err) {
      alert(err.message || '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      btn.disabled = false;
      btn.textContent = defaultBtnLabel(btn);
    }
  });
});
