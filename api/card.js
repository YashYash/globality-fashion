'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Card = require('../models/card');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var async = require('async');
var fs = require('fs');
var ff = require('ff');

var randomImages = [
  "http://i.huffpost.com/gen/1633005/images/o-FASHION-MODELS-facebook.jpg",
  "http://www.ufa.us.com/wp-content/uploads/2015/04/red-dress-fashion-girl-fashion-backgrounds-dress-fashion-girl-red-26058.jpg",
  "http://www.carlytati.com/wp-content/uploads/2014/02/fashion-model-josephine-skriver-paris-fashion-week.jpg",
  "http://trakiaplaza.info/wp-content/uploads/2015/06/harry-styles-fashion-fashion-backgrounds-fashion-harry-styles-26060.jpg",
  "https://deepfashion.herokuapp.com/assets/wallpaper-1ee522fe28796ea406c4d8eca79a107c.jpg",
  "https://subconsciousseamstress.files.wordpress.com/2013/10/milan-fashion-week-fall-2012-roberto-cavalli-runway-show-review-by-kristin-knox-the-clothes-whisperer-blog_0483.jpg",
  "https://shechive.files.wordpress.com/2012/08/0-kids-fashion-1.jpg",
  "https://insightsofmarketing.files.wordpress.com/2013/12/fashion-marketing1.jpg",
  "http://www.inspireleads.com/wp-content/uploads/2015/05/mens-fashion-clothing-zara-autumn-winter-2009-2010-collection.jpg",
  "http://cdn2-www.craveonline.com/assets/uploads/2015/01/Mens-Fashion-Apps.png",
  "http://cdn.themancave.fm/wp-content/uploads/2014/10/awesome-mens-fashion.jpg"
];

router.post('/upload/image', multipartyMiddleware, function(req, res) {
  var file = req.files.file;
  var sourcePath = file.path;
  var destFileName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  var destPath = './public/images/cards/' + destFileName;
  var source = fs.createReadStream(sourcePath);
  var dest = fs.createWriteStream(destPath);
  async.waterfall([
    function(callback) {
      source.pipe(dest);
      source.on('end', function() {
        callback(null);
      });
      source.on('error', function(err) {
        callback(err);
      })
    },
    function(callback) {
      res.send(destFileName);
    }
  ], function(err) {
    res.send(err);
  });
});

router.post('/create', function(req, res) {

  var data = req.body;
  var card = new Card(data);
  card.modified = new Date();
  card.save(function(err, card) {
    if (err) {
      res.send(err);
    } else {
      res.send(card);
    }
  })
});

router.get('/get', function(req, res) {
  if (req.query.id !== 'false') {
    var f = ff(function() {
      Card
        .find({
          "_id": {
            "$lt": req.query.id
          }
        })
        .sort({
          "_id": -1
        })
        .limit(20)
        .exec(f.slotMulti(2));
    }, function(cards, err) {
      if(!err) {
        res.send(cards);
      } else {
        console.log(err);
      }
    }).onError(function(err) {
      res.send(err);
    });
  } else {
    var f = ff(function() {
      Card
        .find()
        .sort({
          "_id": -1
        })
        .limit(20)
        .exec(f.slotMulti(2));
    }, function(cards, err) {
      res.send(cards);
    }).onError(function(err) {
      console.log('#### Error occured');
      res.send(err);
    });
  }
});

router.get('/dummy-cards/:number', function(req, res) {
  var numberOfCards = Number(req.params.number);
  var cards = [];
  var card = {};
  var randomIndex;
  for (var i = 0; i < numberOfCards; i++) {
    randomIndex = 0;
    randomIndex = Math.floor(Math.random() * 11);
    card = {};
    card.image = randomImages[randomIndex];
    card.title = "Fashion Card - " + i;
    card.blurb = "This is the blurb for the fashion card. It is hard to think of an example blurb right now.";
    card.author = "Yash Saxena";
    card.url = "https://www.fashion.com";
    card.modified = new Date();
    cards.push(card);
  }
  console.log(cards);
  async.waterfall([
    function(callback) {
      Card.remove({
        "url": "https://www.fashion.com"
      }, function(err) {
        if (!err) {
          console.log('#### Removed the dummy cards');
          callback(null);
        } else {
          callback(err);
        }
      })
    },
    function(callback) {
      console.log('#### Creating the new cards');
      async.eachSeries(cards, function(card, cb) {
        console.log(card);
        var f = ff(function() {
          new Card(card).save(f.slot());
        }, function(card, err) {
          if (!err) {
              cb();
          } else {
            console.log(err);
            callback(err);
          }
        })
      }, function() {
        console.log('#### Created all the cards')
        res.send(cards);
      })
    }
  ], function(err) {
    console.log(err);
    res.send(err);
  })
})
module.exports = router;
