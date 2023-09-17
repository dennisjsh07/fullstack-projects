// import core modules...

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumFeatures');
const passwordRoutes = require('./routes/resetPassword');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/user',userRoutes);

app.use('/expense',expenseRoutes);

app.use('/purchase',purchaseRoutes);

app.use('/premium',premiumRoutes);

app.use('/password',passwordRoutes);

mongoose.connect('mongodb+srv://dennisjshofficial:hnkc2wFVdsk7D1e2@expensetracker.hgwucyu.mongodb.net/expenseTracker?retryWrites=true')
.then(()=>{
    app.listen(3000);
    console.log('server running on port 3000');
})
.catch((err)=>{
    console.log(err)
})




  