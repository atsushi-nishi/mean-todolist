//var express = require('express');
//var router = express.Router();

/* GET users listing. */
//router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
//});

//module.exports = router;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mean-todolist');

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

module.exports = {
    index : function (req, res) {
        var users = {};
        // TODO: findByAll 実装する
        var User = mongoose.model('User');

        console.log('User');
        
        User.find({}, function(err, docs) {
            console.log("docs.length is %d", docs.length);

            for (var i=0, size=docs.length; i<size; ++i) {
                  users[i] = docs[i].name;
                  console.log("docs.name is %s", docs[i].name);
                  console.log("users");
                  console.dir(users);
            }
            console.log("end for");
            console.log("users");
            console.dir(users);
            res.send(users);
        });
    },

    show : function (req, res) {
        var user = {};
        // TODO: findById 実装する
        res.send(user);
    },
    create : function (req, res) {
        var user = {};
        // TODO: insert 実装する
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
};
