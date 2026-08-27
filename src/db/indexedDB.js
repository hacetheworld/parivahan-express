/**
 * Zero-Loss Offline Engine for Parivahan Express using native IndexedDB API.
 * Guarantees form state and image blob persistence against network drops & page refreshes.
 */

const DB_NAME = 'ParivahanExpressDB';
const DB_VERSION = 1;
const STORE_NAME = 'application_drafts';
const DRAFT_KEY = 'active_dl_application';

let dbInstance = null;

/**
 * Initialize IndexedDB instance
 */
export function initDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB init error:', event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Save draft application to IndexedDB
 */
export async function saveDraft(draftData) {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const payload = {
        data: draftData,
        updatedAt: new Date().toISOString(),
        timestamp: Date.now()
      };

      const request = store.put(payload, DRAFT_KEY);

      request.onsuccess = () => resolve(payload);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('Failed to save draft to IndexedDB:', err);
    throw err;
  }
}

/**
 * Load draft application from IndexedDB
 */
export async function loadDraft() {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(DRAFT_KEY);

      request.onsuccess = () => {
        resolve(request.result ? request.result : null);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('Failed to load draft from IndexedDB:', err);
    return null;
  }
}

/**
 * Clear current active draft
 */
export async function clearDraft() {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(DRAFT_KEY);

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error('Failed to clear draft:', err);
    return false;
  }
}

/**
 * Debounce helper for auto-saving form state
 */
export function createDebouncedAutoSave(delayMs = 200, onStatusUpdate = null) {
  let timeoutId = null;

  return (formData) => {
    if (onStatusUpdate) onStatusUpdate('saving');
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      try {
        const savedResult = await saveDraft(formData);
        if (onStatusUpdate) {
          const timeString = new Date(savedResult.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          onStatusUpdate('saved', timeString);
        }
      } catch (err) {
        if (onStatusUpdate) onStatusUpdate('error', err.message);
      }
    }, delayMs);
  };
}
