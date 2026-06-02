# 2026 OT Beyond Borders — 학술대회 랜딩페이지

제34회 대한작업치료학회 학술대회 홍보 웹페이지.
**AI와 함께 여는 작업치료의 미래**

---

## 📁 디렉토리 구조

```
poster/
├── index.html              # 마크업 (현재: CSS/JS 인라인 완성본 — 분리 작업 대상)
├── README.md
├── css/
│   ├── reset.css           # [TODO] 리셋 + box-sizing
│   ├── style.css           # [TODO] :root 변수, 레이아웃, 컴포넌트, 반응형, 아이콘 mask
│   └── print.css           # [TODO] 인쇄 전용 (추후 A1 포스터 대응)
├── js/
│   └── main.js             # [TODO] 네비 scrolled 토글 + IntersectionObserver reveal
├── images/
│   ├── speakers/           # hong-youngil.png
│   ├── location/           # daejeon-health-university.jpg
│   ├── background/         # skyline.png, community-silhouette.png
│   ├── programs/           # online-course.png, child-lecture.png, adult-lecture.png
│   ├── qr/                 # preregister.png, apply.png, detail.png
│   └── logos/              # ksot.svg, couf.svg, mohw.svg
├── icons/                  # mask-image용 단색 SVG (8종)
│   ├── clock.svg, location.svg, microphone.svg, presentation.svg
│   ├── trophy.svg, graduation.svg, award.svg, networking.svg
└── assets/
    └── ai-network.svg      # AI 네트워크 일러스트 (히어로용, 선택)
```

---

## 🛠 Claude Code 작업 지시 (TODO)

### 1단계: CSS/JS 분리
현재 `index.html`은 `<style>`과 `<script>`가 인라인으로 들어있는 완성본이다.
이를 다음으로 분리한다:

- `<style>` 내용 → `css/reset.css`(리셋부) + `css/style.css`(나머지 전체)
- `<script>` 내용 → `js/main.js`
- `index.html <head>`에 링크 연결:
  ```html
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/print.css" media="print">
  ```
- `</body>` 직전: `<script src="js/main.js" defer></script>`

### 2단계: 아이콘 → mask-image 방식 전환
현재 이모지(🎤📊🏆 등)로 된 아이콘을 `icons/*.svg` 외부 파일 + CSS mask로 치환.

```css
.icon {
  display: inline-block;
  width: 20px; height: 20px;
  background-color: currentColor;   /* 색상 = 부모 color */
  -webkit-mask: var(--icon) center/contain no-repeat;
          mask: var(--icon) center/contain no-repeat;
}
.icon-clock        { --icon: url('../icons/clock.svg'); }
.icon-location     { --icon: url('../icons/location.svg'); }
.icon-microphone   { --icon: url('../icons/microphone.svg'); }
.icon-presentation { --icon: url('../icons/presentation.svg'); }
.icon-trophy       { --icon: url('../icons/trophy.svg'); }
.icon-graduation   { --icon: url('../icons/graduation.svg'); }
.icon-award        { --icon: url('../icons/award.svg'); }
.icon-networking   { --icon: url('../icons/networking.svg'); }
```
사용: `<span class="icon icon-clock" style="color:var(--orange)"></span>`

### 3단계: 이미지 경로 연결
placeholder `onerror` 폴백은 **유지**(파일 넣기 전 깨짐 방지).
경로만 새 구조에 맞춰 교체:

| 위치 | 기존 경로 | 새 경로 |
|------|----------|---------|
| 강사 사진 | `images/speaker_hong.jpg` | `images/speakers/hong-youngil.png` |
| 장소 | `images/venue.jpg` | `images/location/daejeon-health-university.jpg` |
| 배경 | `images/bg_silhouette.png` | `images/background/community-silhouette.png` |
| AI 다이어그램 | `images/ai_diagram.png` | `assets/ai-network.svg` |
| QR 등록 | `images/qr_register.png` | `images/qr/preregister.png` |
| QR 신청 | `images/qr_register.png` | `images/qr/apply.png` |
| QR 일정 | `images/qr_schedule.png` | `images/qr/detail.png` |
| 로고 | `images/logo_*.png` | `images/logos/{ksot,couf,mohw}.svg` |

### 4단계: print.css 작성 (추후)
- 네비, CTA 버튼, 스크롤 힌트, 애니메이션 숨김
- 색상·배경 인쇄 보정 (`-webkit-print-color-adjust: exact`)
- A1 규격 대응은 별도 인쇄용 작업에서 진행

---

## 🎨 디자인 토큰 (style.css `:root`)

| 변수 | 값 | 용도 |
|------|-----|------|
| `--navy` | `#1B2E5E` | 타이틀, 헤더 |
| `--navy-dark` | `#0F1D3E` | 다크 배경 |
| `--orange` | `#E8501F` | CTA, 강조 |
| `--green` | `#2A7A4B` | 보수교육/온라인 |
| `--purple` | `#5C2E99` | 특강/성인 강의 |
| `--blue` | `#1650C8` | 아동 강의 |
| `--ivory` | `#FAF8F4` | 메인 배경 (화이트 대체) |
| `--black` | `#1C1C1E` | 본문 (매트블랙) |

폰트: 디스플레이 `Sora`, 본문 `Noto Sans KR`

---

## 🔗 링크 (추후 교체)
모든 버튼 현재 `https://www.ksot.kr` placeholder.
HTML 내 `✏️ 편집:` 주석으로 위치 표시됨. 실제 URL로 일괄 교체.

---

## ✅ 진행 상태
- [x] 디렉토리 구조 생성
- [x] 빈 CSS/JS 파일 생성
- [ ] CSS/JS 분리 (1단계)
- [ ] 아이콘 mask 전환 (2단계)
- [ ] 이미지 경로 연결 (3단계)
- [ ] print.css 작성 (4단계)
- [ ] 실제 이미지/아이콘/QR 파일 교체
- [ ] 실제 링크 URL 교체
