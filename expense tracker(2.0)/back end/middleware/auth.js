const jwt = require('jsonwebtoken');
const User = require('../model/users');

const authenticate = async (req,res,next)=>{
    try{
        // get the token from the header...
        const token = req.header('Authorization');
        console.log(token);
        // decrypt the token to find the particular user details encrypted...
        const user = jwt.verify(token,'8884434443d@SecretKey');
        console.log('userID >>>>',user.userId);
        // find the data of the particular user stored using the decrypted userId...
        await User.findByPk(user.userId)
        .then(user=>{
            req.user = user;
            next(); // this will flow to the next function in the routes.js file to getExpense...
        })
    } catch(err){
        console.log('authorisation failed',err);
        res.status(401).json({success: false});
    }
};

module.exports = {authenticate};
 