const Coupon = require('../models/Coupon');
const Shop = require('../models/Shop');

const getCouponsByShop = async (req, res) => {
  try {
    const coupons = await Coupon.find({ shopId: req.params.shopId }).sort({ createdAt: -1 });

    // Hide amount for unscratched coupons
    const safeCoupons = coupons.map(c => ({
      ...c.toObject(),
      amount: c.isScratched ? c.amount : null
    }));

    res.json({ success: true, data: safeCoupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const scratchCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    if (coupon.isScratched) return res.status(400).json({ success: false, message: 'Already scratched' });

    coupon.isScratched = true;
    await coupon.save();

    // Now update shop earned — only scratched coupons count
    const scratchedCoupons = await Coupon.find({ shopId: coupon.shopId, isScratched: true });
    const totalEarned = scratchedCoupons.reduce((sum, c) => sum + c.amount, 0);

    await Shop.findByIdAndUpdate(coupon.shopId, { totalEarned });

    res.json({
      success: true,
      data: coupon, // now reveal full amount
      message: `🎉 You won ₹${coupon.amount}!`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const redeemCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    if (!coupon.isScratched) return res.status(400).json({ success: false, message: 'Scratch first!' });
    if (coupon.isRedeemed) return res.status(400).json({ success: false, message: 'Already redeemed' });

    coupon.isRedeemed = true;
    await coupon.save();

    // Update paid amount
    const redeemedCoupons = await Coupon.find({ shopId: coupon.shopId, isRedeemed: true });
    const totalPaid = redeemedCoupons.reduce((sum, c) => sum + c.amount, 0);

    await Shop.findByIdAndUpdate(coupon.shopId, { totalPaid });

    res.json({
      success: true,
      data: coupon,
      message: `✅ ₹${coupon.amount} marked as paid!`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCouponsByShop, scratchCoupon, redeemCoupon };