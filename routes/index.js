var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/users")

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
        username: req.body.username
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

module.exports = router;