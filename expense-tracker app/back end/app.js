// import core modules...
const express = require('express');
const bodyParser = require('body-parser');
const expenseRouter = require('./routers/expense');
const sequelize = require('./util/database')
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/expense',expenseRouter);

sequelize
// .sync({force:true})
.sync()
.then(()=>{
    console.log('table created');
    app.listen(5000);
})
.catch(err=>console.log(err));

