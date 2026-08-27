import { STATES_AND_RTOS } from '../data/statesAndRtos.js';
import { renderGuidanceModal } from './GuidanceModal.js';
import { speechAssistant } from '../utils/speechAssistant.js';
import { getFieldErrors } from '../utils/errorDictionary.js';
import { createSearchableSelect } from './SearchableSelect.js';

export function renderStepIdentity(formData, onUpdateField, { touchedFields, onFieldBlur } = {}) {
  const container = document.createElement('div');
  container.className = 'space-y-6 animate-fade-in';

  const touched = touchedFields || new Set();
  const fieldError = (name) => (touched.has(name) ? getFieldErrors(formData, name)[0] : null);
  const errorHtml = (err) => (err ? `<p class="text-[11px] text-red-400 mt-1 flex items-center gap-1">⚠ ${err.message}</p>` : '');

  const stateErr = fieldError('state');
  const rtoErr = fieldError('rto');
  const nameErr = fieldError('fullName');
  const dobErr = fieldError('dob');
  const mobileErr = fieldError('mobile');
  const dlErr = fieldError('dlNo');

  // Find state object
  const currentStateObj = STATES_AND_RTOS.find(s => s.code === formData.state);
  const availableRtos = currentStateObj ? currentStateObj.rtos : [];

  // Split the persisted YYYY-MM-DD value into parts for the DD/MM/YYYY dropdowns.
  // A native <input type="date"> lets the year field misbehave on direct keystrokes
  // (e.g. typing "2" renders "0002"), so birth date uses explicit day/month/year
  // selects instead — no typing, no locale-dependent formatting quirks.
  let [dobYear, dobMonth, dobDay] = formData.dob ? formData.dob.split('-') : ['', '', ''];
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const daysInSelectedMonth = (dobYear && dobMonth) ? new Date(Number(dobYear), Number(dobMonth), 0).getDate() : 31;

  // Age calculation helper
  let ageText = '';
  let ageBadgeClass = 'hidden';
  if (formData.dob) {
    const birthDate = new Date(formData.dob);
    if (!isNaN(birthDate.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age >= 18) {
        ageText = `Age: ${age} yrs — Eligible for DL & LL`;
        ageBadgeClass = 'inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      } else if (age >= 16) {
        ageText = `Age: ${age} yrs — Eligible for 50cc LL Only`;
        ageBadgeClass = 'inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30';
      } else {
        ageText = `Age: ${age} yrs — Underage (Min age 16 for LL, 18 for DL)`;
        ageBadgeClass = 'inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/30';
      }
    }
  }

  container.innerHTML = `
    <!-- Header Section -->
    <div class="civic-card p-5 space-y-2 border-emerald-500/20">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <span class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">1</span>
          Identity & State Information
        </h2>
        <button type="button" id="voice-identity-btn" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors">
          <i data-lucide="volume-2" class="w-3.5 h-3.5"></i> Listen Guide
        </button>
      </div>
      <p class="text-xs text-slate-400">
        Enter your residential state and identity details. All entries are auto-saved locally on your phone.
      </p>
    </div>

    <!-- Application Type Radio Cards -->
    <div class="space-y-2">
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400">Application Category</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label class="civic-card p-4 flex items-center gap-3 cursor-pointer hover:border-emerald-500/50 transition-all ${formData.appType === 'LL' ? 'border-emerald-500 bg-emerald-500/10' : ''}">
          <input type="radio" name="appType" value="LL" ${formData.appType === 'LL' ? 'checked' : ''} class="w-5 h-5 accent-emerald-500" />
          <div>
            <div class="text-sm font-bold text-white">Learner's Licence (LL)</div>
            <div class="text-xs text-slate-400">First-time applicant / Knowledge test</div>
          </div>
        </label>

        <label class="civic-card p-4 flex items-center gap-3 cursor-pointer hover:border-emerald-500/50 transition-all ${formData.appType === 'DL' ? 'border-emerald-500 bg-emerald-500/10' : ''}">
          <input type="radio" name="appType" value="DL" ${formData.appType === 'DL' ? 'checked' : ''} class="w-5 h-5 accent-emerald-500" />
          <div>
            <div class="text-sm font-bold text-white">Permanent Driving Licence (DL)</div>
            <div class="text-xs text-slate-400">Existing LL holder / Renewal / Retest</div>
          </div>
        </label>
      </div>
    </div>

    <!-- Form Inputs Grid -->
    <div class="civic-card p-6 space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <!-- State Selection -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-slate-300">
            Permanent State / UT <span class="text-emerald-400">*</span>
          </label>
          <div id="state-select-mount"></div>
          ${errorHtml(stateErr)}
        </div>

        <!-- RTO Selection -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold text-slate-300">
              RTO Office <span class="text-emerald-400">*</span>
            </label>
            <button type="button" id="help-rto-btn" class="text-xs text-emerald-400 hover:underline">Where is RTO?</button>
          </div>
          <div id="rto-select-mount"></div>
          ${errorHtml(rtoErr)}
        </div>
      </div>

      <!-- Full Name Input -->
      <div class="space-y-1.5">
        <label class="block text-xs font-semibold text-slate-300">
          Full Applicant Name <span class="text-emerald-400">*</span>
        </label>
        <input type="text" id="fullname-input" value="${formData.fullName || ''}" placeholder="e.g. AJAY KUMAR MEENA" class="w-full bg-slate-900 border ${nameErr ? 'border-red-500' : 'border-slate-700'} rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 uppercase transition-colors" />
        ${nameErr ? errorHtml(nameErr) : '<p class="text-[11px] text-slate-400">Must match your official identity proof (Aadhaar / Passport / School Certificate).</p>'}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <!-- Date of Birth -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold text-slate-300">
              Date of Birth <span class="text-emerald-400">*</span>
            </label>
            <button type="button" id="help-dob-btn" class="text-xs text-emerald-400 hover:underline">Age rules</button>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div id="dob-day-mount"></div>
            <div id="dob-month-mount"></div>
            <div id="dob-year-mount"></div>
          </div>
          ${errorHtml(dobErr)}
          <div id="age-badge-container" class="pt-1">
            <span class="${ageBadgeClass}">${ageText}</span>
          </div>
        </div>

        <!-- Mobile Number -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-slate-300">
            10-Digit Mobile Number <span class="text-emerald-400">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-3.5 top-3 text-xs text-slate-400 font-mono">+91</span>
            <input type="tel" id="mobile-input" maxlength="10" value="${formData.mobile || ''}" placeholder="9876543210" class="w-full bg-slate-900 border ${mobileErr ? 'border-red-500' : 'border-slate-700'} rounded-xl pl-12 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
          ${mobileErr ? errorHtml(mobileErr) : '<p class="text-[11px] text-slate-400">Used for OTP verification and appointment SMS updates.</p>'}
        </div>
      </div>

      <!-- Existing Licence / Application No. -->
      <div class="space-y-1.5 pt-2 border-t border-slate-800">
        <div class="flex items-center justify-between">
          <label class="block text-xs font-semibold text-slate-300">
            Existing Licence / Application No. <span class="text-slate-400 font-normal">(Optional for new LL)</span>
          </label>
          <button type="button" id="help-dl-btn" class="text-xs text-emerald-400 hover:underline font-medium flex items-center gap-1">
            <i data-lucide="search" class="w-3.5 h-3.5"></i> SMS Search Tip
          </button>
        </div>
        <input type="text" id="dlno-input" value="${formData.dlNo || ''}" placeholder="e.g. RJ-14-2022-0012345" class="w-full bg-slate-900 border ${dlErr ? 'border-red-500' : 'border-slate-700'} rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-emerald-500 transition-colors" />
        ${errorHtml(dlErr)}
      </div>
    </div>
  `;

  // Attach Event Handlers
  container.querySelectorAll('input[name="appType"]').forEach(radio => {
    radio.addEventListener('change', (e) => onUpdateField('appType', e.target.value));
  });

  const notifyBlur = (field) => { if (onFieldBlur) onFieldBlur(field); };

  container.querySelector('#state-select-mount').appendChild(createSearchableSelect({
    options: STATES_AND_RTOS.map(s => ({ value: s.code, label: `${s.name} (${s.code})` })),
    value: formData.state,
    placeholder: '-- Select Indian State --',
    searchPlaceholder: 'Search state...',
    hasError: !!stateErr,
    onChange: (val) => {
      notifyBlur('state');
      onUpdateField('state', val);
      onUpdateField('rto', ''); // reset rto on state change
    }
  }));

  container.querySelector('#rto-select-mount').appendChild(createSearchableSelect({
    options: availableRtos.map(r => ({ value: r.code, label: r.name })),
    value: formData.rto,
    placeholder: formData.state ? '-- Select RTO Location --' : '-- Choose State First --',
    searchPlaceholder: 'Search RTO...',
    disabled: !formData.state,
    hasError: !!rtoErr,
    onChange: (val) => {
      notifyBlur('rto');
      onUpdateField('rto', val);
    }
  }));

  // Text inputs use silent updates while typing so the DOM isn't rebuilt on
  // every keystroke (that rebuild was stealing input focus). Blur only marks
  // the field touched (no render — see onFieldBlur's comment in main.js);
  // the error becomes visible on whatever render happens next.
  const nameInput = container.querySelector('#fullname-input');
  nameInput.addEventListener('input', (e) => onUpdateField('fullName', e.target.value.toUpperCase(), { silent: true }));
  nameInput.addEventListener('blur', () => notifyBlur('fullName'));

  // Day/Month/Year all use the same compact custom dropdown — a native
  // <select> on mobile takes over the full screen with an endless scroll
  // list, which is exactly what this replaces.
  let selectedDobDay = dobDay, selectedDobMonth = dobMonth, selectedDobYear = dobYear;
  const commitDob = () => {
    notifyBlur('dob');
    // Only commit (and trigger the re-render that rebuilds these fields) once
    // all three pieces are chosen — committing on a partial pick would clear
    // formData.dob and, on re-render, wipe the other two the user hasn't
    // touched yet.
    if (selectedDobDay && selectedDobMonth && selectedDobYear) {
      onUpdateField('dob', `${selectedDobYear}-${selectedDobMonth}-${selectedDobDay}`);
    }
  };

  container.querySelector('#dob-day-mount').appendChild(createSearchableSelect({
    options: Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1).map(d => ({ value: String(d).padStart(2, '0'), label: String(d) })),
    value: dobDay,
    placeholder: 'DD',
    showSearch: false,
    hasError: !!dobErr,
    onChange: (val) => { selectedDobDay = val; commitDob(); }
  }));

  container.querySelector('#dob-month-mount').appendChild(createSearchableSelect({
    options: MONTH_NAMES.map((m, idx) => ({ value: String(idx + 1).padStart(2, '0'), label: m })),
    value: dobMonth,
    placeholder: 'MM',
    showSearch: false,
    hasError: !!dobErr,
    onChange: (val) => { selectedDobMonth = val; commitDob(); }
  }));

  container.querySelector('#dob-year-mount').appendChild(createSearchableSelect({
    options: Array.from({ length: 100 }, (_, i) => currentYear - i).map(y => ({ value: String(y), label: String(y) })),
    value: dobYear,
    placeholder: 'YYYY',
    searchPlaceholder: 'Search year...',
    hasError: !!dobErr,
    onChange: (val) => { selectedDobYear = val; commitDob(); }
  }));

  const mobileInput = container.querySelector('#mobile-input');
  mobileInput.addEventListener('input', (e) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    if (e.target.value !== cleaned) e.target.value = cleaned;
    onUpdateField('mobile', cleaned, { silent: true });
  });
  mobileInput.addEventListener('blur', () => notifyBlur('mobile'));

  const dlInput = container.querySelector('#dlno-input');
  dlInput.addEventListener('input', (e) => onUpdateField('dlNo', e.target.value.toUpperCase(), { silent: true }));
  dlInput.addEventListener('blur', () => notifyBlur('dlNo'));

  // Guidance Buttons
  container.querySelector('#help-rto-btn').addEventListener('click', () => renderGuidanceModal('rto'));
  container.querySelector('#help-dob-btn').addEventListener('click', () => renderGuidanceModal('dob'));
  container.querySelector('#help-dl-btn').addEventListener('click', () => renderGuidanceModal('dlNo'));

  // Voice Assistant Audio Button
  container.querySelector('#voice-identity-btn').addEventListener('click', () => {
    speechAssistant.speak('Step 1: Enter your permanent state, RTO office location, full applicant name matching Aadhaar, date of birth, and 10-digit mobile number.');
  });

  return container;
}
