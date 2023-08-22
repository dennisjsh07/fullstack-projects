const form = document.querySelector('form');
// console.log(form);

form.addEventListener('submit', onSubmit);

async function onSubmit(e){
    e.preventDefault();

    const myObj = {
        name: document.getElementById('name').value,
        pnone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    // console.log(myObj);
    try{
        const request = await axios.post('',myObj);
    } catch(err){
        console.log(err);
    }
}