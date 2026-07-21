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

// ---------- hero extras: floral bed along the bottom + rising hearts ----------
const floralBed = document.getElementById('floralBed');
if(floralBed){
  const flowers = ['🌹','🌷','💐','🌸','💜','🌷','🌹'];
  flowers.forEach((f, i) => {
    const s = document.createElement('span');
    s.textContent = f;
    s.style.animationDelay = (i * 0.25) + 's';
    floralBed.appendChild(s);
  });
}

const risingHearts = document.getElementById('risingHearts');
if(risingHearts){
  const heartGlyphs = ['💗','🤍','💜','🌸'];
  const heartCount = window.innerWidth < 500 ? 10 : 16;
  for(let i=0;i<heartCount;i++){
    const h = document.createElement('div');
    h.className = 'rising-heart';
    h.textContent = heartGlyphs[Math.floor(Math.random()*heartGlyphs.length)];
    h.style.left = Math.random()*100 + 'vw';
    h.style.fontSize = (14 + Math.random()*10) + 'px';
    h.style.setProperty('--hdrift', (Math.random()*60-30) + 'px');
    const dur = 7 + Math.random()*8;
    h.style.animationDuration = dur + 's';
    h.style.animationDelay = (Math.random()*dur) + 's';
    risingHearts.appendChild(h);
  }
}

// ---------- hero extras: fake heart-rate monitor, spiking way more than normal ----------
const hmBpm = document.getElementById('hmBpm');
const heartMonitor = document.getElementById('heartMonitor');
if(hmBpm && heartMonitor){
  const restingBase = 84;
  setInterval(() => {
    const isSpike = Math.random() < 0.3;
    let value;
    if(isSpike){
      value = 148 + Math.floor(Math.random() * 42); // dramatic, definitely-not-normal spike
      heartMonitor.classList.add('spike');
    } else {
      value = restingBase + Math.floor(Math.random() * 16 - 7); // gentle resting wobble
      heartMonitor.classList.remove('spike');
    }
    hmBpm.textContent = value;
  }, 850);
}

// ---------- page navigation: no scrolling, only tap advances ----------
function goToPage(id){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id === 'countdown') startCountdown();
}

// ---------- countdown target is (locked until this date/time) ----------
// TEMP FOR DEV/TESTING — set to the 20th so the unlock flow triggers immediately for testing.
// TODO: change the day back to 23 before sharing the real link.
const COUNTDOWN_TARGET = new Date(2026, 6, 23, 0, 0, 0, 0).getTime(); // month is 0-indexed: 6 = July
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
      showErrorTroll();
    }
  }
  step();
}

// a tiny troll: right after the 3-2-1, fake a broken "404" page for a
// couple seconds, then glitch it away into the real celebration
function showErrorTroll(){
  const troll = document.getElementById('errorTroll');
  troll.classList.remove('glitch-out');
  troll.classList.add('show');

  setTimeout(() => {
    troll.classList.add('glitch-out');
    setTimeout(() => {
      troll.classList.remove('show', 'glitch-out');
      startBirthdayCelebration();
    }, 550); // matches trollGlitchOut duration
  }, 5000); // how long the "broken" screen sits before it glitches away — long enough to actually read it
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
// ...except inside the letter card, which now holds a long message and
// needs its own internal scroll — everything else on the site stays locked.
document.addEventListener('touchmove', e => {
  if(e.target.closest('.letter-scroll')) return;
  e.preventDefault();
}, { passive:false });
document.addEventListener('wheel', e => {
  if(e.target.closest('.letter-scroll')) return;
  e.preventDefault();
}, { passive:false });

// ---------- image fallback handling ----------
// keeps the space reserved and shows a placeholder until a real file
// (images/photo1.*, images/photo2.*) is dropped into the images folder.
// tries a few common extensions automatically, so it doesn't matter
// whether the photo is a .png, .jpg, .jpeg, or .webp.
const IMG_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

function wireImageFallback(imgEl){
  const wrap = imgEl.closest('.photo-wrap');
  const fallback = wrap.querySelector('.photo-fallback');
  const base = imgEl.dataset.base;
  let extIndex = 0;

  function tryNext(){
    if(extIndex >= IMG_EXTENSIONS.length){
      imgEl.style.display = 'none';
      fallback.style.display = 'flex';
      return;
    }
    imgEl.src = `${base}.${IMG_EXTENSIONS[extIndex]}`;
    extIndex++;
  }

  imgEl.addEventListener('load', () => {
    imgEl.style.display = 'block';
    fallback.style.display = 'none';
  });
  imgEl.addEventListener('error', tryNext);

  tryNext();
}
document.querySelectorAll('.js-photo').forEach(wireImageFallback);

// ---------- reveal flow (page 3) ----------
const messages = [
  "Tomar smile ato beautiful, je eta te copyright howa uchit... shudhu amar. 😏❤️",
  "Jaani na kon drug use koro... tomake chhara onno kauke na dekhte paayi, na bhabte paari. 🙈❤️",
  "Eije tomar chokh gulo ato dangerously hypnotising... er opor warning sign lagano nei keno? 🫣👀",
  "Tomar naam ta shunlei automatic amar mukhe ekta smile chole ashe... kon black magic korecho amar opor? 😳✨",
  "Address change korle ar janale na? 😏 Jaak, ekhon jokhon amar heart-ei thakcho... rent hishebe shudhu ektu bhalobasha dilei cholbe. ❤️"
];

// one hand-drawn, animated little icon per card — kept as inline SVG (rather
// than hotlinked gifs) so the page stays self-contained and never shows a
// broken image, on GitHub Pages or anywhere else.
const cardIcons = [
  // 1: chibi face
  { cls:'icon-chibi', svg:`<svg viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="26" fill="#fffaf4" stroke="#e8bcd2" stroke-width="2"/>
      <path d="M16 26 Q20 20 24 26" stroke="#3a2a30" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M36 26 Q40 20 44 26" stroke="#3a2a30" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="16" cy="34" rx="5" ry="3.5" fill="#f6b8d2" opacity=".8"/>
      <ellipse cx="44" cy="34" rx="5" ry="3.5" fill="#f6b8d2" opacity=".8"/>
      <path d="M24 38 Q30 44 36 38" stroke="#3a2a30" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    </svg>` },
  // 2: dark chocolate square
  { cls:'icon-choc', svg:`<svg viewBox="0 0 60 60">
      <rect x="10" y="10" width="40" height="40" rx="6" fill="#4a2c1d"/>
      <line x1="30" y1="10" x2="30" y2="50" stroke="#3a2216" stroke-width="2"/>
      <line x1="10" y1="30" x2="50" y2="30" stroke="#3a2216" stroke-width="2"/>
      <rect x="14" y="14" width="13" height="13" rx="2" fill="#6b4226" opacity=".7"/>
    </svg>` },
  // 3: lipstick / makeup
  { cls:'icon-lipstick', svg:`<svg viewBox="0 0 60 60">
      <rect x="24" y="6" width="12" height="16" rx="3" fill="#e88bb5"/>
      <rect x="22" y="20" width="16" height="10" rx="2" fill="#f6b8d2"/>
      <rect x="20" y="30" width="20" height="20" rx="4" fill="#2a2224"/>
      <rect x="20" y="30" width="20" height="6" rx="2" fill="#d97aa8"/>
      <path d="M46 12 l2 5 l5 2 l-5 2 l-2 5 l-2-5 l-5-2 l5-2Z" fill="#c9b6e4"/>
    </svg>` },
  // 4: cat face
  { cls:'icon-cat', svg:`<svg viewBox="0 0 60 60">
      <path d="M14 18 L22 6 L27 20Z" fill="#f6b8d2"/>
      <path d="M46 18 L38 6 L33 20Z" fill="#f6b8d2"/>
      <circle cx="30" cy="32" r="20" fill="#fffaf4" stroke="#e8bcd2" stroke-width="2"/>
      <circle cx="22" cy="30" r="2.5" fill="#3a2a30"/>
      <circle cx="38" cy="30" r="2.5" fill="#3a2a30"/>
      <path d="M27 37 Q30 40 33 37" stroke="#3a2a30" stroke-width="2" fill="none" stroke-linecap="round"/>
      <line x1="6" y1="33" x2="18" y2="32" stroke="#c9b6e4" stroke-width="1.5"/>
      <line x1="6" y1="38" x2="18" y2="36" stroke="#c9b6e4" stroke-width="1.5"/>
      <line x1="54" y1="33" x2="42" y2="32" stroke="#c9b6e4" stroke-width="1.5"/>
      <line x1="54" y1="38" x2="42" y2="36" stroke="#c9b6e4" stroke-width="1.5"/>
    </svg>` },
  // 5: little gift box
  { cls:'icon-gift', svg:`<svg viewBox="0 0 60 60">
      <rect x="10" y="26" width="40" height="26" rx="3" fill="#f6b8d2"/>
      <rect x="10" y="26" width="40" height="8" fill="#e88bb5"/>
      <rect x="26" y="10" width="8" height="42" fill="#c9b6e4"/>
      <path d="M30 10 C20 10 18 -2 30 6 C42 -2 40 10 30 10Z" fill="#a98fd2"/>
    </svg>` }
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

// revealedCount = how many cards have been unlocked so far (via the flower tap)
// viewIndex = which of those unlocked cards is currently on screen (browsable
// back and forth with the prev/next arrows, independent of unlocking progress)
let revealedCount = 0;
let viewIndex = -1;
const total = messages.length;
const progressEl = document.getElementById('progress');
const flowerBtn = document.getElementById('flowerBtn');
const msgCard = document.getElementById('msgCard');
const msgContent = document.getElementById('msgContent');
const msgDeco = document.getElementById('msgDeco');
const stageHint = document.getElementById('stageHint');
const nextHint = document.getElementById('nextHint');
const continueBtn = document.getElementById('continueBtn');
const navPrev = document.getElementById('navPrev');
const navNext = document.getElementById('navNext');

const STAGE_HINT_TEXT = "go on, unwrap a little secret 🎀";

function buildDots(){
  progressEl.innerHTML='';
  for(let i=0;i<total;i++){
    const isCurrent = i === viewIndex || (viewIndex === -1 && i === revealedCount);
    const dot = document.createElement('div');
    dot.className = 'dot' + (i < revealedCount ? ' done' : '') + (isCurrent ? ' current' : '');
    progressEl.appendChild(dot);
  }
}
function setFlower(){
  flowerBtn.innerHTML = revealedCount % 2 === 0 ? roseSVG : lavenderSVG;
}
function updateNavArrows(){
  navPrev.disabled = viewIndex <= 0;
  navNext.disabled = viewIndex >= revealedCount - 1;
}
// shows whichever already-unlocked card is at `index`, and keeps the hint
// text honest about whether she's at the newest card or browsing an older one
function renderCard(index){
  const icon = cardIcons[index];
  msgContent.innerHTML = `<div class="quote-mark">"</div><p>${messages[index]}</p>`;
  msgDeco.innerHTML = `<div class="msg-icon ${icon.cls}">${icon.svg}</div>`;
  msgCard.classList.remove('show');
  void msgCard.offsetWidth; // restart animation
  msgCard.classList.add('show');
  buildDots();
  updateNavArrows();

  if(index === revealedCount - 1){
    // caught up to the newest unlocked card
    if(revealedCount >= total){
      stageHint.textContent = "that's everything, for now 💗";
      nextHint.textContent = "";
    } else {
      stageHint.textContent = STAGE_HINT_TEXT;
      nextHint.textContent = "there's more, whenever you're ready 🌷";
    }
  } else {
    stageHint.textContent = "revisiting a little moment 🌷";
    nextHint.textContent = `card ${index + 1} of ${total}`;
  }
}

buildDots(); setFlower(); updateNavArrows();

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
  if(revealedCount >= total) return;
  const rect = flowerBtn.getBoundingClientRect();
  spawnSparkles(rect.left+rect.width/2, rect.top);

  const indexToShow = revealedCount;
  revealedCount++;
  viewIndex = indexToShow;
  renderCard(indexToShow);

  if(revealedCount >= total){
    flowerBtn.style.display='none';
    continueBtn.classList.add('show');
  } else {
    setFlower();
  }
}

// browse back to an earlier already-unlocked card
function prevCard(){
  if(viewIndex <= 0) return;
  viewIndex--;
  renderCard(viewIndex);
}

// browse forward again, up to the newest already-unlocked card
// (does NOT unlock a new one — that's still only the flower's job)
function nextCard(){
  if(viewIndex >= revealedCount - 1) return;
  viewIndex++;
  renderCard(viewIndex);
}

// ---------- finale, stage 2: two rings of keyword tags spinning around her photo ----------
const orbitRingOuter = document.getElementById('orbitRingOuter');
const orbitRingInner = document.getElementById('orbitRingInner');
const tagColors = ['tag-paper','tag-pink','tag-lavender'];

// outer ring: the sweeter, sincere words
const outerWords = ['Boring','Teasing','Introvert','Non-chalant','Dangerous','Menace','DP Paglu'];
// inner ring: the teasing, villain-era words (yes, the Killer/Murderer bit is a John Wick joke)
const innerWords = ['Gorgeous Killer','Pookie Princess','Masoom Killer','Shaitaan Topper','Janlewa Hawtie'];

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

// radii are computed from the photo's actual on-screen size (not guessed),
// so the rings always clear it no matter how big the photo ends up being.
function buildOrbit(){
  const photoWrap2 = document.getElementById('photoWrap2');
  // offsetWidth/Height ignore CSS transforms (like the stage's pop-in bounce),
  // so this stays accurate even while that animation is still playing.
  const photoHalfExtent = Math.max(photoWrap2.offsetWidth, photoWrap2.offsetHeight) / 2 || 90;

  const innerBuffer = 16;   // clearance between the photo's edge and the inner tags
  const ringGap = 42;       // clearance between the inner ring and the outer ring
  const innerRadius = photoHalfExtent + innerBuffer;
  const outerRadius = innerRadius + ringGap;

  buildOrbitRing(orbitRingOuter, outerWords, outerRadius + 'px', 'outer');
  buildOrbitRing(orbitRingInner, innerWords, innerRadius + 'px', 'inner');
}

function showOrbitStage(){
  document.getElementById('finaleLetterStage').classList.remove('active');
  document.getElementById('finaleOrbitStage').classList.add('active');

  buildOrbit(); // build now, once the photo is actually visible and measurable

  const rect = document.getElementById('photoWrap2').getBoundingClientRect();
  spawnSparkles(rect.left + rect.width/2, rect.top);
  launchCrackers('finaleCrackers');
}

function showLetterStage(){
  document.getElementById('finaleOrbitStage').classList.remove('active');
  document.getElementById('finaleLetterStage').classList.add('active');
}

// ---------- finale, stage 1: swipe the gift box open, fruit-ninja style ----------
const giftGate = document.getElementById('giftGate');
const giftBoxWrap = document.getElementById('giftBoxWrap');
const sliceBlade = document.getElementById('sliceBlade');
const letterReveal = document.getElementById('letterReveal');

const SLICE_THRESHOLD = 55; // px of total travel needed to count as a real "cut"
let sliceDragging = false;
let sliceDone = false;
let sliceStart = { x: 0, y: 0 };

function sliceLocalPoint(clientX, clientY){
  const rect = giftBoxWrap.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function updateBlade(startX, startY, curX, curY){
  const dx = curX - startX;
  const dy = curY - startY;
  const dist = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  sliceBlade.style.left = startX + 'px';
  sliceBlade.style.top = startY + 'px';
  sliceBlade.style.width = dist + 'px';
  sliceBlade.style.transform = `rotate(${angle}deg)`;
}

function onSlicePointerDown(e){
  if(sliceDone) return;
  sliceDragging = true;
  sliceStart = sliceLocalPoint(e.clientX, e.clientY);
  sliceBlade.classList.add('active');
  updateBlade(sliceStart.x, sliceStart.y, sliceStart.x, sliceStart.y);
  if(giftBoxWrap.setPointerCapture){
    try{ giftBoxWrap.setPointerCapture(e.pointerId); }catch(err){}
  }
}

function onSlicePointerMove(e){
  if(!sliceDragging || sliceDone) return;
  const p = sliceLocalPoint(e.clientX, e.clientY);
  updateBlade(sliceStart.x, sliceStart.y, p.x, p.y);
}

function onSlicePointerUp(e){
  if(!sliceDragging || sliceDone) return;
  sliceDragging = false;
  sliceBlade.classList.remove('active');
  const p = sliceLocalPoint(e.clientX, e.clientY);
  const dx = p.x - sliceStart.x; // rightward travel specifically — a real right-swipe
  const dy = Math.abs(p.y - sliceStart.y);
  if(dx >= SLICE_THRESHOLD && dy < dx * 1.2){
    triggerSlice();
  } else {
    // not enough of a rightward swipe yet — give a little nudge as a hint
    giftBoxWrap.classList.remove('wiggle');
    void giftBoxWrap.offsetWidth;
    giftBoxWrap.classList.add('wiggle');
  }
}

function triggerSlice(){
  if(sliceDone) return;
  sliceDone = true;
  giftBoxWrap.classList.add('sliced');
  giftGate.classList.add('sliced');

  const rect = giftBoxWrap.getBoundingClientRect();
  spawnSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);

  setTimeout(() => {
    giftGate.style.display = 'none';
    letterReveal.classList.add('show');
  }, 650);
}

if(giftBoxWrap){
  giftBoxWrap.addEventListener('pointerdown', onSlicePointerDown);
  giftBoxWrap.addEventListener('pointermove', onSlicePointerMove);
  giftBoxWrap.addEventListener('pointerup', onSlicePointerUp);
  giftBoxWrap.addEventListener('pointercancel', onSlicePointerUp);
}
