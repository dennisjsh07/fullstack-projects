// const User = require('../model/user');
// const Expense = require('../model/expense');

// exports.getLeaderBoard = async(req,res,next)=>{
//     try{
//         // getting all the users and expenses...
//         const users = await User.findAll();
//         const expenses = await Expense.findAll();

//         // add all the expenses having similar id's...
//         const aggregateExpense = {};

//         expenses.forEach((expense)=>{
//             if(aggregateExpense[expense.userId]){
//                 aggregateExpense[expense.userId] = aggregateExpense[expense.userId] + expense.expenseAmt;
//             } else{
//                 aggregateExpense[expense.userId] = expense.expenseAmt;
//             }
//         });
//         // console.log(aggregateExpense);

//         var userBoardDetails = [];
//         // iterate through each user and add the user and corrospanding expense into the array...
//         users.forEach((user)=>{
//             userBoardDetails.push({name: user.name, totalExpenses: aggregateExpense[user.id] || 0});
//         });
//         // console.log(userBoardDetails);

//         // sort it in descending order...
//         userBoardDetails.sort((a,b)=>b.totalExpenses - a.totalExpenses);
//         res.status(200).json(userBoardDetails);

//     } catch(err){
//         console.log('get leaderboard is failing :', err);
//         res.status(500).json({err: err})
//     }
// }
 
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// // optimisation - 1 (using sql queries)...

// const User = require('../model/user');
// const Expense = require('../model/expense');
// const sequelize = require('../util/database');

// exports.getLeaderBoard = async(req,res,next)=>{
//     try{
//         // getting particular users and expenses...
//         const users = await User.findAll({
//             attributes: ['id','name']
//         });
//         // use group by instead fo looping...
//         const aggregateExpense = await Expense.findAll({
//             attributes: ['userId', [sequelize.fn('sum', sequelize.col('expense.expenseAmt')), 'totalExpenses']],
//             group: ['userId']
//         });        

//         var userBoardDetails = [];
//         // iterate through each user and add the user and corrospanding expense into the array...
//         users.forEach((user)=>{
//             userBoardDetails.push({name: user.name, totalExpenses: aggregateExpense[user.id] || 0});
//         });
//         // console.log(userBoardDetails);

//         // sort it in descending order...
//         userBoardDetails.sort((a,b)=>b.totalExpenses - a.totalExpenses);
//         res.status(200).json(aggregateExpense);

//     } catch(err){
//         console.log('get leaderboard is failing :', err);
//         res.status(500).json({err: err})
//     }
// }

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// // optimisation - 2 (using joins queriy)...

// const User = require('../model/user');
// const Expense = require('../model/expense');
// const sequelize = require('../util/database');

// exports.getLeaderBoard = async(req,res,next)=>{
//     try{
//         // getting particular users and expenses...
//         const leaderBoard = await User.findAll({
//             attributes: ['id','name', [sequelize.fn('sum', sequelize.col('expenseAmt')), 'totalExpenses']],
//             include: [
//                 {
//                     model: Expense,
//                     attributes: []
//                 }
//             ],
//             group: ['id'], // group by user table id where all the users are present...
//             order: [['totalExpenses', 'DESC']]
//         });

//         res.status(200).json(leaderBoard);

//     } catch(err){
//         console.log('get leaderboard is failing :', err);
//         res.status(500).json({err: err})
//     }
// }

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// optimisation - 3 (adding totalexpense col in table itself)...

const User = require('../model/user');
const { Op } = require('sequelize');
const Expense = require('../model/expense');
const sequelize = require('../util/database');

exports.getLeaderBoard = async(req,res,next)=>{
    try{
        const leaderBoard = await User.findAll({
            order: [['totalExpenses', 'DESC']]
        });

        res.status(200).json(leaderBoard);

    } catch(err){
        console.log('get leaderboard is failing :', err);
        res.status(500).json({err: err})
    }
}

exports.generateDailyReport = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { startDate, endDate } = req.query; // extracting query value of the request...
        const expenses = await Expense.findAll({
            where: {
                userId: req.user.id,
                createdAt: { [Op.between]: [startDate, endDate] } // filters expenses created between first and last date...
            },
            transaction: t
        });

        await t.commit();
        res.status(200).json(expenses);
    } catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({ error: 'Failed to generate daily report' });
    }
}

exports.generateMonthlyReports = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { reportMonth } = req.query;  //extracting (YYYY-MM) query value from the request...
        const year = reportMonth.slice(0, 4); // extracting characters from index 0-3(YYYY)...
        const month = reportMonth.slice(5, 7); // extracting characters from index 5-6(MM)...

        const expenses = await Expense.findAll({
            where: {
                userId: req.user.id,
                createdAt: {
                    [Op.and]: [ // operator combines two conditions to ensure expenses are within specific month...
                        { [Op.gte]: `${year}-${month}-01` }, // filters expenses on or after the first day...
                        { [Op.lte]: `${year}-${month}-31` } // filters expenses on or before the last day...
                    ]
                }
            },
            transaction: t
        });

        await t.commit();
        res.status(200).json(expenses);
    } catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({ error: 'Failed to generate monthly report' });
    }
}

exports.generateYearlyReports = async (req, res) => {    
    const t = await sequelize.transaction();
    try {
        const { reportYear } = req.query; // extracting query value from the request...

        const expenses = await Expense.findAll({
            where: {
                userId: req.user.id,
                createdAt: {
                    [Op.and]: [ // operator combines two conditions to ensure expenses are within specific year...
                        { [Op.gte]: `${reportYear}-01-01` }, // filters expenses on or after the first day of the year...
                        { [Op.lte]: `${reportYear}-12-31` } // filters expenses on or before the last day of the year...
                    ]
                }
            }
        });

        // Calculate total expenses for each month
        const monthlyExpenses = new Array(12).fill(0); // array is created to store the total expenses of each month and initialised with zero...
        expenses.forEach(expense => {
            const month = new Date(expense.createdAt).getMonth(); //For each expense, the month of creation is extracted
            monthlyExpenses[month] += expense.expenseAmt;
        });

        const reportData = monthlyExpenses.map((totalExpense, index) => {
            return {
                month: new Date(`${reportYear}-${index + 1}-01`).toLocaleString('default', { month: 'long' }),
                totalExpense
            };
        });

        await t.commit();
        res.status(200).json(reportData);
    } catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({ error: 'Failed to generate yearly report' });
    }
}
 
