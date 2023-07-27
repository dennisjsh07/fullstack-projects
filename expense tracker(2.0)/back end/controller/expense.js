const expenseModel = require('../model/expense');

exports.addExpense = async (req,res,next)=>{
    try{
        // grab all the values....
        const {expenseAmt,expenseDescription,expenseCategory} = req.body;

        // ad error if fields are empty...
        if (!expenseAmt || !expenseDescription || !expenseCategory) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // insert them inside...
        await expenseModel.create({expenseAmt,expenseDescription,expenseCategory});
        res.status(201).json({message: 'expense added successfully'});
    } catch(err){
        console.log('add expense is failing',err)
        res.status(500).json({error: err})
    }
};

exports.deleteExpense = async(req,res,next)=>{
    try{
        const Eid = req.params.id;
        if(Eid ==='undefined'){
            return res.status(400).json({error: 'id required to delete'});
        }
        await expenseModel.destroy({where:{id:Eid}});
        res.sendStatus(200);
    } catch(err){
        console.log('delete expense is failing',err);
        res.status(500).json({err:err});
    }
}

exports.getExpense = async(req,res,next)=>{
    try{
        // const expenses = await expenseModel.findAll();
        const expenses = await expenseModel.findAll({where: {userId: req.user.id}});
        res.status(200).json({allExpenses: expenses})
    } catch(err){
        console.log('get expense is failing');
        res.status(500).json({err:err});
    }
}
  
 