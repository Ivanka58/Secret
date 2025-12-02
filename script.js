document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const messengerScreen = document.getElementById('messenger-screen');
    const loginButton = document.getElementById('login-button');
    const codeInput = document.getElementById('code-input');
    const passwordInput = document.getElementById('password-input');
    const loginError = document.getElementById('login-error');

    const chatListElement = document.getElementById('chat-list');
    const messageListElement = document.getElementById('message-list');
    const messageInputElement = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    const searchContactButton = document.getElementById('search-contact-button');
    const searchModal = document.getElementById('search-modal');
    const closeSearchModalButton = document.getElementById('close-search-modal');
    const addContactButton = document.getElementById('add-contact-button');
    const searchContactCodeInput = document.getElementById('search-contact-code-input');
    const searchError = document.getElementById('search-error');

    const burgerMenuButton = document.getElementById('burger-menu-button');
    const sideMenu = document.getElementById('side-menu');
    const myProfileLink = document.getElementById('my-profile-link');
    const settingsLink = document.getElementById('settings-link');
    const myProfileNameElement = document.getElementById('my-profile-name');

    const currentChatAvatar = document.querySelector('.current-chat-avatar');
    const currentChatNameElement = document.querySelector('.current-chat-name');
    const sidebarElement = document.querySelector('.sidebar');
    const chatAreaElement = document.querySelector('.chat-area');
    const backToChatsButton = document.getElementById('back-to-chats-button');

    // --- Backend URL (ВАЖНО: Это будет URL нашего реального Backend-сервера) ---
    const BACKEND_API_URL = 'https://your-secure-backend.com/api'; // Пример! Нужно будет изменить.

    // --- Глобальные переменные для управления состоянием ---
    let currentChatId = null;
    let chats = {
        'self-chat': {
            id: 'self-chat',
            name: 'Шеф (Вы)',
            avatar: 'https://via.placeholder.com/40',
            messages: [
                { sender: 'other', text: 'Привет, Шеф! Все готово.', time: '10:00' },
                { sender: 'self', text: 'Отлично, начинаем!', time: '10:01' }
            ]
        }
    };

    // --- Тестовые данные для заглушек ---
    const TEST_CODE = 'DEMO-TEST-001';
    const TEST_PASSWORD = 'SuperSecretPass1!';
    const MOCK_EXISTING_CONTACT_CODE = 'TEST-USER-002'; // Код для чата "Проверка"

    // --- Вспомогательные функции ---

    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
        document.getElementById(screenId).classList.add('active');
    }

    function renderMessages(chatId) {
        messageListElement.innerHTML = ''; // Очищаем список сообщений
        const chat = chats[chatId];
        if (!chat) return;

        chat.messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', msg.sender === 'self' ? 'outgoing' : 'incoming');
            messageDiv.innerHTML = `
                <span class="message-text">${msg.text}</span>
                <span class="message-time">${msg.time}</span>
            `;
            messageListElement.appendChild(messageDiv);
        });
        messageListElement.scrollTop = messageListElement.scrollHeight; // Прокрутка вниз
    }

    function renderChatList() {
        chatListElement.innerHTML = ''; // Очищаем список чатов
        for (const chatId in chats) {
            const chat = chats[chatId];
            const chatItem = document.createElement('li');
            chatItem.classList.add('chat-item');
            if (chatId === currentChatId) {
                chatItem.classList.add('active-chat');
            }
            chatItem.dataset.chatId = chatId;
            chatItem.innerHTML = `
                <img src="${chat.avatar}" alt="Аватар">
                <div class="chat-info">
                    <span class="chat-name">${chat.name}</span>
                    <span class="last-message">${chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : ''}</span>
                </div>
            `;
            chatListElement.appendChild(chatItem);

            chatItem.addEventListener('click', () => selectChat(chatId));
        }
    }

    function selectChat(chatId) {
        if (currentChatId === chatId && chatAreaElement.classList.contains('active-mobile-chat')) {
             // Если на мобильном и уже активен, не переключаем
             return;
        }

        currentChatId = chatId;
        const chat = chats[chatId];

        currentChatAvatar.src = chat.avatar;
        currentChatNameElement.textContent = chat.name;

        renderMessages(chatId);
        renderChatList(); // Обновить активный чат в списке

        // Мобильная логика: показать чат-область, скрыть сайдбар
        if (window.innerWidth <= 768) {
            sidebarElement.classList.add('hidden-mobile');
            chatAreaElement.classList.add('active-mobile-chat');
            messageInputElement.focus(); // Фокус на поле ввода
        }
    }

    function sendMessage() {
        const text = messageInputElement.value.trim();
        if (!text || !currentChatId) return;

        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const newMessage = { sender: 'self', text: text, time: time };
        chats[currentChatId].messages.push(newMessage);
        messageInputElement.value = ''; // Очистить поле
        renderMessages(currentChatId); // Перерисовать сообщения

        // Обновить последнее сообщение в списке чатов
        const currentChatItem = chatListElement.querySelector(`.chat-item[data-chat-id="${currentChatId}"]`);
        if (currentChatItem) {
            currentChatItem.querySelector('.last-message').textContent = text;
        }

        // --- Автоответчик для "Проверка" (TEST-USER-002) ---
        if (currentChatId === MOCK_EXISTING_CONTACT_CODE) {
            setTimeout(() => {
                const autoReplyMessage = { sender: 'other', text: 'Привет!', time: time };
                chats[currentChatId].messages.push(autoReplyMessage);
                renderMessages(currentChatId);
                // Обновить последнее сообщение в списке чатов
                if (currentChatItem) {
                    currentChatItem.querySelector('.last-message').textContent = autoReplyMessage.text;
                }
            }, 1000); // Ответить через 1 секунду
        }
    }

    // --- Обработчики событий ---

    // Обработчик кнопки входа
    loginButton.addEventListener('click', async () => {
        const code = codeInput.value.trim();
        const password = passwordInput.value.trim();

        if (!code || !password) {
            loginError.textContent = 'Пожалуйста, введите код и пароль.';
            return;
        }

        loginError.textContent = '';

        // --- ВРЕМЕННАЯ ЗАГЛУШКА ДЛЯ ВХОДА ---
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (code === TEST_CODE && password === TEST_PASSWORD) {
            console.log('Тестовый вход успешен!');
            localStorage.setItem('authToken', 'mock_auth_token_123');
            localStorage.setItem('myUserCode', code);
            myProfileNameElement.textContent = 'Шеф (Вы)'; // Обновляем имя в бургер-меню
            showScreen('messenger-screen');
            renderChatList();
            selectChat('self-chat'); // Выбрать чат с собой по умолчанию
        } else {
            loginError.textContent = 'Неверный код или пароль.';
        }
        // --- КОНЕЦ ВРЕМЕННОЙ ЗАГЛУШКИ ---
    });

    // Обработчик кнопки "Найти контакт"
    searchContactButton.addEventListener('click', () => {
        searchModal.classList.remove('hidden');
    });

    // Обработчик кнопки "Закрыть" модального окна поиска
    closeSearchModalButton.addEventListener('click', () => {
        searchModal.classList.add('hidden');
        searchContactCodeInput.value = '';
        searchError.textContent = '';
    });

    // Обработчик кнопки "Найти и Добавить" в модальном окне
    addContactButton.addEventListener('click', async () => {
        const contactCode = searchContactCodeInput.value.trim();
        if (!contactCode) {
            searchError.textContent = 'Введите код контакта.';
            return;
        }
        searchError.textContent = '';

        console.log(`Поиск контакта с кодом: ${contactCode}`);

        // --- ВРЕМЕННАЯ ЗАГЛУШКА ДЛЯ ПОИСКА КОНТАКТА ---
        await new Promise(resolve => setTimeout(resolve, 700));

        if (contactCode === MOCK_EXISTING_CONTACT_CODE) {
            if (!chats[contactCode]) { // Если чата еще нет, добавляем
                chats[contactCode] = {
                    id: contactCode,
                    name: 'Проверка',
                    avatar: 'https://via.placeholder.com/40?text=П', // Placeholder с буквой П
                    messages: [{ sender: 'other', text: 'Привет! Чем могу помочь?', time: '10:30' }]
                };
            }
            alert(`Контакт "Проверка" найден и добавлен!`);
            searchModal.classList.add('hidden');
            searchContactCodeInput.value = '';
            renderChatList(); // Обновить список чатов
            selectChat(contactCode); // Открыть добавленный чат
        } else {
            searchError.textContent = 'Контакт с таким кодом не найден (заглушка).';
        }
        // --- КОНЕЦ ВРЕМЕННОЙ ЗАГЛУШКИ ---
    });

    // Обработчик кнопки "Отправить"
    sendButton.addEventListener('click', sendMessage);

    // Отправка по Enter в поле ввода
    messageInputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Обработчик бургер-меню
    burgerMenuButton.addEventListener('click', () => {
        sideMenu.classList.toggle('active');
        // Оверлей для закрытия меню по клику вне его (только для мобильных)
        if (window.innerWidth <= 768) {
            let overlay = document.querySelector('.overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.classList.add('overlay');
                document.body.appendChild(overlay);
                overlay.addEventListener('click', () => {
                    sideMenu.classList.remove('active');
                    overlay.classList.remove('active');
                });
            }
            overlay.classList.toggle('active');
        }
    });

    // Обработчики пунктов меню (пока без действий)
    myProfileLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Переход в Мой профиль (в разработке)');
        sideMenu.classList.remove('active');
        document.querySelector('.overlay')?.classList.remove('active');
    });

    settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Переход в Настройки (в разработке)');
        sideMenu.classList.remove('active');
        document.querySelector('.overlay')?.classList.remove('active');
    });

    // Обработчик кнопки "Назад к чатам" (только для мобильных)
    backToChatsButton.addEventListener('click', () => {
        sidebarElement.classList.remove('hidden-mobile');
        chatAreaElement.classList.remove('active-mobile-chat');
        currentChatId = null; // Сбрасываем активный чат, чтобы скрыть его
        renderChatList(); // Перерисовать список чатов, чтобы не было активного
    });

    // --- Инициализация при загрузке страницы ---
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        showScreen('messenger-screen');
        // Если авторизован, сразу отображаем список чатов и выбираем первый
        renderChatList();
        selectChat('self-chat');
        myProfileNameElement.textContent = 'Шеф (Вы)'; // Устанавливаем имя в меню
    } else {
        showScreen('login-screen');
    }

    // Слушатель изменения размера окна для адаптивности
    window.addEventListener('resize', () => {
        // Если перешли с мобильного на десктоп, убедимся, что оба блока видны
        if (window.innerWidth > 768) {
            sidebarElement.classList.remove('hidden-mobile');
            chatAreaElement.classList.remove('active-mobile-chat');
            sideMenu.classList.remove('active'); // Скрываем бургер-меню на десктопе
            document.querySelector('.overlay')?.classList.remove('active'); // Скрываем оверлей
        } else { // Если с десктопа на мобильный, и активен чат, то показываем его
             if (currentChatId && chatAreaElement.classList.contains('active')) {
                sidebarElement.classList.add('hidden-mobile');
                chatAreaElement.classList.add('active-mobile-chat');
             }
        }
    });

});
