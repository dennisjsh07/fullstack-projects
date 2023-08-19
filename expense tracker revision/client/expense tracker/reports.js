const logOutButton = document.getElementById('log-out');

logOutButton.addEventListener('click', () => {
    // Clear local storage
    localStorage.clear();
    // Close the browser window
    window.close();
    // Redirect to the login page
    window.location.href = 'http://127.0.0.1:5500/login/login.html';
});

// generating daily reports...
const generateReportBtn = document.getElementById('generateReport');
const dailyExpensesTable = document.getElementById('dailyExpenses-table');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

generateReportBtn.addEventListener('click', generateDailyReport);

async function generateDailyReport(){
    try{
        const token = localStorage.getItem('token');
        const startDate = formatDate(new Date(startDateInput.value));
        const endDate = formatDate(new Date(endDateInput.value));
        const response = await axios.get('http://localhost:3000/premium/generate-report/daily', {
            headers: {'Authorization': token},
            params: {startDate, endDate}
        });
        const expenseTbody = dailyExpensesTable.querySelector('tbody');
        displayDailyReport(expenseTbody, response.data);

        // Show the download button
        const downloadBtn = document.getElementById('downloadReportDaily');
        downloadBtn.style.display = 'block';
    } catch(err){
        console.log(err);
    }
}

function formatDate(date) {
    // Get the year, month, and day from the Date object
    const year = date.getFullYear();            // Get the full year (e.g., 2023)
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-11) and add 1, then pad with leading zero if needed
    const day = String(date.getDate()).padStart(2, '0');         // Get the day of the month, padded with leading zero if needed

    // Combine the year, month, and day using hyphens to form the formatted date
    const formattedDate = `${year}-${month}-${day}`;
    
    return formattedDate;
}

function displayDailyReport(tbody, expenses) {
    tbody.innerHTML = ''; // Clear previous data

    expenses.forEach(expense => {
        // Create a new row for each expense
        const row = tbody.insertRow();

        // Create cells for each column of the table
        const expenseDateCell = row.insertCell(0);
        const expenseAmtCell = row.insertCell(1);
        const expenseDescriptionCell = row.insertCell(2);
        const expenseCategoryCell = row.insertCell(3);

        // Populate the cells with expense data
        expenseDateCell.textContent = formatDate(new Date(expense.createdAt));
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

// generating monthly reports...

const generateMonthReportBtn = document.getElementById('generateMonthReport');
const monthlyExpensesTable = document.getElementById('monthlyExpenses-table');
const reportMonthInput = document.getElementById('reportMonth');

generateMonthReportBtn.addEventListener('click', generateMonthlyReport);

async function generateMonthlyReport() {
    try {
        const token = localStorage.getItem('token');
        const reportMonth = reportMonthInput.value;
        const response = await axios.get('http://localhost:3000/premium/generate-report/monthly', {
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
        // Create a new row for each expense
        const row = tbody.insertRow();
        
        // Insert cells in the row for different expense details
        const expenseDateCell = row.insertCell(0);
        const expenseAmtCell = row.insertCell(1);
        const expenseDescriptionCell = row.insertCell(2);
        const expenseCategoryCell = row.insertCell(3);

        // Populate the cells with expense details
        expenseDateCell.textContent = formatDate(new Date(expense.createdAt));
        expenseAmtCell.textContent = expense.expenseAmt;
        expenseDescriptionCell.textContent = expense.expenseDescription;
        expenseCategoryCell.textContent = expense.expenseCategory;
    });

    // Calculate the total expense for the month
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.expenseAmt, 0);

    // Create a new row for displaying total expense
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
        const response = await axios.get('http://localhost:3000/premium/generate-report/yearly', {
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
 

