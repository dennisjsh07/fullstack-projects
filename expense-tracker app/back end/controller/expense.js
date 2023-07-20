const Expense = require('../model/expense');

exports.postAddExpense = async (req,res,next)=>{
    try{
        // console.log('req.body',req.body);
        if(!req.body.description && !req.body.expenseAmt){
            throw new Error('expense amount and description are important');
        }
        const expenseAmount = req.body.expense;
        const description = req.body.description;
        const category = req.body.category;
        const data = await Expense.create({
            expenseAmount: expenseAmount,
            description: description,
            category: category
        });
        res.status(201).json({newexpenseDetails: data});
    } catch(err){
        console.log('postAddExpense is failing', err);
        res.status(500).json({err: err})
    }
}

exports.updateExpense = async (req,res,next)=>{
    try{
        const eId = req.params.id;
        if(!eId){
            throw new Error('eId is required for updateding the request');
        }

        // grab all the input fields...
        const expenseAmount = req.body.expense;
        const description = req.body.description;
        const category = req.body.category;

        // find the data based on id...
        const expenseData = await Expense.findByPk(eId);

        if(!expenseData){
            return res.status(404).json({err: 'data not found'})
        }

        expenseData.expenseAmount = expenseAmount;
        expenseData.description = description;
        expenseData.category = category;

        // save the updated date..
        await  expenseData.save();

        res.status(200).json({updatedExpenseData: expenseData});
    }
    catch(err){
        console.log('update details is failing',err)
        res.status(500).json({err: err});
    }
}

exports.deleteExpense = async(req,res,next)=>{
    try{
        if(req.params.id === 'undefined'){
            return res.status(400).json({err: err});
        }
        const eId = req.params.id;
        await Expense.destroy({where:{id: eId}})
        res.sendStatus(200);
        // check
        // const eId = req.params.id;
        // const deleteRows = await Expense.destroy({where:{id: eId}});
        // if(deleteRows>0){
        //     console.log(`${eId} successfully deleted`);
        //     res.sendStatus(200);
        // }
        // else{
        //     console.log(`${eId} not deleted`);
        //     res.sendStatus(404).json({err: err});
        // }
    } catch(err){
        console.log('delete expense is failing',err);
        res.status(500).json({err: err});
    }
}

exports.getExpense = async(req,res,next)=>{
    try{
        const expenses = await Expense.findAll();
        res.status(200).json({allExpenses: expenses});
    } catch(err){
        console.log('get user is failing',err);
        res.status(500).json({err:err});
    }
}

