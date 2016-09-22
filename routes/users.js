//var express = require('express');
//var router = express.Router();

//var passport= require('passport');

/* GET users listing. */
//router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
//});

//module.exports = router;

var mongoose = require('mongoose');
//mongoose.connect('mongodb://root:root@ds033096.mlab.com:33096/mean-todolist');


var UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, requird: true}
});
var User = mongoose.model("User", UserSchema);


var crypto = require("crypto");
var secretKey = "OrangeGrapeNamatamago";   // シークレットは適当に変えてください

var getHash = function(target){
      var sha = crypto.createHmac("sha256", secretKey);
      sha.update(target);
      return sha.digest("hex");
};


module.exports = {
    User : User,

/*
    signup : function (req, res) {
        res.render("signup", {user: req.user, message: req.flash("error")});
    },

    signout : function (req, res) {
        req.logout();
        res.redirect("/");
    },

    signin : function (req, res) {
        res.render("signin", {user: req.user, message: req.flash("error")});
    },

    doSignin : function (req, res) {
        passport.authenticate("local", {failureRedirect: '/signin', failureFlash: true}),
        function(req, res){
            // ログインに成功したらトップへリダイレクト
            console.log('signin succeed');
            res.redirect("/");
        }
    },
*/

    index : function (req, res) {
        var users = {};

        User.find({}, function(err, docs) {

            if (err) console.log("err: %s", err);
            console.log("This is callback function. docs.length is %d", docs.length);

            for (var i=0, size=docs.length; i<size; ++i) {
                  users[i] = docs[i].firstName;
                  console.log("docs.name is %s", docs[i].firstName);
            }
            console.dir(users);
            res.render('users/index', { users: users });
        });

        console.log("Not callback function");
    },

    show : function (req, res) {
        var user = {};

        console.log("req.params");
        console.dir(req.params);

        User.findOne({id: req.params.id}, function(err, doc) {
            console.log("doc.name is %s", doc.name);
            console.dir(doc);
            user = doc;
            res.send(user);
        });
    },

    create : function (req, res) {
        console.log("[func]user.create");
        console.dir(req.body.data);
        console.log("req.body");
        console.dir(req.body);
        var user = new User;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.password= getHash(req.body.password);
        console.log("[info]user.create save");
        user.save(function(err) {
          if (err) { console.log(err); }
          console.log("[success]user.create done");
          res.send(user);
        });
    },
    update : function (req, res) {
        var user = {};
        // TODO: update 実装する
        res.send(user);
    },
    destroy : function (req, res) {
        var user = {};
        // TODO: delete 実装する
        res.send(user);
    },

    api_users : function (req, res) {
       User.find({}, function(err, docs) {
            if (err) console.log("err: %s", err);
            res.json(docs);
        });
    },

    showByEmail : function (req, res) {
        console.log("[func]user.showByEmail");
        console.log("req.params")
        console.log(req.params)

        User.findOne({email: req.params.email}, function(err, doc) {

            console.log("doc");
            console.log(doc);
            if (doc) {
                console.log("doc.firstName by email is %s", doc.firstName);
                console.log(doc);
            } else {
                console.log("user not found");
            }
            res.send(doc);
        });
    },

    getHashedPassword : function(req, res) { 
        console.log("[func]user.getHashedPassword");
        return getHash(req);
    },

    isSignined : function (req, res, next){
        console.log("[func]user.isSignined");
        console.log("isSignined req: ");
        console.dir(req);
        console.log("isSignined0");
        console.log("req.user");
        console.dir(req.user);
        //console.log("req.sessions[0].passport.user");
        //console.dir(req.sessions[0].passport.user);
        console.dir(req.isAuthenticated());
        if(req.isAuthenticated()) {
            console.log("isSignined1");
            return next();  // ログイン済み
        }
        // ログインしてなかったらログイン画面に飛ばす
        console.log("[WARN]isSignined false!!!!");
        //res.redirect("/signin");
        res.redirect("/login");
        //はまったので一回コメントアウト
        //ToDo
    },

};
