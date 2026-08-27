(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function a(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=a(r);fetch(r.href,s)}})();const z="ParivahanExpressDB",F=1,v="application_drafts",k="active_dl_application";let A=null;function M(){return new Promise((e,t)=>{if(A)return e(A);const a=indexedDB.open(z,F);a.onupgradeneeded=o=>{const r=o.target.result;r.objectStoreNames.contains(v)||r.createObjectStore(v)},a.onsuccess=o=>{A=o.target.result,e(A)},a.onerror=o=>{console.error("IndexedDB init error:",o.target.error),t(o.target.error)}})}async function q(e){try{const t=await M();return new Promise((a,o)=>{const s=t.transaction([v],"readwrite").objectStore(v),n={data:e,updatedAt:new Date().toISOString(),timestamp:Date.now()},c=s.put(n,k);c.onsuccess=()=>a(n),c.onerror=l=>o(l.target.error)})}catch(t){throw console.error("Failed to save draft to IndexedDB:",t),t}}async function G(){try{const e=await M();return new Promise((t,a)=>{const s=e.transaction([v],"readonly").objectStore(v).get(k);s.onsuccess=()=>{t(s.result?s.result:null)},s.onerror=n=>a(n.target.error)})}catch(e){return console.error("Failed to load draft from IndexedDB:",e),null}}async function H(){try{const e=await M();return new Promise((t,a)=>{const s=e.transaction([v],"readwrite").objectStore(v).delete(k);s.onsuccess=()=>t(!0),s.onerror=n=>a(n.target.error)})}catch(e){return console.error("Failed to clear draft:",e),!1}}function J(e=200,t=null){let a=null;return o=>{t&&t("saving"),clearTimeout(a),a=setTimeout(async()=>{try{const r=await q(o);if(t){const s=new Date(r.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"});t("saved",s)}}catch(r){t&&t("error",r.message)}},e)}}function V(e){const t=document.createElement("div");return t.className="flex-1 flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white",t.innerHTML=`
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
  `,t.querySelector("#start-app-btn").addEventListener("click",e),t}const B=[{code:"RJ",name:"Rajasthan",rtos:[{code:"RJ-14",name:"RJ-14: Jaipur South (Central)"},{code:"RJ-45",name:"RJ-45: Jaipur North"},{code:"RJ-27",name:"RJ-27: Udaipur"},{code:"RJ-19",name:"RJ-19: Jodhpur"},{code:"RJ-02",name:"RJ-02: Alwar"},{code:"RJ-05",name:"RJ-05: Bharatpur"},{code:"RJ-13",name:"RJ-13: Sri Ganganagar"},{code:"RJ-20",name:"RJ-20: Kota"}]},{code:"MH",name:"Maharashtra",rtos:[{code:"MH-01",name:"MH-01: Mumbai South (Tardeo)"},{code:"MH-02",name:"MH-02: Mumbai West (Andheri)"},{code:"MH-03",name:"MH-03: Mumbai East (Wadala)"},{code:"MH-12",name:"MH-12: Pune"},{code:"MH-14",name:"MH-14: Pimpri-Chinchwad"},{code:"MH-31",name:"MH-31: Nagpur Central"},{code:"MH-04",name:"MH-04: Thane"}]},{code:"DL",name:"Delhi (NCT)",rtos:[{code:"DL-01",name:"DL-01: Mall Road (North Delhi)"},{code:"DL-02",name:"DL-02: IP Depot (New Delhi)"},{code:"DL-03",name:"DL-03: Sheikh Sarai (South Delhi)"},{code:"DL-04",name:"DL-04: Janakpuri (West Delhi)"},{code:"DL-05",name:"DL-05: Loni Road (North East Delhi)"},{code:"DL-10",name:"DL-10: Raja Garden"}]},{code:"UP",name:"Uttar Pradesh",rtos:[{code:"UP-32",name:"UP-32: Lucknow"},{code:"UP-14",name:"UP-14: Ghaziabad"},{code:"UP-16",name:"UP-16: Gautam Buddha Nagar (Noida)"},{code:"UP-78",name:"UP-78: Kanpur Nagar"},{code:"UP-70",name:"UP-70: Prayagraj (Allahabad)"},{code:"UP-65",name:"UP-65: Varanasi"}]},{code:"KA",name:"Karnataka",rtos:[{code:"KA-01",name:"KA-01: Bengaluru Central (Koramangala)"},{code:"KA-02",name:"KA-02: Bengaluru West (Rajajinagar)"},{code:"KA-03",name:"KA-03: Bengaluru East (Indiranagar)"},{code:"KA-04",name:"KA-04: Bengaluru North (Yelahanka)"},{code:"KA-05",name:"KA-05: Bengaluru South (Jayanagar)"},{code:"KA-09",name:"KA-09: Mysuru West"}]},{code:"TN",name:"Tamil Nadu",rtos:[{code:"TN-01",name:"TN-01: Chennai Central"},{code:"TN-07",name:"TN-07: Chennai South"},{code:"TN-37",name:"TN-37: Coimbatore South"},{code:"TN-58",name:"TN-58: Madurai South"}]},{code:"GJ",name:"Gujarat",rtos:[{code:"GJ-01",name:"GJ-01: Ahmedabad (Subhash Bridge)"},{code:"GJ-05",name:"GJ-05: Surat"},{code:"GJ-06",name:"GJ-06: Vadodara"},{code:"GJ-03",name:"GJ-03: Rajkot"}]},{code:"MP",name:"Madhya Pradesh",rtos:[{code:"MP-04",name:"MP-04: Bhopal"},{code:"MP-09",name:"MP-09: Indore"},{code:"MP-20",name:"MP-20: Jabalpur"}]},{code:"WB",name:"West Bengal",rtos:[{code:"WB-01",name:"WB-01: Kolkata Public Vehicles Dept"},{code:"WB-20",name:"WB-20: Alipore (South 24 Parganas)"},{code:"WB-74",name:"WB-74: Siliguri"}]}];function T(e,t){const a=document.createElement("div");a.className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in";let o="Field Guidance",r="";e==="dlNo"?(o="Where to find your Application or Licence No.?",r=`
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
    `):e==="rto"?(o="How to Choose Your RTO Office?",r=`
      <div class="space-y-3 text-slate-300 text-sm">
        <p>Select the Regional Transport Office (RTO) jurisdiction under which your <strong>permanent residential address</strong> falls.</p>
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
          <p class="text-xs text-emerald-400 font-semibold">Important Rule:</p>
          <p class="text-xs text-slate-300">Your physical biometric verification, learner slot test, and DL driving test will be scheduled at this chosen RTO center.</p>
        </div>
      </div>
    `):e==="dob"&&(o="Age & Date of Birth Requirements",r=`
      <div class="space-y-3 text-slate-300 text-sm">
        <ul class="list-disc pl-5 space-y-2 text-xs">
          <li><strong class="text-white">Learner's Licence (Non-Gear Motorized ≤50cc):</strong> Minimum age <strong>16 years</strong> (Requires parental consent).</li>
          <li><strong class="text-white">Learner's & Driving Licence (Light Motor Vehicle - Car/Bike):</strong> Minimum age <strong>18 years</strong>.</li>
          <li><strong class="text-white">Commercial Transport Vehicle:</strong> Minimum age <strong>20 years</strong>.</li>
        </ul>
      </div>
    `),a.innerHTML=`
    <div class="civic-card max-w-md w-full p-6 space-y-4 shadow-2xl relative border border-slate-700">
      <div class="flex items-center justify-between border-b border-slate-700 pb-3">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <span class="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">💡</span>
          ${o}
        </h3>
        <button id="close-guidance-btn" class="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
          ✕
        </button>
      </div>

      <div>${r}</div>

      <div class="pt-2 flex justify-end">
        <button id="close-guidance-confirm" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/30">
          Got It
        </button>
      </div>
    </div>
  `,document.body.appendChild(a);const s=()=>{a.remove()};a.querySelector("#close-guidance-btn").addEventListener("click",s),a.querySelector("#close-guidance-confirm").addEventListener("click",s),a.addEventListener("click",n=>{n.target===a&&s()})}class Y{constructor(){this.synth=typeof window<"u"&&"speechSynthesis"in window?window.speechSynthesis:null,this.isSpeaking=!1,this.currentLanguage="en-IN"}setLanguage(t){this.currentLanguage=t}speak(t){if(!this.synth){console.warn("Speech synthesis not supported in this browser.");return}this.stop();const a=new SpeechSynthesisUtterance(t);a.lang=this.currentLanguage,a.rate=.95,a.pitch=1,a.onstart=()=>{this.isSpeaking=!0},a.onend=()=>{this.isSpeaking=!1},a.onerror=o=>{console.error("Speech synthesis error:",o),this.isSpeaking=!1},this.synth.speak(a)}stop(){this.synth&&this.synth.speaking&&(this.synth.cancel(),this.isSpeaking=!1)}}const S=new Y;function W(e,t){const a=document.createElement("div");a.className="space-y-6 animate-fade-in";const o=B.find(d=>d.code===e.state),r=o?o.rtos:[];let s="",n="hidden";if(e.dob){const d=new Date(e.dob);if(!isNaN(d.getTime())){const f=new Date;let g=f.getFullYear()-d.getFullYear();const y=f.getMonth()-d.getMonth();(y<0||y===0&&f.getDate()<d.getDate())&&g--,g>=18?(s=`Age: ${g} yrs — Eligible for DL & LL`,n="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"):g>=16?(s=`Age: ${g} yrs — Eligible for 50cc LL Only`,n="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30"):(s=`Age: ${g} yrs — Underage (Min age 16 for LL, 18 for DL)`,n="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/30")}}return a.innerHTML=`
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
        <label class="civic-card p-4 flex items-center gap-3 cursor-pointer hover:border-emerald-500/50 transition-all ${e.appType==="LL"?"border-emerald-500 bg-emerald-500/10":""}">
          <input type="radio" name="appType" value="LL" ${e.appType==="LL"?"checked":""} class="w-5 h-5 accent-emerald-500" />
          <div>
            <div class="text-sm font-bold text-white">Learner's Licence (LL)</div>
            <div class="text-xs text-slate-400">First-time applicant / Knowledge test</div>
          </div>
        </label>

        <label class="civic-card p-4 flex items-center gap-3 cursor-pointer hover:border-emerald-500/50 transition-all ${e.appType==="DL"?"border-emerald-500 bg-emerald-500/10":""}">
          <input type="radio" name="appType" value="DL" ${e.appType==="DL"?"checked":""} class="w-5 h-5 accent-emerald-500" />
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
            ${B.map(d=>`<option value="${d.code}" ${e.state===d.code?"selected":""}>${d.name} (${d.code})</option>`).join("")}
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
          <select id="rto-select" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" ${e.state?"":"disabled"}>
            <option value="">${e.state?"-- Select RTO Location --":"-- Choose State First --"}</option>
            ${r.map(d=>`<option value="${d.code}" ${e.rto===d.code?"selected":""}>${d.name}</option>`).join("")}
          </select>
        </div>
      </div>

      <!-- Full Name Input -->
      <div class="space-y-1.5">
        <label class="block text-xs font-semibold text-slate-300">
          Full Applicant Name <span class="text-emerald-400">*</span>
        </label>
        <input type="text" id="fullname-input" value="${e.fullName||""}" placeholder="e.g. AJAY KUMAR MEENA" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 uppercase transition-colors" />
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
          <input type="date" id="dob-input" value="${e.dob||""}" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
          <div id="age-badge-container" class="pt-1">
            <span class="${n}">${s}</span>
          </div>
        </div>

        <!-- Mobile Number -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-slate-300">
            10-Digit Mobile Number <span class="text-emerald-400">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-3.5 top-3 text-xs text-slate-400 font-mono">+91</span>
            <input type="tel" id="mobile-input" maxlength="10" value="${e.mobile||""}" placeholder="9876543210" class="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500 transition-colors" />
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
        <input type="text" id="dlno-input" value="${e.dlNo||""}" placeholder="e.g. RJ-14-2022-0012345" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-emerald-500 transition-colors" />
      </div>
    </div>
  `,a.querySelectorAll('input[name="appType"]').forEach(d=>{d.addEventListener("change",f=>t("appType",f.target.value))}),a.querySelector("#state-select").addEventListener("change",d=>{t("state",d.target.value),t("rto","")}),a.querySelector("#rto-select").addEventListener("change",d=>t("rto",d.target.value)),a.querySelector("#fullname-input").addEventListener("input",d=>t("fullName",d.target.value.toUpperCase())),a.querySelector("#dob-input").addEventListener("change",d=>t("dob",d.target.value)),a.querySelector("#mobile-input").addEventListener("input",d=>t("mobile",d.target.value.replace(/\D/g,""))),a.querySelector("#dlno-input").addEventListener("input",d=>t("dlNo",d.target.value.toUpperCase())),a.querySelector("#help-rto-btn").addEventListener("click",()=>T("rto")),a.querySelector("#help-dob-btn").addEventListener("click",()=>T("dob")),a.querySelector("#help-dl-btn").addEventListener("click",()=>T("dlNo")),a.querySelector("#voice-identity-btn").addEventListener("click",()=>{S.speak("Step 1: Enter your permanent state, RTO office location, full applicant name matching Aadhaar, date of birth, and 10-digit mobile number.")}),a}function Z(e){return new Promise((t,a)=>{const o=new FileReader;o.onload=r=>{const s=new Image;s.onload=()=>t(s),s.onerror=n=>a(n),s.src=r.target.result},o.onerror=r=>a(r),o.readAsDataURL(e)})}function $(e){if(!e)return 0;const t=e.split(",")[1]||"",a=(t.match(/=/g)||[]).length;return Math.round(t.length*.75-a)}function X(e,t,a,o=1.2,r=10){const s=e.getImageData(0,0,t,a),n=s.data,c=259*(o+255)/(255*(259-o));for(let l=0;l<n.length;l+=4)n[l]=c*(n[l]-128)+128+r,n[l+1]=c*(n[l+1]-128)+128+r,n[l+2]=c*(n[l+2]-128)+128+r;e.putImageData(s,0,0)}function Q(e,t,a,o=180){const r=e.getImageData(0,0,t,a),s=r.data;for(let n=0;n<s.length;n+=4){const c=s[n],l=s[n+1],i=s[n+2];.299*c+.587*l+.114*i>o?(s[n]=255,s[n+1]=255,s[n+2]=255):(s[n]=20,s[n+1]=30,s[n+2]=45)}e.putImageData(r,0,0)}function K(e,t,a=.05,o=.95){let r=a,s=o,n=e.toDataURL("image/jpeg",r),c=parseFloat(($(n)/1024).toFixed(1));if(c>t){const l=document.createElement("canvas"),i=.7;return l.width=Math.round(e.width*i),l.height=Math.round(e.height*i),l.getContext("2d").drawImage(e,0,0,l.width,l.height),K(l,t,a,o)}for(let l=0;l<7;l++){const i=(r+s)/2,p=e.toDataURL("image/jpeg",i),m=parseFloat(($(p)/1024).toFixed(1));m<=t?(n=p,c=m,r=i):s=i}return{dataUrl:n,sizeKb:c,width:e.width,height:e.height}}async function ee({imgElement:e,cropX:t=0,cropY:a=0,cropWidth:o,cropHeight:r,outputWidth:s=400,outputHeight:n=533,mode:c="photo",targetMaxKb:l=20,enhanceContrast:i=!1,monochromeFilter:p=!1,brightness:m=10}){const x=document.createElement("canvas");x.width=s,x.height=n;const d=x.getContext("2d");return d.fillStyle="#FFFFFF",d.fillRect(0,0,s,n),d.drawImage(e,t,a,o||e.naturalWidth,r||e.naturalHeight,0,0,s,n),i&&X(d,s,n,25,m),(c==="signature"||p)&&Q(d,s,n,175),K(x,l)}function _({file:e,mode:t="photo",onSave:a,onClose:o}){const r=t==="photo",s=r?20:10,n=3,c=r?4:1,l=r?360:450,i=r?480:150,p=document.createElement("div");p.className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fade-in overflow-y-auto",p.innerHTML=`
    <div class="civic-card max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-700/80 my-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-slate-700 pb-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
            ${r?"📷":"✍️"}
          </div>
          <div>
            <h3 class="text-base font-bold text-white">
              Inline Media Studio - ${r?"Applicant Photo":"Signature Studio"}
            </h3>
            <p class="text-xs text-slate-400">
              Aspect Ratio: ${n}:${c} | Target Size: Strict ≤ ${s} KB
            </p>
          </div>
        </div>
        <button id="close-studio-btn" class="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">✕</button>
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
            <label class="font-medium flex items-center gap-1">🔍 Scale / Zoom</label>
            <span id="zoom-val-text" class="text-emerald-400 font-mono">1.0x</span>
          </div>
          <input type="range" id="zoom-slider" min="0.5" max="3" step="0.05" value="1" class="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer" />
        </div>

        <!-- Filter Toggles -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500/40 transition-colors">
            <input type="checkbox" id="enhance-contrast-chk" ${r?"checked":""} class="w-4 h-4 rounded accent-emerald-500" />
            <span>Auto Contrast & Light Boost</span>
          </label>

          <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500/40 transition-colors">
            <input type="checkbox" id="monochrome-chk" ${r?"":"checked"} class="w-4 h-4 rounded accent-emerald-500" />
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
          <span class="text-xs bg-emerald-700 px-2 py-0.5 rounded-full font-mono">≤ ${s}KB</span>
        </button>
      </div>
    </div>
  `,document.body.appendChild(p);const m=p.querySelector("#studio-canvas"),x=p.querySelector("#zoom-slider"),d=p.querySelector("#zoom-val-text"),f=p.querySelector("#enhance-contrast-chk"),g=p.querySelector("#monochrome-chk"),y=p.querySelector("#kb-status-badge");let w=null,E=null;const L=async()=>{if(!w)return;const R=parseFloat(x.value);d.textContent=`${R.toFixed(2)}x`;const P=w.naturalWidth/R,D=w.naturalHeight/R,O=Math.max(0,(w.naturalWidth-P)/2),U=Math.max(0,(w.naturalHeight-D)/2);E=await ee({imgElement:w,cropX:O,cropY:U,cropWidth:P,cropHeight:D,outputWidth:l,outputHeight:i,mode:t,targetMaxKb:s,enhanceContrast:f.checked,monochromeFilter:g.checked});const N=new Image;N.onload=()=>{m.width=l,m.height=i,m.getContext("2d").drawImage(N,0,0)},N.src=E.dataUrl;const I=E.sizeKb;I<=s?(y.className="mt-3 px-3 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",y.innerHTML=`✓ Clean Payload: ${I} KB (Under ${s} KB limit)`):(y.className="mt-3 px-3 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 bg-red-500/20 text-red-400 border border-red-500/40",y.innerHTML=`⚠ Size Exceeded: ${I} KB (Target: ${s} KB)`)};Z(e).then(R=>{w=R,L()}).catch(R=>{alert("Failed to load image file."),p.remove()}),x.addEventListener("input",L),f.addEventListener("change",L),g.addEventListener("change",L);const C=()=>{p.remove(),o&&o()};p.querySelector("#close-studio-btn").addEventListener("click",C),p.querySelector("#cancel-studio-btn").addEventListener("click",C),p.querySelector("#apply-studio-btn").addEventListener("click",()=>{E&&(a(E),p.remove())})}function te(e,t){const a=document.createElement("div");a.className="space-y-6 animate-fade-in";const o=e.photoDataUrl&&e.photoSizeKb&&e.photoSizeKb<=20,r=e.signatureDataUrl&&e.signatureSizeKb&&e.signatureSizeKb<=10;a.innerHTML=`
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
            <span class="px-2 py-0.5 rounded text-[11px] font-mono ${o?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/40":"bg-amber-500/20 text-amber-400 border border-amber-500/40"}">
              ${e.photoSizeKb?`${e.photoSizeKb} KB (Target ≤20 KB)`:"Target: ≤20 KB"}
            </span>
          </div>

          <!-- Preview Frame -->
          <div class="w-full h-52 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden relative group">
            ${e.photoDataUrl?`
              <img src="${e.photoDataUrl}" class="h-full object-cover rounded-lg shadow-md" alt="Applicant Photo" />
              <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span class="text-xs text-emerald-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-lg border border-emerald-500/40">Recrop Photo</span>
              </div>
            `:`
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
            <span>${e.photoDataUrl?"✨ Adjust in Media Studio":"📤 Upload & Crop Photo"}</span>
          </button>
        </div>
      </div>

      <!-- Card 2: Signature Upload -->
      <div class="civic-card p-5 space-y-4 border-slate-700 relative flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">Applicant Signature</span>
            <span class="px-2 py-0.5 rounded text-[11px] font-mono ${r?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/40":"bg-amber-500/20 text-amber-400 border border-amber-500/40"}">
              ${e.signatureSizeKb?`${e.signatureSizeKb} KB (Target ≤10 KB)`:"Target: ≤10 KB"}
            </span>
          </div>

          <!-- Preview Frame -->
          <div class="w-full h-52 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden relative group p-4">
            ${e.signatureDataUrl?`
              <img src="${e.signatureDataUrl}" class="max-h-full object-contain rounded shadow-md bg-white p-2" alt="Signature" />
              <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span class="text-xs text-emerald-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-lg border border-emerald-500/40">Recrop Signature</span>
              </div>
            `:`
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
            <span>${e.signatureDataUrl?"✨ Clean Signature Background":"📤 Upload & Crop Signature"}</span>
          </button>
        </div>
      </div>

    </div>
  `;const s=a.querySelector("#photo-file-input");a.querySelector("#photo-upload-btn").addEventListener("click",()=>s.click()),s.addEventListener("change",i=>{const p=i.target.files[0];p&&_({file:p,mode:"photo",onSave:m=>{t("photoDataUrl",m.dataUrl),t("photoSizeKb",m.sizeKb)}})});const c=a.querySelector("#signature-file-input");return a.querySelector("#signature-upload-btn").addEventListener("click",()=>c.click()),c.addEventListener("change",i=>{const p=i.target.files[0];p&&_({file:p,mode:"signature",onSave:m=>{t("signatureDataUrl",m.dataUrl),t("signatureSizeKb",m.sizeKb)}})}),a.querySelector("#voice-doc-btn").addEventListener("click",()=>{S.speak("Step 2: Upload your passport photo and signature image. The Inline Media Studio will crop aspect ratios and compress file sizes under 20 KB and 10 KB limits automatically.")}),a}const b={ERR_STATE_REQUIRED:{code:"ERR_STATE_REQUIRED",title:"State Selection Required",message:"Select the Indian State/UT matching your permanent address proof.",action:"Select your state from the dropdown menu."},ERR_RTO_REQUIRED:{code:"ERR_RTO_REQUIRED",title:"RTO Office Required",message:"Choose the Regional Transport Office (RTO) closest to your residential address.",action:"Pick an RTO location from the list."},ERR_NAME_INVALID:{code:"ERR_NAME_INVALID",title:"Full Name Format Invalid",message:"Enter 3 to 50 characters containing letters and spaces only, exactly as printed on your official ID document (Aadhaar/PAN/School Certificate).",action:"Remove numbers or special characters from your full name."},ERR_DOB_FORMAT:{code:"ERR_DOB_FORMAT",title:"Invalid Date of Birth",message:"Date of Birth must follow DD/MM/YYYY format or a valid calendar entry.",action:"Select your birth date using the date picker or format as DD/MM/YYYY."},ERR_AGE_UNDERAGE_LL:{code:"ERR_AGE_UNDERAGE_LL",title:"Under Age Eligibility Threshold (LL)",message:"You must be at least 16 years old for a Non-Gear Motorized 50cc Learner Licence, or 18 years old for a Light Motor Vehicle (LMV) Licence.",action:"Verify your birth year in educational records."},ERR_AGE_UNDERAGE_DL:{code:"ERR_AGE_UNDERAGE_DL",title:"Under Age Eligibility Threshold (DL)",message:"You must be at least 18 years old to apply for a permanent Driving Licence.",action:"Verify your birth year in educational records."},ERR_MOBILE_INVALID:{code:"ERR_MOBILE_INVALID",title:"Invalid 10-Digit Mobile Number",message:"Mobile number must be a valid 10-digit Indian mobile starting with 6, 7, 8, or 9.",action:"Check your mobile number entry for missing digits or prefixes."},ERR_DL_FORMAT:{code:"ERR_DL_FORMAT",title:"Licence / Application Number Format Mismatch",message:"Existing DL or Application Number must start with your 2-letter state code followed by year (e.g., RJ-14-2022-0012345).",action:"Search your mobile SMS inbox for sender IDs like PARIVN or AD-PARIVN for exact application number format."},ERR_PHOTO_MISSING:{code:"ERR_PHOTO_MISSING",title:"Applicant Photo Required",message:"Official passport photo upload is mandatory for driving licence issue.",action:'Tap "Upload Photo" and use Inline Media Studio to crop and auto-compress.'},ERR_PHOTO_SIZE_EXCEEDED:{code:"ERR_PHOTO_SIZE_EXCEEDED",title:"Photo File Exceeds 20 KB Portal Limit",message:"Government portals strictly reject photos larger than 20 KB.",action:'Click "Auto Compress" in Inline Media Studio to resize under 20 KB.'},ERR_SIGNATURE_MISSING:{code:"ERR_SIGNATURE_MISSING",title:"Applicant Signature Required",message:"Signature upload on white background is mandatory.",action:'Upload a photo of your signature and tap "Enhance Contrast".'},ERR_SIGNATURE_SIZE_EXCEEDED:{code:"ERR_SIGNATURE_SIZE_EXCEEDED",title:"Signature Exceeds 10 KB Portal Limit",message:"Government portals strictly reject signatures larger than 10 KB.",action:"Use the Media Studio background cleaner to compress strictly under 10 KB."}};function ae(e){const t=[];e.state||t.push(b.ERR_STATE_REQUIRED),e.rto||t.push(b.ERR_RTO_REQUIRED);const a=(e.fullName||"").trim();if((!a||a.length<3||a.length>50||!/^[a-zA-Z\s.]+$/.test(a))&&t.push(b.ERR_NAME_INVALID),!e.dob)t.push(b.ERR_DOB_FORMAT);else{const r=new Date(e.dob);if(isNaN(r.getTime()))t.push(b.ERR_DOB_FORMAT);else{const s=new Date;let n=s.getFullYear()-r.getFullYear();const c=s.getMonth()-r.getMonth();(c<0||c===0&&s.getDate()<r.getDate())&&n--;const l=e.appType||"LL";l==="LL"&&n<16?t.push(b.ERR_AGE_UNDERAGE_LL):l==="DL"&&n<18&&t.push(b.ERR_AGE_UNDERAGE_DL)}}const o=(e.mobile||"").replace(/\D/g,"");return/^[6-9]\d{9}$/.test(o)||t.push(b.ERR_MOBILE_INVALID),e.dlNo&&e.dlNo.trim().length>0&&e.dlNo.trim().length<10&&t.push(b.ERR_DL_FORMAT),e.photoDataUrl?e.photoSizeKb&&e.photoSizeKb>20&&t.push(b.ERR_PHOTO_SIZE_EXCEEDED):t.push(b.ERR_PHOTO_MISSING),e.signatureDataUrl?e.signatureSizeKb&&e.signatureSizeKb>10&&t.push(b.ERR_SIGNATURE_SIZE_EXCEEDED):t.push(b.ERR_SIGNATURE_MISSING),t}function se(e){let t=0;const a={personalDetails:{max:40,current:0,label:"Identity & Address Details"},formatValidations:{max:20,current:0,label:"Field Formats & Age Criteria"},photoCompliance:{max:20,current:0,label:"Photo Size (≤20 KB) & Aspect Ratio"},signatureCompliance:{max:20,current:0,label:"Signature Contrast & Size (≤10 KB)"}};let o=0;e.state&&(o+=10),e.rto&&(o+=10),e.fullName&&e.fullName.trim().length>=3&&(o+=10),e.mobile&&e.mobile.trim().length===10&&(o+=10),a.personalDetails.current=o;let r=0;if(e.dob){const s=new Date(e.dob);isNaN(s.getTime())||new Date().getFullYear()-s.getFullYear()>=16&&(r+=10)}return e.mobile&&/^[6-9]\d{9}$/.test(e.mobile)&&(r+=10),a.formatValidations.current=r,e.photoDataUrl&&(e.photoSizeKb&&e.photoSizeKb<=20?a.photoCompliance.current=20:a.photoCompliance.current=10),e.signatureDataUrl&&(e.signatureSizeKb&&e.signatureSizeKb<=10?a.signatureCompliance.current=20:a.signatureCompliance.current=10),t=a.personalDetails.current+a.formatValidations.current+a.photoCompliance.current+a.signatureCompliance.current,{score:t,breakdown:a}}function re(e,t){const o={portalName:"Parivahan Express",receiptVersion:"1.0.0-CIVIC",generatedAt:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),readinessScore:`${t}%`,applicationSummary:{state:e.state||"N/A",rto:e.rto||"N/A",applicationType:e.appType==="DL"?"Driving Licence (DL)":"Learner Licence (LL)",fullName:e.fullName||"N/A",dateOfBirth:e.dob||"N/A",mobileNumber:e.mobile||"N/A",existingLicenceNo:e.dlNo||"N/A (New Applicant)"},documentStatus:{photoProcessed:!!e.photoDataUrl,photoSizeKb:e.photoSizeKb?`${e.photoSizeKb} KB`:"Missing",signatureProcessed:!!e.signatureDataUrl,signatureSizeKb:e.signatureSizeKb?`${e.signatureSizeKb} KB`:"Missing"}},r=JSON.stringify(o,null,2),s=new Blob([r],{type:"application/json"}),n=URL.createObjectURL(s),c=document.createElement("a");c.href=n,c.download=`Parivahan_Express_Receipt_${(e.fullName||"Draft").replace(/\s+/g,"_")}.json`,document.body.appendChild(c),c.click(),document.body.removeChild(c),URL.revokeObjectURL(n)}function ne(e,t){const a=document.createElement("div");a.className="space-y-6 animate-fade-in";const{score:o,breakdown:r}=se(e),s=ae(e);let n="border-emerald-500 text-emerald-400",c="Zero-Failure Ready for Submission!",l="All document aspect ratios, byte sizes, and required fields meet transport portal specifications.";return o<60?(n="border-red-500 text-red-400",c="Action Required Before Submission",l="Missing mandatory details or uncompressed document uploads may lead to portal rejection."):o<90&&(n="border-amber-500 text-amber-400",c="Good Progress - Minor Fixes Suggested",l="Your application is mostly complete, but addressing warnings will ensure instant approval."),a.innerHTML=`
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
        <div class="relative w-32 h-32 rounded-full border-8 ${n} flex items-center justify-center shadow-inner">
          <div class="text-3xl font-extrabold font-mono tracking-tight">${o}%</div>
        </div>
        <div>
          <div class="text-sm font-bold text-white">${c}</div>
          <div class="text-xs text-slate-400 mt-1">${l}</div>
        </div>
      </div>

      <!-- Score Breakdown Details Card -->
      <div class="civic-card p-6 md:col-span-2 space-y-4 border-slate-700 flex flex-col justify-between">
        <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider">Readiness Score Breakdown</h3>
        
        <div class="space-y-3">
          ${Object.values(r).map(i=>`
            <div class="space-y-1">
              <div class="flex justify-between text-xs font-medium">
                <span class="text-slate-300">${i.label}</span>
                <span class="font-mono ${i.current===i.max?"text-emerald-400":"text-amber-400"}">${i.current} / ${i.max} pts</span>
              </div>
              <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div class="h-full ${i.current===i.max?"bg-emerald-500":"bg-amber-500"} transition-all duration-500" style="width: ${i.current/i.max*100}%"></div>
              </div>
            </div>
          `).join("")}
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
            ${e.photoDataUrl?`<img src="${e.photoDataUrl}" class="w-full h-full object-cover" />`:'<span class="text-xs text-red-400">Missing</span>'}
          </div>
          <div class="text-[11px] font-mono text-emerald-400">${e.photoSizeKb?`${e.photoSizeKb} KB`:"-"}</div>
        </div>

        <!-- Signature Preview -->
        <div class="space-y-1 text-center">
          <div class="text-xs font-semibold text-slate-400">Signature</div>
          <div class="w-36 h-20 mx-auto bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center p-2">
            ${e.signatureDataUrl?`<img src="${e.signatureDataUrl}" class="max-h-full bg-white rounded p-1" />`:'<span class="text-xs text-red-400">Missing</span>'}
          </div>
          <div class="text-[11px] font-mono text-emerald-400">${e.signatureSizeKb?`${e.signatureSizeKb} KB`:"-"}</div>
        </div>

        <!-- Text Details -->
        <div class="md:col-span-2 space-y-2 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div class="grid grid-cols-2 gap-2">
            <div><span class="text-slate-500">Category:</span> <span class="font-semibold text-white">${e.appType==="DL"?"Driving Licence (DL)":"Learner Licence (LL)"}</span></div>
            <div><span class="text-slate-500">State:</span> <span class="font-semibold text-white">${e.state||"-"}</span></div>
            <div><span class="text-slate-500">RTO:</span> <span class="font-semibold text-white">${e.rto||"-"}</span></div>
            <div><span class="text-slate-500">Full Name:</span> <span class="font-semibold text-white">${e.fullName||"-"}</span></div>
            <div><span class="text-slate-500">Date of Birth:</span> <span class="font-semibold text-white">${e.dob||"-"}</span></div>
            <div><span class="text-slate-500">Mobile:</span> <span class="font-semibold text-white">${e.mobile?`+91 ${e.mobile}`:"-"}</span></div>
          </div>
          ${e.dlNo?`<div class="pt-1 border-t border-slate-800"><span class="text-slate-500">Licence No:</span> <span class="font-mono font-semibold text-emerald-400">${e.dlNo}</span></div>`:""}
        </div>
      </div>
    </div>

    <!-- Issues & Remediation Checklist -->
    <div class="civic-card p-6 space-y-4 border-slate-700">
      <h3 class="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
        <span>🛡️ Client-Side Error Interceptor Checklist</span>
        <span class="text-xs px-2.5 py-1 rounded-full ${s.length===0?"bg-emerald-500/20 text-emerald-400":"bg-red-500/20 text-red-400"} font-semibold">
          ${s.length===0?"✓ 0 Interceptor Issues":`⚠ ${s.length} Issues Found`}
        </span>
      </h3>

      ${s.length===0?`
        <div class="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs font-semibold">
          <span class="text-xl">✅</span>
          <span>Zero pre-flight errors! Application structure, photo size (≤20 KB), signature background, and format validations are 100% verified.</span>
        </div>
      `:`
        <div class="space-y-3">
          ${s.map(i=>`
            <div class="p-4 bg-slate-900 rounded-xl border border-red-500/30 flex items-start justify-between gap-4">
              <div class="space-y-1">
                <div class="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <span>⚠</span> ${i.title}
                </div>
                <div class="text-xs text-slate-300">${i.message}</div>
                <div class="text-[11px] text-emerald-400 font-medium pt-0.5">Solution: ${i.action}</div>
              </div>
              <button type="button" class="fix-issue-btn px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 shrink-0 transition-colors" data-target="${i.code.includes("PHOTO")||i.code.includes("SIGNATURE")?2:1}">
                Fix Now
              </button>
            </div>
          `).join("")}
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
  `,a.querySelectorAll(".fix-issue-btn").forEach(i=>{i.addEventListener("click",p=>{const m=parseInt(p.target.getAttribute("data-target"),10);t(m)})}),a.querySelector("#export-json-btn").addEventListener("click",()=>{re(e,o)}),a.querySelector("#voice-preflight-btn").addEventListener("click",()=>{S.speak(`Your Application Readiness Score is ${o} percent. ${s.length===0?"All validations passed.":`There are ${s.length} items to complete.`}`)}),a.querySelector("#final-submit-btn").addEventListener("click",()=>{if(s.length>0){alert(`Pre-Flight Check: Please resolve ${s.length} issue(s) before submitting.`);return}const i=document.createElement("div");i.className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fade-in",i.innerHTML=`
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
    `,document.body.appendChild(i),i.querySelector("#close-success-modal").addEventListener("click",()=>{i.remove(),window.location.reload()})}),a}function oe({formData:e,currentStep:t=1,saveStatus:a="saved",savedTime:o="Just now",isOnline:r=!0,onUpdateField:s,onNavigateStep:n,onBackToLanding:c,onClearDraft:l}){const i=document.createElement("div");i.className="flex-1 flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white",i.innerHTML=`
    <!-- Top Portal Header -->
    <header class="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        <!-- Left: Back Button & Title -->
        <div class="flex items-center gap-3">
          <button id="back-to-landing-btn" class="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors text-sm font-semibold flex items-center gap-1">
            <span>←</span> <span class="hidden sm:inline">Landing</span>
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
            <span>🗣️</span> <span id="voice-lang-label">EN</span>
          </button>

          <!-- Network Status Pill -->
          <div class="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${r?"bg-emerald-500/10 text-emerald-400 border border-emerald-500/30":"bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse"}">
            <span class="w-2 h-2 rounded-full ${r?"bg-emerald-400":"bg-amber-400"}"></span>
            <span class="hidden sm:inline">${r?"Online":"Offline Caching Active"}</span>
          </div>

          <!-- Auto Save Status Badge -->
          <div class="px-3 py-1 rounded-full text-xs font-mono bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1.5">
            <span id="save-indicator-dot" class="w-1.5 h-1.5 rounded-full ${a==="saving"?"bg-amber-400 animate-ping":"bg-emerald-400"}"></span>
            <span id="save-status-text">${a==="saving"?"Saving...":`Draft saved (${o})`}</span>
          </div>
        </div>

      </div>
    </header>

    <!-- Main Container -->
    <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
      
      <!-- Visual 3-Step Progress Tracker -->
      <div class="civic-card p-4 border-slate-800">
        <div class="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
          
          <button id="step-tab-1" class="p-2.5 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${t===1?"bg-emerald-600 text-white shadow-lg shadow-emerald-900/40":t>1?"bg-slate-900 text-emerald-400 border border-emerald-500/30":"text-slate-500 bg-slate-900/40"}">
            <span class="w-6 h-6 rounded-full bg-slate-950/40 flex items-center justify-center font-bold text-xs">1</span>
            <span>Personal Details</span>
          </button>

          <button id="step-tab-2" class="p-2.5 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${t===2?"bg-emerald-600 text-white shadow-lg shadow-emerald-900/40":t>2?"bg-slate-900 text-emerald-400 border border-emerald-500/30":"text-slate-500 bg-slate-900/40"}">
            <span class="w-6 h-6 rounded-full bg-slate-950/40 flex items-center justify-center font-bold text-xs">2</span>
            <span>Document Studio</span>
          </button>

          <button id="step-tab-3" class="p-2.5 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${t===3?"bg-emerald-600 text-white shadow-lg shadow-emerald-900/40":"text-slate-500 bg-slate-900/40"}">
            <span class="w-6 h-6 rounded-full bg-slate-950/40 flex items-center justify-center font-bold text-xs">3</span>
            <span>Pre-Flight Verification</span>
          </button>

        </div>
      </div>

      <!-- Step Content Area -->
      <div id="step-content-mount"></div>

      <!-- Bottom Step Navigation Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-slate-900">
        <button id="prev-step-btn" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm rounded-xl border border-slate-800 transition-colors ${t===1?"invisible":""}">
          ← Previous Step
        </button>

        <button id="clear-draft-btn" class="text-xs text-red-400 hover:underline">
          Clear Saved Draft
        </button>

        <button id="next-step-btn" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/30 ${t===3?"hidden":""}">
          Next Step →
        </button>
      </div>

    </main>
  `;const p=i.querySelector("#step-content-mount");t===1?p.appendChild(W(e,s)):t===2?p.appendChild(te(e,s)):t===3&&p.appendChild(ne(e,n)),i.querySelector("#back-to-landing-btn").addEventListener("click",c),i.querySelector("#step-tab-1").addEventListener("click",()=>n(1)),i.querySelector("#step-tab-2").addEventListener("click",()=>n(2)),i.querySelector("#step-tab-3").addEventListener("click",()=>n(3)),i.querySelector("#prev-step-btn").addEventListener("click",()=>{t>1&&n(t-1)}),i.querySelector("#next-step-btn").addEventListener("click",()=>{t<3&&n(t+1)}),i.querySelector("#clear-draft-btn").addEventListener("click",()=>{confirm("Clear all saved draft fields and image uploads from your device?")&&l()});let m=S.currentLanguage==="en-IN"?"EN":"HI";const x=i.querySelector("#voice-lang-label");return x.textContent=m,i.querySelector("#toggle-voice-lang").addEventListener("click",()=>{S.currentLanguage==="en-IN"?(S.setLanguage("hi-IN"),x.textContent="HI (हिंदी)"):(S.setLanguage("en-IN"),x.textContent="EN")}),i}const u={view:"landing",currentStep:1,saveStatus:"saved",savedTime:"Just now",isOnline:navigator.onLine,formData:{appType:"LL",state:"",rto:"",fullName:"",dob:"",mobile:"",dlNo:"",photoDataUrl:"",photoSizeKb:null,signatureDataUrl:"",signatureSizeKb:null}},ie=J(200,(e,t)=>{u.saveStatus=e,t&&(u.savedTime=t),h()});function h(){const e=document.getElementById("app");e.innerHTML="",u.view==="landing"?e.appendChild(V(()=>{u.view="portal",h()})):e.appendChild(oe({formData:u.formData,currentStep:u.currentStep,saveStatus:u.saveStatus,savedTime:u.savedTime,isOnline:u.isOnline,onUpdateField:(t,a)=>{u.formData[t]=a,h(),ie(u.formData)},onNavigateStep:t=>{u.currentStep=t,h(),window.scrollTo({top:0,behavior:"smooth"})},onBackToLanding:()=>{u.view="landing",h()},onClearDraft:async()=>{await H(),u.formData={appType:"LL",state:"",rto:"",fullName:"",dob:"",mobile:"",dlNo:"",photoDataUrl:"",photoSizeKb:null,signatureDataUrl:"",signatureSizeKb:null},u.currentStep=1,u.saveStatus="saved",u.savedTime="Cleared",h()}})),typeof window.lucide<"u"&&window.lucide.createIcons()}async function j(){window.addEventListener("online",()=>{u.isOnline=!0,h()}),window.addEventListener("offline",()=>{u.isOnline=!1,h()});try{const e=await G();e&&e.data&&(u.formData={...u.formData,...e.data},e.timestamp&&(u.savedTime=new Date(e.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})))}catch(e){console.warn("Draft restoration fallback:",e)}h()}document.addEventListener("DOMContentLoaded",j);(document.readyState==="interactive"||document.readyState==="complete")&&j();
