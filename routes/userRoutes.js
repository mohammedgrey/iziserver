const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.route('/signup').post(userController.signUp);
router.route('/admin').post(userController.makeAdmin);

module.exports = router;
