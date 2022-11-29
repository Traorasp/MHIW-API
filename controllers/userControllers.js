const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const upload = require('../config.js/upload');
const User = require('../models/user');

// Authorizes users to log in
// Sends back user info and jwt token
exports.login_post = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        msg: 'Incorrect password or username',
        user,
      });
    }

    req.login(user, { session: false }, () => {
      if (err) return next(err);
      const token = jwt.sign({ user }, 'cats');
      return res.json({ user, token });
    });
  })(req, res);
};

// Allows users to register and make an acount, encrypts password with bcrypt
exports.register_post = [
  body('username', 'Username cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 30 })
    .withMessage('Password cannot be longer than 30 characters')
    .escape(),
  body('password', 'Password cannot be empty')
    .trim()
    .isLength({ max: 30 })
    .withMessage('Password cannot be longer than 30 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 'i')
    .withMessage('Password must be atleast 6 characters with atleast 1 uppercase, one lower case and a special character')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        data: req.body,
        errors: errors.array(),
      });
    }

    bcrypt.hash(req.body.password, 12, (err, hashedPassword) => {
      if (err) return next(err);

      new User({
        username: req.body.username,
        password: hashedPassword,
      }).save(() => {
        if (err) return next(err);
        return res.json({ msg: 'Sucesfully registered' });
      });
    });
  },
];

// Lets user updater their profile picture
exports.post_new_profile = [
  upload.single('profile-file'),
  (req, res, next) => {
    if (!req.file) {
      return res.json({ msg: 'No image attached' });
    }
    User.findById(req.params.id)
      .exec((err, user) => {
        if (err) return next(err);
        if (!user) {
          return res.json({ msg: 'User doesn\'t exist' });
        }
        req.app.locals.gfs.delete(user.profilePic, () => {});
        user.profilePic = req.file.id;
        user.save(() => {
          if (err) {
            req.app.locals.gfs.delete(req.file.id, () => {});
            return next(err);
          }
          return res.json({ msg: 'Sucesfully changed profile' });
        });
      });
  },
];

// Gets profile pictutre of user
exports.get_profile = (req, res, next) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  req.app.locals.gfs.find({ _id }).toArray((err, image) => {
    if (!image) {
      return res.status(400).json({ msg: 'No profile exists' });
    }
    return req.app.locals.gfs.openDownloadStream(_id).pipe(res);
  });
};

exports.post_send_friend_request = (req, res, next) => {
  User.findById(req.params.id)
    .exec((err, user) => {
      const idOfRequester = req.body.id;
      if (user == null) {
        return res.json({ msg: "User doesn't exist" });
      }
      if (err) next(err);
      if (user.friendRequests.find((request) => request == idOfRequester)) {
        return res.json({ msg: 'You have already sent a friend request to this user' });
      }
      user.friendRequests = [...user.friendRequests, idOfRequester];
      user.save((err) => {
        if (err) return next(err);
        return res.json({ msg: 'Sucesfully sent request' });
      });
    });
};

// Returns a list of users received friend requests
exports.get_friend_requests = (req, res, next) => {
  User.findById(req.params.id)
    .populate('friendRequests')
    .exec((err, user) => {
      if (user == null) {
        return res.json({ msg: "User doesn't exist" });
      }
      if (err) next(err);
      return res.json(user.friendRequests);
    });
};

// Allows user to accept a friend request, movest request to friends
// list and adds user to requesters friend list
exports.post_accept_friend_request = (req, res, next) => {
  User.findById(req.params.id)
    .exec((err, user) => {
      const idOfRequester = req.body.id;
      if (user == null) {
        return res.json({ msg: "User doesn't exist" });
      }
      if (err) next(err);
      const index = user.friendRequests.indexOf(idOfRequester);
      if (index >= 0) {
        user.friends = [...user.friends, idOfRequester];
        user.friendRequests.splice(index, 1);
        // Adds requestee to requesters friend list
        User.findById(req.body.id)
          .exec((err, user) => {
            user.friendRequests.splice(user.friendRequests.indexOf(req.params.id), 1);
            user.friends = [...user.friends, req.params.id];
            user.save((err) => {
              if (err) return next(err);
            });
          });
        user.save(() => {
          if (err) return next(err);
          return res.json({ msg: 'Sucesfully accepter request' });
        });
      } else {
        return res.json({ msg: 'No friend request from this user' });
      }
    });
};

// Returns a list of users friends
exports.get_friend_list = (req, res, next) => {
  User.findById(req.params.id)
    .populate('friends')
    .exec((err, user) => {
      if (user == null) {
        return res.json({ msg: "User doesn't exist" });
      }
      if (err) next(err);
      return res.json(user.friends);
    });
};

// Removes a friend from users list and user from friends list
exports.delete_friend = (req, res, next) => {
  User.findById(req.params.id)
    .exec((err, user) => {
      if (user == null) {
        return res.json({ msg: "User doesn't exist" });
      }
      if (err) next(err);
      const index = user.friends.indexOf(req.body.id);
      if (index > -1) {
        user.friends.splice(index, 1);
        // Remove this user from exfriend friends list
        User.findById(req.body.id)
          .exec((err, user) => {
            user.friends.splice(user.friends.indexOf(req.params.id), 1);
            user.save((err) => {
              if (err) return next(err);
            });
          });
        user.save(() => {
          if (err) return next(err);
          return res.json({ msg: 'Sucesfully removed friend' });
        });
      } else {
        return res.json({ msg: 'No friend with this id' });
      }
    });
};

// Removes a friend request from users list
exports.delete_friend_request = (req, res, next) => {
  User.findById(req.params.id)
    .exec((err, user) => {
      if (user == null) {
        return res.json({ msg: "User doesn't exist" });
      }
      if (err) next(err);

      const index = user.friendRequests.indexOf(req.body.id);
      if (index > -1) {
        user.friendRequests.splice(index, 1);
        user.save((err) => {
          if (err) return next(err);
          return res.json({ msg: 'Sucesfully declined friend request' });
        });
      } else {
        return res.json({ msg: 'No friend request from this user' });
      }
    });
};
