/* ===== Supabase 연결 설정 =====
 *   - Project URL  → SUPABASE_URL ( /rest/v1/ 붙이지 않음 )
 *   - Publishable key 또는 anon key → SUPABASE_ANON_KEY
 */
const SUPABASE_URL = 'https://nwgyzgfeulfgidgrgqbi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_haRoe9EEHeNxmRCK2hje2g_MCvUhu1I';

function getSubmitUrl() {
  if (!SUPABASE_URL) return '';
  return `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/submit`;
}
