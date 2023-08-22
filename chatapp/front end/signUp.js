const form = document.querySelector('form');
// console.log(form);

form.addEventListener('submit', onSubmit);

async function onSubmit(e){
    e.preventDefault();

    const myObj = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    // console.log(myObj);
    try{
        const response = await axios.post('http://localhost:4000/add-user',myObj);
        console.log(response.data.newUserDetails);
        alert(response.data.message);
    } catch(err){
        if(err.response && err.response.data.error === 'user already exists'){
            alert(err.response.data.error)
        } else{
            console.log(err);
        }
    }

    form.reset();
}
 