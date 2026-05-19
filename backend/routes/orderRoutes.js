const express = require('express');
const router = express.Router();
const { getOrdersByShop, createOrder } = require('../controllers/orderController');

router.get('/shop/:shopId', getOrdersByShop);
router.post('/', createOrder);

module.exports = router;