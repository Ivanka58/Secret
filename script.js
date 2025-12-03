document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const chatForm = document.getElementById('chatForm');
    const loginContainer = document.querySelector('.login-container');
    const chatContainer = document.querySelector('.chat-container');
    const messageDisplay = document.getElementById('messageDisplay');
    const messageInput = document.getElementById('messageInput');
    const loginCodeInput = document.getElementById('loginCode');
    const passwordInput = document.getElementById('password');
    const chatCodeInput = document.getElementById('chatCode');

    // Test credentials
    const validLoginCode = 'DEMO-TEST-001';
    const validPassword = 'SuperSecretPass1!';
    const validChatCode = 'TEST-USER-002'; // For finding a specific chat

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredLoginCode = loginCodeInput.value;
        const enteredPassword = passwordInput.value;

        if (enteredLoginCode === validLoginCode && enteredPassword === validPassword) {
            loginContainer.style.display = 'none';
            chatContainer.style.display = 'block'; // Show chat
        } else {
            alert('Invalid Login Code or Password!');
        }
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredChatCode = chatCodeInput.value;
        const message = messageInput.value;

        if (enteredChatCode === validChatCode && message.trim() !== '') {
            // In a real app, this would send a message to the server
            // For now, just display it locally
            const messageElement = document.createElement('p');
            messageElement.textContent = `[${new Date().toLocaleTimeString()}] You (${enteredChatCode}): ${message}`;
            messageDisplay.appendChild(messageElement);
            messageDisplay.scrollTop = messageDisplay.scrollHeight; // Scroll to bottom
            messageInput.value = '';
        } else if (message.trim() === '') {
            alert('Message cannot be empty!');
        } else {
            alert('Invalid Chat Code!');
        }
    });
});
