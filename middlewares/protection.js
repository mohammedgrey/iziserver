const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const admin = require('firebase-admin');

//TODO: Adjust this function to authenticate firebase users
// A middleware to call before accessing protected routes

exports.authenticate = catchAsync(async (req, res, next) => {
  let idToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    idToken = req.headers.authorization.split(' ')[1];
  }

  if (!idToken) {
    return next(new AppError('Authorization failed!', 401));
  }

  const decodedToken = await admin.auth().verifyIdToken(idToken);
  if (!decodedToken) return next(new AppError('Authorization failed!', 401));
  req.fullDecodedToken = decodedToken;
  next();
});

exports.permit = catchAsync(async (req, res, next) => {
  if (!req.fullDecodedToken.isAdmin)
    return next(
      new AppError('You are not permitted to access this route', 401)
    );
  next();
});
