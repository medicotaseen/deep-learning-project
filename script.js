// script.js - theme toggle, hamburger menu, header show-only-at-top

(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const header = document.querySelector('header');
  const menuLinks = document.querySelectorAll('.menu-link');

  // Utilities
  const setThemeClass = (mode) => {
    root.classList.remove('light','dark');
    if(mode === 'dark') root.classList.add('dark');
    else if(mode === 'light') root.classList.add('light');
    themeToggle.setAttribute('aria-pressed', mode === 'dark');
    // update label
    const label = themeToggle.querySelector('.toggle-label');
    if(label) label.textContent = mode === 'dark' ? 'Dark' : 'Light';
    // update icons (show moon for dark, sun for light)
    const sun = themeToggle.querySelector('.icon.sun');
    const moon = themeToggle.querySelector('.icon.moon');
    if(sun && moon){
      if(mode === 'dark'){
        sun.style.display = 'none';
        moon.style.display = 'inline-block';
      } else {
        sun.style.display = 'inline-block';
        moon.style.display = 'none';
      }
    }
  }

  // init theme from localStorage or prefers-color-scheme
  const initTheme = () => {
    const saved = localStorage.getItem('site-theme');
    if(saved) return setThemeClass(saved);
    // default to light when no saved pref
    setThemeClass('light');
  }

  // toggle handler
  if(themeToggle){
    themeToggle.addEventListener('click', () => {
      const isDark = root.classList.contains('dark');
      const next = isDark ? 'light' : 'dark';
      // add animating class to root to smooth color transitions
      document.documentElement.classList.add('theme-animating');
      // trigger the class removal after the same duration as CSS
      window.setTimeout(()=> document.documentElement.classList.remove('theme-animating'), 460);
      setThemeClass(next);
      localStorage.setItem('site-theme', next);
    });
  }

  // hamburger open/close
  if(hamburger && mobileMenu){
    const toggleMenu = (open) => {
      const isOpen = typeof open === 'boolean' ? open : mobileMenu.getAttribute('aria-hidden') === 'true';
      // keep body scrollable while menu is open for seamless experience
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      hamburger.setAttribute('aria-expanded', String(isOpen));
    }

    hamburger.addEventListener('click', () => toggleMenu());

    // close when clicking outside or on link
    mobileMenu.addEventListener('click', (e) => {
      if(e.target === mobileMenu) toggleMenu(false);
    });

    menuLinks.forEach(a => a.addEventListener('click', (e)=>{
      e.preventDefault();
      const action = a.dataset.action;
      if(action === 'about'){
        openAbout();
        toggleMenu(false);
        return;
      }
      const target = a.dataset.target;
      // check corresponding radio
      const radio = document.getElementById(target);
      if(radio) radio.checked = true;
      toggleMenu(false);
    }))
  }

  // About modal
  const aboutBtn = document.getElementById('aboutBtn');
  const aboutModal = document.getElementById('aboutModal');
  const aboutClose = () => {
    if(!aboutModal) return;
    aboutModal.setAttribute('aria-hidden','true');
  }
  const openAbout = () => {
    if(!aboutModal) return;
    aboutModal.setAttribute('aria-hidden','false');
  }
  if(aboutBtn) aboutBtn.addEventListener('click', openAbout);
  if(aboutModal){
    aboutModal.addEventListener('click', (e)=>{
      // close when clicking overlay but not when clicking inside card
      if(e.target === aboutModal) aboutClose();
    });
    const closeBtn = aboutModal.querySelector('.about-close');
    if(closeBtn) closeBtn.addEventListener('click', aboutClose);
    // close on Escape
    window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') aboutClose() });
  }

  // Header: show only when at top. We'll hide header when user scrolls down even slightly.
  // header should remain visible at the top (no hide-on-scroll). Remove previous logic.

  function throttle(fn, wait){
    let t = 0;
    return function(...args){
      const now = Date.now();
      if(now - t >= wait){ t = now; fn.apply(this,args); }
    }
  }

  // Init
  initTheme();
  // init complete

  // Compute average color for images and apply as shadow if possible
  const images = document.querySelectorAll('.card-img');
  images.forEach(img => {
    // only compute for images with absolute URL or same-origin; try-catch for CORS
    const applyImageShadow = (image) => {
      try{
        const canvas = document.createElement('canvas');
        const w = Math.min(40, image.naturalWidth);
        const h = Math.min(40, image.naturalHeight);
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, w, h);
        const data = ctx.getImageData(0,0,w,h).data;
        let r=0,g=0,b=0,count=0;
        for(let i=0;i<data.length;i+=4){ r += data[i]; g += data[i+1]; b += data[i+2]; count++; }
        r = Math.round(r/count); g = Math.round(g/count); b = Math.round(b/count);
        image.style.setProperty('--img-shadow', `${r} ${g} ${b}`);
        image.setAttribute('data-has-shadow','true');
      }catch(err){
        // ignore (likely CORS), leave default shadow
      }
    }

    if(img.complete && img.naturalWidth){ applyImageShadow(img); }
    else img.addEventListener('load', ()=> applyImageShadow(img));
  })
})();
