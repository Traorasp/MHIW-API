const User = require('../models/user');

const bcrypt = require('bcrypt');
const {body, validationResult} = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');

exports.login_post = (req, res, next) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if(err|| !user) {
            return res.status(400).json({
                msg: 'Incorrect password or username',
                user
            })
        }
       
        req.login(user, {session: false}, (err) => {
            if(err) res.next(err);
            const token = jwt.sign({user}, 'cats');
            return res.json({user, token});
        })
    })(req, res);
};

exports.register_post = [
    body('username', 'Username cannot be empty')
        .trim()
        .isLength({min: 1})
        .isLength({max:30})
        .withMessage('Password cannot be longer than 30 characters')
        .escape(),
    body('password', 'Password cannot be empty')
        .trim()
        .isLength({max:30})
        .withMessage('Password cannot be longer than 30 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 'i')
        .withMessage('Password must be atleast 6 characters with atleast 1 uppercase, one lower case and a special character')
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.json({
                data: req.body,
                errors: errors.array()
            })
        }

        bcrypt.hash(req.body.password, 12, (err, hashedPassword) => {
            if(err) return next(err);
                
            const user = new User({
                username: req.body.username,
                password: hashedPassword        
            }).save(err => {
                if(err) return next(err);
                return res.json({msg: 'Sucesfully registered'});
                })
            });
            
        }
]