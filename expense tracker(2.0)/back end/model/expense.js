const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expense = sequelize.define('expense',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    expenseAmt: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    expenseDescription: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expenseCategory: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Expense;