// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('expense-revise','root','8884434443d@',{
//     dialect: 'mysql',
//     host: 'localhost'
// });

// module.exports = sequelize;

//----------------------------------------------------------------------------------------------------------------------------------------------------------------

// (2nd revision)...

const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense-revise', 'root', '8884434443d@', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;

