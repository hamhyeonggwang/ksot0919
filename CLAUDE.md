# CLAUDE.md

> Claude Code가 이 프로젝트에서 작업할 때 항상 먼저 읽는 컨텍스트 파일.

## 프로젝트 정체성

**2026 OT Beyond Borders** — 제34회 대한작업치료학회 학술대회 홍보 웹페이지.
- 슬로건: "AI와 함께 여는 작업치료의 미래"
- 성격: 학술대회 랜딩페이지 (이메일 배포 + 웹 공유 겸용)
- 톤: 학술적 신뢰감 + 미래지향적 AI 감성 + 따뜻한 돌봄

## 기술 스택 / 제약

- **순수 HTML + CSS + Vanilla JS** (프레임워크 없음, 빌드 도구 없음)
- 외부 의존성: Google Fonts (Sora, Noto Sans KR) 만
- 단일 페이지, 정적 호스팅 (GitHub Pages / Vercel 가능)
- 브라우저 타깃: 최신 Chrome/Safari/Edge + 모바일

## 절대 규칙 (하지 말 것)

- ❌ React/Vue/Tailwind 등 도입 금지 — 순수 정적 파일 유지
- ❌ localStorage/sessionStorage 사용 금지
- ❌ 디자인 토큰(색상·폰트) 임의 변경 금지 — `docs/DESIGN-TOKENS.md` 준수
- ❌ placeholder `onerror` 폴백 제거 금지 (실제 이미지 넣기 전까지 유지)
- ❌ 한글 콘텐츠(강사명·강의명·날짜) 임의 수정 금지 — 오타 의심 시 사용자에게 질문

## 항상 지킬 것

- ✅ 색상은 CSS 변수(`var(--orange)` 등)로만 사용, 하드코딩 금지
- ✅ 둥근 모서리(`--radius` 계열)·카드형 레이아웃 유지
- ✅ 반응형 3단 브레이크포인트 유지 (960px / 560px)
- ✅ 수정 가능 지점은 `<!-- ✏️ 편집: -->` 주석으로 표시
- ✅ 작업 후 `docs/CHANGELOG.md`에 변경 기록

## 작업 우선순위 (순서대로)

1. CSS/JS 분리 — `docs/TASKS.md` 1단계
2. 아이콘 mask-image 전환 — `docs/TASKS.md` 2단계
3. 이미지 경로 연결 — `docs/TASKS.md` 3단계
4. print.css 작성 — `docs/TASKS.md` 4단계

자세한 작업 절차는 **`docs/TASKS.md`** 참조.
구조·파일 역할은 **`README.md`** 참조.

## 참고 문서 맵

| 문서 | 용도 |
|------|------|
| `README.md` | 디렉토리 구조, 파일 역할 |
| `docs/TASKS.md` | 단계별 작업 체크리스트 + 코드 스니펫 |
| `docs/DESIGN-TOKENS.md` | 색상·폰트·간격·radius 전체 토큰 |
| `docs/CONTENT.md` | 모든 텍스트 콘텐츠 원본 (강사·일정·주소) |
| `docs/ASSETS.md` | 필요 이미지/아이콘 사양·목록 |
| `docs/CHANGELOG.md` | 변경 이력 |
