const expenseModel = require('../model/expense');
const User = require('../model/users');
const sequelize = require('../util/database');

exports.addExpense = async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        // grab all the values....
        const {expenseAmt,expenseDescription,expenseCategory} = req.body;

        // ad error if fields are empty...
        if (!expenseAmt || !expenseDescription || !expenseCategory) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // insert them inside...
        const expense = await expenseModel.create({expenseAmt,expenseDescription,expenseCategory,userId: req.user.id}, {transaction: t});
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseAmt)
        // console.log(totalExpense)
        await User.update({totalExpenses: totalExpense}, {where: {id: req.user.id}, transaction: t});
        // commit transaction...
        await t.commit();
        res.status(201).json({expense: expense});
    } catch(err){
        console.log('add expense is failing',err);
        // rollback transaction...
        await t.rollback();
        res.status(500).json({error: err})
    }
};

exports.deleteExpense = async(req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const Eid = req.params.id;
        if(Eid ==='undefined'){
            return res.status(400).json({error: 'id required to delete'});
        }

        // find the expense before deleting...
        const expense = await expenseModel.findOne({where: {id: Eid, userId: req.user.id}});
        if(!expense){
            res.status(404).josn({err: 'expense not found'});
        }
        await expenseModel.destroy({where:{id:Eid, userId: req.user.id}, transaction: t});
        const totalExpense = Number(req.user.totalExpenses) - Number(expense.expenseAmt)
        console.log(totalExpense)
        await User.update({totalExpenses: totalExpense}, {where: {id: req.user.id}}, {transaction: t});
        // commit transaction...
        await t.commit();
        res.sendStatus(200);
    } catch(err){
        console.log('delete expense is failing',err);
        await t.rollback();
        res.status(500).json({err:err});
    }
}

exports.getExpense = async(req,res,next)=>{
    try{
        const page = req.query.page || 1;
        const perPage = 5; // Number of expenses per page
        const offset = (page - 1) * perPage;

        const expenses = await expenseModel.findAll({
            where: {userId: req.user.id},
            limit: perPage,
            offset: offset
        });

        const totalExpenses = await expenseModel.count({ where: { userId: req.user.id } });
        const totalPages = Math.ceil(totalExpenses / perPage);

        res.status(200).json({allExpenses: expenses, totalPages: totalPages })
    } catch(err){
        console.log('get expense is failing');
        res.status(500).json({err:err});
    }
}
  
 