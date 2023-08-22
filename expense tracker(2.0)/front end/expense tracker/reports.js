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

 