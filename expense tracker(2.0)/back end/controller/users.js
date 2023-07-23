const usersModel = require('../model/users');

exports.addUsers = async (req,res,next)=>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        // add error if user already exists...
        const existingUser = await usersModel.findOne({email});
        if(existingUser){
            return res.status(409).json({err: "Email already exists"});
        }

        const data = await usersModel.create({
            name: name,
            email: email,
            password: password
        });
        res.status(201).json({newUsers: data});
    } catch(err){
        console.log("add users is failing", err);
        res.status(500).json({err:err})
    }
};


