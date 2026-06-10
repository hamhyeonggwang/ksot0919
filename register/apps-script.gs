/**
 * 2026 OT Beyond Borders — 신청 폼 → Google 스프레드시트 수집
 *
 * 사용법: docs/SHEETS-SETUP.md 참조
 * 1) 스프레드시트의 확장 프로그램 > Apps Script에 이 코드 전체를 붙여넣기
 * 2) 배포 > 새 배포 > 웹 앱 (액세스: 모든 사용자)
 * 3) 발급된 URL을 register/register.js 의 SCRIPT_URL에 입력
 */

// ✏️ 편집: 접수용 스프레드시트 ID
const SPREADSHEET_ID = '1ULBG3ILsMKq5zzOqZyADBv_26vhjBm0ta-7Hw0VdDsc';

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
      ['환불 은행',                'refund_bank'],
      ['환불 계좌번호',            'refund_account'],
      ['이수증 발급 신청',         'certificate'],
      ['교육비 납부 확인',         'agree_payment'],
      ['입금자명 안내 확인',       'agree_deposit'],
      ['환불기준 확인',            'agree_refund'],
      ['개인정보 동의',            'agree_privacy'],
    ],
  },
  '학생': {
    sheetName: '보수교육_학생',
    columns: [
      ['제출시각',                 'timestamp'],
      ['성명',                     'name'],
      ['생년월일',                 'birth'],
      ['소속',                     'affiliation'],
      ['핸드폰',                   'phone'],
      ['이메일',                   'email'],
      ['신청교육명',               'courses'],
      ['환불 은행',                'refund_bank'],
      ['환불 계좌번호',            'refund_account'],
      ['이수증 발급 신청',         'certificate'],
      ['교육비 납부 확인',         'agree_payment'],
      ['입금자명 안내 확인',       'agree_deposit'],
      ['환불기준 확인',            'agree_refund'],
      ['개인정보 동의',            'agree_privacy'],
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
    ],
  },
  '포스터 발표': {
    sheetName: '포스터_발표',
    columns: [
      ['제출시각',                 'timestamp'],
      ['성명',                     'name'],
      ['소속',                     'affiliation'],
      ['직책',                     'position'],
      ['연락처',                   'phone'],
      ['이메일',                   'email'],
      ['발표 제목',                'title'],
      ['공동저자',                 'co_authors'],
      ['발표 분야',                'field'],
      ['본행사 참석',              'attend_main'],
      ['오찬 참석',                'attend_lunch'],
    ],
  },
  '구두논문 발표': {
    sheetName: '구두논문_발표',
    columns: [
      ['제출시각',                 'timestamp'],
      ['성명',                     'name'],
      ['소속',                     'affiliation'],
      ['직책',                     'position'],
      ['연락처',                   'phone'],
      ['이메일',                   'email'],
      ['발표 제목',                'title'],
      ['공동저자',                 'co_authors'],
      ['발표 분야',                'field'],
      ['발표 유형',                'oral_type'],
      ['본행사 참석',              'attend_main'],
      ['오찬 참석',                'attend_lunch'],
    ],
  },
  '캡스톤 디자인': {
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
      ['지도교수',                 'advisor'],
      ['본행사 참석',              'attend_main'],
      ['오찬 참석',                'attend_lunch'],
    ],
  },
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const config = SHEET_CONFIG[data.form_type];

    // 한국 시간 제출시각
    data.timestamp = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');

    if (config) {
      const sheet = getOrCreateSheet_(ss, config.sheetName, config.columns.map(c => c[0]));
      sheet.appendRow(config.columns.map(c => data[c[1]] || ''));
    } else {
      // SHEET_CONFIG에 없는 form_type은 기타 시트에 원본 JSON으로 저장
      const sheet = getOrCreateSheet_(ss, '기타_접수', ['제출시각', 'form_type', '원본 데이터(JSON)']);
      sheet.appendRow([data.timestamp, data.form_type || '', JSON.stringify(data)]);
    }

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** 시트가 없으면 만들고 1행에 헤더를 채움 */
function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    // 계좌번호·생년월일 등이 숫자/날짜로 변환되지 않도록 전체를 일반 텍스트로
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
