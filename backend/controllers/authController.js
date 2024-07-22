const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const registerUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: 'user' // Ensure the role is set correctly for admin user
    });

    const token = generateToken(newUser._id, newUser.role);
    res.status(201).json({ success: true, token, user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request received with:', { email, password });

    const user = await User.findOne({ email });
    console.log('User found:', user); // Log the user found

    if (!user) {
      return res.status(404).json({ error: 'User not found!', success: false });
    }

    if (user.banned) {
      return res.status(403).json({ error: 'This account is banned.', success: false });
    }
    
    const comparePwd = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', comparePwd); // Log password comparison result

    if (!comparePwd) {
      return res.status(400).json({ error: 'Incorrect password', success: false });
    }

    const token = generateToken(user._id, user.role);
    console.log('Token generated:', token); // Log generated token
    return res.json({ success: true, token, user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

module.exports = { registerUser, authUser };
