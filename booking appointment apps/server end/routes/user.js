const express = require('express');
const userController = require('../controller/user')

const router = express.Router();

router.post('/add-user',userController.postaddUser);

router.put('/update-user/:id', userController.updateUser);

router.delete('/delete-user/:id',userController.deleteUser);

router.get('/get-users',userController.getUsers);

// router.get('/get-users/:id',userController.getUsers)

module.exports= router;