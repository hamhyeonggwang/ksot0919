-- 2026 OT Beyond Borders — VIP 참석 확인(RSVP) 테이블
-- vip.html 참석 확인 폼을 통합 submit Edge Function으로 수집 (Supabase 전용, Sheets 미동기화).
-- Supabase Dashboard > SQL Editor 에서 실행.

create table if not exists submissions_vip (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text,
  affiliation text not null,
  phone text not null,
  email text,
  attend_main text,
  attend_lunch text,
  note text,
  agree_privacy text,
  status text not null default 'pending',
  synced_at timestamptz,
  sync_error text,
  created_at timestamptz not null default now()
);

-- RLS: anon 직접 접근 차단, service_role(Edge Function)만 접근
alter table submissions_vip enable row level security;
