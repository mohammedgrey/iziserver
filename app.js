const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const favoriteRouter = require('./routes/favoriteRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// to allow cross origin domains
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://izihandmade.netlify.app',
      'https://izihandmade.web.app/',
    ],
  })
);
app.options('*', cors());

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use(compression());

// 3) ROUTES
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/favorites', favoriteRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
