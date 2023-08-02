const form = document.querySelector('form');

form.addEventListener('submit',onSubmit);

async function onSubmit(e){
    e.preventDefault();

    const myObj = {
        email: document.getElementById('email').value
    }

    // post the values...
    try{
        const response = await axios.post('http://localhost:3000/password/forgot-password',myObj);
        console.log(response.data);
        if(response.status === 202){
            msgDiv.className = "alert alert-success text-center";
            msgDiv.textContent = 'mail sent successfully';
        }
        else{
            throw new Error('something went wrong!!!');
        }
        
    } catch(err){
        console.log(err);
        msgDiv.className = "alert alert-danger text-center";
        msgDiv.textContent = err.response.data.error;
    }
}