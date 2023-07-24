const express = require('express');
const userController = require('../controller/users');

const router = express.Router();

router.post('/sign-up',userController.addUsers);

router.post('/user-login',userController.userLogin);

module.exports = router;