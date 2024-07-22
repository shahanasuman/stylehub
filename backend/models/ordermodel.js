const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  address: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Processing' },
  orderDate: { type: Date, default: Date.now },
  canceled: { type: Boolean, default: false }
});

module.exports = mongoose.model('Order', orderSchema);
