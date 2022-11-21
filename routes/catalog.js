var express = require('express');
var router = express.Router();
const verifyToken = require('../verifyToken');

// Requires controllers

const userCont = require('../controllers/userController');

// verifies if user is loogged in for all but register and signin page
router.get(/([^e-t]{8}|[^\/]$)/, verifyToken);
router.post(/([^e-t]{8}|[^\/]$)/, verifyToken);

/// USER ROUTES ///

// POST request for login in 
router.post('/', userCont.login_post);

// POST request for register
router.post('/register', userCont.register_post);

// POST a new profile picture
router.post('/profile', userCont.post_new_profile);

// POST friend request to another user
router.post('/friend/request', userCont.post_send_friend_request);

// GET a list of users received friend requests
router.get('/friend/request', userCont.get_friend_requests);

// POST accept to a friend request
router.post('/friend/accept', userCont.post_accept_friend_request);

// GET a list of users friends
router.get('/friends/:id', userCont.get_friend_list);

module.exports = router;
