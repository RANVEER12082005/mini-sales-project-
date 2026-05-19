const express = require('express');
const router = express.Router();
const { getCouponsByShop, scratchCoupon, redeemCoupon } = require('../controllers/couponController');

router.get('/shop/:shopId', getCouponsByShop);
router.put('/scratch/:id', scratchCoupon);
router.put('/redeem/:id', redeemCoupon);

module.exports = router;