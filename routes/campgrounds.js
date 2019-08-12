var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds")

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
router.get("/new", (req, res) => {
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
router.post("/", (req, res) => {
    Campground.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds")
        }
    });
});

module.exports = router;