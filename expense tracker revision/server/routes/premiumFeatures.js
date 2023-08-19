const express = require('express');
const userAuthentication = require('../middleware/auth');
const premiumController = require('../controller/premiumFeatures');

const router = express.Router();

router.get('/show-leaderboard', userAuthentication.authenticate, premiumController.getLeaderBoard);

router.get('/generate-report/daily', userAuthentication.authenticate, premiumController.generateDailyReport);

router.get('/generate-report/monthly', userAuthentication.authenticate, premiumController.generateMonthlyReports);

router.get('/generate-report/yearly', userAuthentication.authenticate, premiumController.generateYearlyReports);

module.exports = router;