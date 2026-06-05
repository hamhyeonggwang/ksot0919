/* ===== 신청 폼 공통 JS =====
 * Google Apps Script 연동 준비 완료 상태.
 * SCRIPT_URL에 배포된 Apps Script Web App URL을 넣으면 즉시 동작.
 * ✏️ 편집: 아래 URL을 실제 Google Apps Script 배포 URL로 교체
 */
const SCRIPT_URL = '';  // ✏️ Google Apps Script 배포 URL

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reg-form');
  const btn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('success-msg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!SCRIPT_URL) {
      alert('현재 신청 시스템을 준비 중입니다.\n잠시 후 다시 시도해 주세요.');
      return;
    }
    btn.disabled = true;
    btn.textContent = '제출 중...';
    try {
      const data = Object.fromEntries(new FormData(form));
      data.submitted_at = new Date().toISOString();
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      form.style.display = 'none';
      successMsg.classList.add('visible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      btn.disabled = false;
      btn.textContent = '신청하기';
    }
  });
});
