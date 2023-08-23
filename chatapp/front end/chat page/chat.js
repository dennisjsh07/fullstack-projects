const form = document.querySelector('form');
// console.log(form);
form.addEventListener('submit', onSubmit);

async function onSubmit(e){
    e.preventDefault();

    const myObj = {
        message: document.getElementById('textInput').value
    }
    // console.log(myObj);

    try{
        const token = localStorage.getItem('token');
        const response = axios.post('http://localhost:4000/chat/send-message',myObj,{headers: {'Authorization': token}});
        console.log(response);
    } catch(err){
        console.log(err);
    }

    form.reset();
}

const logOutButton = document.getElementById('log-out');

logOutButton.addEventListener('click', () => {
    // Clear local storage
    localStorage.clear();
    // Close the browser window
    window.close();
    // Redirect to the login page
    window.location.href = 'http://127.0.0.1:5500/login%20page/login.html';
});