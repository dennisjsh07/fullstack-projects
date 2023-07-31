const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paymentid: Sequelize.STRING, // which we will get after successfull payment..
    orderid: Sequelize.STRING, // we get initially when the order gets created...
    status: Sequelize.STRING
});

module.exports = Order;
 