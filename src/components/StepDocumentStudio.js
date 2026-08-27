import { openMediaStudioModal } from './MediaStudioModal.js';
import { speechAssistant } from '../utils/speechAssistant.js';

export function renderStepDocumentStudio(formData, onUpdateField) {
  const container = document.createElement('div');
  container.className = 'space-y-6 animate-fade-in';

  const photoOk = formData.photoDataUrl && formData.photoSizeKb && formData.photoSizeKb <= 20;
  const signatureOk = formData.signatureDataUrl && formData.signatureSizeKb && formData.signatureSizeKb <= 10;

  container.innerHTML = `
    <!-- Header Section -->
    <div class="civic-card p-5 space-y-2 border-emerald-500/20">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <span class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">2</span>
          Inline Media Studio (Document Uploads)
        </h2>
        <button type="button" id="voice-doc-btn" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors">
          <span>🔊</span> Listen Guide
        </button>
      </div>
      <p class="text-xs text-slate-400">
        Upload photo & signature. Built-in Canvas Media Studio automatically enforces government aspect ratios and compresses file sizes strictly under 20 KB / 10 KB limits.
      </p>
    </div>

    <!-- Upload Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Card 1: Passport Photo -->
      <div class="civic-card p-5 space-y-4 border-slate-700 relative flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">Applicant Photo</span>
            <span class="px-2 py-0.5 rounded text-[11px] font-mono ${photoOk ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'}">
              ${formData.photoSizeKb ? `${formData.photoSizeKb} KB (Target ≤20 KB)` : 'Target: ≤20 KB'}
            </span>
          </div>

          <!-- Preview Frame -->
          <div class="w-full h-52 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden relative group">
            ${formData.photoDataUrl ? `
              <img src="${formData.photoDataUrl}" class="h-full object-cover rounded-lg shadow-md" alt="Applicant Photo" />
              <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span class="text-xs text-emerald-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-lg border border-emerald-500/40">Recrop Photo</span>
              </div>
            ` : `
              <div class="text-center p-4 space-y-2 text-slate-500">
                <div class="text-3xl">📷</div>
                <div class="text-xs font-medium text-slate-400">Aspect Ratio 3:4 (Passport Style)</div>
                <div class="text-[11px] text-slate-500">Auto Contrast & Compression Engine</div>
              </div>
            `}
          </div>
        </div>

        <div class="pt-2">
          <input type="file" id="photo-file-input" accept="image/jpeg,image/png,image/jpg" class="hidden" />
          <button type="button" id="photo-upload-btn" class="w-full py-2.5 bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2">
            <span>${formData.photoDataUrl ? '✨ Adjust in Media Studio' : '📤 Upload & Crop Photo'}</span>
          </button>
        </div>
      </div>

      <!-- Card 2: Signature Upload -->
      <div class="civic-card p-5 space-y-4 border-slate-700 relative flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">Applicant Signature</span>
            <span class="px-2 py-0.5 rounded text-[11px] font-mono ${signatureOk ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'}">
              ${formData.signatureSizeKb ? `${formData.signatureSizeKb} KB (Target ≤10 KB)` : 'Target: ≤10 KB'}
            </span>
          </div>

          <!-- Preview Frame -->
          <div class="w-full h-52 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden relative group p-4">
            ${formData.signatureDataUrl ? `
              <img src="${formData.signatureDataUrl}" class="max-h-full object-contain rounded shadow-md bg-white p-2" alt="Signature" />
              <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span class="text-xs text-emerald-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-lg border border-emerald-500/40">Recrop Signature</span>
              </div>
            ` : `
              <div class="text-center p-4 space-y-2 text-slate-500">
                <div class="text-3xl">✍️</div>
                <div class="text-xs font-medium text-slate-400">Aspect Ratio 3:1 (White Background)</div>
                <div class="text-[11px] text-slate-500">Auto Background Monochrome Cleaner</div>
              </div>
            `}
          </div>
        </div>

        <div class="pt-2">
          <input type="file" id="signature-file-input" accept="image/jpeg,image/png,image/jpg" class="hidden" />
          <button type="button" id="signature-upload-btn" class="w-full py-2.5 bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2">
            <span>${formData.signatureDataUrl ? '✨ Clean Signature Background' : '📤 Upload & Crop Signature'}</span>
          </button>
        </div>
      </div>

    </div>
  `;

  // Attach Photo File Listener
  const photoInput = container.querySelector('#photo-file-input');
  const photoBtn = container.querySelector('#photo-upload-btn');
  photoBtn.addEventListener('click', () => photoInput.click());
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      openMediaStudioModal({
        file,
        mode: 'photo',
        onSave: (result) => {
          onUpdateField('photoDataUrl', result.dataUrl);
          onUpdateField('photoSizeKb', result.sizeKb);
        }
      });
    }
  });

  // Attach Signature File Listener
  const sigInput = container.querySelector('#signature-file-input');
  const sigBtn = container.querySelector('#signature-upload-btn');
  sigBtn.addEventListener('click', () => sigInput.click());
  sigInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      openMediaStudioModal({
        file,
        mode: 'signature',
        onSave: (result) => {
          onUpdateField('signatureDataUrl', result.dataUrl);
          onUpdateField('signatureSizeKb', result.sizeKb);
        }
      });
    }
  });

  // Voice Assistant Audio Button
  container.querySelector('#voice-doc-btn').addEventListener('click', () => {
    speechAssistant.speak('Step 2: Upload your passport photo and signature image. The Inline Media Studio will crop aspect ratios and compress file sizes under 20 KB and 10 KB limits automatically.');
  });

  return container;
}
