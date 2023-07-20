// import core modules...
const express = require('express');
const bodyParser = require('body-parser');
const itemRouter = require('./router/items');
const sequelize = require('./util/database');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/items',itemRouter);

sequelize
// .sync({force:true})
.sync()
.then(()=>{
    app.listen(2000);
    console.log('table created');
})
.catch(err=>console.log(err));
 