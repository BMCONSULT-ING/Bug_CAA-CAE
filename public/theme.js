const STORAGE_KEY = 'caa-cae-theme';

function getTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'light';
}

function setTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

function initTheme() {
  setTheme(getTheme());
}

function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  updateThemeButton(next);
}

function updateThemeButton(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateThemeButton(getTheme());
});
