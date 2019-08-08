var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    expressSession = require("express-session")
    User = require("./models/users")
    mongoose = require("mongoose"),
    Campground = require("./models/campgrounds"),
    Comment = require("./models/comments"),
    seedDB = require("./seeds")

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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})


// ******************* ROUTES ***************************

app.get("/", (req, res) => {
    res.render("landing")
});

app.get("/campgrounds", (req, res) => {
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

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
});

app.get("/campgrounds/:id", (req, res) => {
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

app.post("/campgrounds", (req, res) => {
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

// comments routes
app.get("/campgrounds/:id/comments/new", isLoggedIn , (req, res) => {
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

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment)
                    campground.save();
                    res.redirect("/campgrounds/" + req.params.id)
                }
            });
        }
    });
});

// auth routes
app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {
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

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds")
});

function isLoggedIn(req, res, next){ 
    if(req.isAuthenticated()){
        return next(); 
    }
    res.redirect("/login");
}

app.listen(3000, () => {
    console.log("Serving Yelpcamp at port 3000...")
});