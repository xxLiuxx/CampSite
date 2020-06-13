var express = require('express');
var router = express.Router();

var app = express(),
    mongoose = require('mongoose'),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user"),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    expressSession = require('express-session')

router.get('/', function (req, res) {
    res.render('home');
});


//register route
router.get('/register', function (req, res) {
    res.render("authenticate/register");
});

router.post('/register', function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error" , err.message);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to the campsite " + req.body.username);
            res.redirect('/campgrounds');
        });
    });
});

//login route
router.get('/login', function (req, res) {
    res.render('authenticate/login');
});

router.post('/login', passport.authenticate("local", {
    successRedirect: '/campgrounds',
    failureRedirect: '/register'
}), function (req, res) {
});

//logout
router.get('/logout', function (req, res) {
    req.logout();
    req.flash("success", "Logged out successfully");
    res.redirect('/campgrounds');
});


module.exports = router;
