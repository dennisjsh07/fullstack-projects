// import core modules...

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');

const userRouter = require('./router/user');
const chatRouter = require('./router/chat');
const groupRouter = require('./router/group');

const User = require('./model/user');
const Chat = require('./model/chat');
const Group = require('./model/group');
const UserGroup = require('./model/usergroup');

const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
    methods: "GET, POST, PUT, DELETE"
}));

app.use(bodyParser.json());

app.use('/user',userRouter);

app.use('/chat',chatRouter);

app.use('/group',groupRouter);

User.hasMany(Chat);
Chat.belongsTo(User);

Group.belongsToMany(User , {through : UserGroup});
User.belongsToMany(Group , {through : UserGroup});

Group.hasMany(Chat);
Chat.belongsTo(Group);

sequelize
// .sync({force: true})
.sync()
.then(()=>{
    console.log('tabels created');
    app.listen(4000);
})
.catch(err=> console.log(err));
 
 