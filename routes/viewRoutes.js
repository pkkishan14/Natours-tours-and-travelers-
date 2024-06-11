const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewsController.getOverview); // Root page will serve as overview page
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
// router.get('/signup', viewsController.getSignupForm);//Functionality not added yet
router.get('/me', authController.protect, viewsController.getAccount);

module.exports = router;
