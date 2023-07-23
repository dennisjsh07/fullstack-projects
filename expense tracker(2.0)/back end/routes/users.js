const express = require('express');
const userController = require('../controller/users');

const router = express.Router();

router.post('/sign-up',userController.addUsers);

module.exports = router;