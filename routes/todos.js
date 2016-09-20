var mongoose = require('mongoose');

//mongoose.connect('mongodb://root:root@ds033096.mlab.com:33096/mean-todolist');

var Schema = mongoose.Schema;

var todoSchema = new Schema({
    category: {type: String, required: true},
    title:  {type: String, required: true},
    status:  {type: Number, required: true},
    detail: {type: String, required: true},
    dueDate: {type: Date, required: true},
    createDate: {type: Date, required: true},
});

mongoose.model('todo', todoSchema);

/*
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected!");
});
*/

var Todo = mongoose.model('todo');

module.exports = {
    index : function (req, res) {
        Todo.find({}, function(err, docs) {
        if (err) console.log("err: %s", err);
            res.json(docs);
        }).sort({createDate:-1});;
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
        console.log("===== req.body : ====");
        console.dir(req.body);
        var todo = new Todo;
        todo.category = req.body.todoCategory;
        todo.title = req.body.todoTitle;
        todo.detail = req.body.todoDetail;
        todo.status = 0;
        todo.dueDate = req.body.todoDueDate;
        todo.createDate = Date.now();
        todo.save(function(err) {
          if (err) { console.log(err); }
        });
        res.redirect("/todos");
    },
    update : function (req, res) {
        var todo = {};
        var id = req.body.data._id;

        var todo = {category: req.body.todoCategory,
                    title: req.body.todoTitle,
                    detail: req.body.todoDetail,
                    status: req.body.data.status,
                    dueDate: req.body.todoDueDate,
                    }

        Todo.findByIdAndUpdate(id, todo, function(err, doc) {
          if (err) {
            console.log("err: %s", err);
          }
        });
        res.get("/todos");
    },
    destroy : function (req, res) {
        var todo = {};
        // TODO: delete 実装する
        res.send(todo);
    },


};
