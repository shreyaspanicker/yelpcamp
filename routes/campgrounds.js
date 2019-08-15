var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds")
var Comment = require("../models/comments");
var middleware = require("../middleware")

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campGrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});

// new campground form
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
});

// one campground show
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back")
        } else {
            res.render("campgrounds/show", {
                campground: foundCampground
            })
        }
    });
});

// new campground create
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        },
        price: req.body.price
    }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds")
        }
    });
});

// edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership,  (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {
            campground: foundCampground
        })
    });
})

// update campground route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
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

module.exports = router;