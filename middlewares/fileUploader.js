const admin = require('firebase-admin');
const multer = require('multer');
const cloudinary = require('cloudinary');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.checkImageURL = (req, res, next) => {
  if (req.body.file) {
    req.thereIsAnImageURL = true;
    req.image = req.body.file;
  } else req.thereIsAnImageURL = false;
  next();
};

const multerStorage = multer.diskStorage({
  destination: process.env.UPLOAD_PATH || 'uploads/',
  filename: (req, file, cb) => {
    if (file) {
      const ext = file.mimetype.split('/')[1];
      cb(null, `${(Math.random() * 1000).toFixed(0)}-${Date.now()}.${ext}`);
    }
  },
  fileFilter: (req, file, cb) => {
    if (file) {
      if (
        (process.env.ACCEPTED_FILE_MIMES || '')
          .split(',')
          .includes(file.mimetype.toLowerCase())
      ) {
        cb(null, true);
      } else {
        cb(new AppError('unaceptable file type', 400));
      }
    }
  },
});

const upload = multer({
  storage: multerStorage,
});
exports.uploadLocally = upload.single('file');

exports.uploadToCloudinary = catchAsync(async (req, res, next) => {
  if (req.thereIsAnImageURL) return next();
  cloudinaryImage = await cloudinary.uploader.upload(
    `./uploads/${req.file.filename}`
  );
  if (!cloudinaryImage)
    return next(
      new AppError('failed to upload the image to the server.', '500')
    );
  req.image = cloudinaryImage.secure_url;
  next();
});

// exports.uploadToFirebase = catchAsync(async (req, res, next) => {
//   console.log(req.file);
//   const bucket = admin.storage().bucket('gs://iziserver.appspot.com/');

//   bucket
//     .upload(`uploads/${req.file.filename}`)
//     .then((res) => {
//       console.log(res);
//     })
//     .catch(console.log);

//   res.status(200).json({
//     status: 'success',
//     data: null,
//   });
//   //   next();
// });
