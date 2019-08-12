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
        author : {
            _id : req.user._id,
            username : req.user.username
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
router.get("/:id/edit", (req, res) => {
    Campground.findById( req.params.id, (err, foundCampground) => {
        if(err) {
            res.redirect("/campgrounds")
        } else {
            res.render("campgrounds/edit", {
                campground : foundCampground
            })
        }
    })
})

// update campground route
router.put("/:id", (req, res) => {
    Campground.findByIdAndUpdate( req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/"+ req.params.id)
        }
    })
})

// destroy campground route
router.delete("/:id", (req, res) => {
    Campground.deleteOne({ _id: req.params.id}, (err) => {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds")
        }
    });
})

// middleware
function isLoggedIn(req, res, next){ 
    if(req.isAuthenticated()){
        return next(); 
    }
    res.redirect("/login");
}

module.exports = router;