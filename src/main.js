import './styles/main.css';
import { loadDraft, clearDraft, createDebouncedAutoSave } from './db/indexedDB.js';
import { validateFormState } from './utils/errorDictionary.js';
import { renderLandingView } from './components/LandingView.js';
import { renderFormPortalView } from './components/FormPortalView.js';

// Error codes that gate leaving Step 1 (excludes photo/signature, handled on Step 2)
const STEP1_ERROR_CODES = [
  'ERR_STATE_REQUIRED', 'ERR_RTO_REQUIRED', 'ERR_NAME_INVALID',
  'ERR_DOB_FORMAT', 'ERR_AGE_UNDERAGE_LL', 'ERR_AGE_UNDERAGE_DL',
  'ERR_MOBILE_INVALID', 'ERR_DL_FORMAT'
];
const STEP1_FIELDS = ['state', 'rto', 'fullName', 'dob', 'mobile', 'dlNo'];

// Central Application State
const state = {
  view: 'landing', // 'landing' | 'portal'
  currentStep: 1,
  saveStatus: 'saved',
  savedTime: 'Just now',
  touchedFields: new Set(),
  formData: {
    appType: 'LL',
    state: '',
    rto: '',
    fullName: '',
    dob: '',
    mobile: '',
    dlNo: '',
    photoDataUrl: '',
    photoSizeKb: null,
    signatureDataUrl: '',
    signatureSizeKb: null
  }
};

/**
 * Patch just the save-status badge in place, instead of a full renderApp().
 * A full re-render here would tear down and rebuild the whole DOM ~200ms after
 * every keystroke, stealing focus out of whatever input the user is typing in.
 */
function patchSaveStatusBadge() {
  const dot = document.getElementById('save-indicator-dot');
  const text = document.getElementById('save-status-text');
  if (!dot || !text) return; // not mounted (e.g. on landing view)
  dot.className = `w-1.5 h-1.5 rounded-full ${state.saveStatus === 'saving' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`;
  text.textContent = state.saveStatus === 'saving' ? 'Saving...' : `Draft saved (${state.savedTime})`;
}

// Debounced Auto Save Instance (200ms)
const debouncedSave = createDebouncedAutoSave(200, (status, timeStr) => {
  state.saveStatus = status;
  if (timeStr) state.savedTime = timeStr;
  patchSaveStatusBadge();
});

/**
 * Main App Render Loop
 */
function renderApp() {
  const root = document.getElementById('app');
  root.innerHTML = '';

  if (state.view === 'landing') {
    root.appendChild(renderLandingView(() => {
      state.view = 'portal';
      renderApp();
    }));
  } else {
    root.appendChild(renderFormPortalView({
      formData: state.formData,
      currentStep: state.currentStep,
      saveStatus: state.saveStatus,
      savedTime: state.savedTime,
      touchedFields: state.touchedFields,
      onUpdateField: (field, value, options = {}) => {
        state.formData[field] = value;
        debouncedSave(state.formData);
        // Silent updates (continuous typing) skip the full re-render that
        // would otherwise tear down the input and steal focus mid-keystroke.
        if (options.silent) return;
        renderApp();
      },
      // Intentionally does NOT re-render: blur fires mid-click when the user
      // moves from a field straight into another control (e.g. Next Step).
      // A synchronous full re-render here can tear out the element the user
      // is mid-click on, silently swallowing that click. Errors for touched
      // fields still surface on the next render triggered elsewhere.
      onFieldBlur: (field) => {
        state.touchedFields.add(field);
      },
      onNavigateStep: (step) => {
        state.currentStep = step;
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onAttemptNext: () => {
        if (state.currentStep === 1) {
          const errors = validateFormState(state.formData);
          const blocking = errors.filter(e => STEP1_ERROR_CODES.includes(e.code));
          if (blocking.length > 0) {
            STEP1_FIELDS.forEach(f => state.touchedFields.add(f));
            renderApp();
            return;
          }
        }
        if (state.currentStep < 3) {
          state.currentStep += 1;
          renderApp();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      onBackToLanding: () => {
        state.view = 'landing';
        renderApp();
      },
      onClearDraft: async () => {
        await clearDraft();
        state.touchedFields = new Set();
        state.formData = {
          appType: 'LL',
          state: '',
          rto: '',
          fullName: '',
          dob: '',
          mobile: '',
          dlNo: '',
          photoDataUrl: '',
          photoSizeKb: null,
          signatureDataUrl: '',
          signatureSizeKb: null
        };
        state.currentStep = 1;
        state.saveStatus = 'saved';
        state.savedTime = 'Cleared';
        renderApp();
      }
    }));
  }

  // Initialize Lucide icons if available
  if (typeof window.lucide !== 'undefined') {
    window.lucide.createIcons();
  }
}

/**
 * App Initialization Handler
 */
async function init() {
  // Restore saved draft from IndexedDB
  try {
    const savedDraft = await loadDraft();
    if (savedDraft && savedDraft.data) {
      state.formData = { ...state.formData, ...savedDraft.data };
      if (savedDraft.timestamp) {
        state.savedTime = new Date(savedDraft.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
  } catch (err) {
    console.warn('Draft restoration fallback:', err);
  }

  renderApp();
}

// Boot application
document.addEventListener('DOMContentLoaded', init);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  init();
}
