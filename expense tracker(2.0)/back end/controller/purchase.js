const Razorpay = require('razorpay');
const Order = require('../model/orders');
const userController = require('../controller/users');
const User = require('../model/users');


exports.purchasePremium = async (req,res,next)=>{
    try{
        //(step-1) make a request to the razor pay backend with the id, secret key, AMOUNT, order id so that razrpy will find particular user.
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        // create an order in the backend to specify the amouont...
        const amount = 2500;
        rzp.orders.create({amount,currency:"INR"},(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err))
            }
            req.user.createOrder({orderid: order.id, status: 'PENDING'})
            .then(()=>{
                return res.status(201).json({order,key_id: rzp.key_id});
            }).catch(err=>{
                throw new Error(err);
            })
        })
    } catch(err){
        console.log('purchasing membership is failing',err);
        res.status(403).json({err: err});
    }
};

exports.updateTransactionStatus = async (req,res,next)=>{
    try{
        const userId = +req.user.id;
        const email = req.user.email;
        const {payment_id, order_id} = req.body;
        const order = await Order.findOne({where : {orderid : order_id}});
        const promise1 =  order.update({paymentid: payment_id, status: 'SUCCESSFULL'})
        const promise2 =  req.user.update({ispremiumuser: true})
        await Promise.all([promise1,promise2])
        const updatedUser = await User.findByPk(userId)
        return res.status(202).json({success: true, message: "Transaction Successfull", token: userController.generateAccessToken(updatedUser.id, updatedUser.email, updatedUser.dataValues.ispremiumuser)});// fix the refresh bug...
    } catch(err){
        console.log('update transaction status is failing',err);
        res.status(403).json({err: err});
    }
}
 
