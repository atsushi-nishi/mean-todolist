var mongoose = require('mongoose');
mongoose.connect('mongodb://root:root@ds033096.mlab.com:33096/mean-todolist');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected in init process!");
});



