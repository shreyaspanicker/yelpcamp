var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/users");
var Campground = require("../models/campgrounds")

// root route
router.get("/", (req, res) => {
    res.render("landing")
});

// show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'}); 
 });
 
 //show login form
 router.get("/login", function(req, res){
    res.render("login", {page: 'login'}); 
 });

// to register
router.post("/register", (req, res) => {
    var newUser = new User({
        username: req.body.username,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        avatar : req.body.avatar,
        email: req.body.email
    })
    if(req.body.adminCode === "secretCode1995") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register",{ error: err.message});
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Welcome to Yelpcamp "+ user.username)
                res.redirect("/campgrounds");
            });
        }
    });
})

// to login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {});

// to logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out.")
    res.redirect("/campgrounds")
});

// user profile
router.get("/users/:id", (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("/")
        }
        Campground.find().where("author.id").equals(foundUser._id).exec((err, campgrounds) => {
            if(err) {
                req.flash("error", "Something went wrong");
                res.redirect("/")
            }
            res.render("users/show", { user : foundUser , campgrounds : campgrounds})
        });
    });
});

module.exports = router;