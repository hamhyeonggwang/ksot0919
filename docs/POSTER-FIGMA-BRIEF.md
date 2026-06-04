# POSTER-FIGMA-BRIEF.md — A2 게시판 포스터 (Figma 제작 가이드)

> **방법:** Figma 단독 · **정본:** `CONTENT.md` · **토큰:** `DESIGN-TOKENS.md`  
> 웹 `index.html`과 별도 파일. 텍스트 수정은 `CONTENT.md` 먼저 → 본 문서·Figma 반영.

---

## 1. 제품 정의

| 항목 | 값 |
|------|-----|
| 용도 | 학과·기관 **게시판 부착** |
| 규격 | **A2 세로** — 420 × 594 mm |
| 정보량 | **풀 A** — 일정·강사·9.19 타임테이블 전부 (아코디언 장문 불릿은 QR/웹) |
| 스타일 | **Editorial Tech** — Bento · Glass · Giant 9.19 · Dark Hero |
| Plan B | 가독성 부족 시 **A1 세로** (594×841mm), 레이아웃 동일 |

---

## 2. Figma 파일 설정

### 프레임
- 이름: `A2-Poster-Final`
- 크기: **420 × 594 mm** (Portrait)
- 배경 기본: `#FAF8F4` (`--ivory`)

### 그리드
| 항목 | 값 |
|------|-----|
| 열 | 12 |
| 마진 | 좌우 12mm · 상하 10mm |
| 거터 | 4mm |

### Variables (Figma Local Variables)

**Colors**

| 이름 | HEX |
|------|-----|
| `navy` | `#1B2E5E` |
| `navy-dark` | `#0F1D3E` |
| `navy-deep` | `#091428` |
| `orange` | `#E8501F` |
| `orange-l` | `#FF6B3A` |
| `green` | `#2A7A4B` |
| `blue` | `#1650C8` |
| `purple` | `#5C2E99` |
| `ivory` | `#FAF8F4` |
| `ivory-2` | `#F2EFE8` |
| `border` | `#E4DFD4` |
| `text` | `#2E2E30` |
| `text-sub` | `#6B6B72` |
| `text-dim` | `#9A9AA3` |

**Typography**

| 스타일명 | 폰트 | 크기 (A2) | 굵기 | 용도 |
|----------|------|-----------|------|------|
| `Display/Hero-EN` | Sora | 48–56pt | 800 | OT Beyond Borders |
| `Display/Date-Giant` | Sora | 120–140pt | 800 | 9.19 워터마크 |
| `Display/Label` | Sora | 7–8pt | 700 | MAIN EVENT, caps, tracking +8% |
| `Body/Title-KR` | Noto Sans KR | 11–12pt | 900 | 섹션 제목 |
| `Body/Head` | Noto Sans KR | 9–10pt | 700 | 주제·강사명 |
| `Body/Text` | Noto Sans KR | 8.5–9pt | 400–500 | 소속·본문 |
| `Body/Caption` | Noto Sans KR | 7.5pt | 400 | 캡션 (최소) |

> 게시판 시청 거리 2~3m — **8.5pt 미만 사용 금지** (풀 A 기준).

### Effects (트렌디)
- **Glass card:** fill `#FFFFFF` 8%, stroke `#FFFFFF` 12%, background blur 12px (인쇄 PDF는 blur → 반투명 fill로 대체)
- **Hero overlay:** linear `#091428` 0% → `#0F1D3E` 55% → transparent
- **Grain:** noise 3% on dark hero only (이미지 또는 Figma noise plugin)

---

## 3. 레이어 구조 (이름 규칙)

```
A2-Poster-Final
├── Zone-A-Hero
├── Zone-B-Main-919
│   ├── B1-Programs
│   └── B2-Timetable
├── Zone-C-Pre-Events
│   ├── C1-0912-Online
│   ├── C2-0913-Child
│   └── C3-0920-Adult
├── Zone-D-Brand
│   ├── D1-Themes
│   └── D2-Values
└── Zone-E-Footer
    ├── E1-Registration
    ├── E2-QR
    └── E3-Logos
```

---

## 4. 레이아웃 와이어 (비율)

```
┌────────────────────────────────────┐  0% – 28%   Zone A
│  hero.jpg + dark gradient + grain   │
│  OT Beyond Borders                  │
│  슬로건 · 부제                       │
│  GIANT "9.19" (orange, low opacity) │
│  9.19 (토) 09:00–17:00 · 장소        │
├────────────────────────────────────┤  28% – 48%  Zone B
│ [보수교육 2]  [명사특강+사진]        │
│ ● dot timeline — 8 rows             │
├────────────────────────────────────┤  48% – 82%  Zone C (bento 3열)
│ 9.12 GREEN │ 9.13 BLUE │ 9.20 PURPLE
├────────────────────────────────────┤  82% – 92%  Zone D
│ 핵심테마 4칸 │ 4대 가치 pill 4개    │
├────────────────────────────────────┤  92% – 100% Zone E
│ 사전등록 · QR×2 · 로고4 · URL       │
└────────────────────────────────────┘
```

---

## 5. 자산 경로 (repo)

| 용도 | 파일 |
|------|------|
| 히어로 배경 | `images/background/hero.jpg` |
| 명사특강 | `images/speakers/명사특강 강연자.jpeg` |
| 장소 (선택) | `images/location/대전보건대학교전경.jpeg` |
| QR 사전등록 | `images/qr/preregister.png` |
| QR 웹 (생성) | 접수안내 URL 또는 `https://hamhyeonggwang.github.io/ksot0919/` |
| 로고 | `images/logos/대한작업치료학회.png` 등 4종 |
| 아이콘 | `icons/*.svg` (단색, mask 대신 fill) |

**QR 최소 크기:** 28×28 mm (인쇄 후 스캔 테스트 필수)

---

## 6. Figma 복붙용 카피 (CONTENT.md 동기)

> 아래 블록을 Zone별 텍스트 레이어에 그대로 붙여넣고, 수정 시 `CONTENT.md`와 함께 갱신한다.

### Zone A — Hero

```
제34회 대한작업치료학회 학술대회 · 2026

OT
Beyond
Borders

AI와 함께 여는 작업치료의 미래

경계를 넘어서는 Practice · Research · Education · Community

9.19 (토)  09:00 – 17:00
대전보건대학교 대강당
대전광역시 동구 충정로 21
```

### Zone B — 9.19 당일

**라벨:** `MAIN EVENT · 9.19`

**보수교육 10:00 – 13:00**

1. AI 시대, 작업치료사에게 필요한 역량과 준비  
   이혜진 교수 · 춘해보건대학교 작업치료과

2. Occupation Flow : 참여 중심 작업치료를 위한 AI Workflow 설계  
   함형광 팀장 · 푸르메재단 넥슨어린이재활병원

**명사초청 특강 14:20 – 15:20**

AI와 돌봄  
홍영일 대표 (박사)  
서울대학교 대학원 교육학과 교육공학 박사  
재미와의미연구소 대표

**당일 타임테이블**

| 시간 | 프로그램 | 장소 |
|------|----------|------|
| 08:00–09:00 | 등록 및 접수 | 로비 |
| 10:00–13:00 | 보수교육 — AI 시대 작업치료사에게 필요한 역량과 준비 / Occupation Flow : AI Workflow 설계 (함형광) · 동시: 대학원생 워크샵(장정열) · 동시: 캡스톤 디자인 발표 | 대강당/별도 |
| 13:00–14:00 | 점심 식사 · 포스터 관람 (내빈 12:00~) | 식당/포스터홀 |
| 14:00–14:20 | 개회식 — 국민의례 · 내빈 · 환영사 · 축사 | 대강당 |
| 14:20–15:20 | 명사특강 — AI와 돌봄 (홍영일 박사) | 대강당 |
| 15:20–15:40 | Break Time | — |
| 15:40–16:30 | 시상식 — 학술상 · 우수석박 · 우수논문 · 캡스톤 | 대강당 |
| 16:30–17:00 | 포스터 관람 · 자유 네트워킹 | 포스터홀 |

> 타임테이블은 Figma에서 **2열 또는 3열** 테이블로 줄바꿈 조정. 8행 유지.

### Zone C1 — 9.12 온라인 (Green)

```
9.12 (토) · 온라인 강좌
14:00 – 18:00 (4h) · 100인

성인 발달장애인 지원사업의 이해와 실제
온라인 (실시간 · Zoom)

1. 박정은 · 대전발달장애인지원센터 센터장
2. 권성애 · 동남보건대학교 아동발달지원센터
3. 강은선 · 이음감각통합발달센터
4. 김시현 · 여울목 시설장

※ 강의 세부 → QR 웹
```

### Zone C2 — 9.13 아동 (Blue)

```
9.13 (일) · 아동 강의
국립정신건강센터 열린강당 (서울)

[오전 09:00 – 13:00]
아동 작업치료에서의 치료적 상호작용 전략: 참여 촉진을 위한 임상 적용
1. 정미양 · 한국아동신경발달연구소
2. 주유미 교수 · 가천대학교

[오후 14:00 – 18:00]
아동 작업치료의 실천 접근: 관계 형성을 위한 플로어 타임과 OPC
1. 박지훈 · 어울림아동발달연구소
2. 유애리 · 시소감각통합상담연구소
3. 정희진 · 마미정감각통합상담연구소
4. 조혜진 · 어바웃차일드

※ 세션 상세 → QR 웹
```

### Zone C3 — 9.20 성인 (Purple)

```
9.20 (일) · 성인 강의
국립정신건강센터 열린강당 (서울)

[오전 09:00 – 13:00]
회복기 재활에서 재택의료까지: 지역사회 복귀를 위한 재활의료 전달체계
1. 김영훈 · 아주대학교 요양병원
2. 유지애 · 청주성모병원
3. 황호성 · 건양대학교
4. 이영오 · 수연복지재단 수연24시 어린이집

[오후 14:00 – 18:00]
지역사회 통합돌봄과 작업치료: 지역별 사업모델과 실천사례
1. 김영훈 · 아주대학교 요양병원
2. 유지애 · 청주성모병원
3. 황호성 · 건양대학교
4. 이영오 · 수연복지재단 수연24시 어린이집

※ 세션 상세 → QR 웹
```

### Zone D — 브랜드

**핵심 테마**

```
2026 핵심 테마

AI와 통합 — 기술이 만드는 따뜻한 돌봄의 미래
AI와 함께하는 작업치료 — 임상 현장을 변화시키는 AI의 실제적 적용
Occupation Flow — 참여 중심 작업치료를 위한 AI Workflow
Next OT Research Talk — 미래를 여는 연구, 작업치료의 새로운 지평
```

**4대 가치**

```
「경계를 넘어서는 작업치료」

Practice 실천  |  Research 연구  |  Education 교육  |  Community 지역사회
```

### Zone E — Footer

```
사전등록
2026. 8. 17.(월) ~ 2026. 10. 2.(금)

[QR] 사전등록          [QR] 상세·웹

https://www.ksot.kr
https://hamhyeonggwang.github.io/ksot0919/

주최 대한작업치료학회
주관 (사)대한작업치료사협회 · 전국대학작업치료 교수협의회
후원 보건복지부

© 2026 The Korean Society of Occupational Therapy.
```

**QR URL**

| QR | URL |
|----|-----|
| 사전등록 | `https://www.ksot.kr/?bid=sympo_info&m=bbs` |
| 웹 상세 | `https://hamhyeonggwang.github.io/ksot0919/` |

---

## 7. 작업 절차 (체크리스트)

### Phase 1 — 셋업 (30분)
- [ ] Figma 파일 생성 · Variables 등록
- [ ] A2 프레임 + 12열 그리드
- [ ] 자산 import (hero, speaker, QR, logos)

### Phase 2 — 와이어 (45분)
- [ ] Zone A–E 회색 박스 비율 확정
- [ ] 벤토 3열 · 타임라인 자리 확보

### Phase 3 — 카피 (1–2시간)
- [ ] §6 복붙용 카피 → 각 Zone
- [ ] `CONTENT.md` 줄 단위 대조

### Phase 4 — 비주얼 (1–2시간)
- [ ] Dark hero + giant 9.19
- [ ] Glass cards · color borders (green/blue/purple)
- [ ] 명사 사진 · dot timeline

### Phase 5 — 인쇄 QA (30분)
- [ ] 100% 확대 8.5pt 가독성
- [ ] QR 실스캔 2종
- [ ] PDF export 300dpi
- [ ] A2 시범 인쇄 1장

### Phase 6 — 배포
- [ ] `export/poster-a2-final.pdf` 저장 (선택, gitignore 가능)
- [ ] 게시판 부착
- [ ] `CHANGELOG.md` 기록

---

## 8. 인쇄·납품

| 항목 | 권장 |
|------|------|
| 용지 | 150–200g 코트지 |
| 코팅 | 무광 (복도 게시판) |
| 색 | RGB PDF → 인쇄소 CMYK 변환 시 1회 시범 |
| 재단 | A2 (블리드 없음 시작 가능) |

---

## 9. 유지보수 규칙

1. 텍스트 변경 → **`docs/CONTENT.md` 먼저**
2. 본 문서 §6 카피 동기화
3. Figma `A2-Poster-Final` 수정
4. PDF 재export

웹 `index.html`과 포스터는 **디자인 분리**, **콘텐츠만 공유**.

---

## 10. 참고 링크

| 문서 | 용도 |
|------|------|
| `docs/CONTENT.md` | 텍스트 정본 |
| `docs/DESIGN-TOKENS.md` | 색·폰트 |
| `docs/ASSETS.md` | 이미지 사양 |
| `README.md` | 웹 배포 URL |
