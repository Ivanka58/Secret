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
    // когда Backend будет развернут.
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

        // --- Временная заглушка для входа (ПОТОМ БУДЕТ ЗАМЕНЕНО НА РЕАЛЬНЫЙ API-ЗАПРОС) ---
        // Здесь мы будем отправлять запрос на наш Backend-сервер.
        // Сервер проверит код/пароль и, если все ОК, вернет токен сессии.
        console.log(`Попытка входа с кодом: ${code} и паролем: ${password}`);

        try {
            // Имитация задержки сети и проверки на сервере
            const response = await fetch(`${BACKEND_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Вход успешен
                console.log('Вход успешен! Токен:', data.token);
                // Сохраняем токен в localStorage или sessionStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('myUserCode', code); // Сохраняем свой код
                showScreen('messenger-screen');
                // Здесь же можно загрузить начальные данные (список чатов, свой профиль)
            } else {
                // Ошибка входа
                loginError.textContent = data.message || 'Ошибка входа. Проверьте код и пароль.';
            }
        } catch (error) {
            console.error('Ошибка сети или сервера:', error);
            loginError.textContent = 'Ошибка подключения к серверу. Попробуйте позже.';
        }
        // --- КОНЕЦ ЗАГЛУШКИ ---
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

        // --- Временная заглушка для поиска (ПОТОМ БУДЕТ ЗАМЕНЕНО НА РЕАЛЬНЫЙ API-ЗАПРОС) ---
        // Здесь мы будем отправлять запрос на Backend, чтобы проверить существование кода
        // и получить публичный ключ пользователя для E2EE.
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
                // Здесь будет логика добавления контакта в список чатов и начало E2EE сессии
                searchModal.classList.add('hidden'); // Закрыть модальное окно после успеха
            } else {
                searchError.textContent = data.message || 'Контакт не найден или произошла ошибка.';
            }
        } catch (error) {
            console.error('Ошибка поиска контакта:', error);
            searchError.textContent = 'Ошибка подключения к серверу при поиске контакта.';
        }
        // --- КОНЕЦ ЗАГЛУШКИ ---
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
