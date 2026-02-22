let currentStep = 'phone';
let phoneNumber = '';

function handlePhoneSubmit() {
    phoneNumber = document.getElementById('phone').value.trim();
    
    if (phoneNumber.length < 10) {
        alert('Введите корректный номер телефона');
        return;
    }
    
    // Симуляция отправки кода
    showCodeStep();
}

function showCodeStep() {
    document.getElementById('phone-step').classList.remove('active');
    document.getElementById('code-step').classList.add('active');
    document.getElementById('auth-title').textContent = 'Введите код';
    document.getElementById('auth-subtitle').textContent = `Мы отправили код на ${phoneNumber}`;
    currentStep = 'code';
}

function verifyCode() {
    const code = document.getElementById('code').value;
    
    if (code.length !== 6) {
        alert('Введите 6-значный код');
        return;
    }
    
    // Проверяем, новый ли пользователь
    const users = JSON.parse(localStorage.getItem('selema_users') || '{}');
    
    if (users[phoneNumber]) {
        // Существующий пользователь - входим
        localStorage.setItem('selema_current_user', JSON.stringify(users[phoneNumber]));
        window.location.href = 'app.html';
    } else {
        // Новый пользователь - показываем форму регистрации
        showProfileStep();
    }
}

function showProfileStep() {
    document.getElementById('code-step').classList.remove('active');
    document.getElementById('profile-step').classList.add('active');
    document.getElementById('auth-title').textContent = 'Ваши данные';
    document.getElementById('auth-subtitle').textContent = 'Пожалуйста, укажите ваше имя';
    currentStep = 'profile';
}

function completeRegistration() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    let username = document.getElementById('username').value.trim();
    
    if (!firstName) {
        alert('Введите имя');
        return;
    }
    
    if (!username) {
        alert('Введите username для поиска друзей');
        return;
    }
    
    // Убираем @ если пользователь его ввел
    if (username.startsWith('@')) {
        username = username.substring(1);
    }
    
    // Проверяем формат username (только буквы, цифры и подчеркивание)
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(username)) {
        alert('Username должен содержать от 3 до 32 символов (буквы, цифры, _)');
        return;
    }
    
    // Проверяем уникальность username
    const users = JSON.parse(localStorage.getItem('selema_users') || '{}');
    const usernameExists = Object.values(users).some(u => u.username && u.username.toLowerCase() === username.toLowerCase());
    
    if (usernameExists) {
        alert('Этот username уже занят. Выберите другой.');
        return;
    }
    
    // Создаем нового пользователя
    const user = {
        phone: phoneNumber,
        firstName: firstName,
        lastName: lastName,
        username: username,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    
    // Сохраняем пользователя
    users[phoneNumber] = user;
    localStorage.setItem('selema_users', JSON.stringify(users));
    
    // Создаем отдельное хранилище для каждого пользователя
    localStorage.setItem('selema_current_user', JSON.stringify(user));
    
    // Переходим в приложение
    window.location.href = 'app.html';
}

function backToPhone() {
    document.getElementById('code-step').classList.remove('active');
    document.getElementById('phone-step').classList.add('active');
    document.getElementById('auth-title').textContent = 'Вход в Selema';
    document.getElementById('auth-subtitle').textContent = 'Введите ваш номер телефона';
    currentStep = 'phone';
}

// Проверяем, авторизован ли пользователь
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('selema_current_user');
    if (currentUser) {
        window.location.href = 'app.html';
    }
});
