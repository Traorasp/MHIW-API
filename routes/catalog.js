const express = require('express');

const router = express.Router();

const verifyAdmin = require('../config.js/verifyAdmin');

// Requires controllers
const imageCont = require('../controllers/imageControllers');
const userCont = require('../controllers/userControllers');
const charCont = require('../controllers/characterControllers');
const effectCont = require('../controllers/effectControllers');
const materCont = require('../controllers/materialControllers');
const itemCont = require('../controllers/itemControllers');
const enchCont = require('../controllers/enchantmentController');
const spellCont = require('../controllers/spellControllers');
const magicCont = require('../controllers/magicControllers');
const aoeCont = require('../controllers/aoeControllers');
const talentCont = require('../controllers/talentControllers');
const skillCont = require('../controllers/skillController');
const raceCont = require('../controllers/raceController');
const titleCont = require('../controllers/titleController');
const classCont = require('../controllers/classesController');

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

// GET request to refresh authoricaion token
router.get('/refresh', userCont.refresh_auth_token);

// POST request to logout and clear cookie
router.post('/logout', userCont.logout);

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
router.get('/characters/:id', charCont.get_character_list);

// POST to create a new character
router.post('/character', charCont.post_create_character);

// POST to update a character in users character list
router.post('/character/update', charCont.post_update_character);

// DELETE a caracter from usrs character list
router.delete('/character/:id', charCont.delete_character);

/// EFFECT ROUTES ///

// GET info of specific effect
router.get('/effect/:id', effectCont.get_effect);

// GET info of all existing effects
router.get('/effects', effectCont.get_effect_list);

// POST to create a new effect
router.post('/effect', verifyAdmin, effectCont.post_effect);

// POST to update an effect
router.post('/effect/update', verifyAdmin, effectCont.post_update_effect);

// DELETE an existing effect
router.delete('/effect/:id', verifyAdmin, effectCont.delete_effect);

/// MATERIAL ROUTES ///

// GET details of a specific material
router.get('/material/:id', materCont.get_material_details);

// GET list of all materials
router.get('/materials', materCont.get_material_list);

// POST a new material if it dpesn't already exist
router.post('/material', verifyAdmin, materCont.post_material);

// POST update a material if exact one doesn't alreayd exist
router.post('/material/update', verifyAdmin, materCont.post_update_material);

// DELETE a material and its references
router.delete('/material/:id', verifyAdmin, materCont.delete_material);

/// ITEM ROUTES ///

// GET details of an item
router.get('/item/:id', itemCont.get_item_details);

// GET list of all items
router.get('/items', itemCont.get_item_list);

// POST a new item
router.post('/item', verifyAdmin, itemCont.post_item);

// POST update an item
router.post('/item/update', verifyAdmin, itemCont.post_update_item);

// DELETE an item
router.delete('/item/:id', verifyAdmin, itemCont.delete_item);

/// ENCHANTMENT ROUTES ///

// GET details of an enchantment
router.get('/enchantment/:id', enchCont.get_enchantment_details);

// GET list of all enchantment
router.get('/enchantments', enchCont.get_enchantment_list);

// POST a new enchantment
router.post('/enchantment', enchCont.post_enchantment);

// DELETE an enchantment
router.delete('/enchantment/:id', verifyAdmin, enchCont.delete_enchantment);

/// SPELL ROUTES ///

// GET details of a spell
router.get('/spell/:id', spellCont.get_spell_details);

// GET list of all spells
router.get('/spells', spellCont.get_spell_list);

// POST a new spell
router.post('/spell', verifyAdmin, spellCont.post_spell);

// POST an update to an old spell
router.post('/spell/update', verifyAdmin, spellCont.post_update_spell);

// DELETE a spell
router.delete('/spell/:id', verifyAdmin, spellCont.delete_spell);

/// MAGIC ROUTES ///

// GET details of a magic
router.get('/magic/:id', magicCont.get_magic_details);

// GET list of all magics
router.get('/magics', magicCont.get_magic_list);

// POST a new magic
router.post('/magic', verifyAdmin, magicCont.post_magic);

// POST an update to an old magic
router.post('/magic/update', verifyAdmin, magicCont.post_update_magic);

// DELETE a magic
router.delete('/magic/:id', verifyAdmin, magicCont.delete_magic);

/// AOE ROUTES ///

// GET one aoe
router.get('/aoe/:id', aoeCont.get_aoe);

// GET list of all aoe
router.get('/aoes', aoeCont.get_aoe_list);

// POST a new aoe
router.post('/aoe', verifyAdmin, aoeCont.post_aoe);

// POST update to an aoe
router.post('/aoe/update', verifyAdmin, aoeCont.post_update_aoe);

// Delete a specific aoe
router.delete('/aoe/:id', verifyAdmin, aoeCont.delete_aoe);

/// TALENT ROUTES ///

// GET one talent
router.get('/talent/:id', talentCont.get_talent);

// GET list of all talents
router.get('/talents', talentCont.get_talent_list);

// POST a new talent
router.post('/talent', verifyAdmin, talentCont.post_talent);

// POST update to a talent
router.post('/talent/update', verifyAdmin, talentCont.post_update_talent);

// Delete a specific talent
router.delete('/talent/:id', verifyAdmin, talentCont.delete_talent);

/// SKILL ROTES ///

// GET details of a skill
router.get('/skill/:id', skillCont.get_skill_details);

// GET list of all skills
router.get('/skills', skillCont.get_skill_list);

// POST a new skill
router.post('/skill', verifyAdmin, skillCont.post_skill);

// POST update to a skill
router.post('/skill/update', verifyAdmin, skillCont.post_update_skill);

// Delete a specific skill
router.delete('/skill/:id', verifyAdmin, skillCont.delete_skill);

/// RACE ROTES ///

// GET details of a race
router.get('/race/:id', raceCont.get_race_details);

// GET list of all races
router.get('/races', raceCont.get_race_list);

// POST a new race
router.post('/race', verifyAdmin, raceCont.post_race);

// POST update to a race
router.post('/race/update', verifyAdmin, raceCont.post_update_race);

// Delete a specific race
router.delete('/race/:id', verifyAdmin, raceCont.delete_race);

/// TITLE ROTES ///

// GET details of a title
router.get('/title/:id', titleCont.get_title_details);

// GET list of all title
router.get('/titles', titleCont.get_title_list);

// POST a new title
router.post('/title', verifyAdmin, titleCont.post_title);

// POST update to a title
router.post('/title/update', verifyAdmin, titleCont.post_update_title);

// Delete a specific title
router.delete('/title/:id', verifyAdmin, titleCont.delete_title);

// GET details of a class
router.get('/class/:id', classCont.get_class_details);

// GET list of all class
router.get('/classs', classCont.get_class_list);

// POST a new class
router.post('/class', verifyAdmin, classCont.post_class);

// POST update to a class
router.post('/class/update', verifyAdmin, classCont.post_update_class);

// Delete a specific class
router.delete('/class/:id', verifyAdmin, classCont.delete_class);

module.exports = router;
