/* Author: Dommy, Date: April 2, 2018, edited   August 14 2018
  This Node module is implemented and used within my server to support
  the /promos end point. The REST API supports GET, POST and DELETE
  operations on /promotionss and GET, PUT and DELETE operations on
  /promotions/:id end points.
*/

var express = require('express');
var bodyParser = require('body-parser');
// enables us to parse the data and add it to a javascript object

var mongoose = require('mongoose');
var Promotions = require('../models/promotions');
var Verify = require('./verify');
var promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());
//if json, bodyParser will parse and make available to promotionRouter
promotionRouter.route('/')
.all(Verify.verifyOrdinaryUser)
.get(function(req,res,next) {
  Promotions.find({}, function(err, promotion) {
    if (err) throw err;
    res.json(promotion);
  });
})

.post(Verify.verifyAdmin, function(req,res,next) {
  Promotions.create(req.body, function(err, promotion) {
    if (err) throw err;
    console.log('Promotion created!');
    var id = promotion._id;
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Added the promotion with id: ' + id);
  });
})

.delete(Verify.verifyAdmin, function(req,res,next) {
  Promotions.remove({}, function(err, resp) {
    if (err) throw err;
    res.json(resp);
  });
}); // semicolon completes the chain

promotionRouter.route('/:promotionId')
.get(Verify.verifyOrdinaryUser, function(req,res,next) {
  Promotions.findById(req.params.promotionId, function(err, promotion) {
    if (err) throw err;
    res.json(promotion);
  });
})

.put(Verify.verifyAdmin, function(req,res,next) {
  Promotions.findByIdAndUpdate(req.params.promotionId, {
    $set: req.body
  }, {
    new: true
  }, function (err, promotion) {
    if (err) throw err;
    res.json(promotion);
  });
})

.delete(Verify.verifyAdmin, function(req,res,next) {
  Promotions.findByIdAndRemove(req.params.promotionId, function(err, resp) {
    if (err) throw err;
    res.json(resp);
  });
}); // completes this chain

promotionRouter.route('/:promotionId/comments')
.get(Verify.verifyOrdinaryUser, function(req,res,next) {
  Promotions.findById(req.params.promotionId, function(err, promotion) {
    if (err) throw err;
    res.json(promotion.comments);
  });
})

.post(Verify.verifyAdmin, function(req,res,next) {
  Promotions.findById(req.params.promotionId, function(err, promotion) {
    promotion.comments.push(req.body);
    promotion.save(function (err, promotion) {
      if (err) throw err;
      console.log('Updated comments!');
      res.json(promotion);
    });
  });
})

.delete(Verify.verifyAdmin, function(req,res,next) {
  if (err) throw err;
  for (var i = promotion.comments.length - 1; i >= 0; i--) {
    promotion.comments.id(promotion.comments[i]._id).remove();
  }
  promotion.save(function(err, result) {
    if (err) throw err;
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Deleted all comments!');
  });
});

promotionRouter.route('/:promotionId/comments/:commentId')

.get(Verify.verifyOrdinaryUser, function(req,res,next) {
  Promotions.findById(req.params.promotionId, function(err, promotion) {
    if (err) throw err;
    res.json(promotion.comments.id(req.params.commentId));
  });
})

.put(Verify.verifyAdmin, function(req,res,next) {
  Promotions.findById(req.params.promotionId, function(err, promotion) {
    if (err) throw err;
    promotion.comments.id(req.params.commentId).remove(); // drop existing comment
    promotion.comments.push(req.body); // adding new comment
    promotion.save(function(err,promotion) {
      if (err) throw err;
      console.log('Updated comments!');
      console.log(promotion);
      res.json(promotion);
    });
  });
})

.delete(Verify.verifyAdmin, function(req,res,next) {
  Promotions.findById(req.params.promotionId, function(err, promotion) {
    promotion.comments.id(req.params.commentId).remove();
    promotion.save(function(err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  });
});


module.exports = promotionRouter; // so server can use
