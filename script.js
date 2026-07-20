// ---------- falling petals (behind content, above every page's background) ----------
const petalSVGs = [
  // white rose petal
  `<svg viewBox="0 0 40 40" width="22" height="22"><ellipse cx="20" cy="20" rx="16" ry="12" fill="#fdf6f0" stroke="#e9d6dd" stroke-width="1.5" transform="rotate(20 20 20)"/></svg>`,
  // lavender sprig
  `<svg viewBox="0 0 40 40" width="18" height="18"><circle cx="14" cy="14" r="5" fill="#c9b6e4"/><circle cx="24" cy="10" r="5" fill="#b79fdc"/><circle cx="20" cy="24" r="5" fill="#c9b6e4"/></svg>`,
  // pink petal
  `<svg viewBox="0 0 40 40" width="20" height="20"><ellipse cx="20" cy="20" rx="15" ry="11" fill="#f6b8d2" transform="rotate(-15 20 20)"/></svg>`
];
const petalContainer = document.getElementById('petals');
const petalCount = window.innerWidth < 500 ? 14 : 22;
for(let i=0;i<petalCount;i++){
  const d = document.createElement('div');
  d.className='petal';
  d.innerHTML = petalSVGs[Math.floor(Math.random()*petalSVGs.length)];
  d.style.left = Math.random()*100+'vw';
  d.style.setProperty('--drift', (Math.random()*80-40)+'px');
  const dur = 9 + Math.random()*10;
  d.style.animationDuration = dur+'s';
  d.style.animationDelay = (Math.random()*dur)+'s';
  petalContainer.appendChild(d);
}

// ---------- page navigation: no scrolling, only tap advances ----------
function goToPage(id){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id === 'countdown') startCountdown();
}

// ---------- countdown target (locked until this date/time) ----------
// TEMP FOR DEV/TESTING — set to the 20th so the unlock flow triggers immediately for testing.
// TODO: change the day back to 23 before sharing the real link.
const COUNTDOWN_TARGET = new Date(2026, 6, 20, 0, 0, 0, 0).getTime(); // month is 0-indexed: 6 = July
let countdownInterval = null;
let countdownStarted = false;

function startCountdown(){
  if(countdownStarted) return;
  countdownStarted = true;

  const now = Date.now();
  if(now >= COUNTDOWN_TARGET){
    // already the 23rd (or later) whenever this is opened — skip straight to the ceremony
    playUnlockSequence();
  } else {
    tickCountdown();
    countdownInterval = setInterval(tickCountdown, 1000);
  }
}

function tickCountdown(){
  const diff = COUNTDOWN_TARGET - Date.now();
  if(diff <= 0){
    clearInterval(countdownInterval);
    playUnlockSequence();
    return;
  }
  const pad = n => String(n).padStart(2,'0');
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cdDays').textContent = pad(d);
  document.getElementById('cdHours').textContent = pad(h);
  document.getElementById('cdMins').textContent = pad(m);
  document.getElementById('cdSecs').textContent = pad(s);
}

let celebrationInterval = null;

function playUnlockSequence(){
  const grid = document.getElementById('countdownGrid');
  const hint = document.getElementById('countdownHint');
  const label = document.getElementById('countdownLabel');
  const bigCount = document.getElementById('bigCount');

  grid.style.display = 'none';
  hint.style.display = 'none';
  label.style.display = 'none';
  bigCount.style.display = 'flex';

  const seq = ['3','2','1'];
  let i = 0;
  function step(){
    if(i < seq.length){
      bigCount.textContent = seq[i];
      bigCount.classList.remove('pop');
      void bigCount.offsetWidth; // restart animation
      bigCount.classList.add('pop');
      i++;
      setTimeout(step, 800);
    } else {
      bigCount.style.display = 'none';
      startBirthdayCelebration();
    }
  }
  step();
}

// keeps celebrating (big message + repeating crackers) until she taps to continue
function startBirthdayCelebration(){
  document.getElementById('birthdayMessage').classList.add('show');
  document.getElementById('tapContinue').classList.add('show');

  launchCrackers();
  celebrationInterval = setInterval(launchCrackers, 1200);
}

function stopCelebrationAndContinue(){
  clearInterval(celebrationInterval);
  document.getElementById('crackers').innerHTML = '';
  goToPage('reveals');
}

function launchCrackers(containerId = 'crackers'){
  const container = document.getElementById(containerId);
  if(!container) return;
  const glyphs = ['🎉','✨','💗','🌸','💜','🤍','🎊'];
  for(let i=0;i<40;i++){
    const p = document.createElement('div');
    p.className = 'cracker-particle';
    p.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    p.style.left = (Math.random()*100) + 'vw';
    p.style.top = (40 + Math.random()*20) + 'vh';
    const dx = (Math.random()*2-1) * 170;
    const dy = -(100 + Math.random()*200);
    p.style.setProperty('--dx', dx+'px');
    p.style.setProperty('--dy', dy+'px');
    p.style.animationDelay = (Math.random()*0.3)+'s';
    container.appendChild(p);
    setTimeout(() => p.remove(), 2000);
  }
}

// belt-and-braces: block any scroll/zoom gestures so the page truly can't be scrolled
document.addEventListener('touchmove', e => e.preventDefault(), { passive:false });
document.addEventListener('wheel', e => e.preventDefault(), { passive:false });

// ---------- image fallback handling ----------
// keeps the space reserved and shows a placeholder until a real file
// (images/photo1.jpg, images/photo2.jpg) is dropped into the images folder.
function wireImageFallback(imgEl){
  const wrap = imgEl.closest('.photo-wrap');
  const fallback = wrap.querySelector('.photo-fallback');
  imgEl.addEventListener('load', () => {
    imgEl.style.display = 'block';
    fallback.style.display = 'none';
  });
  imgEl.addEventListener('error', () => {
    imgEl.style.display = 'none';
    fallback.style.display = 'flex';
  });
}
document.querySelectorAll('.js-photo').forEach(wireImageFallback);

// ---------- reveal flow (page 2) ----------
const messages = [
  "your smile is basically my favorite notification. 🔔💗",
  "you're the human version of a warm blanket on a cold day. 🤍",
  "even when you're being silly, i think you're the cutest thing ever. 🐰",
  "you make ordinary days feel like main character moments. 🌸",
  "being your person is genuinely one of my favorite things about life. 🥹💜"
];

const roseSVG = `<svg viewBox="0 0 100 100"><g>
  <ellipse cx="50" cy="60" rx="30" ry="14" fill="#e9d6dd" opacity=".5"/>
  <path d="M50 20 C30 25 25 45 50 55 C75 45 70 25 50 20Z" fill="#fdf6f0" stroke="#e8bcd2" stroke-width="2"/>
  <path d="M50 28 C40 32 38 44 50 48 C62 44 60 32 50 28Z" fill="#fffaf4" stroke="#f0d6e0" stroke-width="1.5"/>
  <path d="M50 55 L50 85" stroke="#9cbf9c" stroke-width="4" stroke-linecap="round"/>
  <path d="M50 68 Q38 68 34 78" stroke="#9cbf9c" stroke-width="3" fill="none" stroke-linecap="round"/>
</g></svg>`;

const lavenderSVG = `<svg viewBox="0 0 100 100"><g>
  <path d="M50 40 L50 88" stroke="#8fae8f" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="18" r="7" fill="#a98fd2"/>
  <circle cx="42" cy="28" r="7" fill="#c9b6e4"/>
  <circle cx="58" cy="28" r="7" fill="#c9b6e4"/>
  <circle cx="46" cy="38" r="6.5" fill="#b79fdc"/>
  <circle cx="54" cy="38" r="6.5" fill="#b79fdc"/>
  <circle cx="50" cy="46" r="6" fill="#c9b6e4"/>
</g></svg>`;

let stage = 0; // index of next message to reveal
const total = messages.length;
const progressEl = document.getElementById('progress');
const flowerBtn = document.getElementById('flowerBtn');
const msgCard = document.getElementById('msgCard');
const msgContent = document.getElementById('msgContent');
const stageHint = document.getElementById('stageHint');
const nextHint = document.getElementById('nextHint');
const continueBtn = document.getElementById('continueBtn');

function buildDots(){
  progressEl.innerHTML='';
  for(let i=0;i<total;i++){
    const dot = document.createElement('div');
    dot.className='dot' + (i<stage ? ' done' : '') + (i===stage ? ' current':'');
    progressEl.appendChild(dot);
  }
}
function setFlower(){
  flowerBtn.innerHTML = stage % 2 === 0 ? roseSVG : lavenderSVG;
}
buildDots(); setFlower();

function spawnSparkles(x,y){
  const glyphs = ['✨','💗','🌸','💜','🤍'];
  for(let i=0;i<10;i++){
    const s = document.createElement('div');
    s.className='sparkle';
    s.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    s.style.left = (x + (Math.random()*100-50))+'px';
    s.style.top = (y + (Math.random()*20-10))+'px';
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),1000);
  }
}

function reveal(){
  const rect = flowerBtn.getBoundingClientRect();
  spawnSparkles(rect.left+rect.width/2, rect.top);

  msgContent.innerHTML = `<div class="quote-mark">"</div><p>${messages[stage]}</p>`;
  msgCard.classList.remove('show');
  void msgCard.offsetWidth; // restart animation
  msgCard.classList.add('show');

  stage++;
  buildDots();

  if(stage >= total){
    flowerBtn.style.display='none';
    stageHint.textContent = "that's everything, for now 💗";
    nextHint.textContent = "";
    continueBtn.classList.add('show');
  } else {
    stageHint.textContent = "go on, tap it 🌸";
    setFlower();
    nextHint.textContent = "there's more, whenever you're ready 🌷";
  }
}

// ---------- finale, stage 2: two rings of keyword tags spinning around her photo ----------
const orbitRingOuter = document.getElementById('orbitRingOuter');
const orbitRingInner = document.getElementById('orbitRingInner');
const tagColors = ['tag-paper','tag-pink','tag-lavender'];

// outer ring: the sweeter, sincere words
const outerWords = ['Gorgeous','Stunning','Pookie','Hawt','Cheesy','Topper','Smart','Ethereal'];
// inner ring: the teasing, villain-era words (yes, the Killer/Murderer bit is a John Wick joke)
const innerWords = ['Boring','Teasing','Introvert','Nonchalant','Killer','Murderer','Menace','Unbothered'];

function buildOrbitRing(container, words, radius, animClass){
  container.innerHTML = '';
  words.forEach((word, i) => {
    const angle = (360 / words.length) * i;
    const tilt = (Math.random() * 12 - 6).toFixed(1); // small random sticker tilt

    const slot = document.createElement('div');
    slot.className = 'orbit-slot';
    slot.style.setProperty('--angle', angle + 'deg');
    slot.style.setProperty('--radius', radius);

    const tag = document.createElement('div');
    tag.className = `orbit-tag ${animClass} ${tagColors[i % tagColors.length]}`;
    tag.style.setProperty('--angle', angle + 'deg');
    tag.style.setProperty('--tilt', tilt + 'deg');
    tag.textContent = word;

    slot.appendChild(tag);
    container.appendChild(slot);
  });
}

function buildOrbit(){
  buildOrbitRing(orbitRingOuter, outerWords, 'clamp(118px,38vw,168px)', 'outer');
  buildOrbitRing(orbitRingInner, innerWords, 'clamp(80px,28vw,120px)', 'inner');
}
buildOrbit();

function showOrbitStage(){
  document.getElementById('finaleLetterStage').classList.remove('active');
  document.getElementById('finaleOrbitStage').classList.add('active');

  const rect = document.getElementById('photoWrap2').getBoundingClientRect();
  spawnSparkles(rect.left + rect.width/2, rect.top);
  launchCrackers('finaleCrackers');
}