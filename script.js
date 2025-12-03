document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы UI ---
    const appWrapper = document.getElementById('appWrapper');
    const loginScreen = document.getElementById('loginScreen');
    const loginForm = document.getElementById('loginForm');
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
    const editProfileButton = document.getElementById('editProfileButton'); // Пока неактивен

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

    const profileItem = document.getElementById('profileItem'); // Кнопка "Мой профиль" в меню
    const settingsItem = document.getElementById('settingsItem'); // Кнопка "Настройки" в меню

    // --- Тестовые данные ---
    const validLoginCode = 'DEMO-TEST-001';
    const validPassword = 'SuperSecretPass1!';
    const validChatCode = 'TEST-USER-002';

    // --- Состояние приложения ---
    let currentChatId = null;
    let userName = validLoginCode; // Имя пользователя по умолчанию
    let userAbout = "Пока пусто..."; // О себе по умолчанию

    const chats = {
        'self': {
            name: 'Шеф (Вы)',
            messages: [{ text: 'Привет!', type: 'other' }] // Initial message
        },
    };

    // --- Функции UI для переключения экранов ---

    function showMainScreen(screenId) {
        // Скрываем все основные экраны (login, main-app)
        loginScreen.classList.remove('active');
        mainAppScreen.classList.remove('active');

        // Активируем нужный
        if (screenId === 'login') {
            loginScreen.classList.add('active');
        } else if (screenId === 'mainApp') {
            mainAppScreen.classList.add('active');
        }
    }

    function showSubScreen(subScreenId) {
        // Скрываем все под-экраны внутри main-app-screen
        chatListSubScreen.classList.remove('active');
        chatConversationSubScreen.classList.remove('active');
        profileSubScreen.classList.remove('active');

        // Убеждаемся, что sidebar закрыт
        sidebar.classList.remove('active');
        overlay.style.display = 'none';

        // Активируем нужный под-экран
        if (subScreenId === 'chatList') {
            chatListSubScreen.classList.add('active');
        } else if (subScreenId === 'chatConversation') {
            chatConversationSubScreen.classList.add('active');
        } else if (subScreenId === 'profile') {
            profileSubScreen.classList.add('active');
        }
        showMainScreen('mainApp'); // Убедимся, что главный контейнер приложения активен
    }

    function renderChatList() {
        chatList.innerHTML = '';
        const sortedChatIds = Object.keys(chats).sort((a, b) => {
            if (a === 'self') return -1; // "Шеф (Вы)" всегда первый
            if (b === 'self') return 1;
            return chats[a].name.localeCompare(chats[b].name); // Остальные по имени
        });

        sortedChatIds.forEach(chatId => {
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

    function openChatConversation(chatId) {
        currentChatId = chatId;
        currentChatTitle.textContent = chats[chatId].name;
        renderMessages(chatId);
        showSubScreen('chatConversation');
    }

    function renderMessages(chatId) {
        messageDisplay.innerHTML = '';
        chats[chatId].messages.forEach(msg => {
            const msgElement = document.createElement('div'); // Используем div для пузырька
            msgElement.classList.add('message-bubble');
            msgElement.classList.add(msg.type === 'user' ? 'user-message' : 'other-message');
            msgElement.textContent = msg.text;
            messageDisplay.appendChild(msgElement);
        });
        messageDisplay.scrollTop = messageDisplay.scrollHeight; // Прокрутка вниз
    }

    function sendMessage(message) {
        if (!currentChatId || message.trim() === '') return;

        chats[currentChatId].messages.push({ text: message, type: 'user' });
        renderMessages(currentChatId);
        messageInput.value = '';

        // Автоматический ответ для чата "Проверка"
        if (currentChatId === 'testUser002') {
            setTimeout(() => {
                chats[currentChatId].messages.push({ text: 'Привет!', type: 'other' });
                renderMessages(currentChatId);
            }, 1000); // Задержка для имитации "печатает..."
        }
        renderChatList(); // Обновим список чатов, чтобы последнее сообщение обновилось
    }

    function renderProfile() {
        profileName.textContent = userName;
        profileAbout.textContent = userAbout;
        // Здесь можно добавить логику для отображения аватарки
    }

    // --- Обработчики событий ---

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredLoginCode = loginCodeInput.value;
        const enteredPassword = passwordInput.value;

        if (enteredLoginCode === validLoginCode && enteredPassword === validPassword) {
            showSubScreen('chatList'); // Показываем список чатов
            renderChatList();
            loginCodeInput.value = '';
            passwordInput.value = '';
        } else {
            alert('Неверный код входа или пароль!');
        }
    });

    chatMessageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage(messageInput.value);
    });

    // Кнопка "назад" из беседы в список чатов
    backToChatListButton.addEventListener('click', () => {
        currentChatId = null; // Сбрасываем активный чат
        showSubScreen('chatList');
        renderChatList(); // Обновим список чатов
    });

    // Кнопка "назад" из профиля в список чатов
    backToChatListFromProfileButton.addEventListener('click', () => {
        showSubScreen('chatList');
        renderChatList();
    });

    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
    });

    searchChatButton.addEventListener('click', () => {
        searchChatModalOverlay.style.display = 'flex';
        searchChatCodeInput.value = '';
        searchStatusMessage.textContent = '';
        findChatButton.textContent = 'Найти'; // Сброс текста кнопки
        findChatButton.disabled = false;
        // Сбросим onclick, чтобы он не вызывался дважды при "Найти" -> "Написать"
        findChatButton.onclick = null;
    });

    cancelSearchButton.addEventListener('click', () => {
        searchChatModalOverlay.style.display = 'none';
    });

    // Обработчик для кнопки "Найти" в модальном окне
    findChatButton.addEventListener('click', () => {
        const enteredCode = searchChatCodeInput.value;

        if (findChatButton.textContent === 'Написать') {
            // Если кнопка уже "Написать", то добавляем чат
            if (!chats['testUser002']) { // Добавляем чат, только если его нет
                chats['testUser002'] = {
                    name: 'Проверка',
                    messages: [{ text: 'Привет!', type: 'other' }]
                };
                renderChatList();
            }
            searchChatModalOverlay.style.display = 'none';
        } else if (enteredCode === validChatCode) {
            searchStatusMessage.textContent = 'Чат найден!';
            searchStatusMessage.style.color = 'var(--accent-green)';
            findChatButton.textContent = 'Написать';
        } else {
            searchStatusMessage.textContent = 'Чат не найден!';
            searchStatusMessage.style.color = 'var(--accent-red)'; // Цвет ошибки
            findChatButton.disabled = true; // Деактивируем кнопку, если чат не найден
        }
    });

    // Обработчик для кнопки "Мой профиль" в сайдбаре
    profileItem.addEventListener('click', (e) => {
        e.preventDefault(); // Предотвращаем переход по ссылке
        renderProfile(); // Обновляем данные профиля
        showSubScreen('profile'); // Показываем экран профиля
    });

    // --- Инициализация при загрузке ---
    showMainScreen('login'); // Начинаем с экрана входа
});
