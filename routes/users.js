var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//module.exports = router;

module.exports = {
    index : function (req, res) {
        var users = {};
        // TODO: findByAll 実装する
        res.send(users);
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
