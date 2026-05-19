const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  amount: { type: Number, required: true },
  note: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);