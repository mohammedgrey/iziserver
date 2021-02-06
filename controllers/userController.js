const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const admin = require('firebase-admin');
const AppError = require('../utils/appError');

exports.signUp = catchAsync(async (req, res, next) => {
  if (!(await User.exists({ uid: req.body.uid }))) {
    await User.create({ uid: req.body.uid, email: req.body.email });
    res.status(201).json(null);
  } else res.status(200).json(null);
});

exports.makeAdmin = catchAsync(async (req, res, next) => {
  if (req.body.code === process.env.SECRET_CODE_TO_MAKE_ADMIN) {
    const user = await admin.auth().getUser(req.body.id);
    if (!(user.customClaims && user.customClaims.isAdmin))
      await admin.auth().setCustomUserClaims(user.uid, { isAdmin: true });
    return res.status(201).json(null);
  }
  return next(new AppError('Not authorized to make an admin', 401));
});
