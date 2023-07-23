// import core modules...
const express = require('express');
const bodyParser = require('body-parser');
const usersController = require('./routes/users');
const sequelize = require('./util/database');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/users',usersController);

sequelize
// .sync({force: true})
.sync()
.then(()=>{
    app.listen(3000);
    console.log('table created');
})
.catch(err=>console.log(err));
