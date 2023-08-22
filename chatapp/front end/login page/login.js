const form = document.querySelector('form');
// console.log(form);
form.addEventListener('submit', onSubmit);

async function onSubmit(e){
    e.preventDefault();

    const myObj = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    try{
<<<<<<< HEAD:chatapp/front end/login page/login.js
        const response = await axios.post('http://localhost:4000/user/login', myObj);
        console.log(response.data);

        // save token in local storage...
        localStorage.setItem('token',response.data.token);

        // redirect...

    } catch(err){
        console.log(err)
=======
        const response = await axios.post('http://localhost:4000/add-user',myObj);
        console.log(response.data.newUserDetails);
        alert(response.data.message);
    } catch(err){
        if(err.response && err.response.data.error === 'user already exists'){
            alert(err.response.data.error)
        } else{
            console.log(err);
        }
>>>>>>> af608fb3bba802be141da86fe08adba44e820ada:chatapp/front end/signUp.js
    }

    form.reset();
}
 