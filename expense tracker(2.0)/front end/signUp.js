const form = document.querySelector('form');
const msgDiv = document.getElementById('msg');

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

        // check response to display error message if any...
        if(response.data.error){
            msgDiv.textContent = response.data.error
        }
        else{
            msgDiv.textContent = "Signup is successfull";
        }
    } catch(err){
        console.log(err);
        msgDiv.textContent = "Failed to signup. Please try again after later";
    }

    form.reset();
}


