//Require Express
var express = require( 'express' );
var app = express();

//Get body-parser
var bodyParser = require( 'body-parser' );

//Configure bodyParser to read JSON
app.use(bodyParser.json());

//MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/1955_api');
var peopleSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2 }
}, {timestamps: true});
mongoose.model('People', peopleSchema);
var People = mongoose.model('People');
mongoose.Promise = global.Promise;

app.get('/', function(req, res){
    People.find({}, function(err, people){
        if(err){
            console.log("Returned error", err);
            res.json({message: "Error", error: err});
        } else {
            res.json({people});
        };
    });
});

//Set Routes
app.get('/new/:name/', function(req,res){
    // console.log("TO ADD: ", req.params.name)
    var people = new People({name: req.params.name});

    people.save(function(err){
        if(err){
            console.log("Error while saving name");
            res.json({message: "Error", error: err});
        } else {
            res.redirect('/');
        };
    });
});

app.get('/remove/:name', function(req,res){
    People.remove({name: req.params.name}, function(err, people) {
        if(err) {
            console.log("error deleting data from Mongo");
        } else {
            res.redirect('/');
        };
    });
});

app.get('/:name', function(req,res){
    People.findOne({name: req.params.name}, function(err, people) {
        if(err) {
            console.log("error getting data from Mongo");
        } else {
            res.json({people});
        };
    });
});

app.listen(8000, function(){
    console.log("Listening to 8000")
});