const form = document.querySelector('form');
const msgDiv = document.getElementById('msg')


form.addEventListener('submit',onsubmit);

async function onsubmit(e){
e.preventDefault();

    const myObj = {
        expenseAmt: document.getElementById('expenseAmt').value,
        expenseDescription: document.getElementById('expenseDescription').value,
        expenseCategory: document.getElementById('expenseCategory').value
    }

    try{
        const response = await axios.post('http://localhost:3000/expense/add-expense',myObj);
        getRequest();
        console.log(response);
    } catch(err){
        console.log(err)
        msgDiv.className = "alert alert-danger text-center";
        msgDiv.textContent = err.response.data.error;
    }

    // clear all fields
    form.reset();
}

async function getRequest(){
    try{
        const token = localStorage.getItem('token'); // getting the token stored in localstorage...
        const response = await axios.get('http://localhost:3000/expense/get-expense',{headers: {'Authorization': token}});
        const expense = response.data.allExpenses;
        console.log(response);

        // clear previoius items on table...
        var tableBody = document.getElementById('item-table');
        tableBody.innerHTML = '';

        for(var i = 0;i<expense.length;i++){
            showInUi(expense[i])
        }
    } catch(err){
        console.log(err)
    }
}

function showInUi(data){
    // grab the table...
    var table = document.getElementById('item-table');

    // create table rows...
    var newRow = table.insertRow();

    // create table cells for each item property...
    var expenseAmtCell = newRow.insertCell(0);
    var expenseDescriptionCell = newRow.insertCell(1);
    var expenseCategoryCell = newRow.insertCell(2);
    var actionCell = newRow.insertCell(3); // cell for buttons...

    // populate the cells with item data...
    expenseAmtCell.textContent = data.expenseAmt;
    expenseDescriptionCell.textContent = data.expenseDescription;
    expenseCategoryCell.textContent = data.expenseCategory;

    // create a row with col for delete button...
    var buttonRow = document.createElement("div");
    buttonRow.className = "row";

    var deleteColumn = document.createElement("div");
    deleteColumn.className = "col";

    // Create delete button...
    var deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger delete-btn btn-sm";
    deleteBtn.appendChild(document.createTextNode("Delete"));
    deleteColumn.appendChild(deleteBtn);

    // add col to row and col to actionCell...
    buttonRow.appendChild(deleteColumn);
    actionCell.appendChild(buttonRow);

    // Adding functionality to deleteBtn
    deleteBtn.addEventListener("click", onDeleteClick);

    async function onDeleteClick(e){
        try{
            const userId = data.id;
            const response = await axios.delete('http://localhost:3000/expense/delete-expense/'+userId);
            getRequest();
            console.log(response);
        } catch(err){
            console.log(err);
        }
    }
}

document.addEventListener('DOMContentLoaded',()=>{
    getRequest();
})
  