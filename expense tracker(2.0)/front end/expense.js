const form = document.querySelector('form');

form.addEventListener('submit',onsubmit);

async function onsubmit(e){
    const myObj = {
        expenseAmt: document.getElementById('expenseAmt'),
        expenseDescription: document.getElementById('expenseDescription'),
        expenseCategory: document.getElementById('expenseCategory')
    }

    try{
        const response = await axios.post('',myObj);
        console.log(response);
    } catch(err){
        console.log(err)
    }

    // clear all fields
    form.reset();
}