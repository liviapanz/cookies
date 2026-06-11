// Seleciona os elementos HTML que o script vai manipular.
// Esses elementos precisam existir no HTML para que o código funcione.
const loginForm = document.getElementById('login-form');
const loginCard = document.getElementById('login-card');
const welcomeCard = document.getElementById('welcome-card');
const welcomeText = document.getElementById('welcome-text');
const logoutBtn = document.getElementById('logout-btn');
const messageEl = document.getElementById('message');
const themeToggleBtn = document.getElementById('theme-toggle');
const togglePasswordBtn = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');

// Define nomes de cookies e duração do armazenamento.
const COOKIE_NAME = 'usuarioLogado';
const REMEMBER_COOKIE = 'lembrarLogin';
const THEME_COOKIE = 'temaPreferido';
const COOKIE_DAYS = 7;

// Grava um cookie no navegador com nome, valor e validade.
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
}

// Lê um cookie pelo nome e retorna seu valor.
// Se não encontrar, retorna string vazia.
function getCookie(name) {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const found = cookies.find(cookie => cookie.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.split('=')[1]) : '';
}

// Remove um cookie definindo sua expiração no passado.
function eraseCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// Aplica o tema escolhido atualizando a classe do body.
function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('light-theme', isLight);

  // Atualiza o ícone do botão de tema para indicar o estado atual.
  themeToggleBtn.textContent = isLight ? '☀️' : '🌙';
  themeToggleBtn.setAttribute('aria-label', isLight ? 'Mudar para modo escuro' : 'Mudar para modo claro');
}

// Mostra uma mensagem ao usuário.
// Se isError for true, aplica estilo de erro.
function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle('error', isError);
}

// Mostra a tela de boas-vindas e oculta o formulário de login.
function showWelcome(user) {
  welcomeText.textContent = `Olá, ${user}! Você está logado usando cookie.`;
  loginCard.classList.add('hidden');
  welcomeCard.classList.remove('hidden');
}

// Mostra o formulário de login e esconde a tela de boas-vindas.
function showLogin() {
  loginCard.classList.remove('hidden');
  welcomeCard.classList.add('hidden');
  showMessage(''); // Limpa mensagens anteriores.
}

// Valida o login quando o formulário é enviado.
function handleLogin(event) {
  event.preventDefault(); // Impede o envio padrão do formulário.

  const username = loginForm.username.value.trim();
  const password = loginForm.password.value.trim();
  const remember = document.getElementById('remember').checked;

  if (!username || !password) {
    showMessage('Preencha usuário e senha.', true);
    return;
  }

  // Simulação de usuário/senha válidos para demonstração.
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

// Faz logout: apaga o cookie de login e mostra o formulário novamente.
function handleLogout() {
  eraseCookie(COOKIE_NAME);
  eraseCookie(REMEMBER_COOKIE);
  loginForm.reset();
  showLogin();
}

// Alterna entre tema claro e escuro e grava a escolha em cookie.
function toggleTheme() {
  const current = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  const nextTheme = current === 'light' ? 'dark' : 'light';
  setCookie(THEME_COOKIE, nextTheme, COOKIE_DAYS);
  applyTheme(nextTheme);
}

// Alterna a visibilidade do campo de senha.
function togglePasswordVisibility() {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
  togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
}

// Inicializa a interface quando a página carrega.
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

// Conecta as funções aos eventos do usuário.
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
themeToggleBtn.addEventListener('click', toggleTheme);
togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
window.addEventListener('DOMContentLoaded', init);
