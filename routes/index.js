var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/users")

// root route
router.get("/", (req, res) => {
    res.render("landing")
});

// register form
router.get("/register", (req, res) => {
    res.render("register");
})

// to register
router.post("/register", (req, res) => {
    var newUser = new User({
        username: req.body.username
    })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.render("register");
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/campgrounds");
            });
        }
    });
})

// login form
router.get("/login", (req, res) => {
    res.render("login");
})

// to login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {});

// to logout
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds")
});

// middleware
function isLoggedIn(req, res, next){ 
    if(req.isAuthenticated()){
        return next(); 
    }
    res.redirect("/login");
}

module.exports = router;