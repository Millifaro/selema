let currentUser = null;
let currentChat = null;
let chats = [];
let messages = {};

// Инициализация приложения
window.addEventListener('DOMContentLoaded', () => {
    // Проверяем авторизацию
    const userStr = localStorage.getItem('selema_current_user');
    if (!userStr) {
        window.location.href = 'auth.html';
        return;
    }
    
    currentUser = JSON.parse(userStr);
    
    // Загружаем данные
    loadChats();
    loadMessages();
    updateUserInfo();
    renderChats();
});

function updateUserInfo() {
    document.getElementById('user-name').textContent = 
        `${currentUser.firstName} ${currentUser.lastName || ''}`.trim();
    document.getElementById('user-phone').textContent = currentUser.phone;
}

function loadChats() {
    const savedChats = localStorage.getItem('selema_chats_' + currentUser.id);
    if (savedChats) {
        chats = JSON.parse(savedChats);
    } else {
        // Создаем демо-чаты для примера
        chats = [
            {
                id: '1',
                name: 'Избранное',
                avatar: '⭐',
                lastMessage: 'Сохраненные сообщения',
                time: '12:30',
                unread: 0
            },
            {
                id: '2',
                name: 'Поддержка Selema',
                avatar: '💬',
                lastMessage: 'Добро пожаловать в Selema!',
                time: '10:15',
                unread: 1
            }
        ];
        saveChats();
    }
}

function saveChats() {
    localStorage.setItem('selema_chats_' + currentUser.id, JSON.stringify(chats));
}

function loadMessages() {
    const savedMessages = localStorage.getItem('selema_messages_' + currentUser.id);
    if (savedMessages) {
        messages = JSON.parse(savedMessages);
    } else {
        // Демо-сообщения
        messages = {
            '2': [
                {
                    id: '1',
                    text: 'Добро пожаловать в Selema! 👋',
                    time: '10:15',
                    type: 'in'
                },
                {
                    id: '2',
                    text: 'Здесь вы можете общаться с друзьями и близкими.',
                    time: '10:15',
                    type: 'in'
                }
            ]
        };
        saveMessages();
    }
}

function saveMessages() {
    localStorage.setItem('selema_messages_' + currentUser.id, JSON.stringify(messages));
}

function renderChats() {
    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = '';
    
    chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        if (currentChat && currentChat.id === chat.id) {
            chatItem.classList.add('active');
        }
        
        chatItem.innerHTML = `
            <div class="avatar">${chat.avatar}</div>
            <div class="chat-item-content">
                <div class="chat-item-header">
                    <span class="chat-item-name">${chat.name}</span>
                    <span class="chat-item-time">${chat.time}</span>
                </div>
                <div class="chat-item-message">${chat.lastMessage}</div>
            </div>
        `;
        
        chatItem.onclick = () => openChat(chat);
        chatList.appendChild(chatItem);
    });
}

function openChat(chat) {
    currentChat = chat;
    document.getElementById('chat-name').textContent = chat.name;
    document.getElementById('chat-status').textContent = 'онлайн';
    
    renderMessages();
    renderChats();
}

function renderMessages() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';
    
    const chatMessages = messages[currentChat.id] || [];
    
    if (chatMessages.length === 0) {
        messagesContainer.innerHTML = '<div class="empty-state"><p>Нет сообщений</p></div>';
        return;
    }
    
    chatMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.type}`;
        messageDiv.innerHTML = `
            <div>${msg.text}</div>
            <div class="message-time">${msg.time}</div>
        `;
        messagesContainer.appendChild(messageDiv);
    });
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    if (!currentChat) {
        alert('Выберите чат');
        return;
    }
    
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const message = {
        id: Date.now().toString(),
        text: text,
        time: time,
        type: 'out'
    };
    
    if (!messages[currentChat.id]) {
        messages[currentChat.id] = [];
    }
    
    messages[currentChat.id].push(message);
    
    // Обновляем последнее сообщение в чате
    const chat = chats.find(c => c.id === currentChat.id);
    if (chat) {
        chat.lastMessage = text;
        chat.time = time;
    }
    
    saveMessages();
    saveChats();
    renderMessages();
    renderChats();
    
    input.value = '';
}

function handleMessageKey(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function attachFile() {
    if (!currentChat) {
        alert('Выберите чат');
        return;
    }
    alert('Прикрепление файлов:\n\n📷 Фото\n🎥 Видео\n📄 Документ\n📍 Геолокация\n\nФункция будет доступна в следующей версии');
}

function insertEmoji() {
    const emojis = ['😊', '😂', '❤️', '👍', '🔥', '✨', '🎉', '💯', '👋', '🤔'];
    const emoji = prompt('Выберите эмодзи:\n\n' + emojis.join(' '));
    if (emoji && emojis.includes(emoji)) {
        const input = document.getElementById('message-input');
        input.value += emoji;
        input.focus();
    }
}

function toggleMenu() {
    const overlay = document.getElementById('menu-overlay');
    overlay.classList.toggle('active');
}

function searchInChat() {
    if (!currentChat) {
        alert('Выберите чат');
        return;
    }
    const query = prompt('Поиск в чате "' + currentChat.name + '":');
    if (query) {
        const chatMessages = messages[currentChat.id] || [];
        const found = chatMessages.filter(m => m.text.toLowerCase().includes(query.toLowerCase()));
        if (found.length > 0) {
            alert(`Найдено сообщений: ${found.length}\n\n` + found.map(m => `${m.time}: ${m.text}`).join('\n\n'));
        } else {
            alert('Ничего не найдено');
        }
    }
}

function showChatMenu() {
    if (!currentChat) {
        alert('Выберите чат');
        return;
    }
    
    const options = [
        '1. Очистить историю',
        '2. Удалить чат',
        '3. Информация о чате',
        '0. Отмена'
    ].join('\n');
    
    const choice = prompt(options);
    
    switch(choice) {
        case '1':
            if (confirm('Очистить историю чата?')) {
                messages[currentChat.id] = [];
                saveMessages();
                renderMessages();
                alert('История очищена');
            }
            break;
        case '2':
            if (confirm('Удалить чат?')) {
                chats = chats.filter(c => c.id !== currentChat.id);
                delete messages[currentChat.id];
                saveChats();
                saveMessages();
                currentChat = null;
                renderChats();
                document.getElementById('messages').innerHTML = '<div class="empty-state"><p>Выберите чат</p></div>';
                alert('Чат удален');
            }
            break;
        case '3':
            const info = `Информация о чате:

Название: ${currentChat.name}
${currentChat.username ? 'Username: @' + currentChat.username : ''}
ID: ${currentChat.id}
Сообщений: ${(messages[currentChat.id] || []).length}`;
            alert(info);
            break;
    }
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('selema_current_user');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 100);
    }
    return false;
}

function createNewGroup() {
    toggleMenu();
    const groupName = prompt('Введите название группы:');
    if (groupName && groupName.trim()) {
        const newGroup = {
            id: 'group_' + Date.now(),
            name: groupName.trim(),
            avatar: '👥',
            lastMessage: 'Группа создана',
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            unread: 0,
            isGroup: true
        };
        chats.unshift(newGroup);
        saveChats();
        renderChats();
        alert('Группа "' + groupName + '" создана!');
    }
}

function showContacts() {
    toggleMenu();
    const users = JSON.parse(localStorage.getItem('selema_users') || '{}');
    const userList = Object.values(users)
        .filter(u => u.id !== currentUser.id)
        .map(u => `@${u.username} - ${u.firstName} ${u.lastName || ''}`)
        .join('\n');
    
    if (userList) {
        alert('Контакты:\n\n' + userList);
    } else {
        alert('У вас пока нет контактов');
    }
}

function showCalls() {
    toggleMenu();
    alert('Звонки:\n\nИстория звонков пуста');
}

function showFavorites() {
    toggleMenu();
    const favoriteChat = chats.find(c => c.id === '1');
    if (favoriteChat) {
        openChat(favoriteChat);
    }
}

function showSettings() {
    toggleMenu();
    const settings = `Настройки аккаунта:

Имя: ${currentUser.firstName} ${currentUser.lastName || ''}
Username: @${currentUser.username}
Телефон: ${currentUser.phone}
ID: ${currentUser.id}

Дата регистрации: ${new Date(currentUser.createdAt).toLocaleDateString('ru-RU')}`;
    
    alert(settings);
}

function searchUsers() {
    const query = prompt('Введите username для поиска:');
    if (!query) return;
    
    const searchQuery = query.trim().replace('@', '').toLowerCase();
    const users = JSON.parse(localStorage.getItem('selema_users') || '{}');
    
    const found = Object.values(users).find(u => 
        u.username.toLowerCase() === searchQuery && u.id !== currentUser.id
    );
    
    if (found) {
        const result = confirm(`Найден пользователь:\n\n${found.firstName} ${found.lastName || ''}\n@${found.username}\n\nНачать чат?`);
        if (result) {
            // Проверяем, есть ли уже чат с этим пользователем
            let existingChat = chats.find(c => c.userId === found.id);
            
            if (!existingChat) {
                // Создаем новый чат
                existingChat = {
                    id: 'user_' + found.id,
                    userId: found.id,
                    name: `${found.firstName} ${found.lastName || ''}`.trim(),
                    username: found.username,
                    avatar: '👤',
                    lastMessage: 'Начните общение',
                    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                    unread: 0
                };
                chats.unshift(existingChat);
                saveChats();
                renderChats();
            }
            
            openChat(existingChat);
        }
    } else {
        alert('Пользователь не найден');
    }
}
