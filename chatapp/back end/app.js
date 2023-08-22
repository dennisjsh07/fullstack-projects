// import core modules...

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');

const userRouter = require('./router/user');

const User = require('./model/user');

const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
<<<<<<< HEAD
    methods: "GET, POST, PUT, DELETE"
=======
    methods: ['GET', 'POST', 'PUT', 'DELETE']
>>>>>>> af608fb3bba802be141da86fe08adba44e820ada
}));

app.use(bodyParser.json());

app.use('/user',userRouter);

sequelize
// .sync({force: true})
.sync()
.then(()=>{
    console.log('tabels created');
    app.listen(4000);
})
.catch(err=> console.log(err));

