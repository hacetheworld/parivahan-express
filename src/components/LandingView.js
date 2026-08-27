export function renderLandingView(onStart) {
  const container = document.createElement('div');
  container.className = 'flex-1 flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white';

  container.innerHTML = `
    <!-- Top Navigation Header -->
    <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-emerald-900/40">
            P
          </div>
          <div>
            <h1 class="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              Parivahan Express
              <span class="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Civic Prototype
              </span>
            </h1>
            <p class="text-xs text-slate-400">Zero-Failure Driving Licence Portal</p>
          </div>
        </div>

        <!-- Attribution Pill -->
        <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Built for India | High-Resilience Civic Portal</span>
        </div>
      </div>
    </header>

    <!-- Main Hero Section -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-10 space-y-12 my-auto">
      
      <div class="text-center space-y-6 max-w-3xl mx-auto">
        <!-- Hero Attribution Badge for Mobile -->
        <div class="inline-flex sm:hidden items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-medium">
          <span>🇮🇳</span> Built for India | Mobile-First Civic Interface
        </div>

        <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Never lose your driving licence application <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">ever again.</span>
        </h2>

        <p class="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Bypass paid cybercafés and rigid government portal errors. Built-in canvas cropper resizes photos strictly under <strong>20 KB</strong> and signatures under <strong>10 KB</strong>, backed by offline auto-save.
        </p>

        <!-- Primary Action Button -->
        <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button id="start-app-btn" class="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-2xl transition-all shadow-xl shadow-emerald-900/50 flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-95 group cursor-pointer">
            <span>Start DL / LL Application</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <a href="#features" class="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm rounded-2xl border border-slate-800 transition-colors text-center">
            How It Works
          </a>
        </div>
      </div>

      <!-- Feature Highlights Grid -->
      <div id="features" class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        
        <!-- Card 1 -->
        <div class="civic-card p-6 space-y-3 civic-card-hover border-slate-800">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-bold border border-emerald-500/20">
            🖼️
          </div>
          <h3 class="text-base font-bold text-white">Inline Canvas Media Studio</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Auto-crops passport photos (3:4) and signatures (3:1). Iterative binary search engine guarantees output JPEG byte sizes strictly under <strong>20 KB</strong> and <strong>10 KB</strong> without server queues.
          </p>
        </div>

        <!-- Card 2 -->
        <div class="civic-card p-6 space-y-3 civic-card-hover border-slate-800">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-bold border border-emerald-500/20">
            💾
          </div>
          <h3 class="text-base font-bold text-white">Zero-Loss Offline Engine</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Every keystroke and image binary auto-saves to your phone’s IndexedDB within 200ms. If your mobile network drops or page reloads, 100% of your progress is instantly restored.
          </p>
        </div>

        <!-- Card 3 -->
        <div class="civic-card p-6 space-y-3 civic-card-hover border-slate-800">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-bold border border-emerald-500/20">
            🎯
          </div>
          <h3 class="text-base font-bold text-white">Pre-Flight Verification</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Client-side error interceptor scores your application from 0% to 100%. Identifies cryptic state DL regex format errors and age eligibility rules before final submission.
          </p>
        </div>

      </div>

    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>Parivahan Express • Civic Tech Prototype for Indian Road Transport Services</div>
        <div>Client-Side SPA • Zero Server Dependencies</div>
      </div>
    </footer>
  `;

  container.querySelector('#start-app-btn').addEventListener('click', onStart);
  return container;
}
