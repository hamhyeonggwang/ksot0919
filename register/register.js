/* ===== 신청 폼 공통 JS =====
 * 단일 제출: Supabase Edge Function `submit` (DB + Storage + Sheets)
 * 설정: docs/SUBMIT-SETUP.md
 */

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXT = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'hwp'];

/** form_type → 필수 파일 input name */
const REQUIRED_FILES = {
  '포스터 및 구두발표 접수': ['abstract_file'],
  '우수 학위논문 접수': [
    'recommendation_file',
    'grad_cert_file',
    'similarity_file',
    'thesis_file',
  ],
  '캡스톤 디자인 접수': ['capstone_file'],
};

function isSubmitReady() {
  return typeof getSubmitUrl === 'function' && getSubmitUrl().length > 0
    && typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 0;
}

function validateFiles(form, formType) {
  const required = REQUIRED_FILES[formType] || [];
  for (const name of required) {
    const input = form.querySelector(`input[name="${name}"]`);
    const file = input?.files?.[0];
    if (!file) {
      throw new Error('필수 파일을 모두 첨부해 주세요.');
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      throw new Error(`허용되지 않는 파일 형식입니다: ${file.name}`);
    }
    if (file.size > MAX_FILE_BYTES) {
      throw new Error(`파일 크기는 10MB 이하여야 합니다: ${file.name}`);
    }
  }

  for (const input of form.querySelectorAll('input[type="file"]')) {
    const file = input.files?.[0];
    if (!file) continue;
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      throw new Error(`허용되지 않는 파일 형식입니다: ${file.name}`);
    }
    if (file.size > MAX_FILE_BYTES) {
      throw new Error(`파일 크기는 10MB 이하여야 합니다: ${file.name}`);
    }
  }
}

/* ===== 접수 게이팅 (register/index.html 허브와 동일 기준시각) =====
 * 허브 링크를 거치지 않고 개별 폼 URL로 직접 들어와도 동일하게 적용되도록
 * register.js(공통 스크립트)에 둔다.
 *
 * 분류별 기준시각이 다르므로, 각 폼 페이지가 register.js를 불러오기 전에
 * window.REG_GATE로 설정해야 한다:
 *   교육 신청(ceu·workshop) — 오픈 게이트, 8/17 00:00부터 제출 가능
 *     { mode: 'open-at',  ts: '2026-08-17T00:00:00+09:00', label: '2026년 8월 17일(월) 00:00' }
 *   발표 신청(oral·poster·capstone) — 마감 게이트, 7/31 23:59:59까지만 제출 가능
 *     { mode: 'close-at', ts: '2026-07-31T23:59:59+09:00', label: '2026년 7월 31일(금) 23:59' }
 *   정원 마감 등 날짜와 무관한 상시 마감 — label을 완결된 문장으로 작성
 *     { mode: 'closed', label: '정원이 마감되어 접수가 종료되었습니다.' }
 * 미설정 시 교육 신청 기준(open-at, 8/17)을 기본값으로 사용한다. */
const REG_GATE = window.REG_GATE || {
  mode: 'open-at',
  ts: '2026-08-17T00:00:00+09:00',
  label: '2026년 8월 17일(월) 00:00',
};
const REG_GATE_TS = REG_GATE.ts ? new Date(REG_GATE.ts).getTime() : NaN;

function isRegistrationOpen() {
  if (REG_GATE.mode === 'closed') return false;
  return REG_GATE.mode === 'close-at' ? Date.now() < REG_GATE_TS : Date.now() >= REG_GATE_TS;
}

function pad2(n) { return (n < 10 ? '0' : '') + n; }

function kstDayNum(ts) { return Math.floor((ts + 9 * 3600000) / 86400000); }

function formatCountdown(diffMs) {
  if (diffMs < 0) diffMs = 0;
  const s = Math.floor(diffMs / 1000);
  const days = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return (days > 0 ? days + '일 ' : '') + pad2(h) + ':' + pad2(m) + ':' + pad2(sec);
}

function makeGateBanner(badgeText, text, showTimer, closed) {
  const banner = document.createElement('div');
  banner.className = 'reg-form-lock-banner' + (closed ? ' is-closed' : '');
  banner.setAttribute('role', 'status');
  banner.setAttribute('aria-live', 'polite');
  banner.innerHTML =
    `<span class="rlb-badge">${badgeText}</span>` +
    `<span class="rlb-text">${text}</span>` +
    (showTimer ? '<span class="rlb-timer"></span>' : '');
  return banner;
}

function lockForm(form, btn, label) {
  form.classList.add('is-locked');
  btn.disabled = true;
  btn.textContent = label;
}

function unlockForm(form, btn) {
  form.classList.remove('is-locked');
  btn.disabled = false;
  btn.textContent = defaultBtnLabel(btn);
}

function applyOpenGate(form, btn) {
  if (isRegistrationOpen()) return;

  const banner = makeGateBanner('접수 시작 예정',
    `이 신청서는 <strong>${REG_GATE.label}</strong>부터 제출하실 수 있습니다.`, true, false);
  form.parentNode.insertBefore(banner, form);
  lockForm(form, btn, '접수 시작 예정');

  const timerEl = banner.querySelector('.rlb-timer');
  const timer = setInterval(tick, 1000);
  tick();

  function tick() {
    if (isRegistrationOpen()) {
      clearInterval(timer);
      banner.remove();
      unlockForm(form, btn);
      return;
    }
    const dday = kstDayNum(REG_GATE_TS) - kstDayNum(Date.now());
    timerEl.textContent = 'D-' + dday + ' · ' + formatCountdown(REG_GATE_TS - Date.now()) + ' 남음';
  }
}

function applyCloseGate(form, btn) {
  if (!isRegistrationOpen()) {
    const banner = makeGateBanner('접수 마감',
      `이 신청서는 <strong>${REG_GATE.label}</strong>에 접수가 마감되었습니다.`, false, true);
    form.parentNode.insertBefore(banner, form);
    lockForm(form, btn, '접수 마감');
    return;
  }

  // 아직 접수 기간 — 마감 안내 배너(폼은 잠그지 않음)
  const banner = makeGateBanner('접수 마감 임박',
    `이 신청서는 <strong>${REG_GATE.label}</strong>에 접수가 마감됩니다.`, true, false);
  form.parentNode.insertBefore(banner, form);

  const timerEl = banner.querySelector('.rlb-timer');
  const timer = setInterval(tick, 1000);
  tick();

  function tick() {
    if (!isRegistrationOpen()) {
      clearInterval(timer);
      banner.remove();
      const closedBanner = makeGateBanner('접수 마감',
        `이 신청서는 <strong>${REG_GATE.label}</strong>에 접수가 마감되었습니다.`, false, true);
      form.parentNode.insertBefore(closedBanner, form);
      lockForm(form, btn, '접수 마감');
      return;
    }
    const dday = kstDayNum(REG_GATE_TS) - kstDayNum(Date.now());
    timerEl.textContent = (dday >= 0 ? 'D-' + dday + ' · ' : '') + formatCountdown(REG_GATE_TS - Date.now()) + ' 남음';
  }
}

function applyClosedGate(form, btn) {
  const banner = makeGateBanner('접수 마감', REG_GATE.label, false, true);
  form.parentNode.insertBefore(banner, form);
  lockForm(form, btn, '접수 마감');
}

function applyRegistrationGate(form, btn) {
  if (REG_GATE.mode === 'closed') {
    applyClosedGate(form, btn);
  } else if (REG_GATE.mode === 'close-at') {
    applyCloseGate(form, btn);
  } else {
    applyOpenGate(form, btn);
  }
}

async function submitForm(form) {
  if (!isRegistrationOpen()) {
    const msg = REG_GATE.mode === 'closed'
      ? REG_GATE.label
      : REG_GATE.mode === 'close-at'
        ? `접수가 마감되었습니다. (마감: ${REG_GATE.label})`
        : `접수는 ${REG_GATE.label}부터 시작됩니다.`;
    throw new Error(msg);
  }
  if (!isSubmitReady()) {
    throw new Error('현재 신청 시스템을 준비 중입니다.\n잠시 후 다시 시도해 주세요.');
  }

  const formType = new FormData(form).get('form_type');
  validateFiles(form, formType);

  const body = new FormData(form);

  const res = await fetch(getSubmitUrl(), {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON_KEY },
    body,
  });

  let result;
  try {
    result = await res.json();
  } catch {
    throw new Error('서버 응답을 처리할 수 없습니다.');
  }

  if (!res.ok || !result.ok) {
    throw new Error(result.message || '제출에 실패했습니다.');
  }
}

function renderFormDownloads() {
  const container = document.getElementById('form-downloads');
  if (!container || typeof FORM_DOWNLOADS === 'undefined') return;

  const key = container.dataset.form;
  const items = FORM_DOWNLOADS[key] || [];
  if (!items.length) {
    container.innerHTML = '<p class="hint">양식 파일 준비 중입니다.</p>';
    return;
  }

  container.innerHTML = items.map((item) => {
    const url = getTemplatePublicUrl(item.path);
    if (!url) {
      return `<p class="hint">${item.label} — URL 설정 필요</p>`;
    }
    return `<a class="download-btn" href="${url}" download target="_blank" rel="noopener noreferrer">${item.label} 다운로드</a>`;
  }).join('');
}

function showSuccess(form) {
  form.style.display = 'none';
  const roleSelect = document.getElementById('role-select');
  if (roleSelect) roleSelect.style.display = 'none';
  document.getElementById('success-msg').classList.add('visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function defaultBtnLabel(btn) {
  return btn.dataset.defaultLabel || '신청하기';
}

document.addEventListener('DOMContentLoaded', () => {
  renderFormDownloads();

  const form = document.getElementById('reg-form');
  const btn = document.getElementById('submit-btn');
  if (!form || !btn) return;

  btn.dataset.defaultLabel = btn.textContent.trim();
  applyRegistrationGate(form, btn);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    for (const group of form.querySelectorAll('[data-min-check]')) {
      if (group.closest('fieldset')?.disabled) continue;
      if (group.querySelectorAll('input[type="checkbox"]:checked').length === 0) {
        alert(group.dataset.minCheckMsg || '항목을 1개 이상 선택해 주세요.');
        group.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    btn.disabled = true;
    btn.textContent = '제출 중...';

    try {
      await submitForm(form);
      showSuccess(form);
    } catch (err) {
      alert(err.message || '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      btn.disabled = false;
      btn.textContent = defaultBtnLabel(btn);
    }
  });
});
