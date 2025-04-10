const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  order_id: {
    type: String,
    required: true,
    index: true
  },
  transaction_id: {
    type: String,
    required: true,
    maxlength: 255,
    index: true
  },
  payment_amount: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  currency: {
    type: String,
    required: true,
    maxlength: 3
  },
  payment_status: {
    type: String,
    required: true,
    maxlength: 20
  },
  payment_method: {
    type: String,
    required: true,
    maxlength: 20
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  collection: 'payments'
});

module.exports = mongoose.model('Payment', paymentSchema);
