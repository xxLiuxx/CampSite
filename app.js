var createError     = require('http-errors'),
    express         = require('express'),
    path            = require('path'),
    cookieParser    = require('cookie-parser'),
    flash           = require("connect-flash"),
    logger          = require('morgan'),
    methodOverride  = require('method-override'),
    bodyParser      = require('body-parser'),
    indexRouter     = require('./routes/index'),
    campgroundRouter     = require('./routes/campground'),
    commentRouter   = require('./routes/comment'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    expressSession  = require('express-session'),
    User            = require('./models/user'),
    mongoose        = require('mongoose'),
    seedDB          = require("./seed")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(flash());

//passport configuration
app.use(expressSession({
  secret: "vintage",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use('/', indexRouter);
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/comment', commentRouter);

mongoose.connect('mongodb://localhost:27017/camp_app', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on("error", function (error) {
  console.log("连接数据库失败" + error);
});
mongoose.connection.on("open", function () {
  console.log("数据库连接成功！！！");
});

//seedDB();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
