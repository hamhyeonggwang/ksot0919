/* ===== 신청 폼 공통 JS =====
 * Google Apps Script(스프레드시트 연동) 전송.
 * ✏️ 편집: 아래 SCRIPT_URL을 배포된 Apps Script 웹 앱 URL로 교체
 *   배포 방법: docs/SHEETS-SETUP.md 참조
 */
const SCRIPT_URL = '';  // ✏️ Google Apps Script 배포 URL (예: https://script.google.com/macros/s/.../exec)

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reg-form');
  const btn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('success-msg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 체크박스 그룹 최소 1개 선택 검증 (data-min-check가 붙은 그룹)
    for (const group of form.querySelectorAll('[data-min-check]')) {
      if (group.closest('fieldset')?.disabled) continue;
      const checked = group.querySelectorAll('input[type="checkbox"]:checked').length;
      if (checked === 0) {
        alert(group.dataset.minCheckMsg || '항목을 1개 이상 선택해 주세요.');
        group.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    if (!SCRIPT_URL) {
      alert('현재 신청 시스템을 준비 중입니다.\n잠시 후 다시 시도해 주세요.');
      return;
    }
    btn.disabled = true;
    btn.textContent = '제출 중...';
    try {
      // 동일 name 다중 값(체크박스)은 ", "로 합침
      const data = {};
      for (const [key, value] of new FormData(form).entries()) {
        data[key] = key in data ? data[key] + ', ' + value : value;
      }
      data.submitted_at = new Date().toISOString();
      // Apps Script는 CORS preflight를 처리하지 못하므로
      // no-cors + 단순 요청(text/plain 본문)으로 전송
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data),
      });
      form.style.display = 'none';
      const roleSelect = document.getElementById('role-select');
      if (roleSelect) roleSelect.style.display = 'none';
      successMsg.classList.add('visible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      btn.disabled = false;
      btn.textContent = '신청하기';
    }
  });
});
