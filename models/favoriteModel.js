const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'There must be a user'],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'There must be a product'],
  },
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
