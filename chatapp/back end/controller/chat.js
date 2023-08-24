const Chat = require('../model/chat');

exports.addNewChat = async(req,res,next)=>{
    try{
        // console.log(req.body);
        const {message} = req.body;

        const addMessage = await Chat.create({message, name: req.user.name, userId: req.user.id});
        res.status(201).json({newMessage: addMessage});
    } catch(err){
        console.log('adding new messsages failed>>>>', err);
        res.status(201).json({message: 'message added'})
    }
}
 

exports.getAllChat = async (req, res, next)=>{
    try{
        const getChat = await Chat.findAll();
        // console.log('getChat >>>', getChat);
        res.status(200).json({allChats: getChat});
    } catch(err){
        console.log('get all chat failed >>>>>', err);
        res.status(500).json({err: err});
    }
}
 