-- 2026 OT Beyond Borders — CEU 학생/일반참가자 구분 컬럼
-- ceu.html 신청 구분이 '작업치료사/일반참가자/학생' 3종으로 개편되며
-- '일반참가자'도 submissions_ceu_student 테이블을 공유하게 됨에 따라
-- 어느 구분으로 접수됐는지 구분하기 위한 role 컬럼 추가.
-- Supabase Dashboard > SQL Editor 에서 실행.

alter table submissions_ceu_student add column if not exists role text;
