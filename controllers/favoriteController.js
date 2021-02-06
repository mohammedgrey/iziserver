const Product = require('../models/productModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const Favorite = require('../models/favoriteModel');
const User = require('../models/userModel');

exports.getMyFavorites = catchAsync(async (req, res, next) => {
  const { _id } = await User.findOne({ uid: req.fullDecodedToken.uid });
  const features = new APIFeatures(
    Favorite.find({ user: _id }).populate('product'),
    req.query
  )
    .sort()
    .paginate();
  const products = await features.query;
  res.status(200).json({
    status: 'success',
    length: products.length,
    data: {
      products,
    },
  });
});

exports.check = catchAsync(async (req, res, next) => {
  const { _id } = await User.findOne({ uid: req.fullDecodedToken.uid });
  const isFavored = await Favorite.exists({
    user: _id,
    product: req.body.product,
  });
  res.status(200).json({
    status: 'success',
    favored: isFavored,
  });
});

exports.addToFavorites = catchAsync(async (req, res, next) => {
  const { _id } = await User.findOne({ uid: req.fullDecodedToken.uid });
  await Favorite.create({
    user: _id,
    product: req.body.product,
  });
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.removeFromFavorites = catchAsync(async (req, res, next) => {
  const { _id } = await User.findOne({ uid: req.fullDecodedToken.uid });
  const product = await Favorite.findOneAndDelete({
    user: _id,
    product: req.body.product,
  });
  if (!product) {
    return next(
      new AppError(
        `Check that you already favorite this product to unfavorite it. Or check that you send the right user id and product id.`,
        400
      )
    );
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
