/* ===== 접수 양식 다운로드 =====
 * ✏️ 편집: Supabase Storage > form-templates 버킷에 파일 업로드 후 path 수정
 * 공개 URL: {SUPABASE_URL}/storage/v1/object/public/form-templates/{path}
 */
const FORM_DOWNLOADS = {
  poster: [
    { label: '논문초록 양식', path: 'poster/abstract_template.hwp' },
  ],
  oral: [
    { label: '지도교수 추천서 양식', path: 'oral/recommendation_template.hwp' },
  ],
  capstone: [
    { label: '캡스톤 제출 안내', path: 'capstone/submission_guide.pdf' },
  ],
};

function getTemplatePublicUrl(path) {
  if (!SUPABASE_URL || !path) return '';
  return `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/form-templates/${path}`;
}
