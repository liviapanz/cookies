const loginForm = document.getElementById('login-form');
const loginCard = document.getElementById('login-card');
const welcomeCard = document.getElementById('welcome-card');
const welcomeText = document.getElementById('welcome-text');
const logoutBtn = document.getElementById('logout-btn');
const messageEl = document.getElementById('message');
const themeToggleBtn = document.getElementById('theme-toggle');
const togglePasswordBtn = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');

const COOKIE_NAME = 'usuarioLogado';
const REMEMBER_COOKIE = 'lembrarLogin';
const THEME_COOKIE = 'temaPreferido';
const COOKIE_DAYS = 7;

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const found = cookies.find(cookie => cookie.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.split('=')[1]) : '';
}

function eraseCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('light-theme', isLight);
  themeToggleBtn.textContent = isLight ? '☀️' : '🌙';
  themeToggleBtn.setAttribute('aria-label', isLight ? 'Mudar para modo escuro' : 'Mudar para modo claro');
}

function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle('error', isError);
}

function showWelcome(user) {
  welcomeText.textContent = `Olá, ${user}! Você está logado usando cookie.`;
  loginCard.classList.add('hidden');
  welcomeCard.classList.remove('hidden');
}

function showLogin() {
  loginCard.classList.remove('hidden');
  welcomeCard.classList.add('hidden');
  showMessage('');
}

function handleLogin(event) {
  event.preventDefault();
  const username = loginForm.username.value.trim();
  const password = loginForm.password.value.trim();
  const remember = document.getElementById('remember').checked;

  if (!username || !password) {
    showMessage('Preencha usuário e senha.', true);
    return;
  }

  const validUser = 'aluno';
  const validPassword = 'ifc123';

  if (username === validUser && password === validPassword) {
    setCookie(COOKIE_NAME, username, COOKIE_DAYS);
    if (remember) {
      setCookie(REMEMBER_COOKIE, 'true', COOKIE_DAYS);
    } else {
      eraseCookie(REMEMBER_COOKIE);
    }
    showWelcome(username);
  } else {
    showMessage('Usuário ou senha inválidos.', true);
  }
}

function handleLogout() {
  eraseCookie(COOKIE_NAME);
  eraseCookie(REMEMBER_COOKIE);
  loginForm.reset();
  showLogin();
}

function toggleTheme() {
  const current = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  const nextTheme = current === 'light' ? 'dark' : 'light';
  setCookie(THEME_COOKIE, nextTheme, COOKIE_DAYS);
  applyTheme(nextTheme);
}

function togglePasswordVisibility() {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
  togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
}

function init() {
  const cookieUser = getCookie(COOKIE_NAME);
  const remember = getCookie(REMEMBER_COOKIE);
  const theme = getCookie(THEME_COOKIE) || 'dark';

  applyTheme(theme);

  if (cookieUser) {
    showWelcome(cookieUser);
  } else {
    if (remember === 'true') {
      loginForm.username.value = 'aluno';
      document.getElementById('remember').checked = true;
    }
    showLogin();
  }
}

loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
themeToggleBtn.addEventListener('click', toggleTheme);
togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
window.addEventListener('DOMContentLoaded', init);
