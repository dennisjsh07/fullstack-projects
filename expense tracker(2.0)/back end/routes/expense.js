const express = require('express');
const expenseController = require('../controller/expense');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/add-expense',userAuthentication.authenticate,expenseController.addExpense);

router.delete('/delete-expense/:id',userAuthentication.authenticate,expenseController.deleteExpense);

router.get('/get-expense',userAuthentication.authenticate,expenseController.getExpense); // adding middle ware to see which user wants the expense...

module.exports = router;
 