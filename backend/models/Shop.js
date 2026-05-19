const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopName: { type: String, required: true },
  telephone: { type: String },
  location: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  town: { type: String },
  beatNo: { type: String },
  ownerName: { type: String, required: true },
  ownerPhone: { type: String, required: true },
  totalCoupons: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);