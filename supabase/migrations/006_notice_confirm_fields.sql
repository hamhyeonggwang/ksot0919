-- 2026 OT Beyond Borders — 발표 신청 3종: '유의사항 확인' 체크박스 컬럼 추가
-- poster.html의 originality_confirm(초록 미발표·미게재 확인), dup_selection_notice_confirm(수상자
-- 중복발표 안내 확인) 및 oral.html·capstone.html의 dup_selection_notice_confirm 필드 대응.
-- 라이브 submissions_* 테이블에 컬럼이 없으면 submit Edge Function insert가 실패하므로 필요.
-- Supabase Dashboard > SQL Editor 에서 실행.

alter table submissions_poster
  add column if not exists originality_confirm text,
  add column if not exists dup_selection_notice_confirm text;

alter table submissions_oral
  add column if not exists dup_selection_notice_confirm text;

alter table submissions_capstone
  add column if not exists dup_selection_notice_confirm text;
