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
 