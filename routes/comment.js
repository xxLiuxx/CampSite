var express = require('express');
var router = express.Router({mergeParams: true});

var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

//create new comment, show the form
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    var text = req.body.text;
    var author = req.body.author;
    var comment = new Comment({text: text, author: author});
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add user id and username to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();

                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//edit
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, commentFound) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: commentFound});
        }
    });
});

//update
router.put('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    var text = req.body.text;
    var updatedComment = {text: text};
    Comment.findByIdAndUpdate(req.params.comment_id, updatedComment, {new: true}, function (err, commentFound) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//destroy
router.delete('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndDelete(req.params.comment_id, function (err, commentFound) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;

