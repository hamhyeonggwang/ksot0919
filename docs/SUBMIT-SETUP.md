# 접수 시스템 설정 가이드

**단일 제출 게이트웨이:** 브라우저 → Edge Function `submit` → Supabase(DB+파일) + Google Sheets

```
신청 폼 1회 POST → submit → DB + Storage + GAS → Sheets
양식 다운로드   → Supabase Storage form-templates (공개)
```

| 리소스 | URL |
|--------|-----|
| 스프레드시트 | https://docs.google.com/spreadsheets/d/1seHYNx8pjqmlHAME6FmPMiRGO-RzO91_8lIZcK8rN2Y/edit |
| Apps Script | https://script.google.com/macros/s/AKfycbwjEZ5vDW1gRVacNuO6sudHctvOGu-uTv6OShsmvYxYKIyMqOjaog3kDoy1yQ8_UwPHRA/exec |

---

## 1. Supabase SQL (순서대로)

SQL Editor에서 실행:

1. `supabase/migrations/001_tables.sql`
2. `supabase/migrations/002_rls.sql` — anon DB 접근 차단
3. `supabase/migrations/003_storage.sql` — 버킷 2개

---

## 2. Storage 버킷

| 버킷 | 용도 | 공개 |
|------|------|------|
| `form-templates` | 접수 양식 다운로드 | ✅ |
| `submissions-2026` | 제출 파일 | ❌ |

### 양식 파일 업로드 (학회)

Dashboard > Storage > `form-templates` 에 업로드 후 `register/forms-config.js` 경로 수정:

```
form-templates/poster/abstract_template.hwp
form-templates/oral/recommendation_template.hwp
form-templates/capstone/submission_guide.pdf
```

---

## 3. Edge Function `submit` 배포

### Secrets (Project Settings > Edge Functions > Secrets)

| 이름 | 값 |
|------|-----|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
| `GAS_WEBHOOK_URL` | Apps Script `/exec` URL |
| `WEBHOOK_SECRET` | GAS Script Properties 와 동일 |

### CLI 배포

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... GAS_WEBHOOK_URL=... WEBHOOK_SECRET=...
supabase functions deploy submit
```

> JWT 검증 **기본 ON** — 브라우저는 `Authorization: Bearer {anon key}` 로 호출

**Database Webhook 불필요** (relay-sync 사용 안 함)

---

## 4. Google Apps Script

1. `register/apps-script.gs` 전체 붙여넣기
2. Script Properties: `WEBHOOK_SECRET`
3. **배포 > 새 버전** (doGet 포함 확인)

---

## 5. 웹페이지 연결

`register/supabase-config.js`:

```js
const SUPABASE_URL = 'https://xxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbG...';
```

---

## 6. 테스트 순서

1. GAS URL 브라우저 → "정상 동작 중입니다"
2. `workshop.html` 텍스트 제출 → Supabase `synced` + Sheets 행
3. `oral.html` 4개 파일 필수 제출 → Sheets URL 4열 확인

---

## 7. 장애 대응

| status | 의미 |
|--------|------|
| `synced` | 정상 (DB + Sheets) |
| `failed` | 제출 실패 — `sync_error` 확인, 신청자 재시도 |

신청자에게는 **성공 또는 오류 메시지**가 즉시 표시됩니다 (침묵 실패 없음).

---

## 8. 필수 파일

| 양식 | 필수 파일 |
|------|-----------|
| 포스터 | 논문초록 1개 |
| 학위논문 | 추천서, 졸업증명서, 유사도검사, 논문 PDF **4개 전부** |
| 캡스톤 | 결과물 1개 |

각 파일 10MB 이하, PDF/HWP/DOC/PPT.
