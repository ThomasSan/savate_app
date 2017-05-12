var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'))

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

var MongoClient	= require('mongodb').MongoClient
var URL = 'mongodb://localhost:27017/savate'

app.get('/', function (req, res) {
  res.render('index.pug', {title: "Savate DB"});
})
.get('/boxers', function (req, res) { 
  MongoClient.connect(URL, function(err, db) {
    if (err) return

    var collection = db.collection('users')
    collection.find({}).toArray(function(err, docs) {
      res.render('boxers.pug', {boxers: docs})
      db.close()
    })

  })
})
.get('/fights/:userName', function (req, res) { 
  MongoClient.connect(URL, function(err, db) {
    if (err) return

    var user_name = req.params.userName
    var collection = db.collection('fights')
    collection.find({"red" : user_name}, {"blue" : user_name}).toArray(function(err, docs) {
      console.log(docs)
      res.render('fights.pug', {fights: docs})
      db.close()
    })

  })
});

app.use(function (req, res, next) {
  res.status(404).render("404.pug")
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})