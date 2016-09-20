var mongoose = require('mongoose');

//mongoose.connect('mongodb://root:root@ds033096.mlab.com:33096/mean-todolist');

var Schema = mongoose.Schema;

var todoSchema = new Schema({
    id: Number,
    category: String,
    title:  String,
    detail: String,
    dute_date: Date
});

mongoose.model('todo', todoSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected!");
});

var Todo = mongoose.model('todo');

module.exports = {
    index : function (req, res) {
        Todo.find({}, function(err, docs) {
        if (err) console.log("err: %s", err);
            res.json(docs);
        });
    },

    show : function (req, res) {
        var todo = {};

        todo.findOne({id: req.params.id}, function(err, docs) {
            console.dir(docs);
            todo = docs;
            res.send(todo);
        });
    },
    create : function (req, res) {
        var todo = new Todo;
        todo.category = "anytihng";
        todo.title = "This is title";
        todo.detail = "This is detail";
        todo.due_date = "2099-07-31";
        todo.save(function(err) {
          if (err) { console.log(err); }
        });
    },
    update : function (req, res) {
        var todo = {};
        // TODO: update 実装する
        res.send(todo);
    },
    destroy : function (req, res) {
        var todo = {};
        // TODO: delete 実装する
        res.send(todo);
    },


};
