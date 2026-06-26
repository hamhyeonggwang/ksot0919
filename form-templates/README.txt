접수 양식 파일 — Supabase Storage 업로드용
==========================================

아래 파일명으로 이 폴더에 넣은 뒤 Dashboard에서 form-templates 버킷에 업로드하세요.

  poster/abstract_template.hwp      ← 논문초록 양식
  oral/recommendation_template.hwp ← 지도교수 추천서 양식
  capstone/submission_guide.pdf    ← 캡스톤 제출 안내 (PDF)

Supabase 경로(버킷 안):
  poster/abstract_template.hwp
  oral/recommendation_template.hwp
  capstone/submission_guide.pdf

forms-config.js 의 path 와 동일해야 다운로드 버튼이 동작합니다.

업로드 후 URL 확인 예:
  https://nwgyzgfeulfgidgrgqbi.supabase.co/storage/v1/object/public/form-templates/poster/abstract_template.hwp
