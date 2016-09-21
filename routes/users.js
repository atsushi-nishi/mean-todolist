//var express = require('express');
//var router = express.Router();

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
        user.save(function(err) {
          if (err) { console.log(err); }
        });
        res.send(user);
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
       res.send(getHash(req));
    },

};
