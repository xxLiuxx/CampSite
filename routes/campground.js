var express = require('express');
var router = express.Router();

var Campground = require('../models/campground');
var middleware = require('../middleware');

//INDEX  show all campgrounds
router.get('/', function (req, res) {
    Campground.find({}, function (err, allCamps) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campsites: allCamps});
        }
    });
});

//NEW  show form to create new campgrounds
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/new');
});

//CREATE add new campgrounds to db
router.post('/', middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = {name: name, price: price, image: image, description: description, author: author};
    Campground.create(newCamp, function (err, newCreate) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});


//SHOW  show more info on campgrounds
router.get('/:id', function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log(campground);
            res.render('campgrounds/show', {campground: campground});
        }
    })
});

//edit
router.get('/:id/edit', middleware.checkCampOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        res.render('campgrounds/edit', {campground: foundCamp});
    });
});

//update
router.put('/:id', middleware.checkCampOwnership, function (req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var updatedCamp = {name: name, price: price, image: image, description: description}
    Campground.findByIdAndUpdate(req.params.id, updatedCamp, {new: true}, function (err, campUpdated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//destroy
router.delete('/:id', middleware.checkCampOwnership, function (req, res) {
    Campground.findByIdAndDelete(req.params.id, function (err, campFound) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;
