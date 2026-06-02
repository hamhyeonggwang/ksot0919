# TASKS.md — 단계별 작업 절차

작업 순서대로 진행. 각 단계 완료 시 `CHANGELOG.md` 기록.

---

## ✅ 1단계 — CSS/JS 분리

**목표:** `index.html`의 인라인 `<style>`/`<script>`를 외부 파일로 분리.

### 절차
1. `<style>` 내용 중 **리셋 부분**(`*`, `body`, `a`, `html` 기본 스타일)을 `css/reset.css`로 이동
2. **나머지 전체**(`:root` 변수, 모든 컴포넌트, 미디어쿼리)를 `css/style.css`로 이동
3. `index.html <head>`에 링크 추가:
   ```html
   <link rel="stylesheet" href="css/reset.css">
   <link rel="stylesheet" href="css/style.css">
   <link rel="stylesheet" href="css/print.css" media="print">
   ```
4. `<script>` 내용을 `js/main.js`로 이동, `</body>` 직전에:
   ```html
   <script src="js/main.js" defer></script>
   ```
5. `index.html`에서 인라인 `<style>`, `<script>` 블록 제거

### 검증
- [ ] 브라우저에서 레이아웃·애니메이션 1단계 전과 동일
- [ ] 콘솔 에러 없음
- [ ] 네비 스크롤 효과, reveal 애니메이션 정상 동작

---

## ✅ 2단계 — 아이콘 mask-image 전환

**목표:** 이모지 아이콘 → `icons/*.svg` 외부 파일 + CSS mask.

### style.css에 추가
```css
.icon {
  display: inline-block;
  width: 1em; height: 1em;
  background-color: currentColor;
  -webkit-mask: var(--icon) center / contain no-repeat;
          mask: var(--icon) center / contain no-repeat;
  vertical-align: -0.125em;
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

### 치환 대상 (이모지 → 클래스)
| 위치 | 기존 이모지 | 새 클래스 |
|------|-----------|----------|
| 메인 행사 시간 | ⏰ | `icon-clock` |
| 메인 행사 장소 | 📍 | `icon-location` |
| 프로그램 칩 기조강연 | 🎤 | `icon-microphone` |
| 프로그램 칩 학술발표 | 📊 | `icon-presentation` |
| 프로그램 칩 우수논문 | 🏆 | `icon-trophy` |
| 프로그램 칩 캡스톤 | 🎨 | (graduation 대용 또는 신규) |
| 프로그램 칩 시상식 | 🏅 | `icon-award` |
| 프로그램 칩 네트워킹 | 🤝 | `icon-networking` |

> ⚠️ `icons/*.svg` 파일이 아직 없으면, 이 단계는 **파일 준비 후** 진행.
> 파일 없을 동안은 이모지 임시 유지 가능.

### 검증
- [ ] 아이콘 색상이 부모 `color`를 따라감
- [ ] 호버 시 색상 전환 정상

---

## ✅ 3단계 — 이미지 경로 연결

**목표:** placeholder 경로를 새 폴더 구조로 교체. `onerror` 폴백 유지.

| 요소 | 기존 경로 | 새 경로 |
|------|----------|---------|
| 강사 사진 | `images/speaker_hong.jpg` | `images/speakers/hong-youngil.png` |
| 장소 | `images/venue.jpg` | `images/location/daejeon-health-university.jpg` |
| 배경 실루엣 | `images/bg_silhouette.png` | `images/background/community-silhouette.png` |
| AI 다이어그램 | `images/ai_diagram.png` | `assets/ai-network.svg` |
| QR 사전등록 | `images/qr_register.png` | `images/qr/preregister.png` |
| QR 참가신청 | `images/qr_register.png` | `images/qr/apply.png` |
| QR 상세일정 | `images/qr_schedule.png` | `images/qr/detail.png` |
| 로고 주최 | `images/logo_ksot.png` | `images/logos/ksot.svg` |
| 로고 주관 | `images/logo_couf.png` | `images/logos/couf.svg` |
| 로고 후원 | `images/logo_mohw.png` | `images/logos/mohw.svg` |

### 검증
- [ ] 모든 `src` 새 경로로 교체
- [ ] 파일 없을 때 `onerror` placeholder 정상 표시

---

## ✅ 4단계 — print.css 작성

**목표:** 인쇄/PDF 출력 시 깔끔하게. (A1 대규격은 별도 작업)

### 기본 골격
```css
@media print {
  .nav, .scroll-hint, .hero-btns, .reg-btns,
  .nav-cta, .venue-map-btn { display: none !important; }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body { background: #fff; }
  section { padding: 24px 0; break-inside: avoid; }
  .reveal { opacity: 1 !important; transform: none !important; }

  .highlight-card, .reg-card, .prog-card, .sched-card {
    box-shadow: none;
    border: 1px solid #ddd;
  }

  @page { margin: 12mm; }
}
```

### 검증
- [ ] 브라우저 인쇄 미리보기에서 네비·버튼 숨김
- [ ] 색상·배경 유지
- [ ] 카드가 페이지 경계서 잘리지 않음

---

## 🔚 마무리 단계 (자산 준비 후)

- [ ] 실제 이미지/QR/로고 파일 각 폴더에 배치 → `docs/ASSETS.md` 사양 준수
- [ ] `icons/*.svg` 8종 준비 후 2단계 실행
- [ ] 모든 `https://www.ksot.kr` placeholder → 실제 URL 교체
- [ ] 모바일/데스크탑 최종 QA
- [ ] Vercel 또는 GitHub Pages 배포
