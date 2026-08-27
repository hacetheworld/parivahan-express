import './styles/main.css';
import { loadDraft, clearDraft, createDebouncedAutoSave } from './db/indexedDB.js';
import { renderLandingView } from './components/LandingView.js';
import { renderFormPortalView } from './components/FormPortalView.js';

// Central Application State
const state = {
  view: 'landing', // 'landing' | 'portal'
  currentStep: 1,
  saveStatus: 'saved',
  savedTime: 'Just now',
  isOnline: navigator.onLine,
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

// Debounced Auto Save Instance (200ms)
const debouncedSave = createDebouncedAutoSave(200, (status, timeStr) => {
  state.saveStatus = status;
  if (timeStr) state.savedTime = timeStr;
  renderApp();
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
      isOnline: state.isOnline,
      onUpdateField: (field, value) => {
        state.formData[field] = value;
        renderApp();
        debouncedSave(state.formData);
      },
      onNavigateStep: (step) => {
        state.currentStep = step;
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onBackToLanding: () => {
        state.view = 'landing';
        renderApp();
      },
      onClearDraft: async () => {
        await clearDraft();
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
  // Listen to network status
  window.addEventListener('online', () => {
    state.isOnline = true;
    renderApp();
  });
  window.addEventListener('offline', () => {
    state.isOnline = false;
    renderApp();
  });

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
