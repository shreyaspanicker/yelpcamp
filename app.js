var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    expressSession = require("express-session"),
    methodOverride = require("method-override"),
    User = require("./models/users")
    mongoose = require("mongoose"),
    Campground = require("./models/campgrounds"),
    Comment = require("./models/comments"),
    seedDB = require("./seeds")

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index")

// dummy data fill
seedDB();

// app configuration
mongoose.connect("mongodb://localhost:27017/yelpcamp", {
    useNewUrlParser: true
})
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({
    extended: true
}));
// using method-overide for PUT and DELETE request
app.use(methodOverride("_method"));


// passport configuration
app.use(expressSession({
    secret: "I am the one",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// assigining the currentUser variable on each route
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

// using the route files
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes)

// starting the server
app.listen(3000, () => {
    console.log("Serving Yelpcamp at port 3000...")
});