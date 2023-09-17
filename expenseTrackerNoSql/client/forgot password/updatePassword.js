const form = document.querySelector('form');
form.addEventListener('submit', onSubmit);

async function onSubmit(e){
    e.preventDefault();

    const myObj = {
        password: document.getElementById('password').value
    }

    try{
        const response = await axios.put('http://localhost:3000/password/update-password',myObj);
        console.log(response.data);

        if(response.status === 200){
            alert('password updated successfully');
            window.location.href = '../login/login.html';
        } else{
            throw new Error('something went wrong');
        }

    } catch(err){
        console.log(err);
    }
}
 