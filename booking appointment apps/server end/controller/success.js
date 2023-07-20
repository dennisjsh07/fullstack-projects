const path = require('path');

exports.successPage = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','success.html'));
}