const form = document.querySelector('form');
const msgDiv = document.getElementById('msg');
const token = localStorage.getItem('token'); // getting the token stored in localstorage...
const premiumMessage = document.getElementById('premiumMessage');

form.addEventListener('submit',onsubmit);

async function onsubmit(e){
e.preventDefault();

    const myObj = {
        expenseAmt: document.getElementById('expenseAmt').value,
        expenseDescription: document.getElementById('expenseDescription').value,
        expenseCategory: document.getElementById('expenseCategory').value
    }

    try{
        const response = await axios.post('http://localhost:3000/expense/add-expense',myObj,{headers: {'Authorization': token}});
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
            const response = await axios.delete(`http://localhost:3000/expense/delete-expense/${userId}`, {headers: {'Authorization': token}});
            getRequest();
            console.log(response);
        } catch(err){
            console.log(err);
        }
    }
}

const buyPremiumBtn = document.getElementById('rzp-btn');

buyPremiumBtn.addEventListener('click',onClick);

async function onClick(e){
    try{
        // (step-1) make a request to the backend and also specify the user and get the order id...
        const response = await axios.get('http://localhost:3000/purchase/premium-membership',{headers: {'Authorization': token}});
        console.log(response);
        var options = {
            'key': response.data.key_id, // enter the keyId generated from backend...
            'order_id': response.data.order.id, //enter the orderId generated from backend...
            'handler' : async function(response) { // function to handle successfull payment...
                await axios.post('http://localhost:3000/purchase/update-status',{
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                },{headers: {'Authorization': token}});

                // Hide the Buy Premium button and show the Premium User text
                buyPremiumBtn.style.display = 'none';
                premiumMessage.style.display = 'block';
                document.getElementById('leaderboard-btn').style.display = 'block';

                localStorage.setItem('token',res.data.token);
            }
        }
    } catch(err){
        console.log(err);
    }

    const rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();

    rzp.on('payment.failed',function(response){
        console.log(response);
        alert('something went wrong');
    })
}

const leaderboardBtn = document.getElementById('leaderboard-btn');

leaderboardBtn.addEventListener('click',onClick);

async function onClick(e){
    try{
        const leaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard',{headers: {'Authorization': token}});
        console.log(leaderBoardArray);

        var leaderboardTable = document.getElementById('leaderboard-table');
        var leaderboardTBody = document.getElementById('leaderboard-tbody');

        // clear the previous data from the tbody...
        leaderboardTBody.innerHTML = '';

        leaderBoardArray.data.forEach((userDetails)=>{
            // create a row for each user in the leaderboard table...
            var newRow = leaderboardTBody.insertRow();
            var nameCell = newRow.insertCell(0);
            var totalExpenseCell = newRow.insertCell(1);

            // populate it with the user details...
            nameCell.textContent = userDetails.name;
            totalExpenseCell.textContent = userDetails.total_cost;
        });
        // show the leaderBoard....
        leaderboardTable.style.display = 'block';

    } catch(err){
        console.log(err);
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

document.addEventListener('DOMContentLoaded',()=>{
    getRequest();
   
    const decodedToken = parseJwt(token);
    console.log(decodedToken);
    const isAdmin = decodedToken.ispremiumuser
     if (isAdmin) {
        buyPremiumBtn.style.display = 'none';
        premiumMessage.style.display = 'block';
        document.getElementById('leaderboard-btn').style.display = 'block';
     }
});
 