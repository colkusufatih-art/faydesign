/* Fatih Cölkusu · legal pages (Impressum, Datenschutz)
   Plain JS, no build: language, light/dark theme and the cookie notice. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const SCHEME = matchMedia('(prefers-color-scheme: dark)');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  /* language: German text lives in the markup, English in data-en attributes and data-doc blocks */
  let lang = 'de';
  const LABELS = {
    de: { toDark: 'Dunkelmodus einschalten', toLight: 'Hellmodus einschalten' },
    en: { toDark: 'Switch to dark mode', toLight: 'Switch to light mode' }
  };
  $$('[data-en]').forEach(el => { el.dataset.de = el.innerHTML; });
  $$('[data-en-label]').forEach(el => { el.dataset.deLabel = el.getAttribute('aria-label') || ''; });
  const titleDe = document.title;

  function applyLang(next) {
    lang = next;
    html.lang = lang;
    document.title = lang === 'en' ? (html.dataset.titleEn || titleDe) : titleDe;
    $$('[data-en]').forEach(el => { el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.de; });
    $$('[data-en-label]').forEach(el => el.setAttribute('aria-label', lang === 'en' ? el.dataset.enLabel : el.dataset.deLabel));
    $$('[data-doc]').forEach(el => { el.hidden = el.dataset.doc !== lang; });
    $$('.lang-btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    updateThemeUI();
  }

  /* theme */
  const isDark = () => html.getAttribute('data-theme') === 'dark';
  function updateThemeUI() {
    const dark = isDark(), label = LABELS[lang][dark ? 'toLight' : 'toDark'];
    $$('.theme-btn').forEach(b => { b.setAttribute('aria-pressed', String(dark)); b.setAttribute('aria-label', label); b.title = label; });
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#141312' : '#E7E4E0');
  }
  function setTheme(next, persist) {
    if (persist) store.set('theme', next);
    const apply = () => { html.setAttribute('data-theme', next); updateThemeUI(); };
    if (document.startViewTransition && !RM.matches) document.startViewTransition(apply); else apply();
  }

  /* cookie notice: informational, there is nothing to consent to */
  function initNotice() {
    const box = $('#notice');
    if (!box || store.get('notice') === 'ok') return;
    box.hidden = false;
    setTimeout(() => box.classList.add('in'), RM.matches ? 0 : 900);
    $('.notice-ok', box).addEventListener('click', () => {
      store.set('notice', 'ok');
      box.classList.remove('in');
      setTimeout(() => { box.hidden = true; }, RM.matches ? 0 : 700);
    });
  }

  const saved = store.get('lang');
  applyLang(saved === 'de' || saved === 'en' ? saved : ((navigator.language || 'de').toLowerCase().startsWith('de') ? 'de' : 'en'));
  $$('.lang-btn').forEach(b => b.addEventListener('click', () => { if (b.dataset.lang !== lang) { applyLang(b.dataset.lang); store.set('lang', lang); } }));
  $$('.theme-btn').forEach(b => b.addEventListener('click', () => setTheme(isDark() ? 'light' : 'dark', true)));
  SCHEME.addEventListener('change', e => { const t = store.get('theme'); if (t !== 'dark' && t !== 'light') setTheme(e.matches ? 'dark' : 'light', false); });
  initNotice();
})();
