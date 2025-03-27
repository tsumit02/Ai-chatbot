const API_KEY = 'AIzaSyCyYjmmELWY1lVY-8sVDia8MGGw4b135vA';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Initialize quick action buttons
document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', () => handleQuickAction(button.textContent));
});

// Initialize menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => handleMenuSelection(item.querySelector('span').textContent));
});

// Function to handle quick actions
async function handleQuickAction(action) {
    addMessage(action, true);
    showTypingIndicator();
    const response = await sendToGemini(`Tell me about ${action} options`);
    removeTypingIndicator();
    addMessage(response);
}

// Function to handle menu selections
async function handleMenuSelection(selection) {
    addMessage(selection, true);
    showTypingIndicator();
    const response = await sendToGemini(`I want to ${selection}`);
    removeTypingIndicator();
    addMessage(response);
}

// Function to add a message to the chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show typing indicator
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    indicator.id = 'typing-indicator';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to remove typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Function to send message to Gemini API
async function sendToGemini(message) {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
}

// Function to handle user input
async function handleUserInput() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, true);
    userInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Get response from Gemini API
    const response = await sendToGemini(message);

    // Remove typing indicator and add bot response
    removeTypingIndicator();
    addMessage(response);
}

// Event listeners
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
}); 