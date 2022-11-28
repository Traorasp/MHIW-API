const express = require('express');

const router = express.Router();

// Requires controllers

const userCont = require('../controllers/userControllers');
const charCont = require('../controllers/characterControllers');
const effectCont = require('../models/effect');

/// USER ROUTES ///

// POST request for login in
router.post('/', userCont.login_post);

// POST request for register
router.post('/register', userCont.register_post);

// POST a new profile picture
router.post('/profile/:id', userCont.post_new_profile);

// Get profile picture
// :id is the id of the users profile
router.get('/profile/:id', userCont.get_profile);

// POST friend request to another user
router.post('/friend/request/:id', userCont.post_send_friend_request);

// GET a list of users received friend requests
router.get('/friend/request/:id', userCont.get_friend_requests);

// POST accept to a friend request
router.post('/friend/accept/:id', userCont.post_accept_friend_request);

// GET a list of users friends
router.get('/friends/:id', userCont.get_friend_list);

// DELETE a friend from users list
router.delete('/friend/remove/:id', userCont.delete_friend);

// DELETE a friend request from users list
router.delete('/friend/request/remove/:id', userCont.delete_friend_request);

/// CHARACTER ROUTES ////

// GET detailed info of a character from users character list
router.get('/character/:id', charCont.get_character);

// GET basic info of all of users characters
router.get('/characters', charCont.get_character_list);

// POST to create a new character
router.post('/character', charCont.post_create_character);

// POST to update a character in users character list
router.post('/character/update', charCont.post_update_character);

// DELETE a caracter from usrs character list
router.delete('/character/:id', charCont.delete_character);

/// EFFECT ROUTES ///

// GET info of all existing effects
router.get('/effects', effectCont.);

// POST to create a new effect 
router.post('/effect', effectCont.);

// DELETE an existing effect
router.delete('/effect', effectCont.);

module.exports = router;
