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

<!-- 다음 작업부터 아래 형식으로 추가
## [YYYY-MM-DD] 작업자 — 요약
### 변경
- ...
-->
