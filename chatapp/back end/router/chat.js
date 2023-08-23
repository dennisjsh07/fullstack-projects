const express = require('express');
const chatController = require('../controller/chat');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/send-message', userAuthentication.authenticate, chatController.addNewChat);

module.exports = router;