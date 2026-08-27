/**
 * Guidance Modal Drawer Component for Parivahan Express.
 * Provides interactive civic guidance and SMS search tips.
 */

export function renderGuidanceModal(topic, onClose) {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in';

  let title = 'Field Guidance';
  let content = '';

  if (topic === 'dlNo') {
    title = 'Where to find your Application or Licence No.?';
    content = `
      <div class="space-y-4 text-slate-300 text-sm">
        <p>If you are renewing, re-testing, or transferring a licence, you need your <strong>15-digit Driving Licence No.</strong> or <strong>Application No.</strong></p>

        <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 space-y-2">
          <div class="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d=" "></path></svg>
            SMS Search Tip
          </div>
          <p class="text-xs text-slate-400">Open your mobile SMS app and search for messages from sender IDs starting with:</p>
          <div class="flex flex-wrap gap-2 pt-1">
            <span class="px-2 py-1 bg-slate-800 text-emerald-400 font-mono text-xs rounded border border-emerald-500/30">PARIVN</span>
            <span class="px-2 py-1 bg-slate-800 text-emerald-400 font-mono text-xs rounded border border-emerald-500/30">AD-PARIVN</span>
            <span class="px-2 py-1 bg-slate-800 text-emerald-400 font-mono text-xs rounded border border-emerald-500/30">RJ-PARIVN</span>
          </div>
        </div>

        <div class="space-y-1">
          <p class="font-medium text-white">Standard Format Example:</p>
          <div class="p-2.5 bg-slate-950 rounded font-mono text-xs text-emerald-400 border border-slate-800">
            RJ-14-2022-0012345
          </div>
          <p class="text-xs text-slate-400">First 2 letters: State Code (RJ). Next 2 digits: RTO code (14). 4 digits: Year (2022). Remaining: 7-digit ID.</p>
        </div>
      </div>
    `;
  } else if (topic === 'rto') {
    title = 'How to Choose Your RTO Office?';
    content = `
      <div class="space-y-3 text-slate-300 text-sm">
        <p>Select the Regional Transport Office (RTO) jurisdiction under which your <strong>permanent residential address</strong> falls.</p>
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
          <p class="text-xs text-emerald-400 font-semibold">Important Rule:</p>
          <p class="text-xs text-slate-300">Your physical biometric verification, learner slot test, and DL driving test will be scheduled at this chosen RTO center.</p>
        </div>
      </div>
    `;
  } else if (topic === 'dob') {
    title = 'Age & Date of Birth Requirements';
    content = `
      <div class="space-y-3 text-slate-300 text-sm">
        <ul class="list-disc pl-5 space-y-2 text-xs">
          <li><strong class="text-white">Learner's Licence (Non-Gear Motorized ≤50cc):</strong> Minimum age <strong>16 years</strong> (Requires parental consent).</li>
          <li><strong class="text-white">Learner's & Driving Licence (Light Motor Vehicle - Car/Bike):</strong> Minimum age <strong>18 years</strong>.</li>
          <li><strong class="text-white">Commercial Transport Vehicle:</strong> Minimum age <strong>20 years</strong>.</li>
        </ul>
      </div>
    `;
  }

  modalOverlay.innerHTML = `
    <div class="civic-card max-w-md w-full p-6 space-y-4 shadow-2xl relative border border-slate-700">
      <div class="flex items-center justify-between border-b border-slate-700 pb-3">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <span class="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">💡</span>
          ${title}
        </h3>
        <button id="close-guidance-btn" class="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
          ✕
        </button>
      </div>

      <div>${content}</div>

      <div class="pt-2 flex justify-end">
        <button id="close-guidance-confirm" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/30">
          Got It
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const closeFn = () => {
    modalOverlay.remove();
    if (onClose) onClose();
  };

  modalOverlay.querySelector('#close-guidance-btn').addEventListener('click', closeFn);
  modalOverlay.querySelector('#close-guidance-confirm').addEventListener('click', closeFn);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeFn();
  });
}
