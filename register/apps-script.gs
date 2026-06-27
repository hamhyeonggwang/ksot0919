/**
 * 2026 OT Beyond Borders — Google Sheets 동기화
 *
 * Supabase Edge Function `submit` → doPost (source=supabase) → 시트 append
 *
 * 설정: docs/SUBMIT-SETUP.md
 * Script Properties: WEBHOOK_SECRET
 */

// ✏️ 편집: 접수용 스프레드시트 ID
const SPREADSHEET_ID = '1seHYNx8pjqmlHAME6FmPMiRGO-RzO91_8lIZcK8rN2Y';

// VIP RSVP 직접 제출 시 사용하는 시크릿 (Script Properties에 VIP_SECRET 설정)
// ✏️ 편집: Script Properties > VIP_SECRET 값을 vip-config.js의 VIP_SECRET과 동일하게 설정

// 폼 구분(form_type)별 시트 이름·열 구성
const SHEET_CONFIG = {
  '임상가': {
    sheetName: '보수교육_임상가',
    columns: [
      ['제출시각',                 'timestamp'],
      ['성명',                     'name'],
      ['이메일',                   'email'],
      ['핸드폰',                   'phone'],
      ['신청교육명',               'courses'],
      ['보수교육 신청 유무',       'ceu_apply'],
      ['협회 ID',                  'kaot_id'],
      ['협회 회원등급',            'kaot_grade'],
      ['면허번호',                 'license_no'],
      ['임상경력(년)',             'career_years'],
      ['교육비 합계',              'fee_total'],
      ['납부방법',                 'pay_method'],
      ['기관납부 입금자명',        'payer_name'],
      ['환불 은행',                'refund_bank'],
      ['환불 계좌번호',            'refund_account'],
      ['이수증 발급 신청',         'certificate'],
      ['교육비 납부 확인',         'agree_payment'],
      ['환불기준 확인',            'agree_refund'],
      ['개인정보 동의',            'agree_privacy'],
      ['Supabase ID',              'supabase_id'],
    ],
  },
  '일반회원': {
    sheetName: '보수교육_일반회원',
    columns: [
      ['제출시각',                 'timestamp'],
      ['성명',                     'name'],
      ['생년월일',                 'birth'],
      ['소속',                     'affiliation'],
      ['핸드폰',                   'phone'],
      ['이메일',                   'email'],
      ['신청교육명',               'courses'],
      ['교육비 합계',              'fee_total'],
      ['납부방법',                 'pay_method'],
      ['기관납부 입금자명',        'payer_name'],
      ['환불 은행',                'refund_bank'],
      ['환불 계좌번호',            'refund_account'],
      ['이수증 발급 신청',         'certificate'],
      ['교육비 납부 확인',         'agree_payment'],
      ['환불기준 확인',            'agree_refund'],
      ['개인정보 동의',            'agree_privacy'],
      ['Supabase ID',              'supabase_id'],
    ],
  },
  '대학원생 워크숍': {
    sheetName: '대학원생_워크숍',
    columns: [
      ['제출시각',                 'timestamp'],
      ['성명',                     'name'],
      ['소속(학교)',               'affiliation'],
      ['학위과정',                 'degree'],
      ['학위과정(기타)',           'degree_etc'],
      ['이메일',                   'email'],
      ['핸드폰',                   'phone'],
      ['관심 주제',                'interest'],
      ['입금자명',                 'payer_name'],
      ['교육비 납부 확인',         'agree_payment'],
      ['환불 은행',                'refund_bank'],
      ['환불 계좌번호',            'refund_account'],
      ['환불기준 확인',            'agree_refund'],
      ['개인정보 동의',            'agree_privacy'],
      ['Supabase ID',              'supabase_id'],
    ],
  },
  '포스터 및 구두발표 접수': {
    sheetName: '포스터_구두발표',
    columns: [
      ['제출시각',                 'timestamp'],
      ['성명',                     'name'],
      ['소속',                     'affiliation'],
      ['핸드폰',                   'phone'],
      ['이메일',                   'email'],
      ['저자 구분',                'author_role'],
      ['발표 종류',                'pres_type'],
      ['포스터 개수',              'poster_count'],
      ['논문 제목',                'title'],
      ['공동 저자',                'co_authors'],
      ['발표 분야',                'field'],
      ['초록양식 확인',            'abstract_format'],
      ['접수비 확인',              'fee_confirm'],
      ['개인정보 동의',            'agree_privacy'],
      ['논문초록 URL',             'abstract_file_url'],
      ['Supabase ID',              'supabase_id'],
    ],
  },
  '우수 학위논문 접수': {
    sheetName: '우수_학위논문',
    columns: [
      ['제출시각',                 'timestamp'],
      ['성명',                     'name'],
      ['생년월일',                 'birth'],
      ['연락처',                   'phone'],
      ['소속대학원',               'grad_school'],
      ['학위 취득(예정)일',        'degree_date'],
      ['게재(예정) 학회지',        'journal_status'],
      ['학회지명 권(호)',          'journal_detail'],
      ['논문명',                   'title'],
      ['언어',                     'thesis_language'],
      ['취득학위',                 'degree_type'],
      ['지도교수',                 'advisor'],
      ['심사위원',                 'committee'],
      ['발표 분야',                'field'],
      ['연구내용 요약',            'summary_research'],
      ['학문적 기여도',            'summary_contribution'],
      ['학문적 중요도',            'summary_importance'],
      ['개인정보 동의',            'agree_privacy'],
      ['추천서 URL',               'recommendation_file_url'],
      ['졸업증명서 URL',           'grad_cert_file_url'],
      ['유사도검사 URL',           'similarity_file_url'],
      ['논문 PDF URL',             'thesis_file_url'],
      ['Supabase ID',              'supabase_id'],
    ],
  },
  '캡스톤 디자인 접수': {
    sheetName: '캡스톤_디자인',
    columns: [
      ['제출시각',                 'timestamp'],
      ['대표자 성명',              'name'],
      ['소속 대학교',              'affiliation'],
      ['학년',                     'grade'],
      ['연락처',                   'phone'],
      ['이메일',                   'email'],
      ['팀명',                     'team_name'],
      ['팀원 수',                  'team_size'],
      ['팀원 전체 이름',           'team_members'],
      ['발표 제목',                'title'],
      ['지도교수 성함',            'advisor_name'],
      ['지도교수 연락처',          'advisor_phone'],
      ['지도교수 이메일',          'advisor_email'],
      ['경진대회 동의',            'agree_competition'],
      ['개인정보 동의',            'agree_privacy'],
      ['결과물 URL',               'capstone_file_url'],
      ['Supabase ID',              'supabase_id'],
    ],
  },
};

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    // VIP RSVP 직접 제출 경로
    if (body.source === 'vip-direct') {
      return handleVipDirect_(body);
    }

    if (body.source !== 'supabase') {
      throw new Error('Direct submission is disabled. Use Supabase submit function.');
    }

    verifyBodySecret_(body);
    return handleSupabaseSync_(body);
  } catch (err) {
    return jsonResponse_({ result: 'error', message: String(err) });
  }
}

/** VIP RSVP 직접 제출 처리 */
function handleVipDirect_(body) {
  const expected = PropertiesService.getScriptProperties().getProperty('VIP_SECRET');
  if (!expected || body.secret !== expected) throw new Error('Invalid VIP secret');

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const headers = ['제출시각', '성함', '소속', '직책', '핸드폰', '이메일', '학술대회 참석', '오찬 참석', '비고'];
  const sheet = getOrCreateSheet_(ss, 'VIP_참석확인', headers);

  sheet.appendRow([
    formatKST_(new Date()),
    body.name        || '',
    body.affiliation || '',
    body.position    || '',
    body.phone       || '',
    body.email       || '',
    body.attend_main  || '',
    body.attend_lunch || '',
    body.note        || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Supabase submit → Sheets */
function handleSupabaseSync_(body) {
  const formType = body.form_type;
  const config = SHEET_CONFIG[formType];
  if (!config) throw new Error('Unknown form_type: ' + formType);

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const headers = config.columns.map(function(c) { return c[0]; });
  const sheet = getOrCreateSheet_(ss, config.sheetName, headers);

  const supabaseId = body.supabase_id || '';
  if (supabaseId && rowExists_(sheet, 'Supabase ID', supabaseId)) {
    return jsonResponse_({ result: 'success', skipped: true });
  }

  const data = Object.assign({}, body.record || {});
  data.supabase_id = supabaseId;
  if (!data.timestamp) {
    data.timestamp = formatKST_(data.created_at || new Date());
  }

  sheet.appendRow(config.columns.map(function(c) { return data[c[1]] || ''; }));
  return jsonResponse_({ result: 'success' });
}

/** body.secret 으로 webhook 인증 */
function verifyBodySecret_(body) {
  const expected = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
  if (!expected || body.secret !== expected) throw new Error('Invalid webhook secret');
}

/** 시트에 Supabase ID 중복 여부 */
function rowExists_(sheet, headerName, value) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colIndex = headers.indexOf(headerName);
  if (colIndex < 0 || sheet.getLastRow() < 2) return false;

  const col = colIndex + 1;
  const values = sheet.getRange(2, col, sheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(value)) return true;
  }
  return false;
}

function formatKST_(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return Utilities.formatDate(d, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** 시트가 없으면 만들고 1행에 헤더를 채움 */
function getOrCreateSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, sheet.getMaxRows(), headers.length).setNumberFormat('@');
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#fde8df');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** 동작 확인용: 브라우저로 배포 URL을 열면 표시됨 */
function doGet() {
  return ContentService.createTextOutput('2026 OT Beyond Borders 접수 시스템이 정상 동작 중입니다.');
}
