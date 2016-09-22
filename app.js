
var express = require('express');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');





//================================================


// ハッシュ値を求めるために必要なもの
var crypto = require("crypto");
var secretKey = "some_random_secret";   // シークレットは適当に変えてください
var getHash = function(target){
      var sha = crypto.createHmac("sha256", secretKey);
      sha.update(target);
      return sha.digest("hex");
};

// passportで必要なもの
var flash = require("connect-flash")
  , passport = require("passport")
  , LocalStrategy = require("passport-local").Strategy;

var flash = require("connect-flash");

var session = require('express-session');

var init = require('./routes/init');
var rPassport = require('./routes/passport');
var routes = require('./routes/index');
var users = require('./routes/users');
var todos = require('./routes/todos');


//rPassport.useLocalStrategy();

//var passport = rPassport.passport;


/*
console.log("copy passport");
console.dir(passport);
*/

// 一時的に User を外でも使えるように．．．
var User = users.User;

// passportでのセッション設定
// シリアライズの設定をしないと、user.passwordでパスワードがポロリする可能性があるので、必要な項目だけ持たせる
passport.serializeUser(function(user, done){
    console.log("passport serializeUser");
    console.dir(user.email);
    console.dir(user._id);
    done(null, {email: user.email, _id: user._id});
    console.log("passport serializeUser done");
});
passport.deserializeUser(function(serializedUser, done){

    console.log("passport deserializeUser1");
    done(err, user);
    console.log("passport deserializeUser2");

/*
    console.log("passport deserializeUser");
    User.findById(serializedUser._id, function(err, user){
        console.log("passport deserializeUser1");
        console.dir(user.email);
        console.dir(user._id);
        done(err, user);
    });
*/
});

rPassport.configSerializer();

// LocalStrategyを使う設定
passport.use(new LocalStrategy(
  // フォームの名前をオプションとして渡す。
  // 今回はusernameの代わりにemailを使っているので、指定が必要
  {usernameField: "email", passwordField: "password"},
  function(email, password, done){
    // 非同期で処理させるといいらしいです
    process.nextTick(function(){
        User.findOne({email: email}, function(err, user){
            console.log('email');
            console.log(email);
            if(err) {
                return done(err, false, {message: err});
            }
            console.log('test log 1');
            if(!user) {
                console.log('test log 2');
                return done(null, false, {message: "User not found!"});
            }
            //var hashedPassword = getHash(password);
            console.log('test log 3');
            var hashedPassword = users.getHashedPassword(password);
            console.log("hashed password : %s", hashedPassword);
            if(user.password !== hashedPassword) {
                console.log('test log 4');
                return done(null, false, {message: "Password incorrect!"});
            }
            console.log('test log 5');
            return done(null, user);
        });
    });
}));

// リクエストがあったとき、ログイン済みかどうか確認する関数
var isLogined = function(req, res, next){
    console.log("[func]isLogined");
    console.dir("[inspect]req");
    console.dir(req);
    console.log("req.isAuthenticated() is ");
    console.dir(req.isAuthenticated());
    //if(req.isAuthenticated()) {
    if (1) {
        console.log("isLogined1");
        return next();  // ログイン済み
    }
    // ログインしてなかったらログイン画面に飛ばす
    console.log("[WARN]isLogined false!!!!");
    res.redirect("/login");
    //はまったので一回コメントアウト
    //ToDo
};

//================================================




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//passport
// app.router を使う前にpassportの設定が必要です

//rPassport.start(app);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret: "another_random_sevret_again",
  saveUninitialized: true,
  resave: true,
}));







app.use('/', routes);

//app.use(app.router);
//routes.initialize(app);


app.get("/signup", function(req, res){
    res.render("signup", {user: req.user, message: req.flash("error")});
});

app.get("/signout", function(req, res){
    req.logout();
    res.redirect("/");
});


app.get("/login", function(req, res){
    res.render("login", {user: req.user, message: req.flash("error")});
});
app.post("/login", 
    passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}),
    function(req, res){
        // ログインに成功したらトップへリダイレクト
        console.log('login post2');
        res.redirect("/");
});

/*
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});
*/
/*
app.get("/signup", rPassport.signup);
app.get("/signout", rPassport.signout);
app.get("/signin", rPassport.signin);
app.post("/signin", rPassport.doSignin);
*/



// ---- Users Start ----
//app.get('/users', users.isSignined, function(req, res) {
app.get('/users', function(req, res) {
  res.render('users/index'); // load the single view file (angular will handle the page changes on the front-end)
});

//app.get('/users', users.index);
app.get('/users/:id', users.show);
app.post('/users', users.create);
app.put('/users/:id', users.update);
app.delete('/users/:id', users.destroy);

app.get('/api/users', users.api_users);
app.get('/api/users/email/:email', users.showByEmail);
app.post('/api/users', users.create);

// ---- Users End ----


// ---- ToDos Start ----
//app.get('/todos', users.isSignined, function(req, res) {
app.get('/todos', function(req, res) {
  res.render('todos');
});

// ToDo APIsL
app.get('/api/todos', todos.index);
app.get('/api/todos/:id', todos.show);
app.post('/api/todos', todos.create);
app.put('/api/todos/:id', todos.update);
app.delete('/api/todos/:id', todos.destroy);
// ---- ToDos End ----


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
