const Product = require('../models/productModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .searchAndCategorize()
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

exports.addProduct = catchAsync(async (req, res, next) => {
  // const userID = req.user._id;
  const productID = req.body.id;
  const productName = req.body.name;
  const productPrice = req.body.price;
  const productDiscount = req.body.discount;
  const productStatus = req.body.status;
  const productImage = req.image;
  const productCategories = req.body.categories
    ? req.body.categories.split(',')
    : null;

  if (
    !productName ||
    !productPrice ||
    !productStatus ||
    !productImage ||
    !productCategories ||
    !productDiscount
  )
    return next(
      new AppError(
        'please provide a name, price, status and image for the product',
        400
      )
    );
  const filteredBody = {
    name: productName,
    price: productPrice,
    discount: productDiscount,
    status: productStatus,
    image: productImage,
    categories: productCategories,
  };
  if (req.body.createdAt) filteredBody.createdAt = req.body.createdAt;
  let returnStatus = 201;
  let newOrUpdatedProduct;
  if (!(productID === 'null' || productID === null)) {
    newOrUpdatedProduct = await Product.findByIdAndUpdate(
      productID,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
    returnStatus = 200;
  } else {
    newOrUpdatedProduct = await Product.create(filteredBody);
  }
  res.status(returnStatus).json({
    status: 'success',
    data: {
      product: newOrUpdatedProduct,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(
      new AppError(`No product found with that ID: ${req.params.id}`, 404)
    );
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
