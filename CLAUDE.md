# CLAUDE.md

> Claude Code가 이 프로젝트에서 작업할 때 항상 먼저 읽는 컨텍스트 파일.

## 프로젝트 정체성

**2026 OT Beyond Borders** — 제34회 대한작업치료학회 학술대회 홍보 웹페이지 + 온라인 접수 시스템.
- 슬로건: "AI와 함께 여는 작업치료의 미래"
- 성격: 학술대회 랜딩페이지(이메일 배포 + 웹 공유) **＋ 실제 운영 중인 접수 폼 7종**
- 톤: 학술적 신뢰감 + 미래지향적 AI 감성 + 따뜻한 돌봄

> ⚠️ **접수 시스템은 라이브 운영 중이다.** `register/`·`supabase/` 변경은 실제 신청자에게
> 즉시 영향을 준다. 폼 필드·요금·마감일·DB 스키마는 추측으로 바꾸지 말고 반드시 확인할 것.

## 기술 스택 / 제약

**프론트엔드** — 순수 HTML + CSS + Vanilla JS (프레임워크·빌드 도구 없음)
- 외부 의존성: Google Fonts (Sora, Noto Sans KR) 만
- 정적 호스팅, 브라우저 타깃: 최신 Chrome/Safari/Edge + 모바일

**백엔드(접수)** — Supabase Edge Function(Deno/TypeScript) + Postgres + Storage, Google Apps Script → Sheets

## 디렉토리 구조

```
/
├── index.html              # 랜딩 단일 페이지 (약 42KB, 정본 마크업)
├── mail.html               # 이메일 배포용 HTML (table 레이아웃 · 인라인 스타일)
├── vip-mail.html           # VIP 초청장 이메일 HTML
├── favicon.svg  .nojekyll
├── css/  reset.css(:root 토큰) · style.css(컴포넌트) · print.css(인쇄)
├── js/   main.js           # hero sparkle canvas, 아코디언, 네비, reveal
├── icons/ *.svg            # mask-image 아이콘 18종
├── images/                 # background · speakers · location · logos · qr
├── assets/ai-network.svg   # ❌ 빈 파일 · 미사용
├── form-templates/         # 신청 양식 원본(hwp) — Supabase Storage 업로드용 사본
├── register/               # 🔴 접수 시스템 (아래 별도 설명)
├── supabase/               # 🔴 Edge Function + 마이그레이션
├── docs/                   # 📌 문서 정본 (Single Source of Truth)
└── .github/workflows/pages.yml
```

루트의 `CONTENT.md`·`TASKS.md`·`CHANGELOG.md`·`DESIGN-TOKENS.md`·`ASSETS.md`는
**`docs/`로 안내하는 stub**이다. 내용을 채우지 말 것.

---

## 🔴 접수 시스템 (register/ + supabase/)

### 데이터 흐름 — 단일 제출 게이트웨이

```
브라우저 폼 (FormData 1회 POST)
  → Supabase Edge Function `submit`
      ├─ 파일 → Storage 버킷 submissions-2026 (비공개, 90일 signed URL)
      ├─ 행   → Postgres submissions_* 테이블
      └─ POST → Google Apps Script webhook → Google Sheets
  → { ok: true, id } 또는 { ok: false, message }
```

- 브라우저는 **GAS를 직접 호출하지 않는다.** 동기 처리이므로 침묵 실패가 없다.
- 실패 시 업로드된 파일은 롤백 삭제, DB 행은 `status: failed` + `sync_error` 기록.
- `status` 흐름: `pending` → `synced`(정상) / `failed`(오류) / `complete`(Sheets 생략 폼)

### form_type → 테이블 매핑

`supabase/functions/submit/index.ts`의 `FORM_TABLE`이 정본이다.

| 폼 페이지 | `form_type` (hidden input) | 테이블 |
|-----------|---------------------------|--------|
| `ceu.html` | `작업치료사` | `submissions_ceu_clinician` |
| `ceu.html` | `학생` · `일반참가자` | `submissions_ceu_student` ※ |
| `workshop.html` | `대학원생 워크숍` | `submissions_workshop` |
| `poster.html` | `포스터 및 구두발표 접수` | `submissions_poster` |
| `oral.html` | `우수 학위논문 접수` | `submissions_oral` |
| `capstone.html` | `캡스톤 디자인 접수` | `submissions_capstone` |
| `vip.html` | `VIP 참석 확인` | `submissions_vip` |

※ `학생`·`일반참가자`가 한 테이블을 공유하므로, Edge Function이 `role` 컬럼에
원래 `form_type`을 저장한다 (`ROLE_TABLES`).

`ceu.html`은 하나의 페이지에서 `form_type`을 **라디오 버튼으로 선택**받는다
(다른 폼은 hidden input 고정). 역할에 따라 강좌 항목·요금이 분기한다.

### ⚠️ 가장 자주 터진 버그 — 폼 필드 ↔ DB 컬럼 불일치

Edge Function은 폼 필드를 **그대로 insert**한다 (`SKIP_FIELDS`·`META_FIELDS` 제외).
따라서 **폼에 `name` 속성을 추가하면 반드시 대응 DB 컬럼을 먼저 추가**해야 한다.

> 미이행 시: `Could not find the 'xxx' column of '...' in the schema cache` → **접수 전면 불가**
> (실제로 2026-07-24, 2026-08-17 두 차례 라이브 장애 발생)

폼 필드를 추가·변경할 때 체크리스트:
1. `supabase/migrations/00N_*.sql`에 `alter table ... add column if not exists` 작성
2. **라이브 DB(Supabase Dashboard > SQL Editor)에 실제 실행** — 파일 작성만으로는 반영 안 됨
3. `register/apps-script.gs`의 `SHEET_CONFIG` 컬럼 목록에 추가
4. Apps Script **새 버전으로 재배포** (붙여넣기만으로는 반영 안 됨)
5. DB에 저장하면 안 되는 UI 전용 필드는 Edge Function `SKIP_FIELDS`에 추가
   (예: `pay_method_primary`/`pay_method_sub` — 합산 결과 `pay_method`만 저장)

### 폼 페이지 구조 (register/*.html)

스크립트 로드 순서가 중요하다:

```html
<script src="supabase-config.js"></script>   <!-- SUPABASE_URL · ANON_KEY · getSubmitUrl() -->
<script src="forms-config.js"></script>      <!-- 양식 다운로드 링크 (필요한 폼만) -->
<script>window.REG_GATE = { ... };</script>  <!-- register.js보다 반드시 먼저 -->
<script src="register.js"></script>          <!-- 공통 검증·게이팅·제출 -->
```

- 폼 엘리먼트는 `id="reg-form"`, 제출 버튼은 `id="submit-btn"`, 성공 영역은 `id="success-msg"`.
- `register.js`가 `DOMContentLoaded`에서 자동으로 바인딩한다.
- **`vip.html`은 예외** — `register.js`를 쓰지 않고 자체 인라인 스크립트로 제출한다.

### 접수 게이팅 (마감/오픈 일정)

`window.REG_GATE`로 폼별 기준시각을 설정한다. 허브(`register/index.html`)를 거치지 않고
개별 URL로 직접 들어와도 적용되도록 **공통 `register.js`에 구현**되어 있다.

| 분류 | 페이지 | mode | 기준시각 |
|------|--------|------|----------|
| 발표 신청 | `oral` · `poster` · `capstone` | `close-at` | 2026-07-31 23:59:59 KST 마감 |
| 교육 신청 | `ceu` · `workshop` | `open-at` (기본값) | 2026-08-17 00:00 KST 오픈 |
| 없음 | `vip` | — | 게이팅 미적용 |

`REG_GATE` 미설정 시 기본값은 `open-at` / 8-17이다. `register/index.html` 허브는
카드에 `data-gate="edu" | "pres"`를 붙여 `wireGate()`로 동일 기준을 독립 적용한다.

### 파일 업로드 규칙

`register.js`(클라이언트)와 Edge Function(서버) **양쪽에 중복 정의**되어 있으므로 함께 고칠 것.

- 허용 확장자: `pdf` `doc` `docx` `ppt` `pptx` `hwp` · 최대 10MB
- 필수 파일: 포스터 1개(`abstract_file`) / 학위논문 4개 전부
  (`recommendation_file` `grad_cert_file` `similarity_file` `thesis_file`) / 캡스톤 1개(`capstone_file`)
- 저장 경로: `submissions-2026/{table}/{rowId}/{inputName}.{ext}`
- DB에는 `*_file_path` + `*_file_url`(signed, 90일) 두 컬럼으로 기록 (`FILE_FIELDS`)

### Storage 버킷

| 버킷 | 용도 | 공개 |
|------|------|------|
| `form-templates` | 신청 양식 다운로드 (`forms-config.js`가 참조) | ✅ 공개 |
| `submissions-2026` | 제출 파일 | ❌ 비공개 |

### RLS

모든 `submissions_*` 테이블은 RLS 활성 + **정책 없음** = anon/authenticated 전면 차단.
`service_role`(Edge Function)만 RLS를 우회해 접근한다. 클라이언트에서 DB 직접 조회 금지.

---

## 절대 규칙 (하지 말 것)

- ❌ React/Vue/Tailwind 등 도입 금지 — 순수 정적 파일 유지
- ❌ localStorage/sessionStorage 사용 금지
- ❌ 디자인 토큰(색상·폰트) 임의 변경 금지 — `docs/DESIGN-TOKENS.md` · `css/reset.css` 준수
- ❌ placeholder `onerror` 폴백 제거 금지 (실제 이미지 넣기 전까지 유지)
- ❌ 한글 콘텐츠(강사명·강의명·날짜) 임의 수정 금지 — 오타 의심 시 사용자에게 질문
- ❌ **요금·계좌·마감일·강좌명 추측 변경 금지** — 클라이언트(학회) 확인 필수
- ❌ **폼 필드 추가 시 DB 마이그레이션 생략 금지** (위 체크리스트 참조)
- ❌ `SUPABASE_SERVICE_ROLE_KEY`·`WEBHOOK_SECRET`을 클라이언트 코드/저장소에 넣지 말 것
  (`supabase-config.js`의 publishable(anon) key만 공개 대상)
- ❌ 루트 stub `.md` 파일에 내용 작성 금지 — 정본은 `docs/`

## 항상 지킬 것

- ✅ 색상은 CSS 변수(`var(--orange)` 등)로만 사용, 하드코딩 금지
- ✅ 밝은 배경 위 주황 텍스트는 `--orange-text`(WCAG AA), 어두운 배경 위는 `--orange-l`
- ✅ 둥근 모서리(`--radius` 계열)·카드형 레이아웃 유지
- ✅ 반응형 3단 브레이크포인트 유지 (960px / 560px), 모바일 네비는 820px
- ✅ 수정 가능 지점은 `<!-- ✏️ 편집: -->` 주석으로 표시 (index.html 15곳, register/ 14곳)
- ✅ 외부 링크는 `target="_blank"` + `rel="noopener noreferrer"`
- ✅ 아이콘은 이모지 대신 `.icon .icon-*` mask-image 사용
- ✅ 작업 후 `docs/CHANGELOG.md` **맨 위에** 날짜 역순으로 기록 (아래 형식)

### CHANGELOG 기록 형식

```markdown
## [YYYY-MM-DD] — 한 줄 제목

배경·이유 1~2문장.

| 변경 | 내용 |
|------|------|
| `파일경로` | 무엇을 어떻게 |
| — | 파일 외 조치(재배포·DB 실행·검증·보류 결정 등) |

---
```

## 개발 워크플로

### 로컬 실행

```bash
python3 -m http.server 3400    # http://localhost:3400
```

`.claude/launch.json`에 동일 설정이 있다. 접수 폼은 로컬에서도 **라이브 Supabase로 제출**되므로
테스트 시 반드시 식별 가능한 더미 데이터를 쓰고, 확인 후 해당 row를 삭제할 것.

### 배포

**정적 사이트** — `main` 푸시 시 `.github/workflows/pages.yml`이 GitHub Pages로 자동 배포.
→ https://hamhyeonggwang.github.io/ksot0919/

> ⚠️ **알려진 불일치:** 현재 워크플로는 `index.html favicon.svg .nojekyll` + `css js images icons`
> 만 `_site/`로 복사한다. **`register/`, `mail.html`, `vip-mail.html`, `assets/`,
> `form-templates/`는 배포에서 누락된다.** `docs/CHANGELOG.md`(2026-06-18)에
> "`pages.yml` register/ 배포 추가"로 기록돼 있으나 실제 커밋은 반영되지 않았다
> (pages.yml은 최초 커밋 이후 수정 이력 없음).
> `index.html`은 `register/*.html`을 상대경로로 링크하므로 Pages 단독으로는 404가 된다.
> 접수 페이지 관련 배포 작업 전에 **실제 운영 호스팅 경로를 사용자에게 확인**할 것
> (`.gitignore`에 `.vercel`이 있어 Vercel 수동 배포 가능성 있음).

**Edge Function** — 코드 수정 후 재배포 필요:

```bash
supabase functions deploy submit
```

**Apps Script** — `register/apps-script.gs` 수정 시 편집기에 재붙여넣기 후
**배포 > 새 배포(새 버전)**. 저장만으로는 반영되지 않는다.

**DB 마이그레이션** — Supabase Dashboard > SQL Editor에서 수동 실행.
`supabase/migrations/`는 기록·재현용이며 자동 적용되지 않는다.

### 필요한 Edge Function Secrets

`SUPABASE_URL` · `SUPABASE_SERVICE_ROLE_KEY` · `GAS_WEBHOOK_URL` · `WEBHOOK_SECRET`
(GAS Script Properties의 `WEBHOOK_SECRET`과 동일해야 함)

## 참고 문서 맵

| 문서 | 용도 | 상태 |
|------|------|------|
| `README.md` | 디렉토리 구조, 파일 역할, 링크 | 랜딩 위주 (접수 미반영) |
| `docs/SUBMIT-SETUP.md` | **접수 시스템 설정 정본** — Supabase·GAS·Storage 전체 | ✅ 현행 |
| `docs/CONTENT.md` | 모든 텍스트 콘텐츠 원본 (강사·일정·주소) | ✅ 현행 |
| `docs/DESIGN-TOKENS.md` | 색상·폰트·간격·radius 전체 토큰 | ✅ 현행 |
| `docs/CHANGELOG.md` | 변경 이력 (최신이 맨 위) | ✅ 현행 |
| `docs/ASSETS.md` | 필요 이미지/아이콘 사양·목록 | ✅ |
| `docs/POSTER-FIGMA-BRIEF.md` | A2 게시판 포스터 Figma 제작 가이드 | 진행 중 |
| `docs/TASKS.md` | 초기 구축 단계별 체크리스트 | 대부분 완료(이력) |
| `docs/SHEETS-SETUP.md` | Apps Script 배포 절차 | ⚠️ 일부 낡음 — `register.js`의 `SCRIPT_URL` 언급은 무효(현재 코드에 없음). 배포 절차 부분만 유효 |
| `docs/HYBRID-SETUP.md` | (구) relay-sync 방식 | ❌ 폐기 — `SUBMIT-SETUP.md` 참조 |
| `docs/REVISION-3.md` | 클라이언트 수정 요청 이력 | 이력 |

> **문서 정본은 `docs/`만 유지.** 루트 동명 `.md`는 `docs/`로 안내하는 stub이다.

## 현재 상태 · 남은 작업

- 랜딩페이지(콘텐츠·IA·자산·아이콘·SEO·a11y·인쇄) — ✅ 완료
- 접수 시스템 7종 (DB + Storage + Sheets 동기화) — ✅ 라이브 운영 중
- A2 게시판 포스터(Figma) — ⬜ 진행 중 (`docs/POSTER-FIGMA-BRIEF.md` P2~P5)
- `assets/ai-network.svg` — 빈 파일, 미사용
- `pages.yml` register/ 누락 — 위 배포 항목 참조 (사용자 확인 필요)
