var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require('mongoose'),
	flash      = require("connect-flash"),
	passport   = require("passport"),
	localStrategy = require("passport-local"),
	methodOverride = require("method-override"),
    Campground = require("./models/campground"),
	Comment    = require("./models/comment"),
	User       = require("./models/user"),
	seedDB     = require("./seeds");

// requiring routes
var commentRoutes      = require("./routes/comments"),
	campgroundRoutes   = require("./routes/campgrounds"),
	indexRoutes         = require("./routes/index");
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();//seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// set all the page with current users
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("YelpCamp Server Has Started!");
});