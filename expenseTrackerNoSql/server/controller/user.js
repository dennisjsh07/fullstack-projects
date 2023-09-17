const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// create a token...
const generateAccessToken = (id,email,isPremiumUser)=>{
    const payLoad = {
        userId: id,
        email: email,
        isPremiumUser: isPremiumUser
    }
    const secretKey = process.env.TOKEN_SECRET;
    return jwt.sign(payLoad, secretKey)
}

exports.addUser = async (req,res,next)=>{
    try{
        // console.log(req.body);
        const {name, email, password} = req.body;

        // enter all the fileds...
        if(!name || !email || !password){
            return res.status(400).json({err: 'enter all the fields'});
        }

        // add error if user already exists...
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({response: 'user already exists'})
        }

        // insert into table...
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        const newUser = await new User({
            name: name, 
            email: email, 
            password: hashedPassword
        });
        const createdUser = await newUser.save();
        // console.log('createdUser >>>> ', createdUser)
        res.status(201).json({newUserDetails: createdUser})
    } catch(err){
        console.log('add-user is failing', err);
        res.status(500).json({err:err});
    }
}

exports.userLogin = async (req,res,next)=>{
    try{
        // console.log(req.body);
        const {email, password} = req.body;

        // enter all the fields...
        if(!email || !password){
            return res.status(400).json({err: 'fill all the required fields'});
        }

        // match the user...
        const existingUser = await User.findOne({email});
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if(isPasswordMatch){
            res.status(200).json({response: 'user logged in successfully', token: generateAccessToken(existingUser._id, existingUser.email, existingUser.isPremiumUser)});
        } else{ 
            res.status(404).json({err: 'user not found'});
        }
        
    } catch(err){
        console.log('user-login is failing :', err);
        res.status(500).json({err: err});
    }
}

module.exports.generateAccessToken = generateAccessToken;