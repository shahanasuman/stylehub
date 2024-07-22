// productRoutes.js
const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProduct,
  likeProduct,
  addToCart
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, updateProductById);
router.delete('/:id', protect, deleteProduct);

router.post('/like/:id', protect, likeProduct);
router.post('/cart/:id', protect, addToCart);

module.exports = router;
