const Chat = require('../model/chat');

exports.addNewChat = async(req,res,next)=>{
    try{
        // console.log(req.body);
        const {message} = req.body;

        const addMessage = await Chat.create({message, userId: req.user.id});
        res.status(201).json({newMessage: addMessage});
    } catch(err){
        console.log('adding new messsages failed>>>>', err);
        res.status(201).json({message: 'message added'})
    }
}