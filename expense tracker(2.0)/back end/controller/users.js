const usersModel = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// require('dotenv').config();

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

        const saltRounds = 10;
        bcrypt.hash(password,saltRounds,async(err,hash)=>{ // encrypting the password... 
            if(err){
                console.log(err)
            }
            else{
                await usersModel.create({name,email,password: hash});
                res.status(201).json({message: 'Account Created Successfully'});
            }
        })
    } catch(err){
        console.log("add users is failing", err);
        res.status(500).json({error:err})
    }
};

const generateAccessToken = (id,email,ispremiumuser)=>{
    const payload = {
        userId: id,
        email: email,
        ispremiumuser: ispremiumuser
    }
    const secretKey = process.env.TOKEN_SECRET;
    return jwt.sign(payload,secretKey);
}

exports.userLogin = async (req,res,next)=>{
    try{
        const {email, password} = req.body;

        //add error if fields are empty...
        if(!email || !password){
            return res.status(400).json({error: 'all fields are requires'});
        }

        const existingUser = await usersModel.findOne({where: {email}});
        if(existingUser){
            // check
            // console.log('existing user details: ',existingUser);
            const isPasswordMatch = await bcrypt.compare(password,existingUser.password);
            if(isPasswordMatch){
                // create payload for jwt...
                // const payload = {userId: existingUser.id, email: existingUser.email};

                // create secret key for jwt...
                // const secretKey = process.env.TOKEN_SECRET;

                // Generate token...
                // const token = jwt.sign(payload,secretKey);
                res.status(200).json({message: 'User logged in successfully',token: generateAccessToken(existingUser.id, existingUser.email, existingUser.ispremiumuser)});
            }
            else{
                res.status(401).json({error: 'Email and Password are not matching'});
            }                
        }
        else{
            res.status(404).json({error: 'User does not exist'});
        }
    } catch(err){
        console.log('error finding user',err);
        res.status(500).json({error: err})
    }
} 
 

 

