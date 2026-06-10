# CHANGELOG.md — 변경 이력

작업할 때마다 최신 항목을 맨 위에 추가. 형식: `## [날짜] 작업자 — 요약`

---

## [2026-06-11] Claude — 접수 문항 전면 개편 + 구글 스프레드시트 연동

### register/ceu.html (보수교육 신청, 전면 개편)
- 최상단 임상가/학생 구분 선택 카드 — 선택에 따라 입력 섹션 분기 (비활성 fieldset은 검증·전송 제외)
- 임상가: 성명·이메일·핸드폰 + 보수교육 신청 유무(오기재 경고) + 협회 ID/회원등급 + 면허번호
  (추가 수정: 학회 ID/회원등급 문항 삭제 — 협회 정보만 수집, 구분 카드 이모티콘 삭제)
- 학생: 성명·생년월일(0000-00-00 패턴)·소속·핸드폰·이메일
- 공통: 신청교육명 체크박스 4종(9.12 온라인 / 9.13 아동 / 9.19 학술대회 보수교육 / 9.20 성인, 최소 1개 검증),
  환불 계좌(은행 select + 계좌번호), 이수증 발급 신청(신청/미신청 + 밑줄 안내),
  교육비 납부·입금자명·환불기준·개인정보 필수 동의 4종
- 입금자명 예시를 **교육일자 + 이름** 방식으로 작성 (12홍길동 / 13홍길동 / 19홍길동 / 20홍길동)
- 학생 입금절차 변경 가능성 대비 `<!-- ✏️ 편집 -->` 주석 표시

### register/workshop.html (대학원생 워크숍, 문항 교체)
- 성명 / 소속(학교) / 학위과정(석사·박사·석박통합·기타 — 기타 선택 시 직접입력) / 이메일 / 핸드폰 / 관심 주제(자유기술)

### register/index.html (통합 신청 → 허브 전환)
- 장바구니식 통합 폼 제거 (구분별 문항이 달라 단일 폼 불가) → 교육 신청 2종 + 발표 신청 3종 카드 링크 허브

### register/register.css
- **다크 → 라이트 테마 전환** (기존엔 미정의 변수(--bg 등) + 흰 텍스트로 본문이 보이지 않던 버그 수정, 신청 페이지 5종 공통)
- 신규 컴포넌트: `.role-select`(구분 카드), `.check-group`(교육 선택), `.notice-box`(안내문), `.agree-check`(동의 체크)

### register/register.js
- 동일 name 체크박스 다중 값 ", " 병합 수집, `data-min-check` 그룹 최소 선택 검증
- no-cors 단순 요청(text/plain)으로 Apps Script 전송, form_type 포함

### 구글 스프레드시트 연동 (신규)
- `register/apps-script.gs` — doPost: form_type별 시트 분기(보수교육_임상가/보수교육_학생/대학원생_워크숍/기타_접수),
  시트·헤더 자동 생성, KST 제출시각 기록. 대상 시트 ID `1ULBG3IL…VdDsc`
- `docs/SHEETS-SETUP.md` — Apps Script 배포 절차(1회, 약 5분) + 재배포·문제해결 가이드
- ⚠️ 남은 수동 작업: Apps Script 웹 앱 배포 후 발급 URL을 `register.js`의 `SCRIPT_URL`에 입력

---

## [2026-06-06] Claude — 수정 요청 사항 3차 (10건)

### index.html
- eyebrow 텍스트 `Main Day · 9.19` → `제34회 대한작업치료학회 학술대회`
- `#programs .section-eyebrow` 폰트 크기 15px, 한글에 맞게 letter-spacing/text-transform 조정
- OT Beyond Borders(values 섹션) ↔ 당일 프로그램 섹션 간 여백 축소
- 당일 프로그램 카드 `.prog-grid` 2행 재배치 (1행: 보수교육 wide + 명사특강 / 2행: 워크숍·구두·캡스톤 3열)
- 타임테이블 10:00–13:00 2행 재배치 (1행 3열: 워크숍·구두·캡스톤 / 2행 full: 보수교육 + 강좌명 2개)
- 강의 일정 날짜·장소·강사 텍스트 매트 블랙(`#1a1a1a`)으로 가시성 확보
- 9.13·9.20 카드에 "오프라인 강좌" 배지(파랑) 추가
- 9.12·9.13·9.20 강좌 카드 하단 "보수교육 신청하기" 버튼 추가 (링크 `#` 임시)
- 참가신청 버튼 3곳(`#register`, 푸터, 플로팅 CTA) → `register/index.html` 연결

### register/index.html (신규)
- 7종 프로그램 카드 체크박스 선택 → 하단 고정 "N개 신청하기" 바 → 통합 신청 폼 → 성공 메시지
- `reset.css` 로드 추가로 CSS 변수 정상 작동

### css/style.css
- `.prog-grid` 2행 레이아웃 (`.prog-row2-wrap` 3열 서브그리드)
- `.tt-concurrent` flex + `.tt-concurrent-row` 2행 구조
- `.sched-apply-btn` 여백, `.offline-badge` 블루 색상

---

## [2026-06-04] Claude — 웹페이지 콘텐츠 HWP 기준 수정

### 변경 (피그마 포스터 + 학술대회 계획_수정_260521.hwp 기준)
- `index.html` — 9.13 오전/오후 강사 순서 교정
  - 오전(치료적 상호작용): 박지훈·유애리·정희진·조혜진
  - 오후(플로어타임 & OPC): 정미양·주유미 (기존과 swap)
- `index.html` — 9.20 오전 강사 수정: 박요안·박예슬 (기존 김영훈·유지애·황호성·이영오 → 오후로 이동)
- `index.html` — 9.12 아코디언 세부 주제 4개로 업데이트 (HWP 실제 강의 주제)
- `index.html` — 9.19 당일 프로그램 섹션에 대학원생 워크샵 카드 추가
  (연결에서 영감으로, Next OT Research Talk / 장정열 / ~50인)

---

## [2026-06-03] Claude — A2 게시판 포스터 Figma 브리프

### 추가
- `docs/POSTER-FIGMA-BRIEF.md` — A2 세로·풀 A·Editorial Tech · Figma Variables · Zone A–E 복붙 카피 · 작업 체크리스트
- `docs/TASKS.md` · `README.md` · `docs/ASSETS.md` — 포스터 작업(P1–P5) 반영
- `export/.gitkeep` — 최종 PDF 저장 위치

---

## [2026-06-03] Claude — 6단계 QA · SEO · 배포

### 변경
- `index.html` — meta description, OG/Twitter Card, canonical, `favicon.svg`, skip-link, `<main>`
- 아코디언 4곳 `aria-labelledby` + toggle `id` 추가
- `js/main.js` — sparkle rAF: 탭 hidden · hero viewport 이탈 시 중지
- `css/print.css` — hero 인쇄 레이아웃, 외부 링크 URL 출력
- `.github/workflows/pages.yml` — GitHub Pages 자동 배포
- `favicon.svg`, `.nojekyll` 추가

---

## [2026-06-03] Claude — 5단계 UI · 반응형 (아이콘 · 모바일 네비)

### 변경
- 이모지 전부 → `icons/*.svg` mask-image (Values, 핵심 테마, 일정, 장소, 사전등록)
- SVG 10종 추가: handshake, flask, book, chip, hospital, gear, clipboard, laptop, calendar, pencil
- 모바일 햄버거 네비 (820px 이하 · 우측 드로어 · backdrop · Escape)
- `js/main.js` — nav toggle / body scroll lock
- Hero 배경 `hero.png`(1.8MB) → `hero.jpg`(1400px · ~122KB)

---

## [2026-06-03] Claude — 4단계 자산 · URL · QR 연결

### 변경
- `images/qr/preregister.png` — 학술대회 접수안내 URL QR 생성
- `index.html` 참가신청·푸터 → `ksot.kr` 학술대회 접수안내 게시판
- 지도 버튼 → 네이버 지도 (대전보건대학교)
- QR 경로 `images/qr/preregister.png`로 통일
- 외부 링크 `rel="noopener noreferrer"` 보완
- `docs/CONTENT.md` · `docs/TASKS.md` · `README.md` 링크 표 갱신

### 참고
- 2026 전용 접수 폼(forms.gle 등) 미공개 — 학회 게시판 URL 사용 중

---

## [2026-06-03] Claude — 3단계 IA · 네비 재구성

### 변경
- `index.html` 섹션 순서: Hero → Highlight → Values → Programs → Schedule → About → Register
- 앵커: `#register`, `#venue`, `#themes` 추가 · 네비·푸터 링크 정렬
- 명칭 구분: **당일 프로그램** (`#programs`) vs **핵심 테마** (`#themes`)
- Hero CTA: 사전등록 `#register` · 상세일정 `#highlight`
- 사전등록 보조 CTA → `#schedule` (내부 앵커)
- `css/reset.css` — `scroll-padding-top: 88px` (고정 네비 앵커 오프셋)
- `css/style.css` — `.nav-logo` 링크 · `.core-eyebrow` 스타일
- `docs/CONTENT.md` — IA 표·네비·푸터 바로가기 갱신

---

## [2026-06-02] 초기 구조 — 프로젝트 셋업

### 추가
- 디렉토리 구조 생성 (css/js/images/icons/assets/docs)
- `index.html` — 모던 랜딩페이지 완성본 (CSS/JS 인라인 상태)
- 문서 세트 작성:
  - `README.md` — 구조·파일 역할
  - `CLAUDE.md` — Claude Code 컨텍스트
  - `docs/TASKS.md` — 단계별 작업 절차
  - `docs/DESIGN-TOKENS.md` — 색상·폰트·간격 토큰
  - `docs/CONTENT.md` — 콘텐츠 원본
  - `docs/ASSETS.md` — 자산 사양
  - `docs/CHANGELOG.md` — 본 파일
- 빈 파일: `css/{reset,style,print}.css`, `js/main.js`, `assets/ai-network.svg`
- `.gitignore`, 각 이미지 폴더 `.gitkeep`

### 디자인 결정
- 포스터형 → 모던 랜딩페이지로 전환 (둥근 카드, 섹션형 여백)
- 색상: 원본 포스터 기반 (네이비/오렌지) + 아이보리/매트블랙 중립
- 폰트: Sora (디스플레이) + Noto Sans KR (본문)
- 아이콘: mask-image 방식 채택 (외부 SVG + CSS 색상 제어)

### 상태
- [x] 구조 셋업
- [ ] 1단계 CSS/JS 분리
- [ ] 2단계 아이콘 mask 전환
- [ ] 3단계 이미지 경로 연결
- [ ] 4단계 print.css

---

## [2026-06-03] Claude — Hero 부제 톤 통일

### 변경
- `index.html`, `docs/CONTENT.md` — Hero 부제를 Values「경계를 넘어서는 작업치료」톤과 맞춤

---

## [2026-06-03] Claude — 2단계 콘텐츠 확정·HTML 동기화

### 변경
- `docs/CONTENT.md` — 확인 필요 7건 사용자 확정 반영 (강사·소속·일정)
- `index.html` — 9.12 날짜, 온라인·아동·성인 오전/오후 세션, 홍영일 대표(박사) 표기

---

## [2026-06-03] Claude — 1단계 정본·문서 정리

### 변경
- `docs/CONTENT.md` — IA·Hero·9.19 타임테이블·강의일정·확인 필요 7건·2단계 체크리스트로 확장
- 루트 `CONTENT.md`, `TASKS.md`, `DESIGN-TOKENS.md`, `ASSETS.md`, `CHANGELOG.md` → `docs/` 안내 stub
- `README.md` — 현재 구조·진행 상태·작업 순서表 갱신
- `docs/TASKS.md` — 기술 분리 완료 반영 + 콘텐츠·IA 6단계 로드맵 추가
- `docs/ASSETS.md` — `hero.png`, 명사특강 사진 현행 경로 반영

---

## [2026-06-03] Claude — Values 섹션 제목 변경

### 변경
- `index.html` — 「AI가 연결하는 작업치료의 네 가지 영역」→「경계를 넘어서는 작업치료」
- `docs/CONTENT.md`, `CONTENT.md` — 섹션 제목 원본 반영

---

## [2026-06-03] Claude — hero 마우스 따라 반짝임 효과

### 변경
- `index.html` — `.hero-sparkle` canvas 레이어 추가
- `css/style.css` — overlay에 커서 위치 `--mx`/`--my` radial-gradient
- `js/main.js` — 마우스 추적 글로우 + 스파클 파티클 (prefers-reduced-motion 시 비활성)
- `css/print.css` — 인쇄 시 canvas 숨김

---

## [2026-06-03] Claude — hero.png 전체 배경 적용

### 변경
- `index.html` — hero-visual 제거, `.hero-bg` img + `.hero-overlay`로 전체 배경 처리
- `css/style.css` — dot grid·orb 장식 제거, 텍스트 가독용 좌→우 그radient 오버레이, 단일 컬럼 레이아웃

---

## [2026-06-03] Claude — hero 비주얼 hero.png 이미지 전용으로 단순화

### 변경
- `index.html` — n8n/RAG 다이어그램 제거, `images/background/hero.png` img 적용
- `index.html` — 중복 배경 오버레이(`.hero-bg-img`) 제거
- `css/style.css` — flow-node 스타일 삭제, `.hero-img` 스타일 추가

---

## [2026-06-03] Claude — hero 비주얼 n8n + RAG 파이프라인으로 교체

### 변경
- `index.html` — 4대 가치 허브 → Trigger → n8n → AI → Output + RAG 지식베이스 루프 구조
- `css/style.css` — flow-node 글래스 카드 스타일, Occupation Flow 강의 주제와 시각적 연계

---

## [2026-06-03] Claude — hero AI 허브 비주얼 정적 리디자인

### 변경
- `index.html` — Canvas 뉴럴 네트워크 제거, SVG 연결선 + 글래스 허브 DOM 구조로 교체
- `css/style.css` — hero-visual을 hero-pill·value-card 톤(글래스·디자인 토큰 색)과 통일, 펄스·네온 글로우 제거
- `js/main.js` — neural-canvas 애니메이션 IIFE 삭제 (정적 비주얼, JS 불필요)

---

## [2026-06-03] Claude — 3단계 이미지 경로 연결 + 4단계 print.css

### 변경
- `index.html` 이미지 경로 연결:
  - 명사특강 강연자 사진 → `images/speakers/명사특강 강연자.jpeg` ✅
  - 장소 사진 → `images/location/대전보건대학교전경.jpeg` ✅
  - `onload` 핸들러로 사진 로드 시 플레이스홀더 자동 숨김 처리
- `css/print.css` 작성 — 네비·버튼 숨김, 색상 유지, 아코디언 펼침, 카드 그림자 제거

### 미연결 (파일 없음)
- AI 다이어그램, QR 코드, 로고 이미지 — 파일 준비 후 연결 필요

---

## [2026-06-03] Claude — 1단계 CSS/JS 분리 + 아코디언 기능 추가

### 변경
- `css/reset.css` — `:root` 변수 + 기본 리셋 스타일 분리
- `css/style.css` — 전체 컴포넌트 스타일 분리 + 아코디언 스타일 추가
- `js/main.js` — 스크롤·reveal 로직 분리 + 아코디언 토글 JS 추가
- `index.html` — 인라인 `<style>`·`<script>` 제거, 외부 파일 링크로 교체 (1322줄 → 440줄)

### 콘텐츠 업데이트 (HWP 원본 기준)
- 강의일정 강사명 수정: 권성현 → 권성애 (동남보건대학교 아동발달지원센터)
- 아동 강좌 강사 4인 수정: 박지훈·유애리·정희진·조혜진 (소속 포함)
- 성인 강좌 강사 4인 수정: 김영훈·유지애·황호성·이영오 (소속 포함)

### 추가
- 9.19(토) 당일 세부 타임테이블 아코디언 (하이라이트 섹션 하단)
- 온라인·아동·성인 강좌 카드별 세부 내용 아코디언 (세션별 주제 + 상세 내용)
- `.claude/launch.json` — python3 정적 서버 (port 3400)

---

<!-- 다음 작업부터 아래 형식으로 추가
## [YYYY-MM-DD] 작업자 — 요약
### 변경
- ...
-->
