let currentStep = 'login';

function showLogin() {
    document.getElementById('register-step').classList.remove('active');
    document.getElementById('login-step').classList.add('active');
    document.getElementById('auth-title').textContent = 'Вход в Selema';
    document.getElementById('auth-subtitle').textContent = 'Войдите или создайте аккаунт';
    currentStep = 'login';
}

function showRegister() {
    document.getElementById('login-step').classList.remove('active');
    document.getElementById('register-step').classList.add('active');
    document.getElementById('auth-title').textContent = 'Регистрация';
    document.getElementById('auth-subtitle').textContent = 'Создайте новый аккаунт';
    currentStep = 'register';
}

function handleLogin() {
    let username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        alert('Заполните все поля');
        return;
    }
    
    // Убираем @ если есть
    if (username.startsWith('@')) {
        username = username.substring(1);
    }
    
    const users = JSON.parse(localStorage.getItem('selema_users') || '{}');
    const user = Object.values(users).find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
        alert('Пользователь не найден');
        return;
    }
    
    if (user.password !== password) {
        alert('Неверный пароль');
        return;
    }
    
    // Успешный вход
    localStorage.setItem('selema_current_user', JSON.stringify(user));
    window.location.href = 'app.html';
}

function handleRegister() {
    const firstName = document.getElementById('reg-firstname').value.trim();
    const lastName = document.getElementById('reg-lastname').value.trim();
    let username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;
    
    if (!firstName) {
        alert('Введите имя');
        return;
    }
    
    if (!username) {
        alert('Введите username');
        return;
    }
    
    // Убираем @ если есть
    if (username.startsWith('@')) {
        username = username.substring(1);
    }
    
    // Проверяем формат username
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(username)) {
        alert('Username: 3-32 символа (буквы, цифры, _)');
        return;
    }
    
    if (!password || password.length < 6) {
        alert('Пароль должен быть минимум 6 символов');
        return;
    }
    
    if (password !== passwordConfirm) {
        alert('Пароли не совпадают');
        return;
    }
    
    // Проверяем уникальность username
    const users = JSON.parse(localStorage.getItem('selema_users') || '{}');
    const usernameExists = Object.values(users).some(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (usernameExists) {
        alert('Username уже занят');
        return;
    }
    
    // Создаем пользователя
    const userId = 'user_' + Date.now();
    const user = {
        id: userId,
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    // Сохраняем
    users[userId] = user;
    localStorage.setItem('selema_users', JSON.stringify(users));
    localStorage.setItem('selema_current_user', JSON.stringify(user));
    
    alert('Аккаунт создан!');
    window.location.href = 'app.html';
}

// Проверяем авторизацию
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('selema_current_user');
    if (currentUser) {
        window.location.href = 'app.html';
    }
});
