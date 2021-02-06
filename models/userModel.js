const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    default: '',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;