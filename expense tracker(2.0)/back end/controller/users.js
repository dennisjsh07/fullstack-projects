const usersModel = require('../model/users');

exports.addUsers = async (req,res,next)=>{
    try{
        const {name,email,password} = req.body;

        // ad error if fields are empty...
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
          }

        // add error if user already exists...
        const existingUser = await usersModel.findOne({where: {email}});
        if(existingUser){
            return res.status(409).json({error: "Email already exists"});
        }

        await usersModel.create({name,email,password});
        res.status(201).json({message: 'Account Created Successfully'});
    } catch(err){
        console.log("add users is failing", err);
        res.status(500).json({error:err})
    }
};


