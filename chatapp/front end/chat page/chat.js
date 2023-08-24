const form = document.querySelector('form');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    e.preventDefault();

    const message = document.getElementById('textInput').value;
    
    try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:4000/chat/send-message', { message }, { headers: { 'Authorization': token } });
        displayAllMessages();
    } catch (err) {
        console.log(err);
    }

    form.reset();
}

// Function to fetch and display all chat messages
async function displayAllMessages() {
    try {
        const response = await axios.get('http://localhost:4000/chat/get-message', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        });

        const messages = response.data.allChats;
        console.log('messages>>>>', messages);

        chatBox.innerHTML = ''; // Clear existing messages

        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${message.name}: ${message.message}`;
            
            if (message.userId === myUserId) {
                // Message is outgoing, add to alert-success
                messageElement.classList.add('alert', 'alert-success', 'mb-3');
            } else {
                // Message is received, add to alert-secondary
                messageElement.classList.add('alert', 'alert-secondary', 'mb-3');
            }
            
            chatBox.appendChild(messageElement);
        });

        // Scroll to the bottom to show the latest messages
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (err) {
        console.log('Error fetching messages:', err);
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const token = localStorage.getItem('token'); // getting the token stored in localstorage...
const decodedToken = parseJwt(token);
// console.log('decoded token>>>',decodedToken.userId);
// Replace 'myUserId' with the ID of the logged-in user
const myUserId = decodedToken.userId;
// Initialize display of messages when the page loads
document.addEventListener('DOMContentLoaded', () => { 
    displayAllMessages();
});

const logOutButton = document.getElementById('log-out');

logOutButton.addEventListener('click', () => {
    // Clear local storage
    localStorage.clear();
    // Close the browser window
    window.close();
    // Redirect to the login page
    window.location.href = 'http://127.0.0.1:5500/login%20page/login.html';
});
