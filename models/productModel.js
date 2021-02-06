const mongoose = require('mongoose');

class ProductStatus {
  static AVAILABLE = 'Available';
  static OUT_OF_STOCK = 'Out of Stock';
  static UPON_REQUEST = 'Upon Request';
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: [
      ProductStatus.AVAILABLE,
      ProductStatus.OUT_OF_STOCK,
      ProductStatus.UPON_REQUEST,
    ],
  },
  image: {
    type: String,
    default: '',
  },
  categories: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
