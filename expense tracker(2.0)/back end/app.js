// import core modules...
const express = require('express');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const expenseRoute = require('./routes/expense');
const purchaseRoute = require('./routes/purchase');
const sequelize = require('./util/database');
const User = require('./model/users');
const Expense = require('./model/expense');
const Order = require('./model/orders');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/users',usersRoute);

app.use('/expense',expenseRoute);

app.use('/premium',purchaseRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
// .sync({force: true})
.sync()
.then(()=>{
    app.listen(3000);
    console.log('table created');
})
.catch(err=>console.log(err));
  