const User = require('../model/users');
const Expense = require('../model/expense');

exports.getUserLeaderBoard = async (req,res,next)=>{
    try{
        // get all the users and expenses...
        const users = await User.findAll();
        const expenses = await Expense.findAll();

        // add all the expenses based on the userId...
        const userAggregatedExpense = {}; //for clubbing all the expenses...
        expenses.forEach((expense)=>{
            if(userAggregatedExpense[expense.userId]){ // if already exists then keep adding
                userAggregatedExpense[expense.userId] = userAggregatedExpense[expense.userId] + expense.expenseAmt;
            } 
            else{
                userAggregatedExpense[expense.userId] = expense.expenseAmt;
            }
        });
        console.log(userAggregatedExpense);

        // iterate through the users array to show all the users...
        var userLeaderBoardDetails = [];
        users.forEach((user)=>{
            // create a key value pair of name and totaCost corrospondig to the id and push inside array...
            userLeaderBoardDetails.push({name: user.name, total_cost: userAggregatedExpense[user.id] || 0});
        });
        console.log(userLeaderBoardDetails);

        // sort based on total expenses...
        userLeaderBoardDetails.sort((a,b)=>b.total_cost - a.total_cost);
        res.status(200).json(userLeaderBoardDetails);
    } catch(err){
        console.log('getUserLeaderBoard is failing',err);
        res.status(500).json({err: err});
    }
};

// notes...
// iterating the objects in the array.
// const expense = [
//     {
//       id:1,
//       expense:300
//     },
//     {
//       id:2,
//       expense:200
//     },
//     {
//       id:1,
//       expense:100
//     }
//     ]
    
//     const aggregatedExpense = {}
//     expense.forEach((item)=>{
//       if(aggregatedExpense[item.id]){
//         aggregatedExpense[item.id] = aggregatedExpense[item.id] + item.expense
//       } else{
//         aggregatedExpense[item.id] = item.expense
//       }
//     });
    
//     console.log(aggregatedExpense);