-- RLS: 클라이언트(anon)는 DB 직접 접근 불가. Edge Function(service_role)만 쓰기.

alter table submissions_ceu_clinician enable row level security;
alter table submissions_ceu_student enable row level security;
alter table submissions_workshop enable row level security;
alter table submissions_poster enable row level security;
alter table submissions_oral enable row level security;
alter table submissions_capstone enable row level security;

-- 정책 없음 = anon/authenticated 모두 차단 (service_role은 RLS 우회)
