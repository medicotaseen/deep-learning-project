// This file handles only the dark-mode toggle.
// The menu and about modal are controlled by the checkbox hack in the HTML and CSS.

(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  const setThemeClass = (mode) => {
    root.classList.remove('light', 'dark');

    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }

    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(mode === 'dark'));

      const label = themeToggle.querySelector('.toggle-label');
      if (label) {
        label.textContent = mode === 'dark' ? 'Dark' : 'Light';
      }

      const sun = themeToggle.querySelector('.icon.sun');
      const moon = themeToggle.querySelector('.icon.moon');
      if (sun && moon) {
        sun.style.display = mode === 'dark' ? 'none' : 'inline-block';
        moon.style.display = mode === 'dark' ? 'inline-block' : 'none';
      }
    }
  };

  const initTheme = () => {
    const saved = localStorage.getItem('site-theme');
    if (saved === 'dark' || saved === 'light') {
      setThemeClass(saved);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setThemeClass(prefersDark ? 'dark' : 'light');
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.classList.contains('dark');
      const nextMode = isDark ? 'light' : 'dark';

      root.classList.add('theme-animating');
      window.setTimeout(() => root.classList.remove('theme-animating'), 420);

      setThemeClass(nextMode);
      localStorage.setItem('site-theme', nextMode);
    });
  }

  initTheme();
})();
