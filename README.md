# 2026 OT Beyond Borders — 학술대회 랜딩페이지

제34회 대한작업치료학회 학술대회 홍보 웹페이지.  
**AI와 함께 여는 작업치료의 미래**

---

## 📁 디렉토리 구조

```
poster/
├── index.html              # 단일 페이지 마크업
├── README.md
├── css/
│   ├── reset.css           # :root 변수 + 리셋
│   ├── style.css           # 컴포넌트·레이아웃·반응형
│   └── print.css           # 인쇄 전용
├── js/
│   └── main.js             # hero sparkle, 아코디언, nav, reveal
├── images/
│   ├── background/hero.jpg # Hero 전체 배경 (최적화)
│   ├── speakers/
│   ├── location/
│   ├── logos/
│   └── qr/                 # QR (미배치)
├── icons/                  # mask-image SVG 8종
└── docs/                   # 📌 문서 정본 (Single Source of Truth)
    ├── CONTENT.md          # 콘텐츠 원본
    ├── TASKS.md            # 작업 절차
    ├── DESIGN-TOKENS.md
    ├── ASSETS.md
    └── CHANGELOG.md
```

> 루트의 `CONTENT.md`, `TASKS.md` 등은 **`docs/`로 리다이렉트 안내**만 포함합니다.

---

## 🛠 작업 순서 (권장)

| 단계 | 내용 | 상태 |
|------|------|------|
| **1** | `docs/CONTENT.md` 정본 확정 · 문서 정리 | ✅ 완료 |
| **2** | HTML 콘텐츠를 CONTENT에 맞춰 동기화 | ✅ 완료 |
| **3** | IA(섹션 순서·네비 앵커) 조정 | ✅ 완료 |
| **4** | 자산·URL·QR 연결 | ✅ 완료 |
| **5** | 아이콘 mask 전환 · 모바일 네비 | ✅ 완료 |
| **6** | SEO · a11y · 성능 · 인쇄 QA | ⬜ 다음 |

기술 분리 작업 (CSS/JS 분리, print.css)는 **완료** — 상세는 `docs/TASKS.md` 참조.

---

## 🎨 디자인 · 개발 규칙

- 순수 HTML + CSS + Vanilla JS (프레임워크 없음)
- 색상·간격: `docs/DESIGN-TOKENS.md` / `css/reset.css` `:root`
- 콘텐츠 수정: **`docs/CONTENT.md` 먼저** → `index.html` 반영
- 변경 기록: `docs/CHANGELOG.md`

---

## 🔗 링크

| 용도 | URL |
|------|-----|
| 사전등록/참가신청 | [학술대회 접수안내](https://www.ksot.kr/?bid=sympo_info&m=bbs) |
| 지도 | [네이버 지도 — 대전보건대학교](https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EB%B3%B4%EA%B1%B4%EB%8C%80%ED%95%99%EA%B5%90) |
| 학회 홈 | https://www.ksot.kr |

> 2026 전용 접수 폼 공개 시 URL·QR 교체 — `docs/CONTENT.md` 참조.

---

## 🚀 로컬 실행

```bash
python3 -m http.server 3400
# http://localhost:3400
```
