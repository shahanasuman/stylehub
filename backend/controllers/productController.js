const Product = require('../models/productModel');
const User = require('../models/userModel');

const createProduct = async (req, res) => {
  const { name, description, price, category, stock, imageUrl } = req.body;
  try {
    const newProduct = new Product({ name, description, price, category, stock, imageUrl });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProductById = async (req, res) => {
  const { name, description, price, category, stock, imageUrl } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, imageUrl },
      { new: true }
    );
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    console.log('Delete request for product ID:', req.params.id);
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log('Product not found:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.deleteOne();
    console.log('Product deleted:', req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};




const likeProduct = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: 'User or Product not found' });
    }

    const index = user.likes.indexOf(productId);
    if (index === -1) {
      user.likes.push(productId);
    } else {
      user.likes.splice(index, 1);
    }

    await user.save();
    res.json({ likes: user.likes });
  } catch (error) {
    console.error('Error liking product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addToCart = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: 'User or Product not found' });
    }

    const index = user.cart.indexOf(productId);
    if (index === -1) {
      user.cart.push(productId);
    } else {
      user.cart.splice(index, 1);
    }

    await user.save();
    res.json({ cart: user.cart });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProduct,
  likeProduct,
  addToCart
};
