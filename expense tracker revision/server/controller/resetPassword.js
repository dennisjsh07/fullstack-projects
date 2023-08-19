const Forgotpassword = require('../model/resetPassword');
const User = require('../model/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

const {v4: uuidv4} = require('uuid');
const Sib = require('sib-api-v3-sdk');

const token = uuidv4(); // generte token...

exports.resetPassword = async (req,res,next)=>{
    try{
        // console.log('email value >>>>',req.body)
        const {email} = req.body;

        // find if email is already present...
        const existingUser = await User.findOne({where: {email}});
        if(!existingUser){
            res.status(404).json({message: 'user not found'});
        }

        // store the token in the database...
        const response = await Forgotpassword.create({
            id: token,
            active: true,
            userId: existingUser.id
        });

        // send email using send in blue...
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;

        const transEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: 'dennisjshofficial@gmail.com',
        }
        const receivers = [{
            email: email,
        }]

        await transEmailApi.sendTransacEmail({
            sender,
            To: receivers,
            subject: 'reset password for expense tracker app',
            textContent: 'please reset password',
            htmlContent: `<h3>Link To Reset Password For Expense App</h3>
            <a href="http://localhost:3000/password/reset-password/${token}"> Click Here to reset password</a>`,
        });
        res.status(201).json({success: true})
    } catch(err){
        console.log('reset password failed :', err);
        res.status(500).json({err: err});
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Find the relevant password reset entry by token
        const existingPasswordActive = await Forgotpassword.findOne({ where: { id: token } });

        if (!existingPasswordActive || !existingPasswordActive.active) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Update the password for the user
        const userToUpdate = await User.findByPk(existingPasswordActive.userId);
        if (!userToUpdate) {
            return res.status(404).json({ message: "User not found" });
        }

        await userToUpdate.update({ password: hashedPassword });

        // Deactivate the token
        await existingPasswordActive.update({ active: false });

        res.status(200).json({ message: "Password updated successfully" });

    } catch (err) {
        console.log('Update password failing:', err);
        res.status(500).json({ err: err });
    }
};

exports.showPasswordChangePage = async (req, res, next) => {
    try {
        const Pid = req.params.id;

        const existingPasswordActive = await Forgotpassword.findOne({ where: { id: Pid } });

        if (existingPasswordActive && existingPasswordActive.active) {
            res.status(200).redirect('http://127.0.0.1:5500/forgot%20password/updatePassword.html');
        } else {
            return res.status(500).json({ message: "Hey, You have already used this link." });
        }
    } catch (err) {
        console.log('show password change page failing:', err);
        res.status(500).json({ err: err });
    }
};
 
 