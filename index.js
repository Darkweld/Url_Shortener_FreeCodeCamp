var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var express = require('express');
var app = express();

var url = process.env.MONGOLAB_URI;

var database;

MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log("error in mongodb, error:", err);
    } else {
        database = db;
        app.listen(process.env.PORT || 8080, function() {
            console.log("listening");
        });
    }
});

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.render("index");
});


app.get("/http://:id", function(req, res) {
    var num = Math.round(Math.random() * (9999 - 1) + 1);
    var urls = database.collection("urls");
    
    if ((/^www./i).test(req.params.id) === false) {
        res.render("invalid", {error:"Url must follow http://www. or https://www. format"});
    } else {
        
        urls.remove({"url": req.params.id}, function(err) {
        if (err) throw err;
        urls.insert({"url": req.params.id, "shorturl": num.toString()});
        res.render("data", {urlname:"http://" + req.params.id, shorturl:num});
         });
    }
});

app.get("/https://:id", function(req, res) {
    var num = Math.round(Math.random() * (9999 - 1) + 1);
    var urls = database.collection("urls");
    
        if ((/^www./i).test(req.params.id) === false) {
        res.render("invalid", {error:"Url must follow http://www. or https://www. format"});
    } else {
        urls.remove({"url": req.params.id}, function(err) {
        if (err) throw err;
        urls.insert({"url": req.params.id, "shorturl": num.toString()});
        res.render("data", {urlname:"https://" + req.params.id, shorturl:num});
         });
    }
});

app.get("/:num", function(req, res) {
    var urls = database.collection("urls");
    urls.find({"shorturl": req.params.num}).toArray(function(err, docs1){
        if (err) throw err;
        if (docs1.length > 0) {
        console.log(docs1[0].url);
        res.redirect("https://" + docs1[0].url);
        } else {
            res.render("invalid", {error:"Invalid or removed entry"});
        }
        });
});