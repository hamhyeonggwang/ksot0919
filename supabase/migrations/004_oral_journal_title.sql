-- 2026 OT Beyond Borders — 우수 학위논문: '게재된 논문명' 컬럼 추가
-- oral.html 게재(예정) 선택 시 입력되는 journal_title 필드 대응.
-- 라이브 submissions_oral 테이블에 컬럼이 없으면 submit Edge Function insert가 실패하므로 필요.
-- Supabase Dashboard > SQL Editor 에서 실행.

alter table submissions_oral
  add column if not exists journal_title text;
