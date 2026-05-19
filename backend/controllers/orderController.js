const Order = require('../models/Order');
const Shop = require('../models/Shop');
const Coupon = require('../models/Coupon');

const COUPON_THRESHOLD = 5000;

const getOrdersByShop = async (req, res) => {
  try {
    const orders = await Order.find({ shopId: req.params.shopId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { shopId, amount, note } = req.body;

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });

    const order = await Order.create({ shopId, amount, note });

    const allOrders = await Order.find({ shopId });
    const totalAmount = allOrders.reduce((sum, o) => sum + o.amount, 0);

    const totalCouponsNeeded = Math.floor(totalAmount / COUPON_THRESHOLD);
    const existingCoupons = await Coupon.countDocuments({ shopId });
    const newCouponsCount = totalCouponsNeeded - existingCoupons;

    const newCoupons = [];
    for (let i = 0; i < newCouponsCount; i++) {
      // Amount hidden until scratched — store it but don't reveal
      const randomAmount = Math.floor(Math.random() * 451) + 50;
      const coupon = await Coupon.create({
        shopId,
        amount: randomAmount,
        isScratched: false,
        isRedeemed: false
      });
      newCoupons.push(coupon);
    }

    // Only count SCRATCHED coupons as earned
    const scratchedCoupons = await Coupon.find({ shopId, isScratched: true });
    const totalEarned = scratchedCoupons.reduce((sum, c) => sum + c.amount, 0);
    const totalPaid = await Coupon.find({ shopId, isRedeemed: true })
      .then(coupons => coupons.reduce((sum, c) => sum + c.amount, 0));

    const allCoupons = await Coupon.find({ shopId });

    await Shop.findByIdAndUpdate(shopId, {
      totalCoupons: allCoupons.length,
      totalEarned,
      totalPaid
    });

    res.status(201).json({
      success: true,
      data: order,
      newCoupons: newCoupons.map(c => ({ ...c.toObject(), amount: null })), // hide amount
      message: newCoupons.length > 0 ? `${newCoupons.length} coupon(s) generated!` : 'Order added',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getOrdersByShop, createOrder };