import { renderStepIdentity } from './StepIdentity.js';
import { renderStepDocumentStudio } from './StepDocumentStudio.js';
import { renderStepPreFlight } from './StepPreFlight.js';
import { speechAssistant } from '../utils/speechAssistant.js';

export function renderFormPortalView({
  formData,
  currentStep = 1,
  saveStatus = 'saved',
  savedTime = 'Just now',
  touchedFields,
  onUpdateField,
  onFieldBlur,
  onNavigateStep,
  onAttemptNext,
  onBackToLanding,
  onClearDraft
}) {
  const container = document.createElement('div');
  container.className = 'flex-1 flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white';

  container.innerHTML = `
    <!-- Top Portal Header -->
    <header class="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        <!-- Left: Back Button & Title -->
        <div class="flex items-center gap-3">
          <button id="back-to-landing-btn" class="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors text-sm font-semibold flex items-center gap-1">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> <span class="hidden sm:inline">Landing</span>
          </button>
          <div>
            <h1 class="text-base font-extrabold text-white">Parivahan Express</h1>
            <p class="text-[11px] text-slate-400">DL & LL Application Portal</p>
          </div>
        </div>

        <!-- Right: Status Badges -->
        <div class="flex items-center gap-2.5">
          <!-- Voice Assistant Language Switcher -->
          <button type="button" id="toggle-voice-lang" class="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 rounded-xl transition-colors font-medium flex items-center gap-1">
            <i data-lucide="languages" class="w-3.5 h-3.5"></i> <span id="voice-lang-label">EN</span>
          </button>

          <!-- Auto Save Status Badge -->
          <div class="px-3 py-1 rounded-full text-xs font-mono bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1.5">
            <span id="save-indicator-dot" class="w-1.5 h-1.5 rounded-full ${saveStatus === 'saving' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}"></span>
            <span id="save-status-text">${saveStatus === 'saving' ? 'Saving...' : `Draft saved (${savedTime})`}</span>
          </div>
        </div>

      </div>
    </header>

    <!-- Main Container -->
    <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
      
      <!-- Visual 3-Step Progress Tracker -->
      <div class="civic-card p-4 border-slate-800">
        <div class="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
          
          <button id="step-tab-1" class="p-2.5 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${currentStep === 1 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : currentStep > 1 ? 'bg-slate-900 text-emerald-400 border border-emerald-500/30' : 'text-slate-500 bg-slate-900/40'}">
            <span class="w-6 h-6 rounded-full bg-slate-950/40 flex items-center justify-center font-bold text-xs">1</span>
            <span>Personal Details</span>
          </button>

          <button id="step-tab-2" class="p-2.5 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${currentStep === 2 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : currentStep > 2 ? 'bg-slate-900 text-emerald-400 border border-emerald-500/30' : 'text-slate-500 bg-slate-900/40'}">
            <span class="w-6 h-6 rounded-full bg-slate-950/40 flex items-center justify-center font-bold text-xs">2</span>
            <span>Document Studio</span>
          </button>

          <button id="step-tab-3" class="p-2.5 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${currentStep === 3 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500 bg-slate-900/40'}">
            <span class="w-6 h-6 rounded-full bg-slate-950/40 flex items-center justify-center font-bold text-xs">3</span>
            <span>Pre-Flight Verification</span>
          </button>

        </div>
      </div>

      <!-- Step Content Area -->
      <div id="step-content-mount"></div>

      <!-- Bottom Step Navigation Footer -->
      <div class="pt-4 border-t border-slate-900 space-y-3">
        <div class="flex items-center justify-between gap-3">
          <button id="prev-step-btn" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm rounded-xl border border-slate-800 transition-colors flex items-center gap-1.5 ${currentStep === 1 ? 'invisible' : ''}">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Previous
          </button>

          <button id="next-step-btn" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 ${currentStep === 3 ? 'hidden' : ''}">
            Next Step <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="flex justify-center sm:justify-end">
          <button id="clear-draft-btn" class="px-2 py-1.5 text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1.5">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Clear Saved Draft
          </button>
        </div>
      </div>

    </main>
  `;

  // Mount active step component
  const mount = container.querySelector('#step-content-mount');
  if (currentStep === 1) {
    mount.appendChild(renderStepIdentity(formData, onUpdateField, { touchedFields, onFieldBlur }));
  } else if (currentStep === 2) {
    mount.appendChild(renderStepDocumentStudio(formData, onUpdateField));
  } else if (currentStep === 3) {
    mount.appendChild(renderStepPreFlight(formData, onNavigateStep));
  }

  // Navigation handlers
  container.querySelector('#back-to-landing-btn').addEventListener('click', onBackToLanding);
  container.querySelector('#step-tab-1').addEventListener('click', () => onNavigateStep(1));
  container.querySelector('#step-tab-2').addEventListener('click', () => onNavigateStep(2));
  container.querySelector('#step-tab-3').addEventListener('click', () => onNavigateStep(3));

  container.querySelector('#prev-step-btn').addEventListener('click', () => {
    if (currentStep > 1) onNavigateStep(currentStep - 1);
  });

  container.querySelector('#next-step-btn').addEventListener('click', () => {
    if (currentStep < 3) onAttemptNext();
  });

  container.querySelector('#clear-draft-btn').addEventListener('click', () => {
    if (confirm('Clear all saved draft fields and image uploads from your device?')) {
      onClearDraft();
    }
  });

  // Voice Assistant Toggle Handler
  let langToggle = speechAssistant.currentLanguage === 'en-IN' ? 'EN' : 'HI';
  const langLabel = container.querySelector('#voice-lang-label');
  langLabel.textContent = langToggle;

  container.querySelector('#toggle-voice-lang').addEventListener('click', () => {
    if (speechAssistant.currentLanguage === 'en-IN') {
      speechAssistant.setLanguage('hi-IN');
      langLabel.textContent = 'HI (हिंदी)';
    } else {
      speechAssistant.setLanguage('en-IN');
      langLabel.textContent = 'EN';
    }
  });

  return container;
}
