/* ============ LOGIN GATE ============ */
let loginMode = 'signin';

function setLoginTab(mode){
  loginMode = mode;
  document.getElementById('tabSignin').classList.toggle('active', mode==='signin');
  document.getElementById('tabSignup').classList.toggle('active', mode==='signup');
  document.getElementById('nameRow').style.display = mode==='signup' ? 'block' : 'none';
  document.getElementById('rememberRow').style.display = mode==='signup' ? 'none' : 'flex';
  document.getElementById('loginSubText').textContent = mode==='signup'
    ? 'Set up your account in a few seconds'
    : 'Welcome back — sign in to continue';
  document.getElementById('loginSubmitBtn').textContent = mode==='signup' ? 'Create account →' : 'Sign in →';
  document.getElementById('loginName').required = mode==='signup';
}

function toggleLoginPassword(){
  const field = document.getElementById('loginPassword');
  const icon = document.getElementById('pwEyeIcon');
  if(field.type === 'password'){
    field.type = 'text';
    icon.innerHTML = '<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.4 19.4 0 0 1 4.22-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a19.5 19.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/>';
  } else {
    field.type = 'password';
    icon.innerHTML = '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>';
  }
}

document.getElementById('loginForm').addEventListener('submit', function(e){
  e.preventDefault();
  const btn = document.getElementById('loginSubmitBtn');
  const original = btn.textContent;
  btn.textContent = loginMode === 'signup' ? 'Creating account…' : 'Signing in…';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('appContent').style.display = 'block';
    btn.textContent = original;
    btn.disabled = false;
    window.scrollTo({top:0});
  }, 700);
});

function logout(){
  document.getElementById('appContent').style.display = 'none';
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('loginForm').reset();
  setLoginTab('signin');
}

/* ============ THEME TOGGLE ============ */
function toggleTheme(){
  const root = document.documentElement;
  const isDark = root.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  const btn = document.getElementById('themeToggle');
  btn.setAttribute('aria-pressed', String(!isDark));
  btn.setAttribute('aria-label', isDark ? 'Switch to dark mode' : 'Switch to light mode');
}

/* ============ DATA ============ */
const ORGANS = {
  heart: {
    label: 'Heart', color: '#BE5148', light: '#F7E8E6',
    symptoms: [
      {id:'chest_pain', label:'Chest pain or pressure'},
      {id:'shortness_breath', label:'Shortness of breath'},
      {id:'palpitations', label:'Racing or irregular heartbeat'},
      {id:'fatigue', label:'Unusual fatigue'},
      {id:'dizziness', label:'Dizziness or lightheadedness'},
      {id:'swelling', label:'Swelling in legs or ankles'},
      {id:'cold_sweat', label:'Cold sweat'},
      {id:'jaw_arm_pain', label:'Pain in jaw, neck, or arm'}
    ],
    conditions: [
      {name:'Possible Angina', max:6, weights:{chest_pain:3,shortness_breath:2,fatigue:1}, rec:'Discomfort tied to exertion is worth having a cardiologist evaluate, even if it passes quickly.'},
      {name:'Possible Arrhythmia', max:6, weights:{palpitations:3,dizziness:2,fatigue:1}, rec:'An irregular heartbeat is often manageable, but an ECG can confirm what type it is.'},
      {name:'Early Heart-Failure Pattern', max:7, weights:{swelling:3,shortness_breath:2,fatigue:2}, rec:'Fluid buildup and breathlessness together are worth a cardiology check, especially if swelling is new.'},
      {name:'Cardiac Emergency Pattern', urgent:true, max:10, weights:{chest_pain:2,cold_sweat:3,jaw_arm_pain:3,shortness_breath:2}, rec:'This combination can indicate a heart attack. Seek emergency care immediately — do not wait.'}
    ]
  },
  lungs: {
    label: 'Lungs', color:'#3E7EA8', light:'#E6EFF5',
    symptoms: [
      {id:'dry_cough', label:'Dry cough'},
      {id:'wet_cough', label:'Cough with mucus'},
      {id:'wheezing', label:'Wheezing'},
      {id:'sob', label:'Shortness of breath'},
      {id:'chest_tight', label:'Chest tightness'},
      {id:'fever', label:'Fever'},
      {id:'fatigue2', label:'Fatigue'},
      {id:'rapid_breath', label:'Rapid or shallow breathing'}
    ],
    conditions: [
      {name:'Possible Asthma Flare', max:8, weights:{wheezing:3,chest_tight:2,sob:2,dry_cough:1}, rec:'If wheezing comes with tightness, a rescue inhaler and a follow-up with your doctor are worth arranging.'},
      {name:'Possible Bronchitis', max:6, weights:{wet_cough:3,fatigue2:1,fever:1,dry_cough:1}, rec:'Rest and fluids often help, but a lingering cough with mucus is worth a check if it passes two weeks.'},
      {name:'Possible Pneumonia', urgent:true, max:9, weights:{fever:3,wet_cough:2,rapid_breath:3,fatigue2:1}, rec:'Fever with rapid breathing and a productive cough should be assessed promptly — this combination can escalate quickly.'},
      {name:'Possible COPD Flare-up', max:7, weights:{sob:3,wheezing:2,fatigue2:1,chest_tight:1}, rec:'Increased breathlessness with wheeze is worth discussing with a pulmonologist, especially with a smoking history.'}
    ]
  },
  brain: {
    label: 'Brain', color:'#7C63A6', light:'#EEE9F5',
    symptoms: [
      {id:'headache', label:'Headache'},
      {id:'sudden_headache', label:'Sudden, severe headache'},
      {id:'dizziness2', label:'Dizziness or vertigo'},
      {id:'memory', label:'Memory lapses'},
      {id:'blurred', label:'Blurred vision'},
      {id:'numbness', label:'Numbness or tingling'},
      {id:'speech', label:'Difficulty speaking'},
      {id:'light_sens', label:'Sensitivity to light'}
    ],
    conditions: [
      {name:'Possible Migraine', max:7, weights:{headache:3,light_sens:2,blurred:1,dizziness2:1}, rec:'Migraines often respond to rest in a dark room — but frequent episodes are worth discussing with a neurologist.'},
      {name:'Possible Tension Headache', max:5, weights:{headache:3,fatigue2:0,memory:1}, rec:'Usually linked to stress or posture — hydration, rest, and stretching often help.'},
      {name:'Possible Vertigo / Inner-Ear Issue', max:6, weights:{dizziness2:3,blurred:1,headache:1}, rec:'Spinning dizziness without other neuro symptoms often points to the inner ear — an ENT check can confirm.'},
      {name:'Stroke Warning Pattern', urgent:true, max:10, weights:{sudden_headache:3,speech:3,numbness:3,blurred:1}, rec:'Sudden severe headache with numbness or speech trouble needs emergency care immediately — every minute matters.'}
    ]
  }
};

const RECS_INTRO = {
  low: "Nothing here strongly matches a specific pattern — that's a good sign, but keep an eye on things.",
  mid: "A few patterns stood out. None are urgent on their own, but a check-up would give you clarity.",
  high: "One or more patterns here are significant. Please read the recommendation for each closely."
};

/* ============ CHECKER STATE ============ */
let currentOrgan = null;
let currentStep = 1;
let selectedSymptoms = new Set();
let followUp = { duration:'1-3 days', severity:3, age:'' };

function openChecker(organKey){
  currentOrgan = organKey;
  currentStep = 1;
  selectedSymptoms = new Set();
  followUp = { duration:'1-3 days', severity:3, age:'' };
  document.getElementById('modalOverlay').classList.add('open');
  const organ = ORGANS[organKey];
  const tag = document.getElementById('modalTag');
  tag.textContent = organ.label + ' check';
  tag.style.background = organ.light;
  tag.style.color = organ.color;
  renderStep();
}
function closeChecker(){
  document.getElementById('modalOverlay').classList.remove('open');
}
function renderStep(){
  const organ = ORGANS[currentOrgan];
  const content = document.getElementById('modalContent');
  document.getElementById('progressFill').style.width = (currentStep/3*100)+'%';

  if(currentStep === 1){
    content.innerHTML = `
      <h3>What are you noticing?</h3>
      <p class="step-sub">Select every symptom that applies — you can pick more than one.</p>
      <div class="symptom-grid" id="symptomGrid">
        ${organ.symptoms.map(s => `<button class="chip ${selectedSymptoms.has(s.id)?'selected':''}" data-id="${s.id}" onclick="toggleSymptom('${s.id}')">${s.label}</button>`).join('')}
      </div>
      <div class="modal-nav">
        <span></span>
        <button class="btn btn-primary" onclick="goStep(2)">Continue →</button>
      </div>`;
  } else if(currentStep === 2){
    content.innerHTML = `
      <h3>A couple more details</h3>
      <p class="step-sub">This helps sharpen the read — nothing here is stored or shared.</p>
      <div class="field-row">
        <label for="ageInput">Age (optional)</label>
        <input type="number" id="ageInput" placeholder="e.g. 34" value="${followUp.age}" min="0" max="120">
      </div>
      <div class="field-row">
        <label for="durationSelect">How long has this been going on?</label>
        <select id="durationSelect">
          <option ${followUp.duration==='Under a day'?'selected':''}>Under a day</option>
          <option ${followUp.duration==='1-3 days'?'selected':''}>1-3 days</option>
          <option ${followUp.duration==='About a week'?'selected':''}>About a week</option>
          <option ${followUp.duration==='2+ weeks'?'selected':''}>2+ weeks</option>
        </select>
      </div>
      <div class="field-row">
        <label>How severe does it feel? <span class="range-val" id="sevVal">${followUp.severity}</span></label>
        <div class="range-row">
          <input type="range" min="1" max="5" value="${followUp.severity}" id="sevRange" oninput="document.getElementById('sevVal').textContent=this.value">
        </div>
      </div>
      <div class="modal-nav">
        <button class="btn btn-ghost" onclick="goStep(1)">← Back</button>
        <button class="btn btn-primary" onclick="submitStep2()">See results →</button>
      </div>`;
  } else if(currentStep === 3){
    renderResults(content);
  }
}
function toggleSymptom(id){
  if(selectedSymptoms.has(id)) selectedSymptoms.delete(id); else selectedSymptoms.add(id);
  renderStep();
}
function goStep(n){ currentStep = n; renderStep(); }
function submitStep2(){
  followUp.age = document.getElementById('ageInput').value;
  followUp.duration = document.getElementById('durationSelect').value;
  followUp.severity = parseInt(document.getElementById('sevRange').value);
  goStep(3);
}

function computeResults(){
  const organ = ORGANS[currentOrgan];
  const severityBoost = 1 + (followUp.severity - 3) * 0.06;
  const scored = organ.conditions.map(c => {
    let raw = 0;
    Object.keys(c.weights).forEach(sym => { if(selectedSymptoms.has(sym)) raw += c.weights[sym]; });
    let pct = Math.min(100, Math.round((raw / c.max) * 100 * severityBoost));
    return {...c, pct};
  }).filter(c => c.pct > 0).sort((a,b) => b.pct - a.pct).slice(0,3);
  return scored;
}

function renderResults(content){
  const organ = ORGANS[currentOrgan];
  const results = computeResults();
  const urgent = results.find(r => r.urgent && r.pct >= 45);
  const topPct = results.length ? results[0].pct : 0;
  const introKey = topPct >= 65 ? 'high' : topPct >= 35 ? 'mid' : 'low';

  let html = `<h3>Your ${organ.label.toLowerCase()} check results</h3>
    <p class="step-sub">${RECS_INTRO[introKey]}</p>`;

  if(urgent){
    html += `<div class="urgent-banner">⚠️ <span><strong>${urgent.name}</strong> — ${urgent.rec}</span></div>`;
  }

  if(results.length === 0){
    html += `<div class="result-card"><p>No strong pattern matched your selected symptoms. If something still feels off, trust that instinct and check in with a doctor.</p></div>`;
  } else {
    results.forEach(r => {
      html += `
        <div class="result-card">
          <div class="result-top"><h4>${r.name}</h4><span class="result-pct">${r.pct}% match</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${r.pct}%; background:${r.urgent ? '#BE5148' : organ.color}"></div></div>
          <p>${r.rec}</p>
        </div>`;
    });
  }

  html += `<div class="disclaimer-box">This is a rule-based educational estimate, not a medical diagnosis. Please consult a licensed healthcare professional for anything concerning.</div>`;

  if(currentOrgan === 'brain' && !urgent){
    html += `<a class="result-subcta" href="#brain-game" onclick="closeChecker()">Try a quick memory game while you decide →</a>`;
  }

  html += `<a class="result-subcta care-subcta" href="#find-care" onclick="closeChecker(); presetCareCategory(${urgent ? "'healthcare.hospital'" : "'healthcare'"});">Find ${urgent ? 'a hospital or urgent care' : 'a doctor or clinic'} near you →</a>`;

  html += `<div class="modal-nav">
      <button class="btn btn-ghost" onclick="goStep(2)">← Back</button>
      <button class="btn btn-primary" onclick="closeChecker()">Done</button>
    </div>`;
  content.innerHTML = html;
}

/* ============ CONFIG & ENVIRONMENT SETUP ============ */
// API keys are NOT hardcoded in this script. They are read dynamically from .env
const APP_CONFIG = {
  geminiKey: '',
  geoapifyKey: '',
  hasBackend: false,
  loaded: false
};

async function initEnvConfig(){
  if(APP_CONFIG.loaded) return;

  // 1. Check if backend proxy server is running (e.g., node server.js / npm start)
  try {
    const res = await fetch('/api/config');
    if(res.ok){
      const data = await res.json();
      APP_CONFIG.hasBackend = true;
      APP_CONFIG.loaded = true;
      console.log('[Vitals] Connected to secure backend server. API keys are safely managed server-side.');
      return;
    }
  } catch(e){}

  // 2. Fallback: If opened on static server (e.g. VS Code Live Server), read .env directly
  try {
    const res = await fetch('.env');
    if(res.ok){
      const text = await res.text();
      text.split(/\r?\n/).forEach(line => {
        line = line.trim();
        if(!line || line.startsWith('#')) return;
        const eqIdx = line.indexOf('=');
        if(eqIdx === -1) return;
        const rawKey = line.slice(0, eqIdx).trim().toUpperCase();
        let val = line.slice(eqIdx + 1).trim();
        if((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))){
          val = val.slice(1, -1);
        }
        if(rawKey === 'GEMINI_API_KEY' || rawKey === 'GEMINI'){
          APP_CONFIG.geminiKey = val;
        } else if(rawKey === 'GEOAPIFY_API_KEY' || rawKey === 'GEOAPIFY'){
          APP_CONFIG.geoapifyKey = val;
        }
      });
      APP_CONFIG.loaded = true;
      console.log('[Vitals] Loaded API configuration from .env file.');
      return;
    }
  } catch(e){}

  APP_CONFIG.loaded = true;
}

// Initialize config on startup
initEnvConfig();

/* ============ GEMINI CHATBOT (open-ended fallback) ============ */
const GEMINI_MODEL = 'gemini-3.5-flash-lite';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const GEMINI_SYSTEM_PROMPT = `You are the Vitals Assistant, a friendly guide inside an educational symptom-checker demo covering heart, lungs, and brain.

For any everyday, non-urgent symptom the user describes (fever, cough, cold, sore throat, mild headache, body ache, mild stomach upset, etc.), you MUST answer helpfully using this structure — do NOT refuse, do NOT reply with only an apology or disclaimer, do NOT say things like "I'm sorry, I can't help with that":
1. Likely common cause(s) — phrased as possibilities ("this is often caused by...", "commonly linked to..."), never a firm diagnosis.
2. Self-care tips — rest, hydration, humidified/warm air, honey/warm fluids for a cough, monitoring temperature, gargling salt water for sore throat, etc. You may say "an over-the-counter fever/pain reliever, taken as directed on the label" but never name a specific medication, brand, or dosage.
3. When to see a doctor — a short, concrete trigger (e.g. "if it lasts more than 3 days, gets worse, or you develop [specific red flag]").

Other rules:
- You are NOT a doctor and must never state or imply a certain diagnosis — but giving general possibilities and self-care info (as above) is expected and required, not something to avoid.
- Keep replies short: 3-5 sentences total, plain language, warm but not saccharine.
- If the symptoms relate to the heart, lungs, or brain specifically, briefly mention that checker on this page as an optional next step.
- If something sounds urgent (chest pain, stroke signs, trouble breathing, high fever with stiff neck or confusion, severe sudden symptoms), skip the 3-step structure and instead clearly tell them to seek emergency care now, mentioning the "Find care" section can help locate a hospital.
- If asked something unrelated to health or this site, answer briefly and steer the conversation back.`;

async function askGemini(userText, retries = 2){
  if(!APP_CONFIG.loaded) await initEnvConfig();

  // Mode 1: Secure backend proxy (Key is never sent to the browser)
  if(APP_CONFIG.hasBackend){
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });
    if(!res.ok){
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gemini server request failed: ' + res.status);
    }
    const data = await res.json();
    return data.reply;
  }

  // Mode 2: Client-side with key loaded from .env
  const apiKey = APP_CONFIG.geminiKey;
  if(!apiKey){
    throw new Error('Gemini API key is not configured in .env file.');
  }

  const body = {
    contents: [{ role: 'user', parts: [{ text: userText }] }],
    systemInstruction: { role: 'system', parts: [{ text: GEMINI_SYSTEM_PROMPT }] },
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.6
    }
  };

  for(let attempt = 0; attempt <= retries; attempt++){
    const res = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify(body)
    });

    if(res.ok){
      const data = await res.json();
      const text = data && data.candidates && data.candidates[0] &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
      return text ? text.trim() : null;
    }

    if(res.status === 503 && attempt < retries){
      await new Promise(r => setTimeout(r, 1200 * (attempt + 1)));
      continue;
    }

    const errBody = await res.text();
    console.error('Gemini API error', res.status, errBody);
    throw new Error('Gemini request failed: ' + res.status);
  }
}

function addTypingIndicator(){
  const wrap = document.createElement('div');
  wrap.className = 'msg bot typing';
  wrap.id = 'typingIndicator';
  wrap.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
  chatBody.appendChild(wrap);
  chatBody.scrollTop = chatBody.scrollHeight;
}
function removeTypingIndicator(){
  const el = document.getElementById('typingIndicator');
  if(el) el.remove();
}

/* ============ CHATBOT ============ */
const chatBody = document.getElementById('chatBody');
let chatOpened = false;

function toggleChat(){
  const panel = document.getElementById('chatPanel');
  panel.classList.toggle('open');
  if(!chatOpened && panel.classList.contains('open')){
    chatOpened = true;
    addBotMessage("Hi, I'm the Vitals assistant. I can help you find the right symptom check or answer quick questions about how this works.", [
      {label:'Heart symptoms', action:()=>{openChecker('heart'); toggleChat();}},
      {label:'Lung symptoms', action:()=>{openChecker('lungs'); toggleChat();}},
      {label:'Brain symptoms', action:()=>{openChecker('brain'); toggleChat();}},
      {label:'Is this a real diagnosis?', action:()=>handleQuick('diagnosis')}
    ]);
  }
}
function addBotMessage(text, quickReplies){
  const wrap = document.createElement('div');
  wrap.className = 'msg bot';
  wrap.textContent = text;
  chatBody.appendChild(wrap);
  if(quickReplies && quickReplies.length){
    const qwrap = document.createElement('div');
    qwrap.className = 'chat-quick';
    quickReplies.forEach(q => {
      const b = document.createElement('button');
      b.textContent = q.label;
      b.onclick = q.action;
      qwrap.appendChild(b);
    });
    chatBody.appendChild(qwrap);
  }
  chatBody.scrollTop = chatBody.scrollHeight;
}
function addUserMessage(text){
  const wrap = document.createElement('div');
  wrap.className = 'msg user';
  wrap.textContent = text;
  chatBody.appendChild(wrap);
  chatBody.scrollTop = chatBody.scrollHeight;
}
function handleQuick(topic){
  if(topic === 'diagnosis'){
    addUserMessage('Is this a real diagnosis?');
    addBotMessage("No — this gives you an early, educational read based on the symptoms you select. It's meant to help you decide whether it's worth seeing a doctor, not to replace one.");
  }
}
function sendChat(){
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if(!text) return;
  addUserMessage(text);
  input.value = '';
  setTimeout(() => routeChat(text.toLowerCase(), text), 350);
}
async function routeChat(text, originalText){
  // Only exact, unambiguous commands bypass Gemini — everything else gets answered by AI
  if(text === 'open heart check' || text === 'heart check'){
    addBotMessage("I'll open the heart symptom check for you.", [{label:'Open heart check', action:()=>{openChecker('heart'); toggleChat();}}]);
    return;
  }
  if(text === 'open lung check' || text === 'lung check'){
    addBotMessage("Let's check your lungs.", [{label:'Open lung check', action:()=>{openChecker('lungs'); toggleChat();}}]);
    return;
  }
  if(text === 'open brain check' || text === 'brain check'){
    addBotMessage("I'll open the brain symptom check for you.", [{label:'Open brain check', action:()=>{openChecker('brain'); toggleChat();}}]);
    return;
  }
  if(text === 'memory game' || text === 'memory match' || text === 'card game'){
    addBotMessage("The memory match game is a light way to check in with your recall while you wait.", [{label:'Open memory game', action:()=>{document.getElementById('brain-game').scrollIntoView({behavior:'smooth'}); toggleChat();}}]);
    return;
  }

  // Everything else — symptom descriptions, general questions, follow-ups — goes to Gemini
  await routeToGemini(originalText);
}

async function routeToGemini(originalText){
  if(!APP_CONFIG.loaded) await initEnvConfig();
  const hasKey = APP_CONFIG.hasBackend || Boolean(APP_CONFIG.geminiKey);

  if(!hasKey){
    addBotMessage("Please configure your Gemini API key in the .env file (GEMINI_API_KEY=...) to enable AI chat responses. In the meantime, I can still guide you to the symptom checks:", [
      {label:'Heart', action:()=>{openChecker('heart'); toggleChat();}},
      {label:'Lungs', action:()=>{openChecker('lungs'); toggleChat();}},
      {label:'Brain', action:()=>{openChecker('brain'); toggleChat();}}
    ]);
    return;
  }

  addTypingIndicator();
  try{
    const reply = await askGemini(originalText);
    removeTypingIndicator();
    if(reply){
      addBotMessage(reply);
    } else {
      addBotMessage("I couldn't quite put together an answer for that. Want to try one of the symptom checks instead?");
    }
  } catch(err){
    removeTypingIndicator();
    addBotMessage("I'm having trouble reaching the AI assistant right now. You can check your .env key or use the symptom checks below:", [
      {label:'Heart', action:()=>{openChecker('heart'); toggleChat();}},
      {label:'Lungs', action:()=>{openChecker('lungs'); toggleChat();}},
      {label:'Brain', action:()=>{openChecker('brain'); toggleChat();}}
    ]);
  }
}

/* ============ BREATHING GAME ============ */
let breathing = false;
let breathTimer = null;
let cycles = 0;
const phases = [
  {name:'Breathe in', duration:4000, scale:1.6},
  {name:'Hold', duration:4000, scale:1.6},
  {name:'Breathe out', duration:4000, scale:1},
  {name:'Hold', duration:4000, scale:1}
];
let phaseIndex = 0;

function toggleBreathing(){
  breathing = !breathing;
  const btn = document.getElementById('breathToggle');
  if(breathing){
    btn.textContent = 'Stop';
    phaseIndex = 0;
    runPhase();
  } else {
    btn.textContent = 'Start breathing exercise';
    clearTimeout(breathTimer);
    document.getElementById('breathCircle').style.transform = 'scale(1)';
    document.getElementById('breathCircle').textContent = 'Start';
    document.getElementById('breathPhaseLabel').textContent = 'Press start when ready';
  }
}
function runPhase(){
  if(!breathing) return;
  const p = phases[phaseIndex];
  document.getElementById('breathPhaseLabel').textContent = p.name + '…';
  document.getElementById('breathCircle').textContent = p.name;
  document.getElementById('breathCircle').style.transform = 'scale(' + p.scale + ')';
  breathTimer = setTimeout(() => {
    phaseIndex = (phaseIndex + 1) % phases.length;
    if(phaseIndex === 0){
      cycles++;
      document.getElementById('cycleCount').textContent = cycles;
    }
    runPhase();
  }, p.duration);
}

/* ============ BRAIN MEMORY MATCH GAME ============ */
const MEMORY_ICONS = ['🧠','⚡','💭','🔬','🩺','💊','👁️','🦴'];

let memoryState = {
  cards: [],
  flipped: [],
  matched: new Set(),
  moves: 0,
  lock: false,
  startTime: null,
  bestTime: null
};

function shuffle(arr){
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildMemoryDeck(){
  const pairs = shuffle([...MEMORY_ICONS, ...MEMORY_ICONS]);
  return pairs.map((icon, idx) => ({ id: idx, icon }));
}

function startMemoryGame(){
  memoryState = {
    cards: buildMemoryDeck(),
    flipped: [],
    matched: new Set(),
    moves: 0,
    lock: false,
    startTime: Date.now(),
    bestTime: memoryState.bestTime
  };
  document.getElementById('memMoves').textContent = '0';
  document.getElementById('memMatches').textContent = '0 / 8';
  document.getElementById('memoryMsg').textContent = 'Flip two cards to find a match.';
  renderMemoryGrid();
}

function renderMemoryGrid(){
  const grid = document.getElementById('memoryGrid');
  if(!grid) return;
  grid.innerHTML = memoryState.cards.map(c => {
    const isFlipped = memoryState.flipped.includes(c.id);
    const isMatched = memoryState.matched.has(c.id);
    return `
      <div class="mem-card ${isMatched ? 'matched' : ''} ${isFlipped ? 'flipped' : ''}" data-id="${c.id}" onclick="flipMemoryCard(${c.id})" role="button" aria-label="Memory card">
        <div class="mem-card-inner">
          <div class="mem-face mem-face-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 4a5 5 0 0 0-4 8 5 5 0 0 0 4 8h6a5 5 0 0 0 4-8 5 5 0 0 0-4-8 4 4 0 0 0-6 0z"/></svg></div>
          <div class="mem-face mem-face-front">${c.icon}</div>
        </div>
      </div>`;
  }).join('');
}

function flipMemoryCard(id){
  if(memoryState.lock) return;
  if(memoryState.flipped.includes(id) || memoryState.matched.has(id)) return;
  if(memoryState.flipped.length === 2) return;

  memoryState.flipped.push(id);
  renderMemoryGrid();

  if(memoryState.flipped.length === 2){
    memoryState.moves++;
    document.getElementById('memMoves').textContent = memoryState.moves;

    const [a, b] = memoryState.flipped;
    const cardA = memoryState.cards.find(c => c.id === a);
    const cardB = memoryState.cards.find(c => c.id === b);

    if(cardA.icon === cardB.icon){
      memoryState.matched.add(a);
      memoryState.matched.add(b);
      memoryState.flipped = [];
      document.getElementById('memMatches').textContent = `${memoryState.matched.size / 2} / 8`;
      renderMemoryGrid();

      if(memoryState.matched.size === memoryState.cards.length){
        const elapsed = Math.round((Date.now() - memoryState.startTime) / 1000);
        if(!memoryState.bestTime || elapsed < memoryState.bestTime){
          memoryState.bestTime = elapsed;
          document.getElementById('memBest').textContent = elapsed + 's';
        }
        document.getElementById('memoryMsg').textContent = `All pairs found in ${memoryState.moves} moves and ${elapsed}s. Nice recall.`;
      }
    } else {
      memoryState.lock = true;
      document.getElementById('memoryMsg').textContent = 'Not a match — try again.';
      setTimeout(() => {
        memoryState.flipped = [];
        memoryState.lock = false;
        if(memoryState.matched.size < memoryState.cards.length){
          document.getElementById('memoryMsg').textContent = 'Flip two cards to find a match.';
        }
        renderMemoryGrid();
      }, 800);
    }
  }
}

startMemoryGame();

/* ============ LAB REPORT READER ============ */
const LAB_MARKERS = [
  { key:'hemoglobin', label:'Hemoglobin', unit:'g/dL', range:[12.0,17.0],
    patterns:[/h[ae]moglobin/i, /\bhgb\b/i],
    info:'Hemoglobin carries oxygen in red blood cells. Values outside the typical range are often tied to blood cell production, hydration, or iron and vitamin status.' },
  { key:'wbc', label:'White Blood Cells (WBC)', unit:'x10³/µL', range:[4.0,11.0],
    patterns:[/white blood cells?/i, /\bwbc\b/i],
    info:'White blood cell count reflects immune system activity. It shifts with infections, inflammation, stress, and some medications.' },
  { key:'platelets', label:'Platelets', unit:'x10³/µL', range:[150,450],
    patterns:[/platelets?/i, /\bplt\b/i],
    info:'Platelets are involved in blood clotting. Levels can be affected by bone marrow activity, medications, or ongoing inflammation.' },
  { key:'glucose', label:'Glucose (Fasting)', unit:'mg/dL', range:[70,99],
    patterns:[/fasting glucose/i, /\bglucose\b/i, /\bblood sugar\b/i],
    info:'Fasting glucose reflects blood sugar regulation. It is influenced by diet, activity, stress, and how the body manages insulin.' },
  { key:'hba1c', label:'HbA1c', unit:'%', range:[4.0,5.6],
    patterns:[/hba1c/i, /\ba1c\b/i, /glycated h[ae]moglobin/i],
    info:'HbA1c reflects average blood sugar over roughly the past three months rather than a single moment.' },
  { key:'totalChol', label:'Total Cholesterol', unit:'mg/dL', range:[0,199],
    patterns:[/total cholesterol/i],
    info:'Total cholesterol is a broad measure that combines several types of fats in the blood, influenced by diet, genetics, and activity level.' },
  { key:'ldl', label:'LDL Cholesterol', unit:'mg/dL', range:[0,99],
    patterns:[/\bldl\b/i],
    info:'LDL is often described informally as "bad" cholesterol; it relates to how fats are transported and deposited in blood vessels over time.' },
  { key:'hdl', label:'HDL Cholesterol', unit:'mg/dL', range:[40,90],
    patterns:[/\bhdl\b/i],
    info:'HDL is often described informally as "good" cholesterol and relates to how excess fats are cleared from the bloodstream.' },
  { key:'triglycerides', label:'Triglycerides', unit:'mg/dL', range:[0,149],
    patterns:[/triglycerides?/i],
    info:'Triglycerides are a type of fat in the blood, closely tied to diet, body weight, and activity level.' },
  { key:'creatinine', label:'Creatinine', unit:'mg/dL', range:[0.6,1.3],
    patterns:[/creatinine/i],
    info:'Creatinine is a waste product filtered by the kidneys, so it is commonly used as a rough marker of kidney filtering function.' },
  { key:'alt', label:'ALT', unit:'U/L', range:[7,56],
    patterns:[/\balt\b/i, /alanine aminotransferase/i],
    info:'ALT is an enzyme found mainly in the liver. Elevated levels can relate to liver stress from many different, unrelated causes.' },
  { key:'ast', label:'AST', unit:'U/L', range:[10,40],
    patterns:[/\bast\b/i, /aspartate aminotransferase/i],
    info:'AST is an enzyme found in the liver and other tissues, and is often looked at alongside ALT.' },
  { key:'tsh', label:'TSH', unit:'µIU/mL', range:[0.4,4.0],
    patterns:[/\btsh\b/i, /thyroid stimulating hormone/i],
    info:'TSH signals the thyroid gland to produce hormones, so it is a common starting point for looking at thyroid activity.' },
  { key:'vitaminD', label:'Vitamin D', unit:'ng/mL', range:[30,100],
    patterns:[/vitamin d/i, /25-?oh vitamin d/i],
    info:'Vitamin D supports bone health and immune function, and levels are affected by sun exposure, diet, and supplementation.' },
  { key:'vitaminB12', label:'Vitamin B12', unit:'pg/mL', range:[200,900],
    patterns:[/vitamin b-?12/i, /\bb12\b/i],
    info:'Vitamin B12 supports nerve function and red blood cell formation, and levels relate closely to diet and absorption.' },
  { key:'sodium', label:'Sodium', unit:'mmol/L', range:[135,145],
    patterns:[/\bsodium\b/i, /\bna\b(?=[^a-z])/i],
    info:'Sodium is an electrolyte tied closely to fluid balance and hydration.' },
  { key:'potassium', label:'Potassium', unit:'mmol/L', range:[3.5,5.1],
    patterns:[/\bpotassium\b/i, /\bk\+?\b/i],
    info:'Potassium is an electrolyte important for muscle and heart function, and it is sensitive to hydration, diet, and some medications.' }
];

let labImageDataURL = null;

function initLabUpload(){
  const dropZone = document.getElementById('labUpload');
  if(!dropZone) return;
  ['dragover'].forEach(evt => dropZone.addEventListener(evt, e => {
    e.preventDefault();
    dropZone.classList.add('dragging');
  }));
  ['dragleave','drop'].forEach(evt => dropZone.addEventListener(evt, e => {
    e.preventDefault();
    dropZone.classList.remove('dragging');
  }));
  dropZone.addEventListener('drop', e => {
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if(file) processLabFile(file);
  });
}

function handleLabFile(event){
  const file = event.target.files && event.target.files[0];
  if(file) processLabFile(file);
}

function processLabFile(file){
  if(!file.type.startsWith('image/')){
    renderLabError('That file doesn\'t look like an image. Please upload a JPG or PNG of the report.');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    labImageDataURL = reader.result;
    renderLabPreview(file);
    runLabOCR(labImageDataURL);
  };
  reader.readAsDataURL(file);
}

function renderLabPreview(file){
  const uploadInner = document.getElementById('labUploadInner');
  uploadInner.parentElement.innerHTML = `
    <div class="lab-preview">
      <img src="${labImageDataURL}" alt="Uploaded lab report preview">
      <div class="lab-preview-meta">
        <p>${file.name}</p>
        <span>${(file.size / 1024).toFixed(0)} KB · processed on this device</span>
      </div>
      <div class="lab-preview-actions">
        <button class="btn btn-ghost" onclick="resetLabUpload()">Choose a different image</button>
      </div>
    </div>`;
}

function resetLabUpload(){
  labImageDataURL = null;
  const uploadEl = document.getElementById('labUpload');
  uploadEl.innerHTML = `
    <input type="file" id="labFileInput" accept="image/*" onchange="handleLabFile(event)" hidden>
    <div class="lab-upload-inner" id="labUploadInner">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 16V4M12 4l-4 4M12 4l4 4"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
      <p><strong>Upload a photo of your lab report</strong></p>
      <p class="lab-upload-sub">JPG or PNG. Processed entirely in your browser — the image is never uploaded anywhere.</p>
      <button class="btn btn-primary" onclick="document.getElementById('labFileInput').click()">Choose image</button>
    </div>`;
  document.getElementById('labResults').innerHTML = '';
}

function renderLabError(message){
  document.getElementById('labResults').innerHTML = `<div class="lab-empty">${message}</div>`;
}

async function runLabOCR(dataURL){
  const resultsEl = document.getElementById('labResults');
  resultsEl.innerHTML = `
    <div class="lab-status">
      <span class="lab-spinner"></span>
      <span>Reading the report… this stays on your device and can take a few seconds.</span>
    </div>`;

  if(typeof Tesseract === 'undefined'){
    renderLabError('The reader couldn\'t load its text-recognition library. Check your connection and try again.');
    return;
  }

  try{
    const { data } = await Tesseract.recognize(dataURL, 'eng');
    const text = data && data.text ? data.text : '';
    const found = matchLabMarkers(text);
    renderLabResults(found, text);
  } catch(err){
    renderLabError('Something went wrong reading that image. Try a clearer, well-lit photo of the report.');
  }
}

function matchLabMarkers(text){
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const found = [];
  const seen = new Set();

  lines.forEach(line => {
    LAB_MARKERS.forEach(marker => {
      if(seen.has(marker.key)) return;
      const matchesName = marker.patterns.some(p => p.test(line));
      if(!matchesName) return;

      const numMatch = line.match(/(\d+(?:[.,]\d+)?)/g);
      if(!numMatch) return;

      const value = parseFloat(numMatch[0].replace(',', '.'));
      if(isNaN(value)) return;

      seen.add(marker.key);
      const [low, high] = marker.range;
      let status = 'normal';
      if(value < low) status = 'low';
      else if(value > high) status = 'high';

      found.push({ ...marker, value, status });
    });
  });

  return found;
}

function renderLabResults(found, rawText){
  const resultsEl = document.getElementById('labResults');

  if(!found.length){
    resultsEl.innerHTML = `
      <div class="lab-empty">
        We couldn't confidently match any recognized markers in that image. Try a clearer photo — good lighting,
        flat on a surface, and the values in focus — or a different section of the report.
      </div>`;
    return;
  }

  const highCount = found.filter(f => f.status === 'high').length;
  const lowCount = found.filter(f => f.status === 'low').length;
  const normalCount = found.length - highCount - lowCount;

  let html = `
    <div class="lab-summary">
      <span>Markers found<b>${found.length}</b></span>
      <span>Within typical range<b>${normalCount}</b></span>
      <span>Outside typical range<b>${highCount + lowCount}</b></span>
    </div>`;

  found.forEach(m => {
    const badgeLabel = m.status === 'normal' ? 'Typical range' : m.status === 'high' ? 'Above typical range' : 'Below typical range';
    html += `
      <div class="lab-marker-card">
        <div class="lab-marker-top">
          <h4>${m.label}</h4>
          <span class="lab-badge ${m.status}">${badgeLabel}</span>
        </div>
        <div class="lab-marker-value">Read as ${m.value} ${m.unit}</div>
        <p>${m.info}</p>
        <span class="lab-marker-range">Typical adult range: ${m.range[0]}–${m.range[1]} ${m.unit} (ranges vary by lab, age, and sex — use the range printed on your own report as the primary reference)</span>
      </div>`;
  });

  resultsEl.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', initLabUpload);
if(document.readyState === 'complete' || document.readyState === 'interactive'){
  initLabUpload();
}

/* ============ FIND CARE NEAR YOU ============ */
const CARE_RADIUS_METERS = 6000;

let careCategory = 'healthcare.pharmacy';
let careCoords = null;

function setCareCategory(btn, cat){
  careCategory = cat;
  document.querySelectorAll('.care-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if(careCoords) findNearbyCare();
}

function presetCareCategory(cat){
  careCategory = cat;
  document.querySelectorAll('.care-filter').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
  findNearbyCare();
}

function findNearbyCare(){
  const resultsEl = document.getElementById('careResults');
  const btn = document.getElementById('careLocateBtn');

  if(!('geolocation' in navigator)){
    resultsEl.innerHTML = `<div class="care-empty">Your browser doesn't support location lookup. You can still search "${careCategoryLabel()}" near you in your maps app.</div>`;
    return;
  }

  btn.disabled = true;
  resultsEl.innerHTML = `
    <div class="care-status">
      <span class="care-spinner"></span>
      <span>Finding your location…</span>
    </div>`;

  navigator.geolocation.getCurrentPosition(
    pos => {
      careCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      searchCarePlaces();
    },
    err => {
      btn.disabled = false;
      const msg = err.code === err.PERMISSION_DENIED
        ? 'Location access was denied. Please allow location access in your browser and try again.'
        : "Couldn't get your location. Please try again in a moment.";
      resultsEl.innerHTML = `<div class="care-empty">${msg}</div>`;
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  );
}

async function searchCarePlaces(){
  if(!APP_CONFIG.loaded) await initEnvConfig();
  const resultsEl = document.getElementById('careResults');
  const btn = document.getElementById('careLocateBtn');
  resultsEl.innerHTML = `
    <div class="care-status">
      <span class="care-spinner"></span>
      <span>Looking for ${careCategoryLabel().toLowerCase()} nearby…</span>
    </div>`;

  const { lat, lon } = careCoords;

  // Mode 1: Secure backend proxy
  if(APP_CONFIG.hasBackend){
    const url = `/api/places?categories=${encodeURIComponent(careCategory)}&lat=${lat}&lon=${lon}&radius=${CARE_RADIUS_METERS}&limit=20`;
    try{
      const response = await fetch(url);
      if(!response.ok) throw new Error('Places request failed: ' + response.status);
      const result = await response.json();
      renderCareResults(result.features || []);
    } catch(err){
      resultsEl.innerHTML = `<div class="care-empty">Something went wrong reaching the places service. Please verify your .env file or server status.</div>`;
    } finally {
      btn.disabled = false;
    }
    return;
  }

  // Mode 2: Client-side with key loaded from .env
  const apiKey = APP_CONFIG.geoapifyKey;
  if(!apiKey){
    resultsEl.innerHTML = `<div class="care-empty">Geoapify API key not found. Please add GEOAPIFY_API_KEY to your .env file.</div>`;
    btn.disabled = false;
    return;
  }

  const url = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(careCategory)}&filter=circle:${lon},${lat},${CARE_RADIUS_METERS}&bias=proximity:${lon},${lat}&limit=20&apiKey=${apiKey}`;

  try{
    const response = await fetch(url, { method: 'GET' });
    if(!response.ok) throw new Error('Places request failed: ' + response.status);
    const result = await response.json();
    renderCareResults(result.features || []);
  } catch(err){
    resultsEl.innerHTML = `<div class="care-empty">Something went wrong reaching the places service. Please try again shortly.</div>`;
  } finally {
    btn.disabled = false;
  }
}

function careCategoryLabel(){
  const btn = document.querySelector(`.care-filter[data-cat="${careCategory}"]`);
  return btn ? btn.textContent : 'places';
}

function haversineKm(lat1, lon1, lat2, lon2){
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function staticCareMapUrl(places){
  const { lat, lon } = careCoords;
  let markers = `lonlat:${lon},${lat};color:%233E8E7E;size:medium;icontype:awesome;icon:circle`;
  places.slice(0, 15).forEach(f => {
    const [plon, plat] = f.geometry.coordinates;
    markers += `|lonlat:${plon},${plat};color:%23BE5148;size:small`;
  });

  if(APP_CONFIG.hasBackend){
    return `/api/map?style=osm-bright&width=900&height=360&marker=${encodeURIComponent(markers)}`;
  }

  const apiKey = APP_CONFIG.geoapifyKey;
  return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=900&height=360&marker=${encodeURIComponent(markers)}&apiKey=${apiKey}`;
}

function renderCareResults(features){
  const resultsEl = document.getElementById('careResults');

  if(!features.length){
    resultsEl.innerHTML = `<div class="care-empty">No ${careCategoryLabel().toLowerCase()} found within about ${(CARE_RADIUS_METERS/1000).toFixed(0)} km. Try a different category, or widen your search in a maps app.</div>`;
    return;
  }

  const { lat, lon } = careCoords;
  const places = features.map(f => {
    const p = f.properties || {};
    const [plon, plat] = f.geometry.coordinates;
    return {
      name: p.name || p.address_line1 || careCategoryLabel(),
      address: p.formatted || p.address_line2 || '',
      lat: plat, lon: plon,
      distKm: haversineKm(lat, lon, plat, plon)
    };
  }).sort((a,b) => a.distKm - b.distKm);

  let html = `<img class="care-map" src="${staticCareMapUrl(features)}" alt="Map showing your location and nearby ${careCategoryLabel().toLowerCase()}" loading="lazy">`;
  html += `<div class="care-summary">${places.length} result${places.length===1?'':'s'} within ~${(CARE_RADIUS_METERS/1000).toFixed(0)} km, closest first</div>`;
  html += `<div class="care-grid">`;
  places.forEach(pl => {
    const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${pl.lat},${pl.lon}`;
    html += `
      <div class="care-card">
        <h4>${pl.name}</h4>
        ${pl.address ? `<span class="care-addr">${pl.address}</span>` : ''}
        <span class="care-dist">${pl.distKm.toFixed(1)} km away</span>
        <a class="care-directions" href="${dirUrl}" target="_blank" rel="noopener">Get directions →</a>
      </div>`;
  });
  html += `</div>`;
  resultsEl.innerHTML = html;
}