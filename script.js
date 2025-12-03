document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы UI ---
    const loginContainer = document.getElementById('loginContainer');
    const loginForm = document.getElementById('loginForm');
    const loginCodeInput = document.getElementById('loginCode');
    const passwordInput = document.getElementById('password');

    const mainAppContainer = document.getElementById('mainAppContainer');
    const chatListContainer = document.getElementById('chatListContainer');
    const chatList = document.getElementById('chatList');
    const chatConversationContainer = document.getElementById('chatConversationContainer');
    const currentChatTitle = document.getElementById('currentChatTitle');
    const messageDisplay = document.getElementById('messageDisplay');
    const messageInput = document.getElementById('messageInput');
    const chatMessageForm = document.getElementById('chatMessageForm');

    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const backButton = document.getElementById('backButton');
    const searchChatButton = document.getElementById('searchChatButton');
    const searchChatModalOverlay = document.getElementById('searchChatModalOverlay');
    const searchChatCodeInput = document.getElementById('searchChatCodeInput');
    const findChatButton = document.getElementById('findChatButton');
    const cancelSearchButton = document.getElementById('cancelSearchButton');
    const searchStatusMessage = document.getElementById('searchStatusMessage');

    // --- Тестовые данные ---
    const validLoginCode = 'DEMO-TEST-001';
    const validPassword = 'SuperSecretPass1!';
    const validChatCode = 'TEST-USER-002';

    // --- Состояние приложения ---
    let currentChatId = null;
    const chats = {
        'self': {
            name: 'Шеф (Вы)',
            messages: [{ text: 'Привет!', type: 'other' }] // Initial message
        },
    };

    // --- Функции UI ---

    function showScreen(screenId) {
        // Скрываем все основные контейнеры
        loginContainer.style.display = 'none';
        mainAppContainer.style.display = 'none';
        chatListContainer.style.display = 'none';
        chatConversationContainer.style.display = 'none';

        // Активируем нужный
        if (screenId === 'login') {
            loginContainer.style.display = 'flex';
        } else if (screenId === 'app') {
            mainAppContainer.style.display = 'flex';
            // Внутри app показываем либо список чатов, либо беседу
            if (currentChatId) {
                chatConversationContainer.style.display = 'flex';
                chatListContainer.style.display = 'none'; // Убедимся, что список скрыт
                chatConversationContainer.classList.add('active'); // Активируем анимацию
                chatListContainer.classList.remove('active'); // Деактивируем анимацию
            } else {
                chatListContainer.style.display = 'flex';
                chatConversationContainer.style.display = 'none'; // Убедимся, что беседа скрыта
                chatListContainer.classList.add('active'); // Активируем анимацию
                chatConversationContainer.classList.remove('active'); // Деактивируем анимацию
            }
        }
    }

    function renderChatList() {
        chatList.innerHTML = '';
        for (const chatId in chats) {
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
        }
    }

    function openChatConversation(chatId) {
        currentChatId = chatId;
        currentChatTitle.textContent = chats[chatId].name;
        renderMessages(chatId);
        chatListContainer.classList.remove('active');
        chatConversationContainer.classList.add('active');
        // Убедимся, что контейнеры видны до анимации, если они были `display: none;`
        chatListContainer.style.display = 'none';
        chatConversationContainer.style.display = 'flex';
    }

    function renderMessages(chatId) {
        messageDisplay.innerHTML = '';
        chats[chatId].messages.forEach(msg => {
            const msgElement = document.createElement('p');
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

    // --- Обработчики событий ---

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredLoginCode = loginCodeInput.value;
        const enteredPassword = passwordInput.value;

        if (enteredLoginCode === validLoginCode && enteredPassword === validPassword) {
            showScreen('app');
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

    backButton.addEventListener('click', () => {
        currentChatId = null; // Сбрасываем активный чат
        chatConversationContainer.classList.remove('active');
        chatListContainer.classList.add('active');
        // Убедимся, что контейнеры видны до анимации, если они были `display: none;`
        chatConversationContainer.style.display = 'none';
        chatListContainer.style.display = 'flex';
        renderChatList(); // Обновим список чатов
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
    });

    cancelSearchButton.addEventListener('click', () => {
        searchChatModalOverlay.style.display = 'none';
    });

    findChatButton.addEventListener('click', () => {
        const enteredCode = searchChatCodeInput.value;
        if (enteredCode === validChatCode) {
            searchStatusMessage.textContent = 'Чат найден!';
            searchStatusMessage.style.color = 'var(--accent-green)';
            findChatButton.textContent = 'Написать';
            findChatButton.onclick = () => {
                if (!chats['testUser002']) { // Добавляем чат, только если его нет
                    chats['testUser002'] = {
                        name: 'Проверка',
                        messages: [{ text: 'Привет!', type: 'other' }]
                    };
                    renderChatList();
                }
                searchChatModalOverlay.style.display = 'none';
            };
        } else {
            searchStatusMessage.textContent = 'Чат не найден!';
            searchStatusMessage.style.color = 'red';
            findChatButton.disabled = true; // Деактивируем кнопку, если чат не найден
        }
    });

    // --- Инициализация при загрузке ---
    showScreen('login'); // Начинаем с экрана входа
});
