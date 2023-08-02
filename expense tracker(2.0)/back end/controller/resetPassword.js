const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');


const User = require('../model/users');
const ForgotPassword = require('../model/resetPassword');

exports.forgotPassword = async(req,res,next)=>{
    try{
        const {email} = req.body;

         // ad error if fields are empty...
        if (!email) {
        return res.status(400).json({ error: "All fields are required" });
        }

        // find the user corrosponding to email...
        const user = await User.findOne({where: {email}});
        if(user){
            const id = uuid.v4();
            user.createForgotPassword({id, active: true})
            .catch(err=> {
                throw new Error(err)
            })

            sgMail.setApiKey(process.env.SENDGRID_API_KEY)

            const msg = {
                to: email, // change email...
                from: 'yj.rocks.2411@gmail.com', // change email...
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/reset-password/${id}">Reset password</a>`, 
            }
            sgMail
            .send(msg)
            .then((response) => {

                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
                throw new Error(error);
            })

            //send mail
        }
        else{
            throw new Error('user doesnot exist')
        }
    } catch(err){
        console.log('forgot Password is failing',err);
        res.status(500).json({err: err});
    }
}

exports.resetPassword = async (req,res,next)=>{
    try{
        const id = req.params.id;
        const forgotpasswordrequest = await ForgotPassword.findOne({where: {id, active: true}});
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
        }
    } catch(err){
        console.log('reset password failing',err);
        res.status(500).json({err:err});
    }
}

exports.updatePassword = async(req,res,next)=>{
    try{
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
                } else{
                    return res.status(404).json({ error: 'No user Exists', success: false})
                }
                })
            })
    } catch(err){
        console.log('update password failing',err);
        res.status(500).json({err:err});
    }
}