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

// Get Cart by user ID
router.get('/:user_id', verifyToken, async (req, res) => {
  try {
    const id = req.params.user_id;

    const cartItems = await Cart.findAll({
      where: { user_id: id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['product_id', 'name', 'price', 'image']
        }
      ]
    });

    if (!cartItems.length) {
      return res.status(404).json({success: false, message: 'No items in cart for this user', data: []});
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + item.quantity * (item.product?.price || 0);
    }, 0);

    res.status(200).json({success: true, message: 'Cart retrieved successfully', data: { items: cartItems, total }});
  } catch (error) {
    res.status(500).json({success: false, message: 'Error retrieving cart', data: error.message});
  }
})

// Update Item from Cart (change qty)
router.put('/:user_id/:cart_id', verifyToken, async (req, res) => {
  try {
    const { user_id, cart_id } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findOne({
      where: { cart_id, user_id }
    });

    if (!cartItem) {
      return res.status(404).json({success: false, message: 'Cart item not found for this user', data: {}});
    }

    if (quantity !== undefined) {
      if (quantity <= 0) {
        await cartItem.destroy();
        return res.status(200).json({success: true, message: 'Cart item removed', data: {}});
      } else {
        cartItem.quantity = quantity;
        await cartItem.save();
      }
    }

    await cartItem.save();

    await cartItem.reload({
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['product_id', 'name', 'price', 'image']
        }
      ]
    });

    res.status(200).json({success: true, message: 'Cart item updated successfully', data: cartItem});
  } catch (error) {
    res.status(500).json({success: false, message: 'Error updating cart item', data: error.message});
  }
})

// Delete a single cart item
router.delete('/:user_id/:cart_id', verifyToken, async (req, res) => {
  try {
    const { user_id, cart_id } = req.params;

    const cartItem = await Cart.findOne({
      where: { cart_id, user_id }
    });

    if (!cartItem) {
      return res.status(404).json({success: false, message: 'Cart item not found for this user', data: {}});
    }

    await cartItem.destroy();

    res.status(200).json({success: true, message: 'Cart item deleted successfully', data: {}});
  } catch (error) {
    res.status(500).json({success: false, message: 'Error deleting cart item', data: error.message});
  }
})

// Delete cart - when user clears cart
router.delete('/:user_id', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.params;

    if (isNaN(user_id)) {
      return res.status(400).json({success: false, message: 'User id is not valid', data: {}});
    }

    const deletedCount = await Cart.destroy({
      where: { user_id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({success: false, message: 'No cart items found for this user', data: {}});
    }

    res.status(200).json({success: true, message: 'Cart cleared successfully', data: {}});

  } catch (error) {
    res.status(500).json({success: false, message: 'Error clearing cart', data: error.message});
  }
})

module.exports = router;