const express = require('express');
const router = express.Router();
const userAuthentication = require('../middleware/auth');
const reportsController = require('../controller/reports');

router.get('/generate-report/daily', userAuthentication.authenticate,reportsController.generateDailyReport);

router.get('/generate-report/monthly', userAuthentication.authenticate,reportsController.generateMonthlyReports);

router.get('/generate-report/yearly', userAuthentication.authenticate, reportsController.generateYearlyReports);

// router.get('/download',userAuthentication.authenticate,reportsController.downloadExpenses);

module.exports = router;
 
 

