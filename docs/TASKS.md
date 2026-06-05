# TASKS.md — 단계별 작업 절차

작업 순서대로 진행. 각 단계 완료 시 `CHANGELOG.md` 기록.

---

## ✅ 기술 분리 (완료)

| 단계 | 내용 | 상태 |
|------|------|------|
| 1 | CSS/JS 분리 | ✅ |
| 4 | print.css 작성 | ✅ |

### 1단계 검증
- [x] 외부 CSS/JS 링크
- [x] 네비 스크롤, reveal, 아코디언 동작
- [x] hero sparkle canvas

---

## ✅ 2단계 — 아이콘 mask-image 전환 (완료)

**목표:** 이모지 → `icons/*.svg` + CSS mask

- [x] `style.css` `.icon` 클래스 + SVG 연결
- [x] 하이라이트 섹션 clock/location/프로그램 칩
- [x] Values · 핵심 테마 · 일정·장소·등록 UI 아이콘
- [x] SVG 18종 (`icons/*.svg`)

---

## ✅ 3단계 — 이미지 경로 (부분 완료)

| 자산 | 경로 | 상태 |
|------|------|------|
| Hero 배경 | `images/background/hero.jpg` | ✅ (1400px · ~122KB) |
| 명사특강 사진 | `images/speakers/명사특강 강연자.jpeg` | ✅ |
| 장소 | `images/location/대전보건대학교전경.jpeg` | ✅ |
| 푸터 로고 4종 | `images/logos/*.png` | ✅ |
| QR | `images/qr/preregister.png` | ✅ |
| AI 다이어그램 | `assets/ai-network.svg` | ❌ 미사용(빈 파일) |

---

## 📋 콘텐츠·IA 작업 (신규 — 권장 순서)

### ✅ 1단계 — 정본·문서 (완료)
- [x] `docs/CONTENT.md` 확장 (IA, 타임테이블, 확인 필요, 2단계 체크리스트)
- [x] 루트 중복 문서 → `docs/` 안내 stub
- [x] README 진행 상태 갱신

### ✅ 2단계 — HTML 콘텐츠 동기화 (완료)
- [x] `docs/CONTENT.md` 「확인 필요」7건 사용자 확인 반영
- [x] `docs/CONTENT.md` 「HTML 대조 체크리스트」 강의·강사 항목 반영
- [x] `index.html` — 9.12 날짜, 아동·성인 오전/오후 세션, 명사특강 표기
- [x] Hero 부제 ↔ Values 톤 통일

### ✅ 3단계 — IA · 네비 (완료)
- [x] 섹션 순서 (Hero → Highlight → Values → Programs → Schedule → About → Register)
- [x] `#register` · `#venue` · `#themes` 앵커 추가
- [x] 네비: 당일 프로그램 · 장소 `#venue` · 사전등록 `#register`
- [x] programs **당일 프로그램** / about **핵심 테마** 명칭 구분
- [x] Hero CTA → `#register` · `#highlight`
- [x] `scroll-padding-top` · `.core-eyebrow` · `.nav-logo` 링크 스타일
- [x] `docs/CONTENT.md` IA 표 갱신

### ✅ 4단계 — 자산 · URL (완료)
- [x] QR `images/qr/preregister.png` 생성 (접수안내 URL)
- [x] 참가신청 → 학술대회 접수안내 게시판
- [x] 지도 → 네이버 지도 (대전보건대학교)
- [x] `target="_blank"` 링크 `rel="noopener noreferrer"` 통일
- [x] `docs/CONTENT.md` 링크 표 갱신

> **후속:** 2026 전용 접수 폼(forms.gle 등) 공개 시 URL·QR 재생성

### ✅ 5단계 — UI · 반응형 (완료)
- [x] 이모지 → mask-image 전환 (Values·테마·일정·장소·등록)
- [x] SVG 10종 추가 (handshake, flask, book, chip, hospital, gear, clipboard, laptop, calendar, pencil)
- [x] 모바일 햄버거 네비 (820px 이하 · 드로어 · backdrop)
- [x] `hero.jpg` 최적화 (1.8MB PNG → ~122KB JPEG)

### ✅ 6단계 — QA · 배포 (완료)
- [x] meta description · OG · Twitter Card · favicon.svg
- [x] skip-link · `<main id="main">` · 아코디언 `aria-labelledby`
- [x] hero sparkle — 탭 비활성·뷰포트 이탈 시 rAF 중지
- [x] print.css hero·외부 링크 URL 보완
- [x] GitHub Pages workflow (`.github/workflows/pages.yml`)

> **배포 URL:** https://hamhyeonggwang.github.io/ksot0919/  
> 저장소 Settings → Pages → Source: **GitHub Actions** 확인

---

## 📋 콘텐츠 수정 — 2026-06-06 수정사항 (HWP 기준)

> 출처: `학술대회 포스터 및 홈페이지 수정사항-2.hwp`  
> 승인 후 실행. 완료 항목은 ✅ 체크.

### 프로그램 명칭 수정

- [x] `우수논문 발표` → `구두논문 발표` (HL 프로그램 칩 · 타임테이블 · 아코디언 전체)
- [x] HL 칩 `시상식 및 폐회식` 삭제
- [x] 타임테이블 `포스터 관람 · 자유 네트워킹` 행(16:30~17:00) 삭제
- [x] 타임테이블 시상식 행에서 `폐회식` 문구 제거

### 대학원생 워크샵 명칭 확정

- [x] `연결에서 영감으로, Next OT Research Talk` → `Next OT 톡톡 2026: Our Story & Study: Being & Doing`

### 보수교육 학점 표기 추가

- [x] 보수교육 카드에 `4학점 인정` 뱃지 추가

### 강사 소속 변경

- [x] `박예슬 · 청주성모병원` → `박예슬 · 연세송내과 재택의료센터`

### 오타 수정

- [x] `학술주관` → `학술주간` (index.html에 해당 문구 없음 — 이미 정상)

### 주최·주관·후원 정리

- [x] 푸터 `전국대학작업치료 교수협의회` 삭제
- [x] 푸터 `보건복지부` 후원 삭제 (2026-06-06 결정)

### 플로팅 CTA

- [x] 하단 고정 floating 버튼 바 추가 (CSS + HTML + JS)

### 프로그램별 신청 페이지

- [x] `register/` 폴더 생성
- [x] `register/poster.html` — 포스터 발표 신청
- [x] `register/workshop.html` — 대학원생 워크샵 신청
- [x] `register/oral.html` — 구두논문 발표 신청
- [x] `register/capstone.html` — 캡스톤 디자인 발표 신청
- [x] `register/ceu.html` — 보수교육 신청
- [x] `register/register.css` — 공통 스타일
- [x] `register/register.js` — Google Apps Script 연동 준비 (SCRIPT_URL 교체만 하면 즉시 동작)
- [x] 메인 페이지에서 각 신청 페이지로 버튼 연결

### 추가 논의 필요 (보류)

- Google Apps Script 배포 URL 확정 → `register/register.js` SCRIPT_URL에 삽입
- 신청 폼 필수 항목 확정 → 각 페이지 form 필드 조정
- 컬러메일 HTML 삽입 여부 — 별도 검토

---

## 📄 A2 게시판 포스터 (Figma — 진행 중)

**가이드:** `docs/POSTER-FIGMA-BRIEF.md`

| 단계 | 내용 | 상태 |
|------|------|------|
| P1 | 기획·Figma 브리프 문서 | ✅ |
| P2 | Figma Variables · Zone 와이어 | ⬜ |
| P3 | 카피 붙여넣기 · CONTENT 대조 | ⬜ |
| P4 | 트렌디 비주얼 · PDF export | ⬜ |
| P5 | A2 시범 인쇄 · 게시판 부착 | ⬜ |

---

## 🔚 마무리 (자산 준비 후)

- [x] `icons/*.svg` mask-image 치환 완료
- [x] CONTENT ↔ HTML 최종 대조
- [ ] 모바일/데스크탑 QA

---

## 아이콘 mask 스니펫 (참고)

```css
.icon {
  display: inline-block;
  width: 1em; height: 1em;
  background-color: currentColor;
  -webkit-mask: var(--icon) center / contain no-repeat;
          mask: var(--icon) center / contain no-repeat;
}
```

```css
.icon-clock        { --icon: url('../icons/clock.svg'); }
.icon-location     { --icon: url('../icons/location.svg'); }
/* … docs/TASKS.md 이전 버전 또는 style.css 참조 */
```
