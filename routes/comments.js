var express = require("express");
var router = express.Router({
    mergeParams: true
});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments")

// new comment form
router.get("/new", isLoggedIn, (req, res) => {
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

// edit comment form
router.get("/:comment_id/edit", (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect("back")
        } else {
            res.render("comments/edit", {
                campgroundId: req.params.id,    
                comment: foundComment
            });
        }
    })
})

//update comment route
router.put("/:comment_id", (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// destroy comment route
router.delete("/:comment_id", (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err, deletedComment) => {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+ req.params.id)
        }
    });
})

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;