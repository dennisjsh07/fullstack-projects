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

    console.log(myObj);

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

// pagination...
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageNumbers = document.getElementById('pageNumbers');
let currentPage = 1;
let totalPages = 1; // Initialize with 1, will be updated when fetching expenses

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getRequest(currentPage);
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        getRequest(currentPage);
    }
});

async function getRequest(page) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/expense/get-expense', {
            headers: { 'Authorization': token },
            params: { page }
        });

        const { allExpenses, totalPages: total } = response.data;
        totalPages = total; // Update totalPages

        // Clear previous items on the table...
        var tableBody = document.getElementById('item-table');
        tableBody.innerHTML = '';

        // Loop through allExpenses and call showInUi for each expense
        for (var i = 0; i < allExpenses.length; i++) {
            showInUi(allExpenses[i]);
        }

        // Update page numbers
        updatePageNumbers();
    } catch (err) {
        console.log(err);
    }
}

function updatePageNumbers() {
    const numbers = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            numbers.push(`<strong>${i}</strong>`);
        } else {
            numbers.push(`<button class="page-btn">${i}</button>`);
        }
    }
    pageNumbers.innerHTML = numbers.join(' ');

    const pageButtons = pageNumbers.querySelectorAll('.page-btn');
    pageButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentPage = parseInt(button.textContent);
            getRequest(currentPage);
        });
    });
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

                //showing the leader board btn and reports btn...
                document.getElementById('leaderboard-btn').style.display = 'block';
                document.getElementById('reports-btn').style.display = 'block';

                // save the token generated from backend in local storage...
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

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function displayReport(tbody, expenses) {
    // Clear previous data
    tbody.innerHTML = '';

    expenses.forEach(expense => {
        const row = tbody.insertRow();
        const expenseAmtCell = row.insertCell(0);
        const expenseDescriptionCell = row.insertCell(1);
        const expenseCategoryCell = row.insertCell(2);

        expenseAmtCell.textContent = expense.expenseAmt;
        expenseDescriptionCell.textContent = expense.expenseDescription;
        expenseCategoryCell.textContent = expense.expenseCategory;
    });
}

// generating daily reports...
const generateReportBtn = document.getElementById('generateReport');
const dailyExpensesTable = document.getElementById('dailyExpenses-table');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

generateReportBtn.addEventListener('click', generateDailyReport);

function displayDailyReport(tbody, expenses) {
    tbody.innerHTML = ''; // Clear previous data

    expenses.forEach(expense => {
        const row = tbody.insertRow();
        const expenseDateCell = row.insertCell(0);
        const expenseAmtCell = row.insertCell(1);
        const expenseDescriptionCell = row.insertCell(2);
        const expenseCategoryCell = row.insertCell(3);

        expenseDateCell.textContent = formatDate(new Date(expense.createdAt)); // Populate expense date
        expenseAmtCell.textContent = expense.expenseAmt;
        expenseDescriptionCell.textContent = expense.expenseDescription;
        expenseCategoryCell.textContent = expense.expenseCategory;
    });

    // Calculate total expense
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.expenseAmt, 0);

    // Create a new row for displaying total expense
    const totalRow = tbody.insertRow();
    totalRow.className = 'table-secondary';
    const totalLabelCell = totalRow.insertCell(0);
    const totalAmtCell = totalRow.insertCell(1);
    totalLabelCell.textContent = 'Total Expense:';
    totalAmtCell.textContent = totalExpense;
}

async function generateDailyReport() {
    try {
        const token = localStorage.getItem('token');
        const startDate = formatDate(new Date(startDateInput.value));
        const endDate = formatDate(new Date(endDateInput.value));
        const response = await axios.get('http://localhost:3000/reports/generate-report/daily', {
            headers: { 'Authorization': token },
            params: { startDate, endDate }
        });
        const expensesTBody = dailyExpensesTable.querySelector('tbody');
        displayDailyReport(expensesTBody, response.data);

        // Show the download button
        const downloadBtn = document.getElementById('downloadReportDaily');
        downloadBtn.style.display = 'block';
    } catch (err) {
        console.log(err);
    }
}

// generating monthly reports...

const generateMonthReportBtn = document.getElementById('generateMonthReport');
const monthlyExpensesTable = document.getElementById('monthlyExpenses-table');
const reportMonthInput = document.getElementById('reportMonth');

generateMonthReportBtn.addEventListener('click', generateMonthlyReport);

async function generateMonthlyReport() {
    try {
        const token = localStorage.getItem('token');
        const reportMonth = reportMonthInput.value;
        const response = await axios.get('http://localhost:3000/reports/generate-report/monthly', {
            headers: { 'Authorization': token },
            params: { reportMonth }
        });
        const expensesTBody = monthlyExpensesTable.querySelector('tbody');
        displayMonthlyReport(expensesTBody, response.data);

        // Show the download button
        const downloadBtn = document.getElementById('downloadReportMonthly');
        downloadBtn.style.display = 'block';
    } catch (err) {
        console.log(err);
    }
}

function displayMonthlyReport(tbody, expenses) {
    tbody.innerHTML = ''; // Clear previous data

    expenses.forEach(expense => {
        const row = tbody.insertRow();
        const expenseDateCell = row.insertCell(0);
        const expenseAmtCell = row.insertCell(1);
        const expenseDescriptionCell = row.insertCell(2);
        const expenseCategoryCell = row.insertCell(3);

        expenseDateCell.textContent = formatDate(new Date(expense.createdAt));
        expenseAmtCell.textContent = expense.expenseAmt;
        expenseDescriptionCell.textContent = expense.expenseDescription;
        expenseCategoryCell.textContent = expense.expenseCategory;
    });

    const totalExpense = expenses.reduce((sum, expense) => sum + expense.expenseAmt, 0);

    const totalRow = tbody.insertRow();
    totalRow.className = 'table-secondary';
    const totalLabelCell = totalRow.insertCell(0);
    const totalAmtCell = totalRow.insertCell(1);
    totalLabelCell.textContent = 'Total Expense:';
    totalAmtCell.textContent = totalExpense;
}

// yearly reports...

const generateYearReportBtn = document.getElementById('generateYearReport');
const yearlyExpensesTable = document.getElementById('yearlyExpenses-table');
const yearlyExpensesTBody = document.getElementById('yearlyExpenses-tbody');
const reportYearInput = document.getElementById('reportYear');
const downloadYearReportBtn = document.getElementById('downloadYearReport');

generateYearReportBtn.addEventListener('click', generateYearlyReport);

async function generateYearlyReport() {
    try {
        const token = localStorage.getItem('token');
        const reportYear = reportYearInput.value;
        const response = await axios.get('http://localhost:3000/reports/generate-report/yearly', {
            headers: { 'Authorization': token },
            params: { reportYear }
        });
        
        // Clear previous data
        yearlyExpensesTBody.innerHTML = '';

        // Display yearly expenses
        response.data.forEach(monthlyData => {
            const row = yearlyExpensesTBody.insertRow();
            const monthCell = row.insertCell(0);
            const totalExpenseCell = row.insertCell(1);

            monthCell.textContent = monthlyData.month;
            totalExpenseCell.textContent = monthlyData.totalExpense;
        });
        // Show the download button
        const downloadBtn = document.getElementById('downloadReportYearly');
        downloadBtn.style.display = 'block';
    } catch (err) {
        console.log(err);
    }
}

const downloadBtn = document.getElementById('generateMonthReport');

downloadBtn.addEventListener('click',onClick);

async function onClick(e){
    try{
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/reports/download',{ headers: {"Authorization" : token} });
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
 
 

