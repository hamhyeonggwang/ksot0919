# ASSETS.md — 이미지 · 아이콘 · QR 사양

필요한 모든 자산의 위치 · 권장 사양. 파일 준비 시 이 표 기준.

---

## 🖼 이미지 (`images/`)

### speakers/
| 파일 | 내용 | 권장 사양 |
|------|------|----------|
| `hong-youngil.png` | 홍영일 교수 프로필 사진 | 세로형, 최소 400×480px, 인물 중앙 |

### location/
| 파일 | 내용 | 권장 사양 |
|------|------|----------|
| `daejeon-health-university.jpg` | 대전보건대학교 대강당/전경 | 가로형 16:9, 최소 800×450px |

### background/
| 파일 | 내용 | 권장 사양 |
|------|------|----------|
| `skyline.png` | 도시 스카이라인 (선택, 히어로 보조) | 가로 와이드, 투명 PNG 권장 |
| `community-silhouette.png` | 사람들 실루엣 (원본 포스터 하단) | 가로 와이드, 투명 PNG |

### programs/
| 파일 | 내용 | 권장 사양 |
|------|------|----------|
| `online-course.png` | 온라인 강좌 일러스트 (선택) | 정사각/가로, 투명 PNG |
| `child-lecture.png` | 아동 강의 일러스트 (선택) | 동일 |
| `adult-lecture.png` | 성인 강의 일러스트 (선택) | 동일 |

> programs 이미지는 현재 디자인에서 미사용. 카드에 일러스트 추가 시 활용.

### qr/
| 파일 | 내용 | 권장 사양 |
|------|------|----------|
| `preregister.png` | 사전등록 QR | 정사각, 최소 300×300px, 여백 포함 |
| `apply.png` | 참가신청 QR | 동일 |
| `detail.png` | 상세일정 QR | 동일 |

### logos/
| 파일 | 내용 | 권장 사양 |
|------|------|----------|
| `ksot.svg` | 대한작업치료학회 로고 | SVG 벡터, 가로형 |
| `couf.svg` | 전국대학작업치료 교수협의회 | SVG 벡터 |
| `mohw.svg` | 보건복지부 | SVG 벡터 |

> 협회 로고(`kaot`)도 필요 시 `images/logos/kaot.svg` 추가.

---

## 🎯 아이콘 (`icons/`) — mask-image용

**중요:** 모두 **단색 SVG** (fill 색상 무관, mask로 색칠됨).
`viewBox="0 0 24 24"` 권장, `fill="currentColor"` 또는 단색 path.

| 파일 | 용도 | 모티프 |
|------|------|--------|
| `clock.svg` | 행사 시간 | 시계 |
| `location.svg` | 장소 | 핀 |
| `microphone.svg` | 기조강연 및 특강 | 마이크 |
| `presentation.svg` | 학술발표 및 심포지엄 | 발표 화면 |
| `trophy.svg` | 우수논문 발표 | 트로피 |
| `graduation.svg` | 캡스톤 디자인 발표 | 학사모 |
| `award.svg` | 시상식 및 폐회식 | 메달/리본 |
| `networking.svg` | 네트워킹 | 연결된 사람들 |

> 무료 아이콘 소스 추천: Lucide, Heroicons, Tabler Icons (모두 MIT, 단색 SVG).
> 다운로드 후 파일명만 위와 같이 맞추면 됨.

---

## 🌐 assets/

| 파일 | 내용 | 비고 |
|------|------|------|
| `ai-network.svg` | AI 중앙 네트워크 다이어그램 | 히어로 중앙 원형. 미준비 시 현재 "AI" 텍스트 + 회전 링으로 대체 표시 |

---

## 📦 자산 준비 우선순위

### 필수 (없으면 허전)
1. `speakers/hong-youngil.png` — 강사 사진
2. `qr/preregister.png`, `qr/apply.png`, `qr/detail.png` — QR
3. `logos/*.svg` — 주최/주관/후원 로고
4. `location/daejeon-health-university.jpg` — 장소

### 권장
5. `icons/*.svg` 8종 — 이모지 대체
6. `background/community-silhouette.png` — 히어로 배경
7. `assets/ai-network.svg` — AI 다이어그램

### 선택
8. `programs/*.png` — 강의 일러스트

---

## 🔧 최적화 팁

- 사진(jpg/png): [Squoosh](https://squoosh.app)로 압축, 폭 1200px 이하
- SVG: [SVGOMG](https://jakearchy.github.io/svgomg/)로 경량화
- QR: 흑백 고대비, 최소 여백(quiet zone) 4모듈 확보
