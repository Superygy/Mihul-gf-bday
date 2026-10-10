(() => {
  'use strict';

  // Change these two values to personalize the site. Media paths are listed in README.txt.
  const HER_NAME = 'Nainshi';
  const YOUR_NAME = 'Mihul';
  const BIRTHDAY_MONTH = 10; // October (1-12)
  const BIRTHDAY_DAY = 11;
  const BIRTH_YEAR = 2009;

  document.querySelectorAll('.her-name').forEach(el => el.textContent = HER_NAME);
  document.querySelectorAll('.your-name').forEach(el => el.textContent = YOUR_NAME);

  // Discovered chapters stay available in the top navigation.
  const page = document.body.dataset.page || 'home';
  const navPages = ['countdown', 'gift', 'locket', 'letter', 'album', 'game'];
  let seen = new Set();
  try { seen = new Set(JSON.parse(localStorage.getItem('birthdaySeenPages') || '[]')); } catch (_) {}
  if (page !== 'home') seen.add(page);
  try { localStorage.setItem('birthdaySeenPages', JSON.stringify([...seen])); } catch (_) {}
  document.querySelectorAll('[data-nav]').forEach(link => {
    const key = link.getAttribute('data-nav');
    if (seen.has(key)) link.classList.add('is-unlocked');
    if (key === page) link.classList.add('current');
  });
  const navHint = document.getElementById('navHint');
  if (navHint) navHint.textContent = seen.size ? 'Your discovered chapters are saved in the menu above ✨' : 'Discover a chapter and it will stay in this menu ✨';

  // Gently floating hearts. Decorative only, and disabled for reduced-motion users.
  const heartsRoot = document.getElementById('floatingHearts');
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heartsRoot && !reducedMotion) {
    const symbols = ['♡', '♥', 'ღ', '✧'];
    for (let i = 0; i < 14; i++) {
      const h = document.createElement('span');
      h.className = 'floating-heart';
      h.textContent = symbols[i % symbols.length];
      h.style.left = `${(i * 37 + 8) % 100}%`;
      h.style.fontSize = `${10 + (i % 4) * 4}px`;
      h.style.animationDuration = `${15 + (i % 6) * 2}s`;
      h.style.animationDelay = `${-(i % 13) * 1.9}s`;
      heartsRoot.appendChild(h);
    }
  }

  function confettiBurst(amount = 85) {
    const layer = document.getElementById('confettiLayer');
    if (!layer || reducedMotion) return;
    const colours = ['#ff8fb9', '#ffe7aa', '#f9d4e7', '#d9b6ff', '#fff4df', '#e978a5', '#a8e0d5'];
    for (let i = 0; i < amount; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colours[i % colours.length];
      piece.style.setProperty('--delay', `${Math.random() * .45}s`);
      piece.style.setProperty('--fall-time', `${2.2 + Math.random() * 1.9}s`);
      piece.style.setProperty('--drift', `${Math.round(Math.random() * 240 - 120)}px`);
      piece.style.setProperty('--spin', `${Math.round(Math.random() * 1100 - 550)}deg`);
      piece.style.width = `${5 + Math.random() * 7}px`;
      piece.style.height = `${8 + Math.random() * 10}px`;
      layer.appendChild(piece);
      window.setTimeout(() => piece.remove(), 4800);
    }
  }

  // Countdown targets the next birthday, and keeps a small same-day countdown until midnight.
  function setupCountdown() {
    const ids = ['days', 'hours', 'minutes', 'seconds'];
    if (!ids.some(id => document.getElementById(id))) return;
    const message = document.getElementById('birthdayMessage');
    const ageLine = document.getElementById('ageLine');
    const pad = n => String(n).padStart(2, '0');
    function tick() {
      const now = new Date();
      const thisStart = new Date(now.getFullYear(), BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0);
      const thisEnd = new Date(now.getFullYear(), BIRTHDAY_MONTH - 1, BIRTHDAY_DAY + 1, 0, 0, 0);
      let target;
      const onBirthday = now >= thisStart && now < thisEnd;
      if (onBirthday) target = thisEnd;
      else {
        target = new Date(now.getFullYear(), BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0);
        if (now >= target) target = new Date(now.getFullYear() + 1, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0);
      }
      let diff = Math.max(0, target.getTime() - now.getTime());
      const days = Math.floor(diff / 86400000); diff %= 86400000;
      const hours = Math.floor(diff / 3600000); diff %= 3600000;
      const minutes = Math.floor(diff / 60000); diff %= 60000;
      const seconds = Math.floor(diff / 1000);
      ['days','hours','minutes','seconds'].forEach((id, i) => { const el = document.getElementById(id); if (el) el.textContent = pad([days,hours,minutes,seconds][i]); });
      if (onBirthday) {
        if (message) message.textContent = `It's her day! Sending birthday magic for ${HER_NAME} ♡`;
        if (ageLine) ageLine.textContent = `Celebrating ${now.getFullYear() - BIRTH_YEAR} beautiful years today.`;
      } else {
        if (message) message.textContent = `${HER_NAME}'s birthday magic is on its way. ♡`;
        if (ageLine) ageLine.textContent = `Turning ${target.getFullYear() - BIRTH_YEAR} on ${BIRTHDAY_DAY} October ${target.getFullYear()}.`;
      }
    }
    tick(); window.setInterval(tick, 1000);
  }
  setupCountdown();

  // Gift reveal + confetti.
  const giftStage = document.getElementById('giftStage');
  const giftBox = document.getElementById('giftBox');
  if (giftStage && giftBox) {
    const openGift = () => {
      if (!giftStage.classList.contains('is-open')) {
        giftStage.classList.add('is-open');
        confettiBurst(95);
        const prompt = document.getElementById('giftPrompt');
        if (prompt) prompt.textContent = 'Surprise unlocked ♡';
      }
    };
    giftBox.addEventListener('click', openGift);
    giftBox.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGift(); } });
  }

  // 3D locket opening: a single image sits underneath the two moving wings.
  const locketScene = document.getElementById('locketScene');
  const openLocket = document.getElementById('openLocket');
  if (locketScene && openLocket) {
    openLocket.setAttribute('aria-controls', 'locketScene');
    openLocket.setAttribute('aria-expanded', 'false');
    openLocket.addEventListener('click', () => {
      const opened = locketScene.classList.toggle('is-open');
      openLocket.innerHTML = opened ? '♡ Close Locket' : '♡ Open Locket';
      openLocket.setAttribute('aria-expanded', String(opened));
      locketScene.setAttribute('aria-label', opened ? 'An open rose-gold heart locket revealing one special photo' : 'A closed, rose-gold heart locket');
      const hint = document.getElementById('locketHint');
      const note = document.getElementById('locketNote');
      if (hint) hint.textContent = opened ? 'Your photo is revealed inside the open pendant. ♡' : 'Tap to open the pendant — your photo will appear above the opened locket ✨';
      if (note) note.classList.toggle('is-visible', opened);
      if (opened) confettiBurst(100);
    });
  }

  // Reveal local images when present; keep elegant placeholder cards if not.
  document.querySelectorAll('img.media-image').forEach(img => {
    const markLoaded = () => {
      img.classList.add('loaded');
      const placeholder = document.getElementById(img.dataset.placeholder || '');
      if (placeholder) placeholder.classList.add('hidden');
    };
    img.addEventListener('load', markLoaded);
    img.addEventListener('error', () => { img.classList.remove('loaded'); });
    if (img.complete && img.naturalWidth > 0) markLoaded();
  });

  // Heart-shaped album. Six media pieces sit around the Polaroid ring; the central hero image is the fifth photo, for exactly 5 photos + 2 videos in total.
  const heartCanvas = document.getElementById('heartCanvas');
  const polaroidRing = document.getElementById('polaroidRing');
  const heartItems = [
    {kind:'photo', src:'assets/heart/photo-1.jpeg', caption:'Your smile, my sunshine ♡', short:'PHOTO 01'},
    {kind:'video', src:'assets/heart/video-1.mp4', caption:'Press play for this little memory 🎞️', short:'VIDEO 01'},
    {kind:'photo', src:'assets/heart/photo-2.jpeg', caption:'Haaye ham toh ghayal he ho gaye ✨', short:'PHOTO 02'},
    {kind:'photo', src:'assets/heart/photo-3.jpeg', caption:'My love of life 💝', short:'PHOTO 03'},
    {kind:'photo', src:'assets/heart/photo-14.jpeg', caption:'A day that felt like magic 💗', short:'PHOTO 04'},
    {kind:'photo', src:'assets/heart/photo-5.jpeg', caption:'Our Love is Eternal🫂', short:'PHOTO 05'},
    {kind:'photo', src:'assets/heart/photo-6.jpeg', caption:'I love you so much baby 💝', short:'PHOTO 06'},
    {kind:'video', src:'assets/heart/video-2.mp4', caption:'One more moment for the heart 🎀', short:'VIDEO 02 '},
    {kind:'photo', src:'assets/heart/photo-7.jpeg', caption:'Saved here, forever yours ♡', short:'PHOTO 07'},
    {kind:'photo', src:'assets/heart/photo-8.jpeg', caption:'Enjoying happy moments with you 💝', short:'PHOTO 08'},
    {kind:'photo', src:'assets/heart/photo-9.jpeg', caption:'Our Bond is unbreakable 💝', short:'PHOTO 09'},
    {kind:'photo', src:'assets/heart/photo-10.jpeg', caption:'My love of life 💝', short:'PHOTO 10'},
    {kind:'photo', src:'assets/heart/photo-11.jpeg', caption:'Slayed it with you beauty 💝', short:'PHOTO 11'},
    {kind:'photo', src:'assets/heart/photo-12.png', caption:'You just look astonishing 💝', short:'PHOTO 12'},
    {kind:'photo', src:'assets/heart/photo-13.png', caption:'Sunshine mixed with hurricane 💝', short:'PHOTO 13'},
  ];
  const slotPositions = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((n,i)=>`slot-${n}`);
  function makeImagePlaceholder(label, src) {
    return `<span class="polaroid-placeholder"><span>${label}</span><small>${src.split('/').pop()}</small></span>`;
  }
  if (heartCanvas && polaroidRing) {
    heartItems.forEach((item, index) => {
      const number = index + 1;
      const button = document.createElement('button');
      button.type = 'button'; button.className = `polaroid ${slotPositions[index]} ${item.kind === 'note' ? 'note-polaroid' : ''} ${item.kind === 'video' ? 'video-polaroid' : ''}`;
      button.setAttribute('aria-label', item.kind === 'note' ? `Wish card ${number}: ${item.caption}` : `Open ${item.kind} ${number}: ${item.caption}`);
      if (item.kind === 'note') {
        button.innerHTML = `<span class="note-art"><strong>${item.icon}</strong><small>${item.note}</small></span><span class="polaroid-caption">${item.caption}</span><span class="polaroid-number">${number}</span>`;
      } else if (item.kind === 'photo') {
        button.innerHTML = `<span class="polaroid-media"><img alt="Heart album photo ${number}" src="${item.src}">${makeImagePlaceholder('♡', item.src)}</span><span class="polaroid-caption">${item.caption}</span><span class="polaroid-number">${number}</span>`;
        const img = button.querySelector('img');
        const placeholder = button.querySelector('.polaroid-placeholder');
        img.addEventListener('load', () => { img.classList.add('loaded'); placeholder.style.display='none'; });
        img.addEventListener('error', () => { img.classList.remove('loaded'); });
        if (img.complete && img.naturalWidth > 0) { img.classList.add('loaded'); placeholder.style.display='none'; }
        button.addEventListener('click', () => openModal({kind:'photo', src:item.src, caption:item.caption}));
      } else {
        button.innerHTML = `<span class="polaroid-media"><video muted playsinline preload="metadata" src="${item.src}"></video><span class="polaroid-placeholder"><span>▶</span><small>${item.src.split('/').pop()}</small></span></span><span class="polaroid-caption">${item.caption}</span><span class="polaroid-number">${number}</span>`;
        const videoThumb = button.querySelector('video');
        const videoPlaceholder = button.querySelector('.polaroid-placeholder');
        videoThumb.addEventListener('loadeddata', () => { videoThumb.classList.add('loaded'); videoPlaceholder.style.display='none'; });
        videoThumb.addEventListener('error', () => { videoThumb.classList.remove('loaded'); });
        button.addEventListener('click', () => openModal({kind:'video', src:item.src, caption:item.caption}));
      }
      polaroidRing.appendChild(button);
    });
  }

  const modal = document.getElementById('mediaModal');
  const modalContent = document.getElementById('modalContent');
  const modalCaption = document.getElementById('modalCaption');
  function openModal(item) {
    if (!modal || !modalContent || !modalCaption) return;
    modalContent.innerHTML = '';
    modalCaption.textContent = item.caption;
    if (item.kind === 'photo') {
      const img = document.createElement('img'); img.src = item.src; img.alt = item.caption;
      img.addEventListener('error', () => { modalContent.innerHTML = `<div class="modal-fallback"><span>♡</span><b>Add your photo to show this memory</b><small>${item.src}</small></div>`; });
      modalContent.appendChild(img);
    } else if (item.kind === 'video') {
      const video = document.createElement('video'); video.src = item.src; video.controls = true; video.playsInline = true; video.preload = 'metadata';
      video.addEventListener('error', () => { modalContent.innerHTML = `<div class="modal-fallback"><span>▶</span><b>Add your video to play this memory</b><small>${item.src}</small></div>`; });
      modalContent.appendChild(video);
    } else {
      const img = document.querySelector('.album-hero-photo img');
      if (img && img.classList.contains('loaded')) { const clone = document.createElement('img'); clone.src = img.src; clone.alt = item.caption; modalContent.appendChild(clone); }
      else modalContent.innerHTML = '<div class="modal-fallback"><span>♡</span><b>Your central album photo goes here</b><small>assets/heart/hero-photo.png</small></div>';
    }
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  }
  function closeModal() { if (!modal) return; modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; modalContent.innerHTML=''; }
  if (modal) {
    modal.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }
  const heroPhotoButton = document.getElementById('heroPhotoButton');
  if (heroPhotoButton) heroPhotoButton.addEventListener('click', () => openModal({kind:'hero', caption:'The heart of the whole album ♡'}));

  // Two clickable envelope notes (#16 and #17), inspired by the supplied reference.
  document.querySelectorAll('.secret-envelope').forEach(envelope => {
    const toggle = () => {
      const opening = !envelope.classList.contains('is-open');
      document.querySelectorAll('.secret-envelope').forEach(other => { if (other !== envelope) other.classList.remove('is-open'); });
      envelope.classList.toggle('is-open', opening);
      if (opening) confettiBurst(22);
    };
    envelope.addEventListener('click', toggle);
    envelope.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  // Site-wide background music: add your MP3 at assets/music/birthday-song.mp3.
  // A floating toggle is available on every page; the first play may require a tap.
  (function setupBackgroundMusic() {
    const SONG_SRC = 'assets/music/Until I Found You.mp3';
    const ENABLED_KEY = 'birthdayMusicEnabled';
    const TIME_KEY = 'birthdayMusicTime';
    const queryRequestsMusic = new URLSearchParams(window.location.search).get('playMusic') === '1';
    const WINDOW_STATE_PREFIX = '__BDAY_WORLD_MUSIC__:';

    function readWindowState() {
      try {
        if (!window.name || !window.name.startsWith(WINDOW_STATE_PREFIX)) return {};
        const parsed = JSON.parse(window.name.slice(WINDOW_STATE_PREFIX.length));
        return parsed && typeof parsed === 'object' ? parsed : {};
      } catch (_) { return {}; }
    }
    function readStored(key) {
      // window.name travels with this tab through file:// page changes, so prefer
      // it if it has a value; localStorage is the normal hosted-site fallback.
      const state = readWindowState();
      if (Object.prototype.hasOwnProperty.call(state, key)) return state[key];
      try {
        const value = localStorage.getItem(key);
        if (value !== null) return value;
      } catch (_) {}
      return null;
    }
    const audio = document.createElement('audio');
    audio.id = 'birthdayBackgroundAudio';
    audio.src = SONG_SRC;
    audio.loop = true;
    audio.preload = 'auto';
    audio.setAttribute('aria-hidden', 'true');
    audio.style.display = 'none';
    document.body.appendChild(audio);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'background-music-toggle';
    button.id = 'backgroundMusicToggle';
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = '<span class="music-toggle-icon">♫</span><span class="music-toggle-label">Play Music</span>';
    document.body.appendChild(button);

    let enabled = queryRequestsMusic || readStored(ENABLED_KEY) === 'true';
    let missingFile = false;
    const store = (key, value) => {
      const stringValue = String(value);
      try { localStorage.setItem(key, stringValue); } catch (_) {}
      try {
        const state = readWindowState();
        state[key] = stringValue;
        window.name = WINDOW_STATE_PREFIX + JSON.stringify(state);
      } catch (_) {}
    };
    if (queryRequestsMusic) store(ENABLED_KEY, true);
    const savedTime = () => {
      const n = Number(readStored(TIME_KEY) || 0);
      return Number.isFinite(n) && n >= 0 ? n : 0;
    };

    function updateButton() {
      const playing = !audio.paused && !audio.ended;
      const label = missingFile ? 'Add Song' : playing ? 'Music On' : enabled ? 'Tap to Play' : 'Play Music';
      button.querySelector('.music-toggle-label').textContent = label;
      button.classList.toggle('is-playing', playing);
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
      button.title = missingFile
        ? 'Add your MP3 at assets/music/birthday-song.mp3, then refresh the site.'
        : playing ? 'Background music is playing — click to pause' : 'Click to play your background song';
    }

    function startMusic() {
      enabled = true;
      store(ENABLED_KEY, true);
      if (missingFile) { updateButton(); return; }
      const result = audio.play();
      if (result && typeof result.catch === 'function') result.catch(updateButton);
      updateButton();
    }

    // Start music immediately on the first main journey click (before navigation).
    // Countdown receives playMusic=1 and retries when its audio file is ready.
    const journeyStart = document.getElementById('startJourneyBtn');
    if (journeyStart) journeyStart.addEventListener('click', () => { startMusic(); });

    button.addEventListener('click', () => {
      if (!audio.paused && !audio.ended) {
        enabled = false;
        store(ENABLED_KEY, false);
        store(TIME_KEY, audio.currentTime || 0);
        audio.pause();
      } else {
        startMusic();
      }
      updateButton();
    });
    audio.addEventListener('loadedmetadata', () => {
      const t = savedTime();
      if (t > 0 && Number.isFinite(audio.duration) && audio.duration > 0) {
        try { audio.currentTime = t % audio.duration; } catch (_) {}
      }
      if (enabled) startMusic();
      updateButton();
    });
    audio.addEventListener('canplay', () => {
      missingFile = false;
      if (enabled && audio.paused) startMusic();
      else updateButton();
    });
    audio.addEventListener('play', updateButton);
    audio.addEventListener('pause', updateButton);
    audio.addEventListener('error', () => { missingFile = true; updateButton(); });
    audio.addEventListener('timeupdate', () => {
      if (!audio.paused && Number.isFinite(audio.currentTime)) store(TIME_KEY, audio.currentTime);
    });
    window.addEventListener('pagehide', () => {
      store(ENABLED_KEY, enabled);
      if (Number.isFinite(audio.currentTime)) store(TIME_KEY, audio.currentTime);
    });
    updateButton();
  })();

  // Tiny catch-the-heart game.
  const gameBoard = document.getElementById('gameBoard');
  const startGame = document.getElementById('startGame');
  if (gameBoard && startGame) {
    let score = 0, timeLeft = 20, running = false, timer = null, spawnTimer = null;
    const scoreEl = document.getElementById('score');
    const timeEl = document.getElementById('gameTime');
    const bestEl = document.getElementById('bestScore');
    const resultEl = document.getElementById('gameResult');
    let best = 0; try { best = Number(localStorage.getItem('birthdayHeartBest') || 0); } catch (_) {}
    if (bestEl) bestEl.textContent = best;
    const stopGame = () => {
      running = false; window.clearInterval(timer); window.clearInterval(spawnTimer);
      gameBoard.querySelectorAll('.catch-heart').forEach(el => el.remove());
      const intro = gameBoard.querySelector('.game-board-intro'); if (intro) intro.remove();
      const msg = score >= 15 ? 'Heart collector extraordinaire! 💖' : score >= 8 ? 'Aww, you caught a lovely bunch! 💗' : 'Every heart counts — try one more round! ♡';
      if (resultEl) resultEl.textContent = msg;
      startGame.textContent = '↻ Play again';
      if (score > best) { best = score; if (bestEl) bestEl.textContent = best; try { localStorage.setItem('birthdayHeartBest', String(best)); } catch (_) {} }
      if (score >= 8) confettiBurst(35);
    };
    const spawnHeart = () => {
      if (!running) return;
      const h = document.createElement('button'); h.type = 'button'; h.className = 'catch-heart'; h.textContent = ['♡','♥','ღ'][Math.floor(Math.random()*3)]; h.setAttribute('aria-label','Catch heart');
      const maxX = Math.max(0, gameBoard.clientWidth - 42), maxY = Math.max(0, gameBoard.clientHeight - 48);
      h.style.left = `${Math.random()*maxX}px`; h.style.top = `${Math.random()*maxY}px`;
      h.addEventListener('click', () => { if (!running) return; score++; if (scoreEl) scoreEl.textContent = score; h.remove(); });
      gameBoard.appendChild(h); window.setTimeout(() => h.remove(), 1250);
    };
    startGame.addEventListener('click', () => {
      if (running) return;
      score = 0; timeLeft = 20; running = true;
      if (scoreEl) scoreEl.textContent = '0'; if (timeEl) timeEl.textContent = '20'; if (resultEl) resultEl.textContent = 'Catch as many as you can!';
      gameBoard.innerHTML = ''; startGame.textContent = 'Playing…';
      spawnHeart(); spawnTimer = window.setInterval(spawnHeart, 470);
      timer = window.setInterval(() => { timeLeft--; if (timeEl) timeEl.textContent = String(timeLeft); if (timeLeft <= 0) stopGame(); }, 1000);
    });
  }
})();
