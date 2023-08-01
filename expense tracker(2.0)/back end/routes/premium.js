const express = require('express');
const userAuthentication = require('../middleware/auth');
const premiumFeatureController = require('../controller/premiumFeatures');
const router = express.Router();

router.get('/showLeaderBoard',userAuthentication.authenticate,premiumFeatureController.getUserLeaderBoard);

module.exports = router;