//var express = require('express');
//var router = express.Router();

/* GET users listing. */
//router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
//});

//module.exports = router;

var mongoose = require('mongoose');
mongoose.connect('mongodb://root:root@ds033096.mlab.com:33096/mean-todolist');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: Number,
    name:  String,
});

mongoose.model('User', UserSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected!");
});

var User = mongoose.model('User');

module.exports = {
    index : function (req, res) {
        var users = {};

        User.find({}, function(err, docs) {

            if (err) console.log("err: %s", err);
            console.log("This is callback function. docs.length is %d", docs.length);

            for (var i=0, size=docs.length; i<size; ++i) {
                  users[i] = docs[i].name;
                  console.log("docs.name is %s", docs[i].name);
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

        User.findOne({id: req.params.id}, function(err, docs) {

            console.log("docs.name is %s", docs.name);
            console.dir(docs);
            user = docs;
            res.send(user);
        });
    },
    create : function (req, res) {
        var user = {};
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

};
