exports.addExpense = async ()=>{
    try{

    } catch(err){
        console.log('add expense is failing',err)
        res.status(500).json({err: err})
    }
};