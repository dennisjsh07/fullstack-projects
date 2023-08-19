// import core modules...

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumFeatures');
const passwordRoutes = require('./routes/resetPassword');

const User = require('./model/user');
const Expense = require('./model/expense');
const Order = require('./model/order');
const Forgotpassword = require('./model/resetPassword');
const Download = require('./model/download');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/user',userRoutes);

app.use('/expense',expenseRoutes);

app.use('/purchase',purchaseRoutes);

app.use('/premium',premiumRoutes);

app.use('/password',passwordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Download);
Download.belongsTo(User);

sequelize
// .sync({force: true})
.sync()
.then(()=>{
    console.log('all table created');
    app.listen(3000);
})
.catch(err=> console.log(err))
  