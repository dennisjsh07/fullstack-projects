const express = require('express');
const expenseController = require('../controller/expense');

const router = express.Router();

router.post('/sign-up',expenseController.addExpense);

module.exports = router;