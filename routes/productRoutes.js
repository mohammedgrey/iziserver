const express = require('express');
const productController = require('../controllers/productController');
const fileUploader = require('../middlewares/fileUploader');
const protectection = require('../middlewares/protection');
const router = express.Router();

router
  .route('/')
  .post(
    protectection.authenticate,
    protectection.permit,
    fileUploader.uploadLocally,
    fileUploader.checkImageURL,
    fileUploader.uploadToCloudinary,
    productController.addProduct
  )
  .get(productController.getProducts);

router.delete(
  '/:id',
  protectection.authenticate,
  protectection.permit,
  productController.deleteProduct
);

module.exports = router;
