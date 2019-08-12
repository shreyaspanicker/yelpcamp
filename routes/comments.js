var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments")

// new comment form
router.get("/new", isLoggedIn , (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                campground: campground
            })
        }
    });
})

// comment create
router.post("/", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // after making a change in the newly created comment, we need to save it to the DB, so use .save()
                    comment.save();
                    campground.comments.push(comment)
                    campground.save();
                    res.redirect("/campgrounds/" + req.params.id)
                }
            });
        }
    });
});

// middleware
function isLoggedIn(req, res, next){ 
    if(req.isAuthenticated()){
        return next(); 
    }
    res.redirect("/login");
}

module.exports = router;