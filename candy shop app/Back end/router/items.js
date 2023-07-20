const express = require('express');
const itemsController = require('../controllers/item');

const router = express.Router();

router.post('/add-items',itemsController.postaddItems);

router.delete('/delete-items/:id',itemsController.deleteItems);

router.put('/update-items/:id',itemsController.updateItems);

router.get('/get-items',itemsController.getItems);

module.exports = router;
 
