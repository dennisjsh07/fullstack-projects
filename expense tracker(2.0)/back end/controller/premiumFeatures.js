// const User = require('../model/users');
// const Expense = require('../model/expense');

// exports.getUserLeaderBoard = async (req,res,next)=>{
//     try{
//         // get all the users and expenses...
//         const users = await User.findAll();
//         const expenses = await Expense.findAll();

//         // add all the expenses based on the userId...
//         const userAggregatedExpense = {}; //for clubbing all the expenses...
//         expenses.forEach((expense)=>{
//             if(userAggregatedExpense[expense.userId]){ // if already exists then keep adding
//                 userAggregatedExpense[expense.userId] = userAggregatedExpense[expense.userId] + expense.expenseAmt;
//             } 
//             else{
//                 userAggregatedExpense[expense.userId] = expense.expenseAmt;
//             }
//         });
//         console.log(userAggregatedExpense);

//         // iterate through the users array to show all the users...
//         var userLeaderBoardDetails = [];
//         users.forEach((user)=>{
//             // create a key value pair of name and totaCost corrospondig to the id and push inside array...
//             userLeaderBoardDetails.push({name: user.name, total_cost: userAggregatedExpense[user.id] || 0});
//         });
//         console.log(userLeaderBoardDetails);

//         // sort based on total expenses...
//         userLeaderBoardDetails.sort((a,b)=>b.total_cost - a.total_cost);
//         res.status(200).json(userLeaderBoardDetails);
//     } catch(err){
//         console.log('getUserLeaderBoard is failing',err);
//         res.status(500).json({err: err});
//     }
// };

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// // optimised code - 1...
// const User = require('../model/users');
// const Expense = require('../model/expense');
// const sequelize = require('../util/database');

// exports.getUserLeaderBoard = async (req,res,next)=>{
//     try{
//         // get only the required attributes from users and expenses...
//         const users = await User.findAll({
//             attributes:  ['id', 'name'] 
//         });
        // const expenses = await Expense.findAll({ // based on userId add the expense and group it...
        //     attributes: ['userId', [sequelize.fn('sum', sequelize.col('expense.expenseAmt')), 'total_cost']],
        //     group: ['userId']
        // });
        // console.log(expenses);

        // // iterate through the users array to show all the users...
        // var userLeaderBoardDetails = [];
        // users.forEach((user)=>{
        //     // create a key value pair of name and totaCost corrospondig to the id and push inside array...
        //     userLeaderBoardDetails.push({name: user.name, total_cost: userAggregatedExpense[user.id] || 0});
//         });
//         console.log(userLeaderBoardDetails);

//         // sort based on total expenses...
//         userLeaderBoardDetails.sort((a,b)=>b.total_cost - a.total_cost);
//         res.status(200).json(expenses);
//     } catch(err){
//         console.log('getUserLeaderBoard is failing',err);
//         res.status(500).json({err: err});
//     }
// };

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// // optimised code - 2 (MAKING A SINGLE QUERY)...
// const User = require('../model/users');
// const Expense = require('../model/expense');
// const sequelize = require('../util/database');

// exports.getUserLeaderBoard = async (req,res,next)=>{
//     try{
//         // get only the required attributes from users and expenses...
//         const leaderboardOfUsers = await User.findAll({
//             attributes:  ['id', 'name', [sequelize.fn('sum', sequelize.col('expenseAmt')), 'total_cost']],
//             include: [
//                 {
//                     model: Expense,
//                     attributes: []
//                 }
//             ],
//             group: ['id'],
//             order: [['total_cost','DESC']]
//         });
//         res.status(200).json(leaderboardOfUsers);
//     } catch(err){
//         console.log('getUserLeaderBoard is failing',err);
//         res.status(500).json({err: err});
//     }
// };

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// optimised code - 3 (directly using totalExpenses from the table)...
const User = require('../model/users');

exports.getUserLeaderBoard = async (req,res,next)=>{
    try{
        // get only the required attributes from users and expenses...
        const leaderboardOfUsers = await User.findAll({
            order: [['totalExpenses','DESC']]
        });
        res.status(200).json(leaderboardOfUsers);
    } catch(err){
        console.log('getUserLeaderBoard is failing',err);
        res.status(500).json({err: err});
    }
};
 
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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