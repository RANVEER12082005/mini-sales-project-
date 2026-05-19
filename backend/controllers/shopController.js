const Shop = require('../models/Shop');

const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: shops });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, userId: req.user._id });
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, data: shop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createShop = async (req, res) => {
  try {
    const shop = await Shop.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, data: shop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, data: shop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteShop = async (req, res) => {
  try {
    await Shop.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Shop deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllShops, getShopById, createShop, updateShop, deleteShop };