const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const protectection = require('../middlewares/protection');
const router = express.Router();

//All favorites routes require a logged in user
router.use(protectection.authenticate);
//Favorites routes
router.get('/me', favoriteController.getMyFavorites);
router.post('/check', favoriteController.check);
router.post('/add', favoriteController.addToFavorites);
router.post('/remove', favoriteController.removeFromFavorites);

module.exports = router;
