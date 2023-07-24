const form = document.querySelector('form');
const msgDiv = document.getElementById('msg')

form.addEventListener('submit',onSubmit);

async function onSubmit(e){
    e.preventDefault();
    
    // grab all the values of the form...
    const myObj = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    // post all the values...
    try{
        const response = await axios.post('http://localhost:3000/users/sign-up',myObj);
        console.log(response)
        msgDiv.className = "alert alert-success text-center";
        msgDiv.textContent = response.data.message;
    } catch(err){
        console.log(err);
        msgDiv.className = "alert alert-danger text-center";
        msgDiv.textContent = err.response.data.error;
    }

    form.reset();
}
 

