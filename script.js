document.addEventListener('DOMContentLoaded', () => {
    // Элементы UI
    const appWrapper = document.getElementById('appWrapper');
    const loginScreen = document.getElementById('loginScreen');
    const loginForm = document.getElementByID('loginForm');
    const loginCodeInput = document.getElementById('loginCode');
    const passwordInput = document.getElementById('password');

    const mainAppScreen = document.getElementById('mainAppScreen');
    const chatListSubScreen = document.getElementById('chatListSubScreen');
    const chatList = document.getElementById('chatList');
    const chatConversationSubScreen = document.getElementById('chatConversationSubScreen');
    const currentChatTitle = document.getElementById('currentChatTitle');
    const messageDisplay = document.getElementById('messageDisplay');
    const messageInput = document.getElementById('messageInput');
    const chatMessageForm = document.getElementById('chatMessageForm');

    const profileSubScreen = document.getElementById('profileSubScreen');
    const profileName = document.getElementById('profileName');
    const profileAbout = document.getElementById('profileAbout');
    const editProfileButton = document.getElementById('editProfileButton');

    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const backToChatListButton = document.getElementById('backToChatListButton');
    const backToChatListFromProfileButton = document.getElementById('backToChatListFromProfileButton');
    const searchChatButton = document.getElementById('searchChatButton');
    const searchChatModalOverlay = document.getElementById('searchChatModalOverlay');
    const searchChatCodeInput = document.getElementById('searchChatCodeInput');
    const findChatButton = document.getElementById('findChatButton');
    const cancelSearchButton = document.getElementById('cancelSearchButton');
    const searchStatusMessage = document.getElementById('searchStatusMessage');

    const profileItem = document.getElementById('profileItem');
    const settingsItem = document.getElementById('settingsItem');

    // Тестовые данные
    const chats = {
        'self': {
            name: 'Избранное', // Новое название чата
            messages: [{ text: 'Привет!', type: 'other' }]
        },
    };

    // Новый объект для второго пользователя
    const secondUserChats = {
        'second-user': {
            name: 'Избранное',
            messages: []
        },
    };

    // Объединяем оба набора данных
    Object.assign(chats, secondUserChats);

    // Пользователи с разными наборами данных
    const users = {
        firstUser: {
            validLoginCode: 'DEMO-TEST-001',
            validPassword: 'SuperSecretPass1!',
            userName: 'DEMO-TEST-001',
            userAbout: "Пока пусто..."
        },
        secondUser: {
            validLoginCode: 'USER2-CODE-002',
            validPassword: 'User2Pass!',
            userName: 'USER2-CODE-002',
            userAbout: "Пока пусто..."
        }
    };

    // Состояние приложения
    let currentChatId = null;
    let userName = 'DEMO-TEST-001'; // Начальное имя пользователя
    let userAbout = "Пока пусто...";

    // Проверка данных входа
    function checkCredentials(loginCode, password) {
        for (let key in users) {
            if (users[key].validLoginCode === loginCode && users[key].validPassword === password) {
                return users[key];
            }
        }
        return null;
    }

    // Рендеринг списка чатов
    function renderChatList(userLoginCode) {
        chatList.innerHTML = '';
        const filteredChatIds = Object.keys(chats)
            .filter(id => id !== 'self' || userLoginCode === 'DEMO-TEST-001')
            .sort((a, b) => {
                if (a === 'self') return -1;
                if (b === 'self') return 1;
                return chats[a].name.localeCompare(chats[b].name);
            });

        filteredChatIds.forEach(chatId => {
            const chat = chats[chatId];
            const chatItem = document.createElement('div');
            chatItem.classList.add('chat-item');
            chatItem.dataset.chatId = chatId;
            chatItem.innerHTML = `
                <h3>${chat.name}</h3>
                <p>${chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : ''}</p>
            `;
            chatItem.addEventListener('click', () => openChatConversation(chatId));
            chatList.appendChild(chatItem);
        });
    }

    // Открытие разговора
    function openChatConversation(chatId) {
        currentChatId = chatId;
        currentChatTitle.textContent = chats[chatId].name;
        renderMessages(chatId);
        showSubScreen('chatConversation');
    }

    // Рендеринг сообщений
    function renderMessages(chatId) {
        messageDisplay.innerHTML = '';
        chats[chatId].messages.forEach(msg => {
            const msgElement = document.createElement('div');
            msgElement.classList.add('message-bubble');
            msgElement.classList.add(msg.type === 'user' ? 'user-message' : 'other-message');
            msgElement.textContent = msg.text;
            messageDisplay.appendChild(msgElement);
        });
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
    }

    // Отправка сообщения
    function sendMessage(message) {
        if (!currentChatId || message.trim() === '') return;
        chats[currentChatId].messages.push({ text: message, type: 'user' });
        renderMessages(currentChatId);
        messageInput.value = '';
    }

    // Рендеринг профиля
    function renderProfile() {
        profileName.textContent = userName;
        profileAbout.textContent = userAbout;
    }

    // Переключение экранов
    function showMainScreen(screenId) {
        loginScreen.classList.remove('active');
        mainAppScreen.classList.remove('active');
        if (screenId === 'login') {
            loginScreen.classList.add('active');
        } else if (screenId === 'mainApp') {
            mainAppScreen.classList.add('active');
        }
    }

    function showSubScreen(subScreenId) {
        chatListSubScreen.classList.remove('active');
        chatConversationSubScreen.classList.remove('active');
        profileSubScreen.classList.remove('active');
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
        if (subScreenId === 'chatList') {
            chatListSubScreen.classList.add('active');
        } else if (subScreenId === 'chatConversation') {
            chatConversationSubScreen.classList.add('active');
        } else if (subScreenId === 'profile') {
            profileSubScreen.classList.add('active');
        }
        showMainScreen('mainApp');
    }

    // Обработчики событий

    // Вход
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredLoginCode = loginCodeInput.value;
        const enteredPassword = passwordInput.value;
        const loggedInUser = checkCredentials(enteredLoginCode, enteredPassword);
        if (loggedInUser) {
            showSubScreen('chatList');
            renderChatList(loggedInUser.validLoginCode);
            loginCodeInput.value = '';
            passwordInput.value = '';
            userName = loggedInUser.userName;
            userAbout = loggedInUser.userAbout;
        } else {
            alert('Неверный код входа или пароль!');
        }
    });

    // Отправка сообщения
    chatMessageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage(messageInput.value);
    });

    // Возврат назад из беседы в список чатов
    backToChatListButton.addEventListener('click', () => {
        currentChatId = null;
        showSubScreen('chatList');
        renderChatList();
    });

    // Возврат назад из профиля в список чатов
    backToChatListFromProfileButton.addEventListener('click', () => {
        showSubScreen('chatList');
        renderChatList();
    });

    // Меню (открыть/свернуть сайдбар)
    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
    });

    // Сворачивание сайдбара при клике вне него
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
    });

    // Поиск чата
    searchChatButton.addEventListener('click', () => {
        searchChatModalOverlay.style.display = 'flex';
        searchChatCodeInput.value = '';
        searchStatusMessage.textContent = '';
        findChatButton.textContent = 'Найти';
        findChatButton.disabled = false;
    });

    // Отмена поиска
    cancelSearchButton.addEventListener('click', () => {
        searchChatModalOverlay.style.display = 'none';
    });

    // Обработчик поиска чата
    findChatButton.addEventListener('click', () => {
        const enteredCode = searchChatCodeInput.value;
        if (findChatButton.textContent === 'Написать') {
            if (!chats['testUser002']) {
                chats['testUser002'] = {
                    name: 'Проверка',
                    messages: [{ text: 'Привет!', type: 'other' }]
                };
                renderChatList();
            }
            searchChatModalOverlay.style.display = 'none';
        } else if (enteredCode === 'VALID_CHAT_CODE') {
            searchStatusMessage.textContent = 'Чат найден!';
            searchStatusMessage.style.color = 'green';
            findChatButton.textContent = 'Написать';
        } else {
            searchStatusMessage.textContent = 'Чат не найден!';
            searchStatusMessage.style.color = 'red';
            findChatButton.disabled = true;
        }
    });

    // Клик по профилю
    profileItem.addEventListener('click', (e) => {
        e.preventDefault();
        renderProfile();
        showSubScreen('profile');
    });

    // Инициализация при загрузке
    showMainScreen('login');
});

