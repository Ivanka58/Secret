document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы экрана входа ---
    const loginScreen = document.getElementById('login-screen');
    const loginButton = document.getElementById('login-button');
    const codeInput = document.getElementById('code-input');
    const passwordInput = document.getElementById('password-input');
    const loginError = document.getElementById('login-error');

    // --- Элементы основного экрана мессенджера ---
    const messengerScreen = document.getElementById('messenger-screen');
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
    const sideMenuAvatar = document.getElementById('side-menu-avatar');
    const myProfileNameInMenu = document.getElementById('my-profile-name-in-menu');

    const currentChatAvatar = document.querySelector('.current-chat-avatar');
    const currentChatNameElement = document.querySelector('.current-chat-name');
    const sidebarElement = document.querySelector('.sidebar');
    const chatAreaElement = document.querySelector('.chat-area');
    const backToChatsButton = document.getElementById('back-to-chats-button');

    // --- Элементы экрана "Мой профиль" ---
    const profileScreen = document.getElementById('profile-screen');
    const myProfileLink = document.getElementById('my-profile-link');
    const backFromProfileButton = document.getElementById('back-from-profile-button');
    const editProfileButton = document.getElementById('edit-profile-button');
    const profileAvatar = document.getElementById('profile-avatar');
    const profileNickname = document.getElementById('profile-nickname');
    const profileAboutInput = document.getElementById('profile-about-input');
    const settingsLink = document.getElementById('settings-link'); // Пока не активен

    // --- Backend URL (заглушка) ---
    const BACKEND_API_URL = 'https://your-secure-backend.com/api';

    // --- Глобальные переменные для управления состоянием ---
    let currentChatId = null;
    let chats = JSON.parse(localStorage.getItem('chats')) || {
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
    let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
        nickname: 'Шеф (Вы)',
        about: 'Привет! Я создатель этого мессенджера.',
        avatar: 'https://via.placeholder.com/120'
    };

    // --- Тестовые данные для заглушек ---
    const TEST_CODE = 'DEMO-TEST-001';
    const TEST_PASSWORD = 'SuperSecretPass1!';
    const MOCK_EXISTING_CONTACT_CODE = 'TEST-USER-002'; // Код для чата "Проверка"

    // --- Вспомогательные функции ---

    function setActiveScreen(screenToShow) {
        document.querySelectorAll('.screen').forEach(screen => {
            if (screen.id === screenToShow.id) {
                screen.classList.remove('hidden');
                screen.classList.add('active');
                screen.style.transform = 'translateX(0)';
            } else {
                screen.classList.remove('active');
                screen.style.transform = 'translateX(100%)'; // Сдвигаем вправо, чтобы скрыть
                // Можно добавить таймаут для добавления 'hidden' после анимации,
                // но пока для простоты будем управлять transform и видимостью
                setTimeout(() => {
                     if (!screen.classList.contains('active')) {
                         screen.classList.add('hidden');
                     }
                }, 300); // Соответствует transition time
            }
        });
    }

    function renderMessages(chatId) {
        messageListElement.innerHTML = '';
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
        messageListElement.scrollTop = messageListElement.scrollHeight;
    }

    function renderChatList() {
        chatListElement.innerHTML = '';
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
        localStorage.setItem('chats', JSON.stringify(chats)); // Сохраняем чаты
    }

    function selectChat(chatId) {
        // Убираем активный класс со всех чатов
        document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active-chat'));

        currentChatId = chatId;
        const chat = chats[chatId];

        currentChatAvatar.src = chat.avatar;
        currentChatNameElement.textContent = chat.name;

        renderMessages(chatId);
        // Добавляем активный класс к выбранному чату
        const selectedChatItem = chatListElement.querySelector(`.chat-item[data-chat-id="${chatId}"]`);
        if (selectedChatItem) {
            selectedChatItem.classList.add('active-chat');
        }

        // Мобильная логика: показать чат-область, скрыть сайдбар
        if (window.innerWidth <= 768) {
            sidebarElement.classList.add('hidden-mobile');
            chatAreaElement.classList.add('active-mobile-chat');
            messageInputElement.focus();
        }
    }

    function sendMessage() {
        const text = messageInputElement.value.trim();
        if (!text || !currentChatId) return;

        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const newMessage = { sender: 'self', text: text, time: time };
        chats[currentChatId].messages.push(newMessage);
        messageInputElement.value = '';
        renderMessages(currentChatId);

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
                if (currentChatItem) {
                    currentChatItem.querySelector('.last-message').textContent = autoReplyMessage.text;
                }
            }, 1000);
        }
        localStorage.setItem('chats', JSON.stringify(chats)); // Сохраняем чаты после отправки
    }

    function renderProfileScreen() {
        profileAvatar.src = userProfile.avatar;
        profileNickname.textContent = userProfile.nickname;
        profileAboutInput.value = userProfile.about;
        myProfileNameInMenu.textContent = userProfile.nickname; // Обновляем имя в бургер-меню
        sideMenuAvatar.src = userProfile.avatar; // Обновляем аватар в бургер-меню
        profileAboutInput.readOnly = true; // Сначала режим чтения
        editProfileButton.innerHTML = '<i class="fas fa-pencil-alt"></i>'; // Иконка карандаша
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

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (code === TEST_CODE && password === TEST_PASSWORD) {
            console.log('Тестовый вход успешен!');
            localStorage.setItem('authToken', 'mock_auth_token_123');
            localStorage.setItem('myUserCode', code);
            userProfile.nickname = 'Шеф (Вы)'; // Устанавливаем базовый ник
            localStorage.setItem('userProfile', JSON.stringify(userProfile)); // Сохраняем профиль
            setActiveScreen(messengerScreen);
            renderProfileScreen(); // Обновить профиль при входе
            renderChatList();
            selectChat('self-chat'); // Выбрать чат с собой по умолчанию
        } else {
            loginError.textContent = 'Неверный код или пароль.';
        }
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

        await new Promise(resolve => setTimeout(resolve, 700));

        if (contactCode === MOCK_EXISTING_CONTACT_CODE) {
            if (!chats[contactCode]) {
                chats[contactCode] = {
                    id: contactCode,
                    name: 'Проверка',
                    avatar: 'https://via.placeholder.com/40?text=П',
                    messages: [{ sender: 'other', text: 'Привет! Чем могу помочь?', time: '10:30' }]
                };
            }
            alert(`Контакт "Проверка" найден и добавлен!`);
            searchModal.classList.add('hidden');
            searchContactCodeInput.value = '';
            renderChatList();
            selectChat(contactCode);
        } else {
            searchError.textContent = 'Контакт с таким кодом не найден (заглушка).';
        }
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

    // Переход на страницу профиля
    myProfileLink.addEventListener('click', (e) => {
        e.preventDefault();
        sideMenu.classList.remove('active'); // Закрыть бургер-меню
        document.querySelector('.overlay')?.classList.remove('active');
        renderProfileScreen();
        setActiveScreen(profileScreen);
    });

    // Обработчик кнопки "Назад к чатам" (только для мобильных)
    backToChatsButton.addEventListener('click', () => {
        sidebarElement.classList.remove('hidden-mobile');
        chatAreaElement.classList.remove('active-mobile-chat');
        currentChatId = null;
        renderChatList();
    });

    // Обработчик кнопки "Назад" с экрана профиля
    backFromProfileButton.addEventListener('click', () => {
        setActiveScreen(messengerScreen);
        renderChatList(); // Убедиться, что чат лист обновлен, если что-то менялось
    });

    // Обработчик кнопки редактирования профиля
    editProfileButton.addEventListener('click', () => {
        if (profileAboutInput.readOnly) {
            profileAboutInput.readOnly = false;
            profileAboutInput.focus();
            editProfileButton.innerHTML = '<i class="fas fa-check"></i>'; // Иконка галочки для сохранения
        } else {
            // Сохраняем изменения
            userProfile.about = profileAboutInput.value.trim();
            localStorage.setItem('userProfile', JSON.stringify(userProfile)); // Сохраняем профиль
            profileAboutInput.readOnly = true;
            editProfileButton.innerHTML = '<i class="fas fa-pencil-alt"></i>'; // Иконка карандаша
            alert('Профиль сохранен!');
        }
    });


    // --- Инициализация при загрузке страницы ---
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        setActiveScreen(messengerScreen); // Показываем мессенджер, если авторизованы
        renderProfileScreen(); // Загружаем данные профиля
        renderChatList(); // Отображаем список чатов
        selectChat('self-chat'); // Выбираем чат по умолчанию
    } else {
        setActiveScreen(loginScreen); // Показываем экран входа
    }

    // Слушатель изменения размера окна для адаптивности
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebarElement.classList.remove('hidden-mobile');
            chatAreaElement.classList.remove('active-mobile-chat');
            sideMenu.classList.remove('active');
            document.querySelector('.overlay')?.classList.remove('active');
        } else {
             // Если мы на мобильном и текущий экран - мессенджер, и есть активный чат,
             // то убедимся, что чат-область активна, а сайдбар скрыт
             if (messengerScreen.classList.contains('active') && currentChatId) {
                sidebarElement.classList.add('hidden-mobile');
                chatAreaElement.classList.add('active-mobile-chat');
             }
        }
    });
});
