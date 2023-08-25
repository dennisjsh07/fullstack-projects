// adding users to the group..........................................
const addNewUsers = document.getElementById('addNewUsers');
// console.log('addNewUsers>>>>', addNewUsers);
addNewUsers.addEventListener('submit', addnewUsers);

async function addnewUsers(e){
    e.preventDefault();
    const groupName = localStorage.getItem('groupName');
    // console.log('groupName>>>>', groupName);
    const myObj = {
        newUser: document.getElementById('addUsers').value,
        groupName
    }
    // console.log('myObj>>>>', myObj);
    try{
        const token = localStorage.getItem('token');
        const addNewUserToGroup = await axios.post('http://localhost:4000/chat/addUserToGroup',myObj, { 
            headers: { 'Authorization': token } 
        });
        console.log(addNewUserToGroup);
    } catch(err){
        console.log(err);
    }

    addNewUsers.reset();
}

// getting all users of the group......................................
const ul = document.getElementById('allUsers');

async function getAllUsersOfGroup(){
    try{
        const groupName = localStorage.getItem('groupName');
        const getallUsersofGroup = await axios.get('http://localhost:4000/chat/getUsersofGroup', {
            params: {groupName}
        });
        console.log('getallUsersofGroup>>>>', getallUsersofGroup.data);

        const groupUsers = getallUsersofGroup.data;

        // clear previous ul values...s

        ul.innerHTML = '';

        for(var i = 0; i<groupUsers.length; i++){
            const li = document.createElement('li');
            li.textContent = groupUsers[i].name;
            li.classList.add('list-group-item');

            // adding delete btn...
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'X';
            deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'delete-button', 'float-end');
            deleteBtn.dataset.userId = groupUsers[i].userId; // Set userId as data attribute
            li.appendChild(deleteBtn);

            ul.appendChild(li);
        }
        console.log('groupUsers>>>>', groupUsers);
    } catch(err){
        console.log('getAllUsersOfGroup failed>>>>',err);
    }
}

// adding delete function.............................................
ul.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
        const userName = event.target.dataset.userName;
        const groupName = localStorage.getItem('groupName');

        try {
            const response = await axios.delete('http://localhost:4000/chat/deleteUserFromGroup', {
                params: { groupName, userId: userName }
            });

            if (response.status === 200) {
                console.log('User deleted from the group successfully.');
                // Refresh the user list or update the UI as needed
            }
        } catch (error) {
            console.log('Error deleting user from group:', error);
        }
    }
});

// making other users admin............................................
const makeNewAdmin = document.getElementById('makeNewAdmin');
// console.log(makeNewAdmin);

makeNewAdmin.addEventListener('submit', makenewAdmin);

async function makenewAdmin(e){
    e.preventDefault();

    const myObj = {
        makeNewAdmin : document.getElementById('makeAdmine').value
    }

    try{
        const token = localStorage.getItem('token');
        const groupName = localStorage.getItem('groupName');
        const makeAdmin = await axios.put('http://localhost:4000/chat/makenewAdmin', myObj, {
            headers: {'Authorization': token},
            params: {groupName}
        });
        console.log('makeAdmine >>>>', makeAdmin.data);
    } catch(err){
        console.log('makenewAdmin is failing >>>>', err);
    }

    makeNewAdmin.reset();
}

// adding messages.....................................................
const form = document.getElementById('addMessages');
// console.log('form>>>>', form);
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    e.preventDefault();

    const message = document.getElementById('textInput').value;
    
    try {
        const token = localStorage.getItem('token');
        const groupName = localStorage.getItem('groupName');
        await axios.post('http://localhost:4000/chat/send-message', { message }, { 
            headers: { 'Authorization': token },
            params: {groupName}
        });
        displayAllMessages();
    } catch (err) {
        console.log(err);
    }

    form.reset();
}

// Function to fetch and display all chat messages.......................
async function displayAllMessages() {
    const groupName = localStorage.getItem('groupName');
    try {
        const response = await axios.get('http://localhost:4000/chat/get-message', {
            headers: {
                Authorization: localStorage.getItem('token')
            },
            params: {groupName}
        });

        const messages = response.data.allChats;
        console.log('messages>>>>', messages);
        
        localStorage.setItem('messages', JSON.stringify(messages));

        const lsMessage = JSON.parse(localStorage.getItem('messages')); // Parse the JSON string back to an object
        console.log('lsMessage>>>>', lsMessage);

        chatBox.innerHTML = ''; // Clear existing messages

        // display messages from the local storage...
        lsMessage.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${message.name}: ${message.message}`;
            
            if (message.userId === myUserId) {
                // Message is outgoing, add to alert-success
                messageElement.classList.add('alert', 'alert-success', 'mb-3');
                messageElement.style.textAlign = 'right';
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

// Set interval to refresh messages every second...
// const intervalId = setInterval(displayAllMessages, 1000);

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
    getAllUsersOfGroup();
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
 