// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  banned: { type: Boolean, default: false },
  previousAddresses: [{ 
    place: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phoneNumber: { type: String, required: true }
  }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
