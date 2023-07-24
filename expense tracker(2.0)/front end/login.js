const form = document.querySelector('form');

form.addEventListener('submit',onSubmit);

async function onSubmit(e){
    const myObj = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    // post the values...
    try{
        const response = await axios.post('',myObj);
        console.log(response);
    } catch(err){
        console.log(err)
    }
}