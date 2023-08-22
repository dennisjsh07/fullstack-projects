const User = require('../model/user');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

exports.addUser = async (req, res, next)=>{
    try{
        // console.log(req.body);
        const {name, phone, email, password} = req.body;

        // validation...
        if(!name || !phone || !email || !password){
            return res.status(400).json({err: 'enter all the fields'})
        }

        // add error if user already exists...
        const existingUser = await User.findOne({
            where: {[Op.or]: [
                {email},
                {phone}
            ]}
        });
        if(existingUser){
            return res.status(400).json({err: 'user already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await User.create({name, phone, email, password: hashedPassword});
        res.status(201).json({newUserDetails: response});

    } catch(err){
        console.log('adding user failed >>>>', err);
        res.status(500).json({err: err});
    }
}