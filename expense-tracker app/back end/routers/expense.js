const express = require('express');
const expenseController = require('../controller/expense');

const router = express.Router();

router.post('/add-expense',expenseController.postAddExpense);

router.put('/update-expense/:id',expenseController.updateExpense);

router.delete('/delete-expense/:id',expenseController.deleteExpense);

router.get('/get-expense',expenseController.getExpense);

module.exports = router;
 

