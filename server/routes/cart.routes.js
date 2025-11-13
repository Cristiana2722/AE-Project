const { Product } = require('../database/models');
const { User } = require('../database/models');
const { Cart } = require('../database/models');

const express = require('express');
const {verifyToken} = require('../utils/token.js');

const router = express.Router();

// Add item to cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    const existingItem = await Cart.findOne({
      where: { user_id, product_id }
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json({
        success: true,
        message: 'Cart updated (quantity increased)',
        data: existingItem,
      });
    }

    const cartItem = await Cart.create({user_id, product_id, quantity});
    res.status(201).json({success: true, message: 'Product added to cart', data: cartItem});
  } catch (error) {
    res.status(500).json({success: false, message: 'Error adding product to cart', data: error.message});
  }
})

module.exports = router;