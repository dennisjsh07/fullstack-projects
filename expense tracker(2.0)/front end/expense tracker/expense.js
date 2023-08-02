const form = document.querySelector('form');
const msgDiv = document.getElementById('msg');
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
        const token = localStorage.getItem('token'); // getting the token stored in localstorage...
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
            const token = localStorage.getItem('token'); // getting the token stored in localstorage...
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
        const token = localStorage.getItem('token'); // getting the token stored in localstorage...
        // (step-1) make a request to the backend and also specify the user and get the order id...
        const response = await axios.get('http://localhost:3000/purchase/premium-membership',{headers: {'Authorization': token}});
        console.log(response);
        var options = {
            'key': response.data.key_id, // enter the keyId generated from backend...
            'order_id': response.data.order.id, //enter the orderId generated from backend...
            'handler' : async function(response) { // function to handle successfull payment...
                const token = localStorage.getItem('token'); // getting the token stored in localstorage...
                let res = await axios.post('http://localhost:3000/purchase/update-status',{
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                },{headers: {'Authorization': token}});

                // Hide the Buy Premium button and show the Premium User text
                buyPremiumBtn.style.display = 'none';
                premiumMessage.style.display = 'block';
                document.getElementById('leaderboard-btn').style.display = 'block';
                localStorage.setItem('token',res.data.token);
                console.log(res.data.token)
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

leaderboardBtn.addEventListener('click',onLeadClick);

async function onLeadClick(e){
    try{
        const token = localStorage.getItem('token'); // getting the token stored in localstorage...
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
            totalExpenseCell.textContent = userDetails.totalExpenses;
        });
        // show the leaderBoard....
        leaderboardTable.style.display = 'block';

    } catch(err){
        console.log(err);
    }
}

// generating daily reports...
const generateReportBtn = document.getElementById('generateReport');
const dailyExpensesTable = document.getElementById('dailyExpenses-table');

generateReportBtn.addEventListener('click', generateDailyReport);

async function generateDailyReport() {
    try {
        const token = localStorage.getItem('token');
        const startDate = formatDate(new Date(startDateInput.value));
        const endDate = formatDate(new Date(endDateInput.value));
        const response = await axios.get('http://localhost:3000/premium/generate-report/daily', {
            headers: { 'Authorization': token },
            params: { startDate, endDate }
        });
        const expensesTBody = dailyExpensesTable.querySelector('tbody');
        displayReport(expensesTBody, response.data);

        // Calculate total expense
        const totalExpense = response.data.reduce((sum, expense) => sum + expense.expenseAmt, 0);

        // Create a new row for displaying total expense
        const totalExpenseRow = document.createElement('tr');
        const totalExpenseCell = document.createElement('td');
        totalExpenseCell.colSpan = 3; // Span across the columns
        totalExpenseCell.textContent = `Total Expense: ${totalExpense}`;
        totalExpenseRow.appendChild(totalExpenseCell);
        expensesTBody.appendChild(totalExpenseRow);
    } catch (err) {
        console.log(err);
    }
    // making the download button visible...
    downloadBtn.style.display = 'block';
}

// generating monthly reports...

const generateMonthReportBtn = document.getElementById('generateMonthReport');
const monthlyExpensesTable = document.getElementById('monthlyExpenses-table');

generateMonthReportBtn.addEventListener('click', generateMonthlyReport);

async function generateMonthlyReport() {
    try {
        const token = localStorage.getItem('token');
        const reportMonth = formatDate(new Date(reportMonthInput.value));
        const response = await axios.get('http://localhost:3000/premium/generate-report/monthly', {
            headers: { 'Authorization': token },
            params: { reportMonth }
        });
        const expensesTBody = monthlyExpensesTable.querySelector('tbody');
        displayReport(expensesTBody, response.data);

        // Calculate total expense
        const totalExpense = response.data.reduce((sum, expense) => sum + expense.expenseAmt, 0);

        // Create a new row for displaying total expense
        const totalExpenseRow = document.createElement('tr');
        const totalExpenseCell = document.createElement('td');
        totalExpenseCell.colSpan = 3; // Span across the columns
        totalExpenseCell.textContent = `Total Expense: ${totalExpense}`;
        totalExpenseRow.appendChild(totalExpenseCell);
        expensesTBody.appendChild(totalExpenseRow);
    } catch (err) {
        console.log(err);
    }
     // making the download button visible...
     downloadBtn.style.display = 'block';
}

// yearly reports...

const generateYearReportBtn = document.getElementById('generateYearReport');
const yearlyExpensesTable = document.getElementById('yearlyExpenses-table');

generateYearReportBtn.addEventListener('click', generateYearlyReport);

async function generateYearlyReport() {
    try {
        const token = localStorage.getItem('token');
        const reportYear = Number(reportYearInput.value);
        const response = await axios.get('http://localhost:3000/premium/generate-report/yearly', {
            headers: { 'Authorization': token },
            params: { reportYear }
        });
        const expensesTBody = yearlyExpensesTable.querySelector('tbody');
        displayYearlyReport(expensesTBody, response.data);

        // Calculate total expenses for each month
        const totalExpensesPerMonth = Array(12).fill(0);
        response.data.forEach(expense => {
            const month = new Date(expense.date).getMonth();
            totalExpensesPerMonth[month] += expense.expenseAmt;
        });

        // Create rows for each month's total expense
        for (let month = 0; month < totalExpensesPerMonth.length; month++) {
            const monthName = new Date(2023, month).toLocaleString('default', { month: 'long' });
            const totalExpenseRow = document.createElement('tr');
            const monthCell = document.createElement('td');
            monthCell.textContent = monthName;
            const totalExpenseCell = document.createElement('td');
            totalExpenseCell.textContent = totalExpensesPerMonth[month];
            totalExpenseRow.appendChild(monthCell);
            totalExpenseRow.appendChild(totalExpenseCell);
            expensesTBody.appendChild(totalExpenseRow);
        }
    } catch (err) {
        console.log(err);
    }
     // making the download button visible...
     downloadBtn.style.display = 'block';
}

const downloadBtn = document.getElementById('downloadReport');

downloadBtn.addEventListener('click',onClick);

async function onClick(e){
    try{
        const response = await axios.get('',{ headers: {"Authorization" : token} });
        if(response.status === 201){
            // getting the download link from the backend...
            // which when opened will download theh file...
            var a = document.createElement('a');
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        }
    } catch(err){
        throw new Error(err);
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
    const token = localStorage.getItem('token'); // getting the token stored in localstorage...
    const decodedToken = parseJwt(token);
    console.log(decodedToken);
    const isAdmin = decodedToken.ispremiumuser;
    console.log(isAdmin);
     if (isAdmin) {
        buyPremiumBtn.style.display = 'none';
        premiumMessage.style.display = 'block';
        document.getElementById('leaderboard-btn').style.display = 'block';
     }
});
 