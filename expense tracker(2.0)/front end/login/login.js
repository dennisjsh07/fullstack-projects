const form = document.querySelector('form');
const msgDiv = document.getElementById('msg');

form.addEventListener('submit',onSubmit);

async function onSubmit(e){
    e.preventDefault();

    const myObj = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    // post the values...
    try{
        const response = await axios.post('http://localhost:3000/users/user-login',myObj);
        console.log(response.data);
        localStorage.setItem('token',response.data.token);
        msgDiv.className = "alert alert-success text-center";
        msgDiv.textContent = response.data.message;
        // redirect to expense page...
        window.location.href = '../expense tracker/expense.html';
    } catch(err){
        console.log(err);
        msgDiv.className = "alert alert-danger text-center";
        msgDiv.textContent = err.response.data.error;
    }
    
    form.reset();
}
 