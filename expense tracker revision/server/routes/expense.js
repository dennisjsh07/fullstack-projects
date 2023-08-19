const express = require('express');
const expenseController = require('../controller/expense');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/download', userAuthentication.authenticate, expenseController.downloadReport);

router.get('/alldownload', userAuthentication.authenticate, expenseController.getAllDownloadedFileUrls);

router.post('/add-expense', userAuthentication.authenticate, expenseController.addExpense);

router.delete('/delete-expense/:id', userAuthentication.authenticate, expenseController.deleteExpense);

router.get('/get-expense', userAuthentication.authenticate, expenseController.getExpense);

module.exports = router;
 