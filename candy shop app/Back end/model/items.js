const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Items = sequelize.define('items',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    itemName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Items;
 
