// import core modules...
const express = require('express');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const expenseRoute = require('./routes/expense');
const sequelize = require('./util/database');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/users',usersRoute);

app.use('/expense',expenseRoute);


sequelize
// .sync({force: true})
.sync()
.then(()=>{
    app.listen(3000);
    console.log('table created');
})
.catch(err=>console.log(err));
 