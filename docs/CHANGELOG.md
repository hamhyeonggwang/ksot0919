## [2026-06-18] — 단일 submit 게이트웨이로 접수 아키텍처 전환

오류 최소화: 브라우저 1회 POST → Edge Function `submit` → DB + Storage + GAS → Sheets (동기).

| 변경 | 내용 |
|------|------|
| `supabase/functions/submit/` | 신규 — 유일한 제출 API |
| `relay-sync` | 삭제 |
| `002_rls.sql` | anon DB 접근 차단 |
| `003_storage.sql` | form-templates(공개) + submissions-2026 |
| `register.js` | submit 1회 호출, 성공/실패 즉시 표시 |
| `forms-config.js` | 양식 다운로드 URL |
| poster/oral/capstone | file input + 다운로드 UI |
| oral | 파일 4개 전부 필수 |
| `apps-script.gs` | GAS 직접 제출 제거, webhook 전용 |
| `docs/SUBMIT-SETUP.md` | 신규 설정 가이드 |

---

## [2026-06-18] — 하이브리드 접수 인프라 (Supabase + Sheets 경로 B)

Supabase 정본 저장 + relay-sync → Apps Script webhook → Google Sheets 자동 동기화.

| 추가/변경 | 내용 |
|-----------|------|
| `supabase/migrations/` | 6개 접수 테이블, RLS, Storage bucket |
| `supabase/functions/relay-sync/` | complete 시 GAS 호출 + signed URL |
| `register/apps-script.gs` | `source=supabase` webhook + Supabase ID 열 |
| `register/register.js` | Supabase 제출 (미설정 시 GAS 폴백) |
| `register/supabase-config.js` | URL·anon key 설정 |
| `docs/HYBRID-SETUP.md` | 학회 측 설정 가이드 |
| `pages.yml` | `register/` GitHub Pages 배포 추가 |

---

## [2026-06-18] — 접수 스프레드시트·Apps Script URL 교체

하이브리드(Supabase + Sheets) 전환 준비로 접수용 Google 리소스를 새 시트로 이전.

| 항목 | 변경 |
|------|------|
| 스프레드시트 ID | `1seHYNx8pjqmlHAME6FmPMiRGO-RzO91_8lIZcK8rN2Y` |
| Apps Script URL | `register/register.js` `SCRIPT_URL` 갱신 |

반영 파일: `register/apps-script.gs`, `register/register.js`, `docs/SHEETS-SETUP.md`

---


장소 (확정)





9.13(일): 국립정신건강센터 지하1층 어울림홀(서울)



9.20(일): 국립정신건강센터 열린강당(서울)

반영 파일





index.html — 강의 일정 #schedule 장소 표기



register/ceu.html — 9.20 강좌 2종 장소 수정 (9.13 어울림홀 표기 통일)



docs/CONTENT.md — 9.13 장소 정본 갱신



docs/POSTER-FIGMA-BRIEF.md — 9.13 장소 갱신



[2026-06-17] Claude — 캡스톤 작품 설명 · 우수 학위논문 PDF 업로드 안내

register/capstone.html





작품 설명 섹션 추가: 목적 · 개요 · 핵심 아이디어 · 기대효과 (필수 textarea)

register/oral.html





파일 업로드 안내 목록에 4) 학위논문 전문 PDF 파일 추가 (Google Drive 연동 추후)

register/apps-script.gs





캡스톤_디자인 시트 컬럼 4개 추가 (작품 목적·개요·핵심 아이디어·기대효과)



[2026-06-17] Claude — register 허브 발표 신청 3열 레이아웃

register/index.html





발표 신청 섹션 .hub-grid--3 추가 — 데스크탑 3열 / 960px 이하 2열 / 560px 이하 1열



허브 본문 max-width 720px → 960px (3카드 가독성)



[2026-06-17] Claude — register 허브 발표 신청 카드 설명 삭제

register/index.html





발표 신청 3카드(우수 학위논문 · 포스터·구두발표 · 캡스톤) 하단 hub-meta 설명 문구 제거



[2026-06-17] Claude — 발표 접수 3종 명칭·양식 개편 (A안 form_type)

명칭 변경 (공통)





oral.html → 우수 학위논문 접수



poster.html → 포스터 및 구두발표 접수



capstone.html → 캡스톤 디자인 접수



register/index.html 허브 카드 · index.html 히어로 칩·타임테이블·당일 프로그램 4카드 분리 표기

register/oral.html — 우수 학위논문 접수 전면 개편





기본 정보(성명·생년월일·연락처·소속대학원·학위취득일·게재학회지) + 학위논문 정보(논문명·언어·석/박·지도교수·심사위원·발표 분야 유지·서술 3문항 각 1,000자)



당일 참석 섹션 삭제 · 개인정보 동의 추가



파일 업로드 3종 — Google Drive 연동 준비 중 안내만 (미구현)



form_type: 우수 학위논문 접수

register/poster.html — 포스터·구두발표 통합 접수





1저자/교신저자 · 발표 종류(포스터/포스터+구두) · 포스터 개수 · 초록양식 확인 · 접수비 안내·확인



당일 참석 삭제 · 개인정보 동의 · 논문초록 업로드 준비 중 안내



form_type: 포스터 및 구두발표 접수

register/capstone.html — 캡스톤 디자인 접수





지도교수 → 성함·연락처·이메일 3필드 · 경진대회 참가 동의 · 개인정보 동의



당일 참석 삭제 · PPT 업로드 준비 중 안내



form_type: 캡스톤 디자인 접수

register/apps-script.gs (A안)





구 구두논문 발표/포스터 발표/캡스톤 디자인 → 신규 form_type·시트(우수_학위논문·포스터_구두발표·캡스톤_디자인 컬럼 재설계)



⚠️ Apps Script 재배포 필요 · 기존 시트 탭은 유지(신규 탭 자동 생성)

css/style.css





당일 프로그램 2행 4열 그리드 · 타임테이블 concurrent 4열(row-4col) 추가



[2026-06-17] Claude — ceu 임상가 섹션 순서·납부방법 2단계 구조 개편

register/ceu.html — 임상가: 보수교육 · 회원 정보 → 신청 교육명 위로 이동





임상가 선택 시 회원등급·면허·임상경력 입력 후 강좌 선택하는 흐름으로 섹션 순서 변경



학생 흐름(신청자 정보 → 신청 교육명)은 동일

register/ceu.html — 교육비 납부방법 2단계 구조





1차: 카드결제 · 계좌이체 분리 (기존 합쳐진 "카드결제/계좌이체" 옵션 제거)



계좌이체 선택 시 하위: 개인납부(기본) · 기관납부





개인납부/카드결제 → 결재선생 링크 + 2일 미결제 안내



기관납부 → 하나은행 907-910328-84207 + 입금자명 입력칸



pay_method hidden 필드에 통합 저장값 동기화





카드결제 (결재선생) / 계좌이체 > 개인납부 (결재선생) / 계좌이체 > 기관납부 (하나은행 …)

register/register.css





.pay-method-sub 계좌이체 하위 선택 들여쓰기·강조 스타일 추가



[2026-06-17] Claude — 대학원생 워크숍(workshop) 교육비·환불·개인정보 섹션 추가

register/workshop.html — 결제·환불·동의 섹션 신설





교육비 및 입금 절차 안내 추가: 참가비 30,000원 · 하나은행 907-910328-84207 · 입금자명 "이름/학교명" 형식





입금자명 입력칸(payer_name, 필수) + 교육비 납부 확인 체크박스(agree_payment) 추가



문의처: ksotoffice@nate.com



환불 기준 안내 박스(8일 전 100% / 7일~직전일 정오 60% / 이후 불가) + 확인 체크박스(agree_refund) 추가



개인 환불 계좌(은행 드롭다운 refund_bank + 계좌번호 refund_account) 추가



개인정보 수집 동의 박스 + 동의 체크박스(agree_privacy) 추가



제출 안내문구를 "교육비 납부 확인 후 최종 등록" 문구로 보강



장소(대전보건대 8동 3층 일반강의실 8323-1호)는 기존 반영되어 있어 변경 없음

register/apps-script.gs





대학원생_워크숍 시트에 입금자명·교육비 납부 확인·환불 은행·환불 계좌번호·환불기준 확인·개인정보 동의 컬럼 추가



⚠️ 반영하려면 Apps Script에 갱신 코드 재붙여넣기 + 새 버전 재배포 필요



[2026-06-17] Claude — 보수교육(ceu) 강좌 분리·교육비 장바구니·납부방법 개편

register/ceu.html — 신청 교육 4 → 6개 강좌별 분리





기존 9.13(아동 통합)·9.20(성인 통합) 단일 항목을 강좌별 개별 선택으로 분리 (총 6개)





9.12 온라인 / 9.13 치료적 상호작용 전략(0913) / 9.13 플로어타임&OPC(1418)



9.19 AI와 함께 하는 작업치료 / 9.20 회복기 재활·재택의료(0913) / 9.20 지역사회 통합돌봄(1418)



장소 구체화: 13·20일 강좌 → 국립정신건강센터 지하 1층 어울림홀(서울), 19일 → 대전보건대 8동 4층 대강당(유지)



강좌별 분리입금(입금자명 12이름…) 안내 제거 — 결재선생 도입으로 불필요

register/ceu.html — 임상가 임상경력 + 교육비 장바구니





임상가 회원정보에 임상경력(약 ○○년) 입력 추가



교육비 장바구니(데스크탑 우측 sticky / 모바일 하단 고정 바) 신규





학생: 강좌당 40,000원 · 임상가: 정/평생회원 60,000원, 준/인증완료회원 76,000원



회원등급·강좌 선택 시 실시간 합산, fee_total hidden 필드로 전송

register/ceu.html — 교육비 납부방법(선택) 개편





기존 우리은행 단일 계좌 안내 → 납부방법 선택(카드결제/계좌이체 결재선생 · 기관납부 하나은행 907-910328-84207)으로 교체



기관납부 선택 시 입금자명 입력칸 노출(기관명 이체 식별 곤란 해소)



카드결제 2일 내 미결제 시 미수강 안내, 증빙/문의·학생 단체접수 ksotoffice@naver.com 안내 추가

register/register.css





.career-input / .pay-method / .fee-cart(데스크탑 사이드바·모바일 하단 바) 스타일 추가

register/apps-script.gs





보수교육_임상가·보수교육_학생 시트에 임상경력·교육비 합계·납부방법·기관납부 입금자명 컬럼 추가, 기존 입금자명 안내 확인 컬럼 제거



⚠️ 반영하려면 Apps Script에 갱신 코드 재붙여넣기 + 새 버전 재배포 필요



[2026-06-14] Claude — 강의 장소 확정 반영 + 장소 표기 강조

확정 장소 반영





대학원생 워크숍(Next OT 톡톡 2026) → 대전보건대학교 8동 3층 일반강의실 8323-1호





register/workshop.html 상단 안내, register/index.html 워크숍 허브 카드



9.19(토) 학술대회 보수교육(AI와 함께 하는 작업치료 임상과 전문역량) → 대전보건대학교 8동 4층 대강당





register/ceu.html 강좌 선택 항목

register.css — .venue 장소 강조 칩 추가





회색 메타 줄(course-meta·reg-page-desc·hub-meta)에서 장소가 시간·입금자명과 같은
톤이라 잘 안 보인다는 피드백 반영 → 장소만 📍 핀 + 주황(--orange) 배경 칩으로 강조



ceu.html 4개 강좌 장소(온라인 Zoom · 국립정신건강센터(서울) · 대강당) 모두 칩 적용



데스크톱·모바일(390px) 확인 완료

index.html — 메인 페이지 장소 표기 통일





히어로 메타 · 하이라이트 카드 · 장소 섹션: 대전보건대학교 대강당 → 대전보건대학교 8동 4층 대강당



당일 타임테이블: 보수교육·개회식·명사특강·시상식 장소 → 8동 4층 대강당,
워크숍 → 8동 3층 일반강의실 8323-1호 (~50인), 10:00~13:00 장소 요약 → 8동 4층 대강당 / 3층 강의실



구두논문·캡스톤은 강의실 미확정 → 별도 강의실 유지



.tt-concurrent-venue는 기존 주황색(--orange)이라 어두운 배경에서 이미 강조됨 (스타일 변경 없음)



[2026-06-11] Claude — 발표 신청 3종 스프레드시트 연동

register/poster.html · oral.html · capstone.html





각 폼에 form_type hidden 필드 추가 (포스터 발표 / 구두논문 발표 / 캡스톤 디자인)

register/apps-script.gs





포스터_발표 · 구두논문_발표 · 캡스톤_디자인 시트 구성(SHEET_CONFIG) 추가
→ 발표 신청도 보수교육·워크숍과 동일하게 전용 시트에 행 단위 기록



⚠️ 반영하려면 Apps Script에 갱신된 코드 재붙여넣기 + 새 버전 재배포 필요
(미반영 시 발표 신청은 기존 폴백대로 기타_접수 시트에 JSON으로 적재됨)



[2026-06-11] Claude — 접수 문항 전면 개편 + 구글 스프레드시트 연동

register/ceu.html (보수교육 신청, 전면 개편)





최상단 임상가/학생 구분 선택 카드 — 선택에 따라 입력 섹션 분기 (비활성 fieldset은 검증·전송 제외)



임상가: 성명·이메일·핸드폰 + 보수교육 신청 유무(오기재 경고) + 협회 ID/회원등급 + 면허번호
(추가 수정: 학회 ID/회원등급 문항 삭제 — 협회 정보만 수집, 구분 카드 이모티콘 삭제,
 교육비 안내에 학회 입금 계좌 추가 — 우리은행 1005-402-514024 대한작업치료학회)



학생: 성명·생년월일(0000-00-00 패턴)·소속·핸드폰·이메일



공통: 신청교육명 체크박스 4종(9.12 온라인 / 9.13 아동 / 9.19 학술대회 보수교육 / 9.20 성인, 최소 1개 검증),
환불 계좌(은행 select + 계좌번호), 이수증 발급 신청(신청/미신청 + 밑줄 안내),
교육비 납부·입금자명·환불기준·개인정보 필수 동의 4종



입금자명 예시를 교육일자 + 이름 방식으로 작성 (12홍길동 / 13홍길동 / 19홍길동 / 20홍길동)



학생 입금절차 변경 가능성 대비 <!-- ✏️ 편집 --> 주석 표시

register/workshop.html (대학원생 워크숍, 문항 교체)





성명 / 소속(학교) / 학위과정(석사·박사·석박통합·기타 — 기타 선택 시 직접입력) / 이메일 / 핸드폰 / 관심 주제(자유기술)

register/index.html (통합 신청 → 허브 전환)





장바구니식 통합 폼 제거 (구분별 문항이 달라 단일 폼 불가) → 교육 신청 2종 + 발표 신청 3종 카드 링크 허브

register/register.css





다크 → 라이트 테마 전환 (기존엔 미정의 변수(--bg 등) + 흰 텍스트로 본문이 보이지 않던 버그 수정, 신청 페이지 5종 공통)



신규 컴포넌트: .role-select(구분 카드), .check-group(교육 선택), .notice-box(안내문), .agree-check(동의 체크)

register/register.js





동일 name 체크박스 다중 값 ", " 병합 수집, data-min-check 그룹 최소 선택 검증



no-cors 단순 요청(text/plain)으로 Apps Script 전송, form_type 포함

구글 스프레드시트 연동 (신규)





register/apps-script.gs — doPost: form_type별 시트 분기(보수교육_임상가/보수교육_학생/대학원생_워크숍/기타_접수),
시트·헤더 자동 생성, KST 제출시각 기록. 대상 시트 ID 1ULBG3IL…VdDsc



docs/SHEETS-SETUP.md — Apps Script 배포 절차(1회, 약 5분) + 재배포·문제해결 가이드



⚠️ 남은 수동 작업: Apps Script 웹 앱 배포 후 발급 URL을 register.js의 SCRIPT_URL에 입력



[2026-06-06] Claude — 수정 요청 사항 3차 (10건)

index.html





eyebrow 텍스트 Main Day · 9.19 → 제34회 대한작업치료학회 학술대회



#programs .section-eyebrow 폰트 크기 15px, 한글에 맞게 letter-spacing/text-transform 조정



OT Beyond Borders(values 섹션) ↔ 당일 프로그램 섹션 간 여백 축소



당일 프로그램 카드 .prog-grid 2행 재배치 (1행: 보수교육 wide + 명사특강 / 2행: 워크숍·구두·캡스톤 3열)



타임테이블 10:00–13:00 2행 재배치 (1행 3열: 워크숍·구두·캡스톤 / 2행 full: 보수교육 + 강좌명 2개)



강의 일정 날짜·장소·강사 텍스트 매트 블랙(#1a1a1a)으로 가시성 확보



9.13·9.20 카드에 "오프라인 강좌" 배지(파랑) 추가



9.12·9.13·9.20 강좌 카드 하단 "보수교육 신청하기" 버튼 추가 (링크 # 임시)



참가신청 버튼 3곳(#register, 푸터, 플로팅 CTA) → register/index.html 연결

register/index.html (신규)





7종 프로그램 카드 체크박스 선택 → 하단 고정 "N개 신청하기" 바 → 통합 신청 폼 → 성공 메시지



reset.css 로드 추가로 CSS 변수 정상 작동

css/style.css





.prog-grid 2행 레이아웃 (.prog-row2-wrap 3열 서브그리드)



.tt-concurrent flex + .tt-concurrent-row 2행 구조



.sched-apply-btn 여백, .offline-badge 블루 색상



[2026-06-04] Claude — 웹페이지 콘텐츠 HWP 기준 수정

변경 (피그마 포스터 + 학술대회 계획_수정_260521.hwp 기준)





index.html — 9.13 오전/오후 강사 순서 교정





오전(치료적 상호작용): 박지훈·유애리·정희진·조혜진



오후(플로어타임 & OPC): 정미양·주유미 (기존과 swap)



index.html — 9.20 오전 강사 수정: 박요안·박예슬 (기존 김영훈·유지애·황호성·이영오 → 오후로 이동)



index.html — 9.12 아코디언 세부 주제 4개로 업데이트 (HWP 실제 강의 주제)



index.html — 9.19 당일 프로그램 섹션에 대학원생 워크샵 카드 추가
(연결에서 영감으로, Next OT Research Talk / 장정열 / ~50인)



[2026-06-03] Claude — A2 게시판 포스터 Figma 브리프

추가





docs/POSTER-FIGMA-BRIEF.md — A2 세로·풀 A·Editorial Tech · Figma Variables · Zone A–E 복붙 카피 · 작업 체크리스트



docs/TASKS.md · README.md · docs/ASSETS.md — 포스터 작업(P1–P5) 반영



export/.gitkeep — 최종 PDF 저장 위치



[2026-06-03] Claude — 6단계 QA · SEO · 배포

변경





index.html — meta description, OG/Twitter Card, canonical, favicon.svg, skip-link, <main>



아코디언 4곳 aria-labelledby + toggle id 추가



js/main.js — sparkle rAF: 탭 hidden · hero viewport 이탈 시 중지



css/print.css — hero 인쇄 레이아웃, 외부 링크 URL 출력



.github/workflows/pages.yml — GitHub Pages 자동 배포



favicon.svg, .nojekyll 추가



[2026-06-03] Claude — 5단계 UI · 반응형 (아이콘 · 모바일 네비)

변경





이모지 전부 → icons/*.svg mask-image (Values, 핵심 테마, 일정, 장소, 사전등록)



SVG 10종 추가: handshake, flask, book, chip, hospital, gear, clipboard, laptop, calendar, pencil



모바일 햄버거 네비 (820px 이하 · 우측 드로어 · backdrop · Escape)



js/main.js — nav toggle / body scroll lock



Hero 배경 hero.png(1.8MB) → hero.jpg(1400px · ~122KB)



[2026-06-03] Claude — 4단계 자산 · URL · QR 연결

변경





images/qr/preregister.png — 학술대회 접수안내 URL QR 생성



index.html 참가신청·푸터 → ksot.kr 학술대회 접수안내 게시판



지도 버튼 → 네이버 지도 (대전보건대학교)



QR 경로 images/qr/preregister.png로 통일



외부 링크 rel="noopener noreferrer" 보완



docs/CONTENT.md · docs/TASKS.md · README.md 링크 표 갱신

참고





2026 전용 접수 폼(forms.gle 등) 미공개 — 학회 게시판 URL 사용 중



[2026-06-03] Claude — 3단계 IA · 네비 재구성

변경





index.html 섹션 순서: Hero → Highlight → Values → Programs → Schedule → About → Register



앵커: #register, #venue, #themes 추가 · 네비·푸터 링크 정렬



명칭 구분: 당일 프로그램 (#programs) vs 핵심 테마 (#themes)



Hero CTA: 사전등록 #register · 상세일정 #highlight



사전등록 보조 CTA → #schedule (내부 앵커)



css/reset.css — scroll-padding-top: 88px (고정 네비 앵커 오프셋)



css/style.css — .nav-logo 링크 · .core-eyebrow 스타일



docs/CONTENT.md — IA 표·네비·푸터 바로가기 갱신



[2026-06-02] 초기 구조 — 프로젝트 셋업

추가





디렉토리 구조 생성 (css/js/images/icons/assets/docs)



index.html — 모던 랜딩페이지 완성본 (CSS/JS 인라인 상태)



문서 세트 작성:





README.md — 구조·파일 역할



CLAUDE.md — Claude Code 컨텍스트



docs/TASKS.md — 단계별 작업 절차



docs/DESIGN-TOKENS.md — 색상·폰트·간격 토큰



docs/CONTENT.md — 콘텐츠 원본



docs/ASSETS.md — 자산 사양



docs/CHANGELOG.md — 본 파일



빈 파일: css/{reset,style,print}.css, js/main.js, assets/ai-network.svg



.gitignore, 각 이미지 폴더 .gitkeep

디자인 결정





포스터형 → 모던 랜딩페이지로 전환 (둥근 카드, 섹션형 여백)



색상: 원본 포스터 기반 (네이비/오렌지) + 아이보리/매트블랙 중립



폰트: Sora (디스플레이) + Noto Sans KR (본문)



아이콘: mask-image 방식 채택 (외부 SVG + CSS 색상 제어)

상태





구조 셋업



1단계 CSS/JS 분리



2단계 아이콘 mask 전환



3단계 이미지 경로 연결



4단계 print.css



[2026-06-03] Claude — Hero 부제 톤 통일

변경





index.html, docs/CONTENT.md — Hero 부제를 Values「경계를 넘어서는 작업치료」톤과 맞춤



[2026-06-03] Claude — 2단계 콘텐츠 확정·HTML 동기화

변경





docs/CONTENT.md — 확인 필요 7건 사용자 확정 반영 (강사·소속·일정)



index.html — 9.12 날짜, 온라인·아동·성인 오전/오후 세션, 홍영일 대표(박사) 표기



[2026-06-03] Claude — 1단계 정본·문서 정리

변경





docs/CONTENT.md — IA·Hero·9.19 타임테이블·강의일정·확인 필요 7건·2단계 체크리스트로 확장



루트 CONTENT.md, TASKS.md, DESIGN-TOKENS.md, ASSETS.md, CHANGELOG.md → docs/ 안내 stub



README.md — 현재 구조·진행 상태·작업 순서表 갱신



docs/TASKS.md — 기술 분리 완료 반영 + 콘텐츠·IA 6단계 로드맵 추가



docs/ASSETS.md — hero.png, 명사특강 사진 현행 경로 반영



[2026-06-03] Claude — Values 섹션 제목 변경

변경





index.html — 「AI가 연결하는 작업치료의 네 가지 영역」→「경계를 넘어서는 작업치료」



docs/CONTENT.md, CONTENT.md — 섹션 제목 원본 반영



[2026-06-03] Claude — hero 마우스 따라 반짝임 효과

변경





index.html — .hero-sparkle canvas 레이어 추가



css/style.css — overlay에 커서 위치 --mx/--my radial-gradient



js/main.js — 마우스 추적 글로우 + 스파클 파티클 (prefers-reduced-motion 시 비활성)



css/print.css — 인쇄 시 canvas 숨김



[2026-06-03] Claude — hero.png 전체 배경 적용

변경





index.html — hero-visual 제거, .hero-bg img + .hero-overlay로 전체 배경 처리



css/style.css — dot grid·orb 장식 제거, 텍스트 가독용 좌→우 그radient 오버레이, 단일 컬럼 레이아웃



[2026-06-03] Claude — hero 비주얼 hero.png 이미지 전용으로 단순화

변경





index.html — n8n/RAG 다이어그램 제거, images/background/hero.png img 적용



index.html — 중복 배경 오버레이(.hero-bg-img) 제거



css/style.css — flow-node 스타일 삭제, .hero-img 스타일 추가



[2026-06-03] Claude — hero 비주얼 n8n + RAG 파이프라인으로 교체

변경





index.html — 4대 가치 허브 → Trigger → n8n → AI → Output + RAG 지식베이스 루프 구조



css/style.css — flow-node 글래스 카드 스타일, Occupation Flow 강의 주제와 시각적 연계



[2026-06-03] Claude — hero AI 허브 비주얼 정적 리디자인

변경





index.html — Canvas 뉴럴 네트워크 제거, SVG 연결선 + 글래스 허브 DOM 구조로 교체



css/style.css — hero-visual을 hero-pill·value-card 톤(글래스·디자인 토큰 색)과 통일, 펄스·네온 글로우 제거



js/main.js — neural-canvas 애니메이션 IIFE 삭제 (정적 비주얼, JS 불필요)



[2026-06-03] Claude — 3단계 이미지 경로 연결 + 4단계 print.css

변경





index.html 이미지 경로 연결:





명사특강 강연자 사진 → images/speakers/명사특강 강연자.jpeg ✅



장소 사진 → images/location/대전보건대학교전경.jpeg ✅



onload 핸들러로 사진 로드 시 플레이스홀더 자동 숨김 처리



css/print.css 작성 — 네비·버튼 숨김, 색상 유지, 아코디언 펼침, 카드 그림자 제거

미연결 (파일 없음)





AI 다이어그램, QR 코드, 로고 이미지 — 파일 준비 후 연결 필요



[2026-06-03] Claude — 1단계 CSS/JS 분리 + 아코디언 기능 추가

변경





css/reset.css — :root 변수 + 기본 리셋 스타일 분리



css/style.css — 전체 컴포넌트 스타일 분리 + 아코디언 스타일 추가



js/main.js — 스크롤·reveal 로직 분리 + 아코디언 토글 JS 추가



index.html — 인라인 <style>·<script> 제거, 외부 파일 링크로 교체 (1322줄 → 440줄)

콘텐츠 업데이트 (HWP 원본 기준)





강의일정 강사명 수정: 권성현 → 권성애 (동남보건대학교 아동발달지원센터)



아동 강좌 강사 4인 수정: 박지훈·유애리·정희진·조혜진 (소속 포함)



성인 강좌 강사 4인 수정: 김영훈·유지애·황호성·이영오 (소속 포함)

추가





9.19(토) 당일 세부 타임테이블 아코디언 (하이라이트 섹션 하단)



온라인·아동·성인 강좌 카드별 세부 내용 아코디언 (세션별 주제 + 상세 내용)



.claude/launch.json — python3 정적 서버 (port 3400)



