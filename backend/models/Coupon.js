const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  amount: { type: Number, required: true },
  isScratched: { type: Boolean, default: false },
  isRedeemed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);