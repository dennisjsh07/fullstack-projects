const express = require('express');
const purchaseController = require('../controller/purchase');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/premium-membership',userAuthentication.authenticate,purchaseController.purchasePremium);

router.post('/update-status',userAuthentication.authenticate,purchaseController.updateTransactionStatus);

module.exports = router;
 