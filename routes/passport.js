
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var session = require('express-session');


var users = require('./users');
var User = users.User;


//console.log("[inspect]User");
//console.dir(User);


/*
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
    console.log("passport deserializeUser");
    User.findById(serializedUser._id, function(err, user){
        console.log("passport deserializeUser1");
        console.dir(user.email);
        console.dir(user._id);
        done(err, user);
    });
});
*/


/*
// LocalStrategyを使う設定
passport.use(new LocalStrategy(
    // フォームの名前をオプションとして渡す。
    // 今回はusernameの代わりにemailを使っているので、指定が必要
    {usernameField: "email", passwordField: "password"},
    function(email, password, done){
        console.log("[func]passport.useLoclaStrategy");
        // 非同期で処理させるといいらしいです
        process.nextTick(function(){
            console.log("[func]passport.useLoclaStrategy.process");
            User.findOne({email: email}, function(err, user){
                if(err) {
                    return done(err, false, {message: err});
                }
                if(!user) {
                    return done(null, false, {message: "User not found!"});
                }
                //var hashedPassword = getHash(password);
                var hashedPassword = users.getHashedPassword(password);
                console.log("hashed password : %s", hashedPassword);
                if(user.password !== hashedPassword) {
                    return done(null, false, {message: "Password incorrect!"});
                }
                return done(null, user);
            });
        });
    }
));
*/


module.exports = {

    useLocalStrategy : function(req, res) { 
        console.log("[func]passport.useLoclaStrategy");
        passport.use(new LocalStrategy(
            // フォームの名前をオプションとして渡す。
            // 今回はusernameの代わりにemailを使っているので、指定が必要
            {usernameField: "email", passwordField: "password"},
            function(email, password, done){
                console.log("[func]passport.useLoclaStrategy2");
                // 非同期で処理させるといいらしいです
                process.nextTick(function(){
                    console.log("[func]passport.useLoclaStrategy.process");
                    User.findOne({email: email}, function(err, user){
                        if(err) {
                            return done(err, false, {message: err});
                        }
                        if(!user) {
                            return done(null, false, {message: "User not found!"});
                        }
                        //var hashedPassword = getHash(password);
                        var hashedPassword = users.getHashedPassword(password);
                        console.log("hashed password : %s", hashedPassword);
                        if(user.password !== hashedPassword) {
                            return done(null, false, {message: "Password incorrect!"});
                        }
                        return done(null, user);
                    });
                });
            }
        ));
        console.log("[func]passport.useLoclaStrategy end");
    },

    configSerializer : function (req, res) {
        console.log("[func]passport.configSerializer");
        // シリアライズの設定をしないと、user.passwordでパスワードがポロリする可能性があるので、必要な項目だけ持たせる
        //console.dir(passport);
        passport.serializeUser(function(user, done){
            console.log("[func]passport.configSerializer.serializeUser");
            console.log("passport serializeUser");
            console.dir(user.email);
            console.dir(user._id);
            done(null, {email: user.email, _id: user._id});
            console.log("passport serializeUser done");
        });

        passport.deserializeUser(function(serializedUser, done){
            console.log("[func]passport.configDeserializer");
            console.log("passport deserializeUser");
            User.findById(serializedUser._id, function(err, user){
                console.log("passport deserializeUser1");
                console.dir(user.email);
                console.dir(user._id);
                done(err, user);
            })
        });
        console.log("[func]passport.configSerializer end");
    },


    start : function (req, res) {

        console.log("[func]passport.start");
        app = req;
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(session({
          secret: "another_random_sevret_again",
          saveUninitialized: true,
          resave: true,
        }));
        console.log("[func]passport.start end");
    },

    signup : function (req, res) {
        console.log("[func]passport.signup");
        res.render("signup", {user: req.user, message: req.flash("error")});
    },

    signout : function (req, res) {
        console.log("[func]passport.signout");
        req.logout();
        res.redirect("/");
    },

    signin : function (req, res) {
        console.log("[func]passport.signin");
        console.log("[inspect]req.user");
        console.log(req.user);
        res.render("signin", {user: req.user, message: req.flash("error")});
    },

    doSignin : function (req, res) {
        console.log("[func]passport.doSignin");
        console.dir(passport);
        passport.authenticate("local", {failureRedirect: '/signinaaa', failureFlash: true}),
        function(req, res){
            // ログインに成功したらトップへリダイレクト
            console.log('signin succeed');
            res.redirect("/");
        }
        console.log("[func]passport.doSignin end");
    },
};








