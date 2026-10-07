/* Fatih Cölkusu · Portfolio
   Plain JS, no build. Scroll-scrubbed hero, text choreography, the hold-to-reveal grid, DE/EN. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const smoothstep = (p, e0, e1) => { const t = clamp((p - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  const HERO = html.dataset.hero || 'tinte';
  // two cuts of the same journey: landscape for desktops, a portrait crop for phones and portrait tablets
  const VARIANTS = {
    d: { video: `assets/hero-${HERO}.mp4`, poster: `assets/hero-${HERO}-poster.jpg`, bytes: Number(html.dataset.bytes) || 8835289 },
    m: { video: `assets/hero-${HERO}-m.mp4`, poster: `assets/hero-${HERO}-poster-m.jpg`, bytes: Number(html.dataset.bytesM) || 5605607 }
  };
  const RM = matchMedia('(prefers-reduced-motion: reduce)');

  /* ==========================================================
     i18n: German lives in the HTML, English lives here.
     ========================================================== */
  const EN = {
    metaTitle: 'Fatih Cölkusu · Head of Design, UX/UI & design systems, Zurich',
    metaDesc: 'Fatih Cölkusu, Head of Design based in Zurich. 15+ years of UX/UI, design systems and accessibility for banking, logistics and the public sector.',
    skip: 'Skip to content', navLabel: 'Main navigation', navWork: 'Work', navProcess: 'Process', navAbout: 'About', navContact: 'Contact',
    avail: 'Available from January 2027', langLabel: 'Language', ctaTalk: "Let's talk", menuOpen: 'Open menu', menuClose: 'Close menu',
    heroLabel: 'Introduction',
    h1k: 'Head of Design · UX/UI &amp; AI · Zurich', h1t: 'Hello.', h1s: "I'm Fay. I make complex products simple.",
    h2t: 'Every product has layers.', h2s: 'Structure. Flow. Surface.',
    h3t: 'I put them in order until everything is clear.',
    t2t: 'Every idea starts with a single stroke.', t2s: 'Sketch. Structure. System.',
    t3t: 'I give it shape until everything is clear.',
    h4t: 'Banking. Logistics. Automotive. Public sector.', h4s: 'For CREALOGIX&nbsp;AG &amp; DIGITERRA, Kühne+Nagel, BMW&nbsp;Digital, Mercedes-Benz and Fiducia&nbsp;&amp;&nbsp;GAD.',
    h5t: 'From the first sketch to the code.', h5s: 'I create design systems and interfaces, and I build frontends myself.',
    ctaWork: 'See the work', hudLayer: 'Layer', hudDepth: 'Depth', scroll: 'Scroll',
    hsHello: 'Hello.', hsName: "I'm Fay.", hsSub: 'I make complex products simple. And buildable.',
    introLabel: 'Profile', introLede: '15+ years of product design. Today Head of Design at CREALOGIX&nbsp;AG in Zurich.',
    stat1: 'years of experience', stat2: 'industries: banking, logistics, public sector, automotive', stat3: 'languages: German, Turkish, English',
    portraitAlt: 'Fatih Cölkusu, black and white portrait', portraitCap: 'Product Designer',
    marqueeLabel: 'Brands and clients', marqueeSr: 'CREALOGIX AG, DIGITERRA, Kühne+Nagel, Fiducia &amp; GAD, Pascher+Heinz, German Federal Employment Agency, Capgemini, BMW, Mercedes-Benz, antoni, Weleda',
    statementLabel: 'Approach',
    statement: 'FEWER CLICKS. CLEARER FLOWS.<br>ONE SYSTEM THAT GROWS WITH YOU.<br>USABLE BY EVERYONE.<br>DESIGN AND CODE SPEAK THE SAME LANGUAGE.',
    workLabel: 'Selected work', workTitle: 'Complex products, made clear.', workIntro: 'Four projects from banking, logistics and automotive. Each with my role and my contribution.',
    holdTitle: 'Show the grid', holdHint: 'Press and hold', holdOff: 'Hide the grid', holdHintOff: 'Click',
    p1Title: 'One banking app for two brands.', tagAppWeb: 'App &amp; web',
    p1Text: 'At CREALOGIX&nbsp;AG I planned and designed a hybrid banking app that CREALOGIX&nbsp;AG and DIGITERRA share. A design system keeps tech and design consistent while each brand keeps its own look, in dark and light mode. I brought together what every stakeholder needed and coordinated design and engineering.',
    p1Extra: 'Also: the DIGITERRA website redesign with a scroll-based 3D experience, which I planned and built in the frontend.',
    altDtHero: 'DIGITERRA banking on a MacBook and smartphone: asset overview and security detail in dark mode', altDtWeb: 'DIGITERRA website with the Horizon hero “Your digital banking channel. Ready for any AI.” on a MacBook', altDtPortal: 'DIGITERRA client portal with documentation, interfaces and operations on a MacBook', altDtHybrid: 'Hybrid DIGITERRA banking app on four smartphones: asset overview with accounts, private account and portfolio in dark and light mode',
    p2Title: 'Thousands of shipments. One clear view.', tagLogistics: 'Logistics', tagDeskTab: 'Desktop &amp; tablet',
    p2Text: "myKN is Kühne+Nagel's customer platform for quotes, bookings and tracking in sea and air freight. I designed tracking dashboards, turned data into clear visuals, built complex prototypes in Figma, ran usability tests and grew the styleguide library.",
    altKnHero: 'myKN container overview on a convertible laptop at a desk', altKnShip: 'myKN shipment detail with routing milestones and map on an iPad', altKnTrack: 'myKN container overview with dwell time hotspots on a MacBook',
    p3Title: 'The Volksbanken retail banking app.', tagUxExpert: 'UX/UI expert',
    p3Text: 'For the Volksbanken I worked on the retail banking app: I planned new flows, visualised prototypes and extended the pattern libraries and styleguide. Agile in a Scrum team, with handoff via GitHub and Sketch Measure.',
    altVbHero: 'Volksbank website with the claim “Morgen kann kommen.” on a MacBook', altVbApp: 'Eight screens of the Volksbank app: splash screen, banking & contracts, account picker, transfer, orders, bank mailbox, profile data and website', altVbCockpit: 'Banking & finance cockpit on an iPad: activated apps with providers, customer groups and performance',
    p4Title: 'From showroom to Need Analyser.',
    p4Text: 'For BMW I planned showroom pages, designed the UI for BMW M and created a new tool that guides customers to the right car. I also delivered frontend specs and quality checks against the BMW styleguide.',
    altBmwHero: 'BMW Need Analyser: the “What’s important to you?” step with attribute selection on a MacBook', altBmwX6: 'BMW Need Analyser: BMW X6 recommendation on a MacBook', altBmwMob: 'BMW Need Analyser on two smartphones: seat selection and recommendation', altBmwM: 'BMW M website featuring the M4 GTS on a MacBook',
    processLabel: 'Process', processTitle: 'Four steps. No surprises.', processIso: 'User-centred, following ISO 9241-210',
    s1Title: 'Understand', s1Text: 'I ask about goals, users and limits before I draw anything.',
    s2Title: 'Structure', s2Text: 'User flows, information architecture and wireframes. This is where it gets simple.',
    s3Title: 'Design', s3Text: 'UI and clickable prototypes in Figma, tested with real users and accessible to WCAG 2.1 AA.',
    s4Title: 'Hand off', s4Text: 'Components, design tokens and specs that engineers understand. I build frontends myself too.',
    servicesLabel: 'Services', servicesTitle: 'What I bring.',
    sv1: 'Apps and platforms for web, iOS and Android.', sv2n: 'Design systems', sv2: 'Components, tokens and docs that grow with the product.',
    sv3: 'Clickable Figma prototypes and tests that give real answers.', sv4n: 'Accessibility', sv4: 'WCAG 2.1 AA, BITV 2.0 and WAI-ARIA, planned in from day one.',
    sv5n: 'AI &amp; frontend', sv5: 'Frontends built with Cursor and Claude, design tokens and component libraries.', sv6: 'Campaigns and content for brands like Mercedes-Benz and BMW.',
    quotesLabel: 'What CREALOGIX AG says',
    q1: 'His commitment exceeds our expectations.',
    q2: 'He applies the knowledge he has acquired reliably in practice and quickly familiarises himself with new tasks.',
    q3: 'We are completely satisfied with his reliable and precise approach to work.',
    qSrc: 'CREALOGIX AG, interim reference letter, September 2026',
    aboutLabel: 'About', aboutTitle: 'From art director to Head of Design.',
    ab1: "I'm a UX/UI and AI designer with more than 15 years of experience. I joined CREALOGIX&nbsp;AG in Zurich in 2023, today as Senior Product Designer and Head of Design. One of my projects there is the DIGITERRA platform.",
    ab2: "I started as an art director in advertising agencies, for brands like BMW and Mercedes-Benz. Since then I've designed digital products for fintech, logistics and public institutions, user-centred and accessible.",
    ab3: 'My focus is scalable design systems. I also build frontends myself with AI tools like Cursor and Claude. So I know how designs get built, and I create handoffs that developers like working with.',
    kitTools: 'Tools', kitMethods: 'Methods', kitLang: 'Languages', kitLangText: 'German and Turkish (native), English (fluent)',
    tlTitle: 'Experience', tl1d: '2023 to today', tl2d: '2021 to 2023', tl3d: '2020 to 2021', tl3o: 'Fiducia &amp; GAD IT, Munich', tl3r: 'UX/UI expert',
    tl4d: '2018 to 2019', tl4o: 'Capgemini for the German Federal Employment Agency, Nuremberg', tl5d: '2016 to 2017', tl5o: 'young&amp;well, Munich', tl5r: 'Senior art director (freelance)',
    tl6d: '2012 to 2015', tl6r: 'Graphic designer &amp; digital art director for BMW, Weleda and Mercedes-Benz', tl7d: 'until 2012', tl7o: 'Training in graphic and communication design, Istanbul',
    faqLabel: 'Questions', faqTitle: 'What recruiters and clients ask me.',
    f2q: 'Are you looking for a job or for projects?', f2a: "Both can work. Tell me what it's about and I'll tell you honestly if it's a fit.",
    f3q: 'Can you handle complex, regulated products?', f3a: "That's my everyday work. Banking, payments and public agencies come with many rules and many people involved. I turn that into flows users understand that still meet every requirement, data protection included.",
    f4q: 'How does handoff to engineering work?', f4a: 'Through design system components, design tokens and clear specs. I build frontends myself too, so I know what gets expensive in code. That saves rework.',
    f5q: 'How do you handle accessibility?', f5a: 'I plan it in from the start. For the German Federal Employment Agency I designed to BITV 2.0, WCAG and WAI-ARIA. Today WCAG 2.1 AA is my baseline.',
    f6q: 'Can I see all your projects?', f6a: "Some work is under NDA. In a call I'm happy to show more, as far as I'm allowed.",
    contactLabel: 'Contact', contactTitle: "Let's talk.", contactLede: "Tell me about your role, your project or a product that should get simpler.",
    contactDirect: 'Or directly:', fName: 'Name', fNamePh: 'Your name', fMail: 'Email', fMailPh: 'you@company.com', fTopic: 'Topic',
    fT2: 'Project', fT4: 'Cup of coffee', fT3: 'Something else', fMsg: 'Message', fMsgPh: 'What is it about?',
    fErr: 'Please fill in name, email and message.', fSend: 'Send message', fOk: 'Thanks! Your email app opens with your message. Just hit send.',
    themeToDark: 'Switch to dark mode', themeToLight: 'Switch to light mode', footTheme: 'Appearance',
    footLegal: 'Legal', footImprint: 'Legal notice', footPrivacy: 'Privacy',
    noticeLabel: 'Note on cookies', noticeKicker: 'Cookie check', noticeTitle: 'No cookies here. Just coffee.',
    noticeText: 'I don’t track you and set no advertising or analytics cookies. Your browser only remembers whether you read in light or dark mode and in which language.',
    noticeOk: 'Got it', noticeMore: 'Read the privacy policy',
    toTop: 'Back to top', city: 'Zurich', footAi: 'The 3D camera move is AI generated. All projects are real.',
    mailSubject: 'Enquiry via your portfolio', mailFrom: 'From'
  };
  const DE = { themeToDark: 'Dunkelmodus einschalten', themeToLight: 'Hellmodus einschalten', holdOff: 'Raster ausblenden', holdHintOff: 'Klicken', menuClose: 'Menü schließen', mailSubject: 'Anfrage über dein Portfolio', mailFrom: 'Von' };

  function harvestDE() {
    DE.metaTitle = document.title;
    DE.metaDesc = $('meta[name="description"]').getAttribute('content');
    $$('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (!(k in DE)) DE[k] = el.innerHTML.trim(); });
    $$('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':'); if (!(key in DE)) DE[key] = el.getAttribute(attr);
    }));
  }
  let lang = 'de';
  const t = k => (lang === 'en' ? EN : DE)[k] ?? DE[k] ?? '';

  function applyLang(next, first) {
    lang = next;
    html.lang = lang;
    document.title = t('metaTitle');
    $('meta[name="description"]').setAttribute('content', t('metaDesc'));
    if (!first) {
      $$('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); if (v) el.innerHTML = v; });
      $$('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':'); const v = t(key); if (v) el.setAttribute(attr, v);
      }));
      // anything we decorated needs to be rebuilt from the fresh text
      $$('[data-split]').forEach(splitText);
      $$('.reveal-lines').forEach(wrapLines);
      prepStatement();
      bands.forEach(b => { b.op = -1; b.k = -1; });
      if (scrubOn) updateCaptions(shown);
      lastLit = -1; onStatement();
      setHoldLabel();
      updateThemeUI();
    }
    $$('.lang-btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }

  /* ==========================================================
     Text splitting (seeded, identical every load)
     ========================================================== */
  function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function mk(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  function splitText(el) {
    const mode = el.dataset.split;
    const text = el.textContent.replace(/[ \t\n\r]+/g, ' ').trim();
    const r = rng(hash(text + mode));
    el.textContent = '';
    el.append(mk('span', 'sr', text));
    const vis = mk('span', 'vis'); vis.setAttribute('aria-hidden', 'true');
    el.classList.add(mode);

    if (mode === 'focus') {
      vis.classList.add('fx-focus');
      vis.append(mk('span', 'soft', text), mk('span', 'sharp', text));
      el.append(vis); return;
    }
    if (mode === 'layers-lines') {
      const parts = (text.match(/[^.]+\.?/g) || [text]).map(s => s.trim()).filter(Boolean);
      parts.forEach((p, i) => { const w = mk('span', 'w', p); w.style.setProperty('--th', (0.34 + i * 0.13).toFixed(3)); vis.append(w); });
      el.classList.add('layers');
      el.append(vis); return;
    }
    const words = text.split(' ');
    const totalChars = text.replace(/ /g, '').length;
    const spread = Number(el.closest('[data-spread]')?.dataset.spread) || 0.5;
    let ci = 0;
    words.forEach((word, wi) => {
      const w = mk('span', 'w');
      const f = words.length > 1 ? wi / (words.length - 1) : 0;
      if (mode === 'snap' || mode === 'scatter') {
        [...word].forEach(ch => {
          const c = mk('span', 'c', ch);
          if (mode === 'snap') {
            c.style.setProperty('--th', (ci / totalChars * spread + r() * 0.06).toFixed(3));
            c.style.setProperty('--jx', `${((r() < 0.5 ? -1 : 1) * (30 + r() * 80)).toFixed(1)}px`);
          } else {
            c.style.setProperty('--th', (r() * 0.5).toFixed(3));
            c.style.setProperty('--jx', `${((r() - 0.5) * 120).toFixed(1)}px`);
            c.style.setProperty('--jy', `${((r() - 0.5) * 90).toFixed(1)}px`);
            c.style.setProperty('--jr', `${((r() - 0.5) * 40).toFixed(1)}deg`);
          }
          ci++; w.append(c);
        });
      } else {
        w.textContent = word;
        const th = { rise: 0.18 + f * 0.36, layers: f * 0.36, punch: f * 0.48, settle: f * 0.4, drift: f * 0.42 }[mode] ?? f * 0.4;
        w.style.setProperty('--th', th.toFixed(3));
      }
      vis.append(w);
      if (wi < words.length - 1) vis.append(document.createTextNode(' '));
    });
    el.append(vis);
  }

  function wrapLines(el) {
    const raw = el.textContent.replace(/\s+/g, ' ').trim();
    el.textContent = '';
    raw.split(' ').forEach((word, i, arr) => {
      const rw = mk('span', 'rw'); const ri = mk('span', 'ri', word);
      ri.style.setProperty('--i', i); rw.append(ri); el.append(rw);
      if (i < arr.length - 1) el.append(document.createTextNode(' '));
    });
  }

  /* ==========================================================
     HERO: gates, blob loader, lerp, gated seeks, bands
     ========================================================== */
  const hero = $('.hero');
  const stage = $('#stage');
  const video = $('#hero-video');
  const posterLayer = $('.poster');
  const ring = $('.ring');
  const hudNum = $('#hud-num');
  const hudTicks = $$('.hud-ticks i');
  const bands = $$('.band').map(el => ({ el, a: +el.dataset.a, b: +el.dataset.b, ramp: +el.dataset.ramp || 0, op: -1, k: -1 }));

  // static hero: no journey at all (identical strings in site.css)
  const GATES = [
    '(orientation: landscape) and (max-width: 720px)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  // portrait journey: the cropped video and the stacked band layout (identical strings in site.css)
  const MOBILE = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)'
  ];
  const MQLS = GATES.map(q => matchMedia(q));
  const MQLS_M = MOBILE.map(q => matchMedia(q));

  let scrubOn = false, heroVariant = null, loadToken = 0, heroOnScreen = true;
  const blobUrls = {};
  let target = 0, shown = 0, rafId = null, lastTick = 0;
  let loadK = 0, loadStart = 0;
  let seekBusy = false, pendingTime = null;
  let lastHud = '', lastHudAt = 0, lastScrolled = null, lastFade = -1, lastKp = -1;

  function heroProgress() {
    const r = hero.getBoundingClientRect();
    const range = hero.offsetHeight - innerHeight;
    return range > 0 ? clamp(-r.top / range, 0, 1) : 0;
  }

  function requestSeek(t) {
    if (!video.duration || !isFinite(video.duration)) return;
    if (seekBusy) { pendingTime = t; return; }
    seekBusy = true;
    video.currentTime = t;
  }
  video.addEventListener('seeked', () => {
    seekBusy = false;
    if (pendingTime !== null) { const t = pendingTime; pendingTime = null; requestSeek(t); }
  });
  video.addEventListener('error', () => { seekBusy = false; pendingTime = null; failVideo(); });

  function updateCaptions(p) {
    const last = bands.length - 1;
    bands.forEach((B, i) => {
      const { a, b } = B;
      const f = Math.min(0.02, (b - a) / 3);
      const op = (i === 0 ? 1 : smoothstep(p, a, a + f)) * (i === last ? 1 : 1 - smoothstep(p, b - f, b));
      let k = clamp((p - a) / (B.ramp || Math.min(0.025, (b - a) * 0.35)), 0, 1);
      if (i === 0) k = Math.max(k, loadK);
      if (Math.abs(op - B.op) > 0.004 || (op === 0) !== (B.op === 0) || (op === 1) !== (B.op === 1)) {
        B.el.style.opacity = op.toFixed(3); B.op = op; B.el.classList.toggle('on', op > 0.5);
      }
      if (Math.abs(k - B.k) > 0.008 || ((k === 1 || k === 0) && k !== B.k)) {
        B.el.style.setProperty('--k', k.toFixed(3)); B.k = k;
      }
    });
    // hud: about 10Hz, only on change
    const now = performance.now();
    const layer = String(Math.min(5, Math.floor(p * 5 * 0.999) + 1)).padStart(2, '0');
    if (layer !== lastHud && now - lastHudAt > 100) {
      lastHud = layer; lastHudAt = now; hudNum.textContent = layer;
      hudTicks.forEach((tk, i) => tk.classList.toggle('on', i < +layer));
    }
    const sc = p > 0.004;
    if (sc !== lastScrolled) { lastScrolled = sc; stage.classList.toggle('scrolled', sc); }
    const kp = smoothstep(p, 0.82, 0.93);
    if (Math.abs(kp - lastKp) > 0.006 || ((kp === 0 || kp === 1) && kp !== lastKp)) { lastKp = kp; stage.style.setProperty('--kp', kp.toFixed(3)); }
    const fade = smoothstep(p, 0.9, 1);
    if (Math.abs(fade - lastFade) > 0.01) { lastFade = fade; stage.style.setProperty('--fade', fade.toFixed(3)); }
  }

  function tick(now) {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    const kk = 0.16;
    shown += (target - shown) * (1 - Math.pow(1 - kk, dt / 16.667));
    // band one's load ramp hands over to scroll
    let ramping = false;
    if (loadK < 1) { loadK = easeOut(clamp((now - loadStart) / 1500, 0, 1)); ramping = loadK < 1; }
    if (Math.abs(target - shown) < 0.0005 && !ramping) {
      shown = target; rafId = null; lastTick = 0;
    } else {
      rafId = requestAnimationFrame(tick);
    }
    requestSeek(shown * (video.duration || 0));
    updateCaptions(shown);
  }

  function onScroll() {
    target = heroProgress();
    if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
  }

  // loads (or swaps to) one cut; a rotation between portrait and landscape swaps the cut
  function initHero(v) {
    if (heroVariant === v) return;
    heroVariant = v;
    const V = VARIANTS[v], token = ++loadToken;
    posterLayer.style.backgroundImage = `url('${V.poster}')`;
    stage.classList.remove('video-ready', 'video-failed');
    if (blobUrls[v]) { useVideo(blobUrls[v], token); return; }
    let started = false;
    const start = () => {
      if (started) return; started = true;
      loadHeroBlob(V, token).catch(() => { if (token === loadToken) failVideo(); });
    };
    const img = new Image(); img.onload = start; img.onerror = start; img.src = V.poster;
    setTimeout(start, 4000);
  }

  function useVideo(url, token) {
    if (token !== loadToken) return;
    seekBusy = false; pendingTime = null;
    video.src = url;
    video.load();
    video.addEventListener('canplay', () => {
      if (token !== loadToken) return;
      requestSeek(heroProgress() * video.duration);
      stage.classList.add('video-ready');
      if ($('.ring')) swapRingForCue();
      // some mobile browsers only paint seeked frames after the video has played once
      const pr = heroVariant === 'm' && video.play && video.play();
      if (pr && pr.then) pr.then(() => { video.pause(); requestSeek(shown * video.duration); }).catch(() => {});
    }, { once: true });
  }

  async function loadHeroBlob(V, token) {
    if (location.protocol === 'file:') throw new Error('file protocol');
    const ctrl = new AbortController();
    let watchdog = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(V.video, { priority: 'low', signal: ctrl.signal });
    if (!res.ok || !res.body) throw new Error('video fetch failed');
    const total = Number(res.headers.get('Content-Length')) || V.bytes;
    const reader = res.body.getReader();
    const chunks = []; let got = 0, lastRing = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      clearTimeout(watchdog); watchdog = setTimeout(() => ctrl.abort(), 20000);
      chunks.push(value); got += value.length;
      const frac = Math.min(1, got / total); const now = performance.now();
      if (now - lastRing > 100 || frac === 1) { lastRing = now; ring.style.setProperty('--ld', Math.round(126 * (1 - frac))); }
    }
    clearTimeout(watchdog);
    ring.style.setProperty('--ld', 0);
    const key = V === VARIANTS.m ? 'm' : 'd';
    blobUrls[key] = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
    useVideo(blobUrls[key], token);
  }

  function swapRingForCue() {
    const cue = mk('span', 'cue');
    cue.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M5 8l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    ring.replaceWith(cue);
  }
  function failVideo() {
    if (stage.classList.contains('video-failed')) return;
    stage.classList.add('video-failed');
    if ($('.ring')) swapRingForCue();
  }

  function enableScrub() {
    if (scrubOn) return; scrubOn = true;
    addEventListener('scroll', onScroll, { passive: true });
    bands.forEach(b => { b.op = -1; b.k = -1; });
    loadStart = performance.now();
    target = shown = heroProgress();
    updateCaptions(shown);
    onScroll();
  }
  function disableScrub() {
    if (!scrubOn) return; scrubOn = false;
    removeEventListener('scroll', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }
  function applyHeroMode() {
    if (MQLS.some(m => m.matches)) { disableScrub(); return; }
    initHero(MQLS_M.some(m => m.matches) ? 'm' : 'd');
    enableScrub();
  }

  /* ==========================================================
     Page motion
     ========================================================== */
  // reveals, staggered within their parent, delays retired after the entrance
  let revealIO = null;
  const pendingReveals = new Set();
  function revealEl(el) {
    if (!pendingReveals.has(el)) return;
    pendingReveals.delete(el);
    el.classList.add('in');
    if (revealIO) revealIO.unobserve(el);
    setTimeout(() => el.classList.add('done'), 1800);
    if (el.classList.contains('stat')) countUp(el);
  }
  // safety net: anything on screen that is still hidden gets shown right away,
  // so a missed observer callback (Safari, restored scroll, fast flicks) can never leave a blank screen
  function sweepReveals() {
    if (!pendingReveals.size) return;
    const vh = innerHeight;
    pendingReveals.forEach(el => { const r = el.getBoundingClientRect(); if (r.top < vh && r.bottom > 0) revealEl(el); });
  }
  function initReveals() {
    const groups = new Map();
    $$('.reveal').forEach(el => {
      const p = el.parentElement; const n = groups.get(p) || 0; groups.set(p, n + 1);
      el.style.setProperty('--i', n % 6);
    });
    $$('.draw').forEach(svg => $$('*', svg).forEach(s => s.setAttribute('pathLength', '1')));
    $$('.dim-line,.flow-line').forEach(s => s.setAttribute('pathLength', '1'));
    $$('.reveal,.reveal-lines,.timeline').forEach(el => pendingReveals.add(el));
    if ('IntersectionObserver' in window) {
      revealIO = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) revealEl(e.target); }),
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      pendingReveals.forEach(el => revealIO.observe(el));
    } else {
      pendingReveals.forEach(revealEl);
    }
    addEventListener('load', sweepReveals);
    addEventListener('pageshow', sweepReveals);
    setTimeout(sweepReveals, 1200);
    setTimeout(sweepReveals, 3000);
  }

  function countUp(stat) {
    const el = $('.count', stat); if (!el) return;
    const to = +el.dataset.to;
    if (RM.matches) { el.textContent = to; return; }
    const t0 = performance.now(); el.textContent = '0';
    const step = now => {
      const k = clamp((now - t0) / 1300, 0, 1);
      const v = Math.round(easeOut(k) * to);
      if (el.textContent !== String(v)) el.textContent = v;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // living elements only run while their section is on screen
  function initLive() {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('live', e.isIntersecting)), { rootMargin: '10% 0px' });
    $$('section,.marquee').forEach(s => io.observe(s));
    document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));
  }

  // marquee: duplicated until each half is wider than any screen
  function initMarquee() {
    const names = ['CREALOGIX AG', 'DIGITERRA', 'Kühne+Nagel', 'Fiducia & GAD', 'Pascher+Heinz', 'Bundesagentur für Arbeit', 'Capgemini', 'BMW', 'Mercedes-Benz', 'antoni', 'Weleda'];
    const track = $('.marquee-track');
    const half = mk('div'); half.style.display = 'flex';
    // the separator is drawn, not typed: iOS shows the ✳ character as a green emoji
    const STAR = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v16M2 10h16M4.3 4.3l11.4 11.4M15.7 4.3L4.3 15.7"/></svg>';
    const addSet = () => names.forEach(n => { const it = mk('span', 'mq-item', n); const st = mk('span', 'mq-star'); st.innerHTML = STAR; it.append(st); half.append(it); });
    addSet(); track.append(half);
    let guard = 0;
    while (half.scrollWidth < 2600 && guard++ < 6) addSet();
    track.append(half.cloneNode(true));
  }

  // scroll-driven bits below the hero, one rAF per scroll burst
  const intro = $('#intro'), nameEl = $('.name');
  const statement = $('#statement'); let swords = [], lastLit = -1;
  const process = $('#process'), flowLine = $('.flow-line');
  const quotes = $('#quotes'), qSticky = $('.quotes-sticky'), qs = $$('.q'), qdots = $$('.q-dots i'); let lastQ = -1;
  const nav = $('#nav'); let navSolid = null;
  let lastW = -1, lastFd = -1, pageRaf = null;

  function prepStatement() {
    const el = $('.statement-text');
    const lines = el.innerHTML.split(/<br\s*\/?>/i).map(s => s.replace(/<[^>]+>/g, '').trim());
    el.textContent = '';
    lines.forEach((line, li) => {
      line.split(/\s+/).forEach((w, wi, arr) => { el.append(mk('span', 'sw', w)); if (wi < arr.length - 1) el.append(document.createTextNode(' ')); });
      if (li < lines.length - 1) el.append(mk('br'));
    });
    el.setAttribute('aria-label', lines.join(' '));
    swords = $$('.sw', el);
  }

  function onStatement() {
    if (!swords.length) return;
    const r = statement.getBoundingClientRect(); const vh = innerHeight;
    const q = clamp((vh * 0.82 - r.top) / (r.height * 0.9), 0, 1);
    const n = RM.matches || html.classList.contains('rm') ? swords.length : Math.round(q * swords.length * 1.1);
    if (n === lastLit) return; lastLit = n;
    swords.forEach((w, i) => w.classList.toggle('lit', i < n));
  }

  function pageFrame() {
    pageRaf = null;
    const vh = innerHeight;
    sweepReveals();
    // nav goes solid once the journey is behind us
    const solid = scrubOn ? hero.getBoundingClientRect().bottom < vh * 0.2 : scrollY > 40;
    if (solid !== navSolid) { navSolid = solid; nav.classList.toggle('solid', solid); }
    // the name gains weight as it moves up the screen (variable weight axis)
    const ir = intro.getBoundingClientRect();
    if (ir.top < vh && ir.bottom > 0) {
      const tt = RM.matches ? 1 : clamp((vh - ir.top) / (vh * 0.95), 0, 1);
      const w = Math.round((100 + easeOut(tt) * 700) / 4) * 4;
      if (w !== lastW) { lastW = w; nameEl.style.setProperty('--nw', w); }
    }
    // statement words light up
    const sr = statement.getBoundingClientRect();
    if (sr.top < vh && sr.bottom > 0) onStatement();
    // process flow line draws across
    const pr = process.getBoundingClientRect();
    if (pr.top < vh && pr.bottom > 0) {
      const fd = RM.matches ? 0 : 1 - clamp((vh * 0.9 - pr.top) / (pr.height * 0.6), 0, 1);
      if (Math.abs(fd - lastFd) > 0.005) { lastFd = fd; flowLine.style.setProperty('--fd', fd.toFixed(3)); }
    }
    // quotes, one after the other
    const qr = quotes.getBoundingClientRect();
    if (qr.top < vh && qr.bottom > 0) {
      // the pin travels from its sticky top until the section runs out (full screen on desktop, compact on phones)
      const top0 = parseFloat(getComputedStyle(qSticky).top) || 0;
      const range = quotes.offsetHeight - qSticky.offsetHeight;
      const q = range > 0 ? clamp((top0 - qr.top) / range, 0, 0.999) : 0;
      const idx = Math.floor(q * qs.length);
      if (idx !== lastQ) { lastQ = idx; qs.forEach((el, i) => el.classList.toggle('on', i === idx)); qdots.forEach((d, i) => d.classList.toggle('on', i <= idx)); }
    }
  }
  function onPageScroll() { if (pageRaf === null) pageRaf = requestAnimationFrame(pageFrame); }

  /* ==========================================================
     The signature: press and hold to reveal the grid
     ========================================================== */
  const work = $('#work'), hold = $('#hold');
  let hp = 0, holding = false, gridOn = false, holdRaf = null, holdLast = 0, offAnim = false;
  const HOLD_MS = 1100, RELEASE_MS = 900, OFF_MS = 650;

  function buildGrid() {
    const specs = { 'm-wide': ['1440', '24'], 'm-phone': ['375', '16'] };
    $$('.m', work).forEach(m => {
      const kind = m.classList.contains('m-phone') ? 'm-phone' : (m.classList.contains('m-wide') ? 'm-wide' : 'm-wide');
      const [wv, sv] = specs[kind];
      const gl = mk('div', 'gl'); gl.setAttribute('aria-hidden', 'true');
      const cols = mk('div', 'gl-cols');
      const n = kind === 'm-phone' ? 4 : 12;
      cols.style.setProperty('--n', n); cols.style.setProperty('--cg', n === 4 ? '5%' : '1.6%');
      for (let i = 0; i < n; i++) { const c = mk('i'); c.style.setProperty('--ci', i * (12 / n)); cols.append(c); }
      const mx = mk('div', 'gl-mx'); mx.append(mk('span', 'gl-val', wv));
      const my = mk('div', 'gl-my'); my.append(mk('span', 'gl-val', sv));
      gl.append(cols, mk('div', 'gl-box'), mx, my, mk('span', 'gl-tag', m.dataset.gl || 'Component'));
      m.append(gl);
    });
  }
  function setG(v) {
    work.style.setProperty('--g', v.toFixed(3));
    hold.style.setProperty('--hp', hp.toFixed(3));
  }
  function setHoldLabel() {
    $('.hold-title', hold).innerHTML = gridOn ? t('holdOff') : t('holdTitle');
    $('.hold-hint', hold).innerHTML = gridOn ? t('holdHintOff') : t('holdHint');
    hold.setAttribute('aria-pressed', String(gridOn));
    hold.classList.toggle('is-on', gridOn);
    document.body.classList.toggle('grid-on', gridOn);
  }
  function holdLoop(now) {
    const dt = now - (holdLast || now); holdLast = now;
    if (offAnim) {
      hp = Math.max(0, hp - dt / OFF_MS);
      setG(easeOut(hp));
      if (hp <= 0) { offAnim = false; holdRaf = null; holdLast = 0; return; }
    } else if (holding) {
      hp = Math.min(1, hp + dt / HOLD_MS);
      setG(easeOut(hp));
      if (hp >= 1) { holding = false; gridOn = true; setHoldLabel(); holdRaf = null; holdLast = 0; return; }
    } else {
      hp = Math.max(0, hp - dt / RELEASE_MS);   // released early: ease back, never snap
      setG(easeOut(hp));
      if (hp <= 0) { holdRaf = null; holdLast = 0; return; }
    }
    holdRaf = requestAnimationFrame(holdLoop);
  }
  function kick() { if (holdRaf === null) { holdLast = 0; holdRaf = requestAnimationFrame(holdLoop); } }
  function press() {
    if (gridOn) return;
    if (RM.matches) { gridOn = true; hp = 1; setG(1); setHoldLabel(); return; }
    holding = true; offAnim = false; kick();
  }
  function release() {
    if (gridOn && !holding) {
      if (hp >= 1 || RM.matches) {
        gridOn = false; setHoldLabel();
        if (RM.matches) { hp = 0; setG(0); } else { offAnim = true; kick(); }
      }
      return;
    }
    holding = false; kick();
  }
  function initHold() {
    buildGrid();
    let downWhileOn = false;
    hold.addEventListener('pointerdown', e => { e.preventDefault(); downWhileOn = gridOn; hold.setPointerCapture?.(e.pointerId); press(); });
    hold.addEventListener('pointerup', () => { if (downWhileOn) release(); else if (holding) release(); downWhileOn = false; });
    hold.addEventListener('pointercancel', () => { if (holding) release(); });
    hold.addEventListener('lostpointercapture', () => { if (holding) release(); });
    hold.addEventListener('keydown', e => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); downWhileOn = gridOn; press(); }
    });
    hold.addEventListener('keyup', e => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (downWhileOn) release(); else if (holding) release(); downWhileOn = false; }
    });
    hold.addEventListener('click', e => e.preventDefault());
    hold.addEventListener('contextmenu', e => e.preventDefault());
  }

  /* ==========================================================
     Nav, menu, language, form
     ========================================================== */
  function initMenu() {
    const btn = $('.menu-btn'), menu = $('#menu');
    const close = () => { btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', t('menuOpen')); menu.classList.remove('open'); setTimeout(() => { if (!menu.classList.contains('open')) menu.hidden = true; }, 450); document.body.style.overflow = ''; };
    const open = () => { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('open')); btn.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-label', t('menuClose')); document.body.style.overflow = 'hidden'; $('a', menu).focus(); };
    btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? close() : open()));
    $$('a', menu).forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { close(); btn.focus(); } });
  }

  function initLang() {
    harvestDE();
    const saved = store.get('lang');
    const initial = saved === 'de' || saved === 'en' ? saved : ((navigator.language || 'de').toLowerCase().startsWith('de') ? 'de' : 'en');
    $$('[data-split]').forEach(splitText);
    $$('.reveal-lines').forEach(wrapLines);
    prepStatement();
    applyLang('de', true);
    if (initial === 'en') applyLang('en', false);
    $$('.lang-btn').forEach(b => b.addEventListener('click', () => { if (b.dataset.lang !== lang) { applyLang(b.dataset.lang, false); store.set('lang', lang); } }));
  }

  function initForm() {
    const form = $('#form'), err = $('#form-error'), ok = $('#form-ok');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim(), mail = form.email.value.trim(), msg = form.message.value.trim();
      const bad = [!name && form.name, !/^\S+@\S+\.\S+$/.test(mail) && form.email, !msg && form.message].filter(Boolean);
      $$('input,textarea', form).forEach(f => f.removeAttribute('aria-invalid'));
      if (bad.length) { bad.forEach(f => f.setAttribute('aria-invalid', 'true')); err.hidden = false; ok.hidden = true; bad[0].focus(); return; }
      err.hidden = true;
      const topicInput = form.querySelector('input[name="topic"]:checked');
      const topic = topicInput ? topicInput.nextElementSibling.textContent.trim() : '';
      const subject = `${t('mailSubject')}: ${topic} (${name})`;
      const body = `${msg}\n\n${t('mailFrom')}: ${name}\n${mail}`;
      window.location.href = `mailto:info@faydesign.ch?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      ok.hidden = false;
    });
  }

  /* ==========================================================
     Reduced motion, honoured live in both directions
     ========================================================== */
  function pinToFinalStates() {
    html.classList.add('rm');
    [...pendingReveals].forEach(revealEl);
    $$('.reveal,.reveal-lines,.timeline').forEach(el => el.classList.add('in', 'done'));
    $$('.count').forEach(c => { c.textContent = c.dataset.to; });
    lastLit = -1; onStatement();
    flowLine.style.setProperty('--fd', 0); lastFd = 0;
    nameEl.style.setProperty('--nw', 800); lastW = 800;
    if (holding) { holding = false; gridOn = true; hp = 1; setG(1); setHoldLabel(); }
    if (holdRaf) { cancelAnimationFrame(holdRaf); holdRaf = null; }
  }
  function unpinFinalStates() {
    html.classList.remove('rm');
    lastLit = -1; lastW = -1; lastFd = -1; lastQ = -1;
    pageFrame();
  }

  /* ==========================================================
     Boot
     ========================================================== */
  /* ==========================================================
     Light / dark theme
     ========================================================== */
  const SCHEME = matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => html.getAttribute('data-theme') === 'dark';
  function updateThemeUI() {
    const dark = isDark();
    $$('.theme-btn').forEach(b => { b.setAttribute('aria-pressed', String(dark)); b.setAttribute('aria-label', t(dark ? 'themeToLight' : 'themeToDark')); b.title = t(dark ? 'themeToLight' : 'themeToDark'); });
    $('meta[name="theme-color"]').setAttribute('content', dark ? '#141312' : '#E7E4E0');
  }
  function setTheme(next, persist) {
    if (persist) store.set('theme', next);
    const apply = () => { html.setAttribute('data-theme', next); updateThemeUI(); };
    if (document.startViewTransition && !RM.matches) document.startViewTransition(apply); else apply();
  }
  function initTheme() {
    if (!html.getAttribute('data-theme')) html.setAttribute('data-theme', SCHEME.matches ? 'dark' : 'light');
    updateThemeUI();
    $$('.theme-btn').forEach(b => b.addEventListener('click', () => setTheme(isDark() ? 'light' : 'dark', true)));
    SCHEME.addEventListener('change', e => { const saved = store.get('theme'); if (saved !== 'dark' && saved !== 'light') setTheme(e.matches ? 'dark' : 'light', false); });
  }

  /* ==========================================================
     Cookie notice: informational, there is nothing to consent to
     ========================================================== */
  function initNotice() {
    const box = $('#notice');
    if (!box || store.get('notice') === 'ok') return;
    box.hidden = false;
    setTimeout(() => box.classList.add('in'), RM.matches ? 0 : 1400);
    $('.notice-ok', box).addEventListener('click', () => {
      store.set('notice', 'ok');
      box.classList.remove('in');
      setTimeout(() => { box.hidden = true; }, RM.matches ? 0 : 700);
    });
  }

  function safe(name, fn) { try { fn(); } catch (err) { console.error('[site] ' + name + ' failed', err); } }
  function boot() {
    safe('reveals', initReveals);
    safe('lang', initLang);
    safe('theme', initTheme);
    safe('marquee', initMarquee);
    safe('live', initLive);
    safe('hold', initHold);
    safe('menu', initMenu);
    safe('form', initForm);
    safe('notice', initNotice);
    safe('hero', () => {
      new IntersectionObserver(es => es.forEach(e => {
        heroOnScreen = e.isIntersecting;
        if (heroOnScreen && scrubOn) onScroll();
      })).observe(hero);
      MQLS.concat(MQLS_M).forEach(m => m.addEventListener('change', applyHeroMode));
      RM.addEventListener('change', e => { if (e.matches) pinToFinalStates(); else { unpinFinalStates(); applyHeroMode(); } });
      if (RM.matches) pinToFinalStates();
      applyHeroMode();
    });
    addEventListener('scroll', onPageScroll, { passive: true });
    addEventListener('resize', () => { onPageScroll(); if (scrubOn) onScroll(); }, { passive: true });
    safe('frame', pageFrame);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
