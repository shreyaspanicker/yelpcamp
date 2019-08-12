var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds")
var Comment = require("../models/comments")

// index route
router.get("/", (req, res) => {
    Campground.find({}, (err, allcampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campGrounds: allcampgrounds
            })
        }
    });
});

// new campground form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
});

// one campground show
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {
                campground: result
            })
        }
    });
});

// new campground create
router.post("/", isLoggedIn, (req, res) => {
    Campground.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds")
        }
    });
});

// edit campground route
router.get("/:id/edit", checkCampgroundOwnership,  (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {
            campground: foundCampground
        })
    });
})

// update campground route
router.put("/:id", checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// destroy campground route
router.delete("/:id", checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err, removedCampground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            console.log(removedCampground.comments)
            // deleting all comments associated to the deleted campground
            Comment.deleteMany({_id: { $in: removedCampground.comments } }, (err) => {
                if(err) {
                    console.log(err)
                }
                res.redirect("/campgrounds")
            })
        }
    });
})

// middlewares
function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                // will redirect to previous route
                res.redirect("back")
            } else {
                //foundCampground.author.id is a mongoose object and req.user._id is a string, so .equals()
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back")
                }
            }
        })
    } else {
        res.redirect("back")
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;