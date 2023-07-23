const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense(2.0)','root','8884434443d@',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;