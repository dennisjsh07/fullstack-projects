const express = require('express');
const expenseController = require('../controller/expense');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/add-expense',expenseController.addExpense);

router.delete('/delete-expense/:id',expenseController.deleteExpense);

router.get('/get-expense',userAuthentication.authenticate,expenseController.getExpense); // adding middle ware to see which user wants the expense...

module.exports = router;
 