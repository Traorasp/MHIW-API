const express = require('express');

const router = express.Router();

// Requires controllers
const imageCont = require('../controllers/imageControllers');
const userCont = require('../controllers/userControllers');
const charCont = require('../controllers/characterControllers');
const effectCont = require('../controllers/effectControllers');
const materCont = require('../controllers/materialControllers');
const itemCont = require('../controllers/itemControllers');
const enchCont = require('../controllers/enchantmentController');

/// IMAGE Routes ///

// GET image with its id
router.get('/image/:id', imageCont.get_image);

// POST a new image into the database
router.post('/image', imageCont.post_image);

// POST a new image and removes the old one
router.post('/image/:id', imageCont.post_update_image);

// DELETE an image with its id
router.delete('/image/:id', imageCont.delete_image);

/// USER ROUTES ///

// POST request for login in
router.post('/', userCont.login_post);

// POST request for register
router.post('/register', userCont.register_post);

// POST adds a profile to user
router.post('/profile/:id', userCont.post_new_profile);

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
router.get('/effects', effectCont.get_effect_list);

// POST to create a new effect
router.post('/effect', effectCont.post_effect);

// DELETE an existing effect
router.delete('/effect', effectCont.delete_effect);

/// MATERIAL ROUTES ///

// GET details of a specific material
router.get('/material/:id', materCont.get_material_details);

// GET list of all materials
router.get('/materials', materCont.get_material_list);

// POST a new material if it dpesn't already exist
router.post('/material', materCont.post_material);

// POST update a material if exact one doesn't alreayd exist
router.post('/material/update', materCont.post_update_material);

// DELETE a material and its references
router.delete('/material/:id', materCont.delete_material);

/// ITEM ROUTES ///

// GET details of an item
router.get('/item/:id', itemCont.get_item_details);

// GET list of all items
router.get('/items', itemCont.get_item_list);

// POST a new item
router.post('/item', itemCont.post_item);

// POST update an item
router.post('/item/update', itemCont.post_update_item);

// DELETE an item
router.delete('/item/:id', itemCont.delete_item);

/// ENCHANTMENT ROUTES ///

// GET details of an enchantment
router.get('/enchantment/:id', enchCont.get_enchantment_details);

// GET list of all enchantment
router.get('/enchantments', enchCont.get_enchantment_list);

// POST a new enchantment
router.post('/enchantment', enchCont.post_enchantment);

// DELETE an enchantment
router.delete('/enchantment/:id', enchCont.delete_enchantment);

module.exports = router;
