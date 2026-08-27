import { STATES_AND_RTOS } from '../data/statesAndRtos.js';
import { renderGuidanceModal } from './GuidanceModal.js';
import { speechAssistant } from '../utils/speechAssistant.js';

export function renderStepIdentity(formData, onUpdateField) {
  const container = document.createElement('div');
  container.className = 'space-y-6 animate-fade-in';

  // Find state object
  const currentStateObj = STATES_AND_RTOS.find(s => s.code === formData.state);
  const availableRtos = currentStateObj ? currentStateObj.rtos : [];

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
          <span>🔊</span> Listen Guide
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
          <select id="state-select" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors">
            <option value="">-- Select Indian State --</option>
            ${STATES_AND_RTOS.map(s => `<option value="${s.code}" ${formData.state === s.code ? 'selected' : ''}>${s.name} (${s.code})</option>`).join('')}
          </select>
        </div>

        <!-- RTO Selection -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold text-slate-300">
              RTO Office <span class="text-emerald-400">*</span>
            </label>
            <button type="button" id="help-rto-btn" class="text-xs text-emerald-400 hover:underline">Where is RTO?</button>
          </div>
          <select id="rto-select" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" ${!formData.state ? 'disabled' : ''}>
            <option value="">${formData.state ? '-- Select RTO Location --' : '-- Choose State First --'}</option>
            ${availableRtos.map(r => `<option value="${r.code}" ${formData.rto === r.code ? 'selected' : ''}>${r.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Full Name Input -->
      <div class="space-y-1.5">
        <label class="block text-xs font-semibold text-slate-300">
          Full Applicant Name <span class="text-emerald-400">*</span>
        </label>
        <input type="text" id="fullname-input" value="${formData.fullName || ''}" placeholder="e.g. AJAY KUMAR MEENA" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 uppercase transition-colors" />
        <p class="text-[11px] text-slate-400">Must match your official identity proof (Aadhaar / Passport / School Certificate).</p>
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
          <input type="date" id="dob-input" value="${formData.dob || ''}" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
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
            <input type="tel" id="mobile-input" maxlength="10" value="${formData.mobile || ''}" placeholder="9876543210" class="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
          <p class="text-[11px] text-slate-400">Used for OTP verification and appointment SMS updates.</p>
        </div>
      </div>

      <!-- Existing Licence / Application No. -->
      <div class="space-y-1.5 pt-2 border-t border-slate-800">
        <div class="flex items-center justify-between">
          <label class="block text-xs font-semibold text-slate-300">
            Existing Licence / Application No. <span class="text-slate-400 font-normal">(Optional for new LL)</span>
          </label>
          <button type="button" id="help-dl-btn" class="text-xs text-emerald-400 hover:underline font-medium flex items-center gap-1">
            <span>🔎</span> SMS Search Tip
          </button>
        </div>
        <input type="text" id="dlno-input" value="${formData.dlNo || ''}" placeholder="e.g. RJ-14-2022-0012345" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-emerald-500 transition-colors" />
      </div>
    </div>
  `;

  // Attach Event Handlers
  container.querySelectorAll('input[name="appType"]').forEach(radio => {
    radio.addEventListener('change', (e) => onUpdateField('appType', e.target.value));
  });

  const stateSelect = container.querySelector('#state-select');
  stateSelect.addEventListener('change', (e) => {
    onUpdateField('state', e.target.value);
    onUpdateField('rto', ''); // reset rto on state change
  });

  const rtoSelect = container.querySelector('#rto-select');
  rtoSelect.addEventListener('change', (e) => onUpdateField('rto', e.target.value));

  const nameInput = container.querySelector('#fullname-input');
  nameInput.addEventListener('input', (e) => onUpdateField('fullName', e.target.value.toUpperCase()));

  const dobInput = container.querySelector('#dob-input');
  dobInput.addEventListener('change', (e) => onUpdateField('dob', e.target.value));

  const mobileInput = container.querySelector('#mobile-input');
  mobileInput.addEventListener('input', (e) => onUpdateField('mobile', e.target.value.replace(/\D/g, '')));

  const dlInput = container.querySelector('#dlno-input');
  dlInput.addEventListener('input', (e) => onUpdateField('dlNo', e.target.value.toUpperCase()));

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
