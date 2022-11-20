var express = require('express');
var router = express.Router();

// Requires controllers

const userCont = require('../controllers/userController');

/// USER ROUTES ///

// POST request for login in 
router.post('/', userCont.login_post);

// POST request for register
router.post('/register', userCont.register_post);

// POST request for sign out
router.post('/logout', userCont.logout_post);

module.exports = router;
