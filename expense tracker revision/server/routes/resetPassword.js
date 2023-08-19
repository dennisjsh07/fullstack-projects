const express = require('express');
const resetPasswordController = require('../controller/resetPassword');

const router = express.Router();

router.get('/reset-password/:id',resetPasswordController.showPasswordChangePage);

router.post('/reset-password', resetPasswordController.resetPassword);

router.put('/update-password',resetPasswordController.updatePassword);

module.exports = router;
 