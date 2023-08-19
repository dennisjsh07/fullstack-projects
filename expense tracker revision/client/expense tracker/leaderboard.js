const leaderBoardBtn = document.getElementById('leaderBoard-btn');
// console.log(leaderBoardBtn);

leaderBoardBtn.addEventListener('click', onClick);

async function onClick(e){
    try{
        // console.log(e.target);
        const token = localStorage.getItem('token');
        const leaderBoardArray = await axios.get('http://localhost:3000/premium/show-leaderboard', {headers: {'Authorization': token}});
        console.log(leaderBoardArray.data);

        var leaderboardTable = document.getElementById('leaderboard-table');
        var leaderboardTBody = document.getElementById('leaderboard-tbody');

         // clear the previous data from the tbody...
         leaderboardTBody.innerHTML = '';

         leaderBoardArray.data.forEach((userDetails)=>{
            // create rows for each user...
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

const logOutButton = document.getElementById('log-out');

logOutButton.addEventListener('click', () => {
    // Clear local storage
    localStorage.clear();
    // Close the browser window
    window.close();
    // Redirect to the login page
    window.location.href = 'http://127.0.0.1:5500/login/login.html';
});
