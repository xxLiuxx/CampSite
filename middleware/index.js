var middlewareObj = {}
var Campground = require('../models/campground');
var Comment = require('../models/comment');

middlewareObj.checkCommentOwnership = function (req, res, next) {
    //is logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, commentFound) {
            if (err) {
                res.redirect("back");
            } else {
                if (commentFound.author.id.equals(req.user._id)) {
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first");
        res.redirect("back");
    }
}

middlewareObj.checkCampOwnership = function (req, res, next) {
    //is logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCamp) {
            //does the user own the campground?
            if (foundCamp.author.id.equals(req.user._id)) {
                if (err) {
                    console.log(err);
                } else {
                    next();
                }
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "Please login first");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please log in first");
    res.redirect('/login');
}

module.exports = middlewareObj