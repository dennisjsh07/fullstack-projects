const form = document.querySelector('form');

form.addEventListener('submit', onSubmit);

async function onSubmit(e){
    console.log(e.target);
    e.preventDefault();

    const myObj = {
        expenseAmt: document.getElementById('expenseAmt').value,
        expenseDescription: document.getElementById('expenseDescription').value,
        expenseCategory: document.getElementById('expenseCategory').value
    }

    try{
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/expense/add-expense',myObj,{headers: {'Authorization': token}});
        console.log(response);
        showInUi(response.data.newExpenseDetails);
    } catch(err){
        console.log(err)
    }

    form.reset();
}

// pagination...
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageNumbers = document.getElementById('pageNumbers');
let currentPage = 1;
let totalPages = 1; // Initialize with 1, will be updated when fetching expenses...

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

async function getRequest(page){
    try{
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/expense/get-expense', {
            headers: {'Authorization': token},
            params: { page }
        });
        console.log(response);
        // console.log(response.data.allExpenses);

        // grab all the expenses...
        const {allExpenses, totalPages: total} = response.data;
        totalPages = total; // Update totalPages

        // clear previous items in the table...--+
        var tableBody = document.getElementById('item-table');
        tableBody.innerHTML = '';

        // run through all the expenses and display them on the screen...
        for(var i = 0; i<allExpenses.length; i++){
            showInUi(allExpenses[i]);
        }

        // Update page numbers
        updatePageNumbers();

    } catch(err){
        console.log(err)
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
    var actionCell = newRow.insertCell(3); // cell for buttons.

    // populate the cells with item data...
    expenseAmtCell.textContent = data.expenseAmt;
    expenseDescriptionCell.textContent = data.expenseDescription;
    expenseCategoryCell.textContent = data.expenseCategory;

    // create a row & for delete button...
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
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3000/expense/delete-expense/${userId}`, {headers: {'Authorization': token}});
            console.log(response);
            // console.log(response.data.deletedExpense);
            getRequest();
        } catch(err){
            console.log(err);
        }
    }
}

const buyPremiumBtn = document.getElementById('rzp-btn');
const premiumMessage = document.getElementById('premiumMessage');
const reportsBtn = document.getElementById('reportsBtn');
const leaderBoardBtn = document.getElementById('leaderBoard-btn');

buyPremiumBtn.addEventListener('click',onBuyClick);

async function onBuyClick(e){
    try{
        // buy premium membership...
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/purchase/premium-membership', {headers: {'Authorization': token}});
        console.log(response);

        // update status...
        var options = {
            'key': response.data.key_id,
            'order_id': response.data.order.id,
            'handler': async(response)=>{
                const token = localStorage.getItem('token');
                const res = await axios.post('http://localhost:3000/purchase/update-status',{
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, {headers: {'Authorization': token}});

                alert('you are now a premium user');

                // Hide the Buy Premium button and show the Premium User text
                buyPremiumBtn.style.display = 'none';
                premiumMessage.style.display = 'block';
                reportsBtn.style.display = 'block';
                leaderBoardBtn.style.display = 'block';

                 // save the new updated token for premium user in local storage...
                 localStorage.setItem('token',res.data.token);
                //  console.log(res.data.token);
            }
        } 
    } catch(err){
        console.log(err)
    } 

    const rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();

    rzp.on('payment.failed',function(response){
        console.log(response);
        alert('something went wrong');
    })
}
 
document.getElementById('downloadExpense').addEventListener('click', async(e)=>{
    try{
        const token = localStorage.getItem('token');
        const awsS3Data = await axios.get('http://localhost:3000/expense/download', {
            headers: {'Authorization': token},
        });
        console.log(awsS3Data);

        if(awsS3Data.status === 200){

            var anchor = document.createElement('a');
            anchor.href = awsS3Data.data.fileUrl;
            anchor.download = 'expeses.csv';
            anchor.click();
            addDownloadsToScreen(awsS3Data.data.fileUrl)

        } else {
            throw new Error(response.data.message)
        }
    } catch(err){
        console.log(err);
    }
})
 
async function showAllDownloadsOfUser() {
    try {
        let token = localStorage.getItem('token')
        let downloads = await axios.get('http://localhost:3000/expense/alldownload', { headers: { Authorization: token } })
        // console.log(downloads.data.allData)
        //  console.log(downloads.data.allData.fileurl)
        downloads.data.allData.forEach((element, index) => {
            addDownloadsToScreen(element.fileurl, index + 1)
        })
    } catch (err) {
        console.log(err)
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
    showAllDownloadsOfUser()
    const token = localStorage.getItem('token'); // getting the token stored in localstorage...
    const decodedToken = parseJwt(token);
    // console.log('decoded token>>>',decodedToken);
    const isAdmin = decodedToken.isPremiumUser;
    // console.log('isAdmin >>>>>',isAdmin);
     if (isAdmin) {
        buyPremiumBtn.style.display = 'none';
        premiumMessage.style.display = 'block';
        reportsBtn.style.display = 'block';
        leaderBoardBtn.style.display = 'block';
     }
});