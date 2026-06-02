# CHANGELOG.md — 변경 이력

작업할 때마다 최신 항목을 맨 위에 추가. 형식: `## [날짜] 작업자 — 요약`

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
