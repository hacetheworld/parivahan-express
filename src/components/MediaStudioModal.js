import { loadImageFromFile, processDocumentImage } from '../media/mediaStudio.js';

/**
 * Render Media Studio Cropping & Enhancement Modal
 */
export function openMediaStudioModal({ file, mode = 'photo', onSave, onClose }) {
  const isPhoto = mode === 'photo';
  const targetKb = isPhoto ? 20 : 10;
  const aspectWidth = isPhoto ? 3 : 3;
  const aspectHeight = isPhoto ? 4 : 1;
  const canvasWidth = isPhoto ? 360 : 450;
  const canvasHeight = isPhoto ? 480 : 150;

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fade-in overflow-y-auto';

  modalOverlay.innerHTML = `
    <div class="civic-card max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-700/80 my-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-slate-700 pb-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <i data-lucide="${isPhoto ? 'camera' : 'pen-line'}" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-white">
              Inline Media Studio - ${isPhoto ? 'Applicant Photo' : 'Signature Studio'}
            </h3>
            <p class="text-xs text-slate-400">
              Aspect Ratio: ${aspectWidth}:${aspectHeight} | Target Size: Strict ≤ ${targetKb} KB
            </p>
          </div>
        </div>
        <button id="close-studio-btn" class="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>

      <!-- Live Canvas Workspace -->
      <div class="relative bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-800 overflow-hidden min-h-[220px]">
        <div class="relative max-w-full overflow-hidden flex items-center justify-center">
          <canvas id="studio-canvas" class="max-w-full rounded-lg border border-slate-700 shadow-xl"></canvas>
        </div>

        <!-- Floating Target KB Badge -->
        <div id="kb-status-badge" class="mt-3 px-3 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 bg-slate-800 text-slate-300 border border-slate-700">
          <span>Calculating byte payload...</span>
        </div>
      </div>

      <!-- Interactive Tool Controls -->
      <div class="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 text-sm">
        <!-- Zoom Slider -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs text-slate-300">
            <label class="font-medium flex items-center gap-1"><i data-lucide="zoom-in" class="w-3.5 h-3.5"></i> Scale / Zoom</label>
            <span id="zoom-val-text" class="text-emerald-400 font-mono">1.0x</span>
          </div>
          <input type="range" id="zoom-slider" min="0.5" max="3" step="0.05" value="1" class="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer" />
        </div>

        <!-- Filter Toggles -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500/40 transition-colors">
            <input type="checkbox" id="enhance-contrast-chk" ${isPhoto ? 'checked' : ''} class="w-4 h-4 rounded accent-emerald-500" />
            <span>Auto Contrast & Light Boost</span>
          </label>

          <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500/40 transition-colors">
            <input type="checkbox" id="monochrome-chk" ${!isPhoto ? 'checked' : ''} class="w-4 h-4 rounded accent-emerald-500" />
            <span>Clean Background (Monochrome)</span>
          </label>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <button id="cancel-studio-btn" class="px-4 py-2 text-slate-400 hover:text-white font-medium text-sm rounded-xl transition-colors">
          Cancel
        </button>
        <button id="apply-studio-btn" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2">
          <span>Apply & Auto Compress</span>
          <span class="text-xs bg-emerald-700 px-2 py-0.5 rounded-full font-mono">≤ ${targetKb}KB</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);
  if (window.lucide) window.lucide.createIcons();

  const canvas = modalOverlay.querySelector('#studio-canvas');
  const zoomSlider = modalOverlay.querySelector('#zoom-slider');
  const zoomText = modalOverlay.querySelector('#zoom-val-text');
  const contrastChk = modalOverlay.querySelector('#enhance-contrast-chk');
  const monochromeChk = modalOverlay.querySelector('#monochrome-chk');
  const statusBadge = modalOverlay.querySelector('#kb-status-badge');

  let loadedImg = null;
  let currentProcessedResult = null;

  // Process & Render Canvas Preview
  const updateCanvasPreview = async () => {
    if (!loadedImg) return;

    const zoom = parseFloat(zoomSlider.value);
    zoomText.textContent = `${zoom.toFixed(2)}x`;

    const cropW = loadedImg.naturalWidth / zoom;
    const cropH = loadedImg.naturalHeight / zoom;
    const cropX = Math.max(0, (loadedImg.naturalWidth - cropW) / 2);
    const cropY = Math.max(0, (loadedImg.naturalHeight - cropH) / 2);

    currentProcessedResult = await processDocumentImage({
      imgElement: loadedImg,
      cropX,
      cropY,
      cropWidth: cropW,
      cropHeight: cropH,
      outputWidth: canvasWidth,
      outputHeight: canvasHeight,
      mode,
      targetMaxKb: targetKb,
      enhanceContrast: contrastChk.checked,
      monochromeFilter: monochromeChk.checked
    });

    // Render image to visible canvas
    const previewImg = new Image();
    previewImg.onload = () => {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(previewImg, 0, 0);
    };
    previewImg.src = currentProcessedResult.dataUrl;

    // Update Status Badge
    const sizeKb = currentProcessedResult.sizeKb;
    const isValid = sizeKb <= targetKb;

    if (isValid) {
      statusBadge.className = 'mt-3 px-3 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
      statusBadge.innerHTML = `✓ Clean Payload: ${sizeKb} KB (Under ${targetKb} KB limit)`;
    } else {
      statusBadge.className = 'mt-3 px-3 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 bg-red-500/20 text-red-400 border border-red-500/40';
      statusBadge.innerHTML = `⚠ Size Exceeded: ${sizeKb} KB (Target: ${targetKb} KB)`;
    }
  };

  // Load image file
  loadImageFromFile(file).then((img) => {
    loadedImg = img;
    updateCanvasPreview();
  }).catch((err) => {
    alert('Failed to load image file.');
    modalOverlay.remove();
  });

  // Event Listeners for Live Preview Tuning
  zoomSlider.addEventListener('input', updateCanvasPreview);
  contrastChk.addEventListener('change', updateCanvasPreview);
  monochromeChk.addEventListener('change', updateCanvasPreview);

  const closeFn = () => {
    modalOverlay.remove();
    if (onClose) onClose();
  };

  modalOverlay.querySelector('#close-studio-btn').addEventListener('click', closeFn);
  modalOverlay.querySelector('#cancel-studio-btn').addEventListener('click', closeFn);

  modalOverlay.querySelector('#apply-studio-btn').addEventListener('click', () => {
    if (currentProcessedResult) {
      onSave(currentProcessedResult);
      modalOverlay.remove();
    }
  });
}
