document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const messengerScreen = document.getElementById('messenger-screen');
    const loginButton = document.getElementById('login-button');
    const codeInput = document.getElementById('code-input');
    const passwordInput = document.getElementById('password-input');
    const loginError = document.getElementById('login-error');

    const searchContactButton = document.getElementById('search-contact-button');
    const searchModal = document.getElementById('search-modal');
    const closeSearchModalButton = document.getElementById('close-search-modal');
    const addContactButton = document.getElementById('add-contact-button');
    const searchContactCodeInput = document.getElementById('search-contact-code-input');
    const searchError = document.getElementById('search-error');

    // --- Backend URL (ВАЖНО: Это будет URL нашего реального Backend-сервера) ---
    // На данный момент это заглушка. Реальный URL нужно будет прописать здесь,
    // когда Backend будет развернут. Пока используется для закомментированного кода.
    const BACKEND_API_URL = 'https://your-secure-backend.com/api'; // Пример! Нужно будет изменить.

    // Функция для переключения между экранами
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
        document.getElementById(screenId).classList.add('active');
    }

    // Обработчик кнопки входа
    loginButton.addEventListener('click', async () => {
        const code = codeInput.value.trim();
        const password = passwordInput.value.trim();

        if (!code || !password) {
            loginError.textContent = 'Пожалуйста, введите код и пароль.';
            return;
        }

        loginError.textContent = ''; // Очищаем предыдущие ошибки

        // --- ВРЕМЕННАЯ ЗАГЛУШКА ДЛЯ ВХОДА (УДАЛИТЬ ПОСЛЕ РЕАЛИЗАЦИИ BACKEND) ---
        // Имитация задержки для демонстрации
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        const TEST_CODE = 'DEMO-TEST-001';
        const TEST_PASSWORD = 'SuperSecretPass1!';

        if (code === TEST_CODE && password === TEST_PASSWORD) {
            console.log('Тестовый вход успешен!');
            localStorage.setItem('authToken', 'mock_auth_token_123'); // Заглушка токена
            localStorage.setItem('myUserCode', code); // Сохраняем свой код
            showScreen('messenger-screen');
            // Здесь же можно загрузить начальные данные (список чатов, свой профиль)
        } else {
            loginError.textContent = 'Неверный код или пароль.';
        }
        // --- КОНЕЦ ВРЕМЕННОЙ ЗАГЛУШКИ ---
        
        // --- РЕАЛЬНЫЙ КОД ДЛЯ ВЗАИМОДЕЙСТВИЯ С BACKEND (РАСКОММЕНТИРОВАТЬ И УДАЛИТЬ ЗАГЛУШКУ ПОСЛЕ) ---
        /*
        try {
            const response = await fetch(`${BACKEND_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code, password })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Вход успешен! Токен:', data.token);
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('myUserCode', code);
                showScreen('messenger-screen');
            } else {
                loginError.textContent = data.message || 'Ошибка входа. Проверьте код и пароль.';
            }
        } catch (error) {
            console.error('Ошибка сети или сервера:', error);
            loginError.textContent = 'Ошибка подключения к серверу. Попробуйте позже.';
        }
        */
        // --- КОНЕЦ РЕАЛЬНОГО КОДА ---
    });

    // Обработчик кнопки "Найти контакт"
    searchContactButton.addEventListener('click', () => {
        searchModal.classList.remove('hidden');
    });

    // Обработчик кнопки "Закрыть" модального окна поиска
    closeSearchModalButton.addEventListener('click', () => {
        searchModal.classList.add('hidden');
        searchContactCodeInput.value = ''; // Очищаем поле
        searchError.textContent = ''; // Очищаем ошибку
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

        // --- ВРЕМЕННАЯ ЗАГЛУШКА ДЛЯ ПОИСКА КОНТАКТА (УДАЛИТЬ ПОСЛЕ РЕАЛИЗАЦИИ BACKEND) ---
        await new Promise(resolve => setTimeout(resolve, 700)); // Имитация задержки

        const MOCK_EXISTING_CONTACT_CODE = 'TEST-USER-002'; // Пример кода, который "существует"
        const MOCK_NOT_FOUND_CODE = 'NON-EXISTENT'; // Пример кода, который "не существует"

        if (contactCode === MOCK_EXISTING_CONTACT_CODE) {
            console.log(`Тестовый контакт "${contactCode}" найден!`);
            alert(`Контакт "${contactCode}" найден! В будущем здесь будет добавлена возможность начать чат.`);
            searchModal.classList.add('hidden');
        } else if (contactCode === MOCK_NOT_FOUND_CODE) {
            searchError.textContent = 'Контакт с таким кодом не найден (заглушка).';
        }
        else {
            // Для любого другого кода, кроме тестового MOCK_EXISTING_CONTACT_CODE и MOCK_NOT_FOUND_CODE,
            // тоже считаем, что нашли, чтобы можно было потестировать.
            // В реальной жизни тут была бы проверка на бэкенде.
            console.log(`Тестовый контакт "${contactCode}" найден!`);
            alert(`Контакт "${contactCode}" найден! В будущем здесь будет добавлена возможность начать чат.`);
            searchModal.classList.add('hidden');
        }
        // --- КОНЕЦ ВРЕМЕННОЙ ЗАГЛУШКИ ---

        // --- РЕАЛЬНЫЙ КОД ДЛЯ ВЗАИМОДЕЙСТВИЯ С BACKEND (РАСКОММЕНТИРОВАТЬ И УДАЛИТЬ ЗАГЛУШКУ ПОСЛЕ) ---
        /*
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${BACKEND_API_URL}/user_by_code?code=${contactCode}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Контакт найден:', data);
                alert(`Контакт "${data.username}" найден! В будущем здесь будет добавлена возможность начать чат.`);
                searchModal.classList.add('hidden');
            } else {
                searchError.textContent = data.message || 'Контакт не найден или произошла ошибка.';
            }
        } catch (error) {
            console.error('Ошибка поиска контакта:', error);
            searchError.textContent = 'Ошибка подключения к серверу при поиске контакта.';
        }
        */
        // --- КОНЕЦ РЕАЛЬНОГО КОДА ---
    });

    // Проверяем, авторизован ли пользователь при загрузке страницы
    // Если токен есть, сразу показываем мессенджер, иначе - экран входа.
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        // Здесь можно дополнительно проверить токен на сервере
        // showScreen('messenger-screen');
        // Пока для простоты, если токен есть, считаем, что авторизованы
        showScreen('messenger-screen');
        // TODO: Загрузить реальные данные чатов и профиля
    } else {
        showScreen('login-screen');
    }
});
