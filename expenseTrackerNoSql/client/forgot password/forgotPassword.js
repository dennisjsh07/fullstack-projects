const form = document.querySelector('form');
// console.log(form);
form.addEventListener('submit',onSubmit);

async function onSubmit(e){
    e.preventDefault();

    const myObj = {
        email: document.getElementById('email').value
    }
    // console.log(myObj);
    try{
        const response = await axios.post('http://localhost:3000/password/reset-password',myObj);
        console.log(response);

        if(response.data.success){
            window.location.replace('../login/login.html')
            alert('password sent successfully');
        } else{
            throw new Error('something went wrong');
        }
    } catch(err){
        console.log(err);
        alert('Hey.. Your are not registered with us please sign up ');
    }
}
 


