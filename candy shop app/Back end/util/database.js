const Sequelize = require('sequelize');

const sequelize = new Sequelize('candy-shop','root','8884434443d@',{
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;