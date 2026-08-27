import { calculateReadinessScore, validateFormState } from '../utils/errorDictionary.js';
import { downloadApplicationReceipt } from '../utils/exportEngine.js';
import { speechAssistant } from '../utils/speechAssistant.js';

export function renderStepPreFlight(formData, onNavigateStep) {
  const container = document.createElement('div');
  container.className = 'space-y-6 animate-fade-in';

  const { score, breakdown } = calculateReadinessScore(formData);
  const errors = validateFormState(formData);

  let gaugeColor = 'border-emerald-500 text-emerald-400';
  let statusTitle = 'Zero-Failure Ready for Submission!';
  let statusDesc = 'All document aspect ratios, byte sizes, and required fields meet transport portal specifications.';

  if (score < 60) {
    gaugeColor = 'border-red-500 text-red-400';
    statusTitle = 'Action Required Before Submission';
    statusDesc = 'Missing mandatory details or uncompressed document uploads may lead to portal rejection.';
  } else if (score < 90) {
    gaugeColor = 'border-amber-500 text-amber-400';
    statusTitle = 'Good Progress - Minor Fixes Suggested';
    statusDesc = 'Your application is mostly complete, but addressing warnings will ensure instant approval.';
  }

  container.innerHTML = `
    <!-- Header Section -->
    <div class="civic-card p-5 space-y-2 border-emerald-500/20">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <span class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">3</span>
          Pre-Flight Verification & Readiness Scoring
        </h2>
        <button type="button" id="voice-preflight-btn" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors">
          <span>🔊</span> Listen Score
        </button>
      </div>
      <p class="text-xs text-slate-400">
        Pre-flight engine checks all inputs and image payloads before touching public government servers.
      </p>
    </div>

    <!-- Readiness Score & Gauge Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Score Circle Card -->
      <div class="civic-card p-6 flex flex-col items-center justify-center text-center space-y-3 border-slate-700">
        <div class="relative w-32 h-32 rounded-full border-8 ${gaugeColor} flex items-center justify-center shadow-inner">
          <div class="text-3xl font-extrabold font-mono tracking-tight">${score}%</div>
        </div>
        <div>
          <div class="text-sm font-bold text-white">${statusTitle}</div>
          <div class="text-xs text-slate-400 mt-1">${statusDesc}</div>
        </div>
      </div>

      <!-- Score Breakdown Details Card -->
      <div class="civic-card p-6 md:col-span-2 space-y-4 border-slate-700 flex flex-col justify-between">
        <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider">Readiness Score Breakdown</h3>
        
        <div class="space-y-3">
          ${Object.values(breakdown).map(item => `
            <div class="space-y-1">
              <div class="flex justify-between text-xs font-medium">
                <span class="text-slate-300">${item.label}</span>
                <span class="font-mono ${item.current === item.max ? 'text-emerald-400' : 'text-amber-400'}">${item.current} / ${item.max} pts</span>
              </div>
              <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div class="h-full ${item.current === item.max ? 'bg-emerald-500' : 'bg-amber-500'} transition-all duration-500" style="width: ${(item.current / item.max) * 100}%"></div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="pt-2 flex justify-end">
          <button type="button" id="export-json-btn" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5">
            <span>📥</span> Download Draft Receipt (JSON)
          </button>
        </div>
      </div>
    </div>

    <!-- Application Preview Summary Card -->
    <div class="civic-card p-6 space-y-4 border-slate-700">
      <h3 class="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
        <span>📋</span> Application Pre-Submission Summary
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Photo Preview -->
        <div class="space-y-1 text-center">
          <div class="text-xs font-semibold text-slate-400">Cropped Photo</div>
          <div class="w-28 h-36 mx-auto bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center">
            ${formData.photoDataUrl ? `<img src="${formData.photoDataUrl}" class="w-full h-full object-cover" />` : '<span class="text-xs text-red-400">Missing</span>'}
          </div>
          <div class="text-[11px] font-mono text-emerald-400">${formData.photoSizeKb ? `${formData.photoSizeKb} KB` : '-'}</div>
        </div>

        <!-- Signature Preview -->
        <div class="space-y-1 text-center">
          <div class="text-xs font-semibold text-slate-400">Signature</div>
          <div class="w-36 h-20 mx-auto bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center p-2">
            ${formData.signatureDataUrl ? `<img src="${formData.signatureDataUrl}" class="max-h-full bg-white rounded p-1" />` : '<span class="text-xs text-red-400">Missing</span>'}
          </div>
          <div class="text-[11px] font-mono text-emerald-400">${formData.signatureSizeKb ? `${formData.signatureSizeKb} KB` : '-'}</div>
        </div>

        <!-- Text Details -->
        <div class="md:col-span-2 space-y-2 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div class="grid grid-cols-2 gap-2">
            <div><span class="text-slate-500">Category:</span> <span class="font-semibold text-white">${formData.appType === 'DL' ? 'Driving Licence (DL)' : 'Learner Licence (LL)'}</span></div>
            <div><span class="text-slate-500">State:</span> <span class="font-semibold text-white">${formData.state || '-'}</span></div>
            <div><span class="text-slate-500">RTO:</span> <span class="font-semibold text-white">${formData.rto || '-'}</span></div>
            <div><span class="text-slate-500">Full Name:</span> <span class="font-semibold text-white">${formData.fullName || '-'}</span></div>
            <div><span class="text-slate-500">Date of Birth:</span> <span class="font-semibold text-white">${formData.dob || '-'}</span></div>
            <div><span class="text-slate-500">Mobile:</span> <span class="font-semibold text-white">${formData.mobile ? `+91 ${formData.mobile}` : '-'}</span></div>
          </div>
          ${formData.dlNo ? `<div class="pt-1 border-t border-slate-800"><span class="text-slate-500">Licence No:</span> <span class="font-mono font-semibold text-emerald-400">${formData.dlNo}</span></div>` : ''}
        </div>
      </div>
    </div>

    <!-- Issues & Remediation Checklist -->
    <div class="civic-card p-6 space-y-4 border-slate-700">
      <h3 class="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
        <span>🛡️ Client-Side Error Interceptor Checklist</span>
        <span class="text-xs px-2.5 py-1 rounded-full ${errors.length === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} font-semibold">
          ${errors.length === 0 ? '✓ 0 Interceptor Issues' : `⚠ ${errors.length} Issues Found`}
        </span>
      </h3>

      ${errors.length === 0 ? `
        <div class="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs font-semibold">
          <span class="text-xl">✅</span>
          <span>Zero pre-flight errors! Application structure, photo size (≤20 KB), signature background, and format validations are 100% verified.</span>
        </div>
      ` : `
        <div class="space-y-3">
          ${errors.map(err => `
            <div class="p-4 bg-slate-900 rounded-xl border border-red-500/30 flex items-start justify-between gap-4">
              <div class="space-y-1">
                <div class="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <span>⚠</span> ${err.title}
                </div>
                <div class="text-xs text-slate-300">${err.message}</div>
                <div class="text-[11px] text-emerald-400 font-medium pt-0.5">Solution: ${err.action}</div>
              </div>
              <button type="button" class="fix-issue-btn px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 shrink-0 transition-colors" data-target="${err.code.includes('PHOTO') || err.code.includes('SIGNATURE') ? 2 : 1}">
                Fix Now
              </button>
            </div>
          `).join('')}
        </div>
      `}
    </div>

    <!-- Final Submission Action -->
    <div class="pt-4 flex justify-end">
      <button type="button" id="final-submit-btn" class="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-xl transition-all shadow-xl shadow-emerald-900/50 flex items-center gap-2 hover:scale-[1.02]">
        <span>🚀 Simulate Portal Submission</span>
        <span class="text-xs bg-emerald-700 px-2.5 py-1 rounded-lg">Zero Failure</span>
      </button>
    </div>
  `;

  // Fix buttons event delegation
  container.querySelectorAll('.fix-issue-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const stepTarget = parseInt(e.target.getAttribute('data-target'), 10);
      onNavigateStep(stepTarget);
    });
  });

  // Export JSON receipt button
  container.querySelector('#export-json-btn').addEventListener('click', () => {
    downloadApplicationReceipt(formData, score);
  });

  // Voice Assistant Audio Button
  container.querySelector('#voice-preflight-btn').addEventListener('click', () => {
    speechAssistant.speak(`Your Application Readiness Score is ${score} percent. ${errors.length === 0 ? 'All validations passed.' : `There are ${errors.length} items to complete.`}`);
  });

  // Final Simulation Submit Modal
  container.querySelector('#final-submit-btn').addEventListener('click', () => {
    if (errors.length > 0) {
      alert(`Pre-Flight Check: Please resolve ${errors.length} issue(s) before submitting.`);
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fade-in';
    modal.innerHTML = `
      <div class="civic-card max-w-md w-full p-6 space-y-5 text-center border-emerald-500/50">
        <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto">
          🎉
        </div>
        <div class="space-y-2">
          <h3 class="text-xl font-extrabold text-white">Pre-Flight Verification Complete!</h3>
          <p class="text-xs text-slate-300">
            Your application payload has passed all zero-failure client-side checks. Photo strictly ≤20 KB, signature background clean ≤10 KB, and state data validated.
          </p>
        </div>
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400">
          Status: Ready for Parivahan Sewa API Dispatch
        </div>
        <button id="close-success-modal" class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-colors">
          Return to Portal Home
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#close-success-modal').addEventListener('click', () => {
      modal.remove();
      window.location.reload();
    });
  });

  return container;
}
