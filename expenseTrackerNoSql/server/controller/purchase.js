const RazorPay = require('razorpay');
const Order = require('../model/order');
const userController = require('../controller/user');
require('dotenv').config();


exports.purchasePremium = async(req,res,next)=>{
    try{
    // identity verification...
    const rzp = new RazorPay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // place order in razorpay...
    const amountInPaise = 250000; // 2500 INR in paise
    const order = await rzp.orders.create({ amount: amountInPaise, currency: "INR" });

    // insert the orderId and status generated from razorpay into our database...
    const newOrder = new Order({ 
        orderId: order.id, 
        status: "PENDING", 
        userId: req.user._id
    });
    await newOrder.save();
    res.status(201).json({order, key_id: rzp.key_id});
    } catch(err){
        console.log('create order failed :', err);
        res.status(403).json({err: 'user does not have access'})
    }
};

exports.updateStatus = async(req,res,next)=>{
    try{
        // console.log('req.body>>>>>',req.body);
        const userId = req.user._id;
        // get the payment and oredrId...
        const{payment_id, order_id} = req.body;

        // find order using orderId...
        const order = await Order.findOne({orderId: order_id})

        if (!order) { // debugging if order exists?
            return res.status(404).json({ message: 'Order not found' });
        }

        // update the paymentId and premium user...
        const promise1 = order.updateOne({
            paymentId: payment_id, 
            status: 'SUCCESSFULL'
        });
        const promise2 = req.user.updateOne({
            isPremiumUser: true
        });
        await Promise.all([promise1, promise2]);
        return res.status(202).json({
            success: true, 
            message: 'Transaction successfull', 
            token: userController.generateAccessToken(userId, undefined, true)});

    } catch(err){
        console.log('payment failed :', err);
        res.status(403).json({err: 'user does not have access'})
    }
}
 


