/* Author: Dommy, Date: April 2, 2018, edited   August 14 2018
  This Node module is implemented and used within my server to support
  the /brags end point. The REST API supports GET, POST and DELETE
  operations on /brags and GET, PUT and DELETE operations on
  /brags/:id end points.
*/

var express = require('express');
var bodyParser = require('body-parser');
// enables us to parse the data and add it to a javascript object

var mongoose = require('mongoose');
var Dishes = require('../models/brags');
var Verify = require('./verify');

var bragRouter = express.Router();
bragRouter.use(bodyParser.json());
//if json, bodyParser will parse and make available to bragRouter
bragRouter.route('/')
.get(Verify.verifyOrdinaryUser, function(req,res,next) {
  Dishes.find({})
  .populate('comments.postedBy')
  .exec(function(err, brag) {
    if (err) throw err;
    res.json(brag);
  });
}) // no semicolon

.post(Verify.verifyOrdinaryUser, function(req,res,next) {
  Dishes.create(req.body, function(err, brag) {
    if (err) throw err;
    console.log('Brag created!');
    var id = dish._id;
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });

    res.end('Added the brag with id: ' + id);
  });
}) // ditto

.delete(Verify.verifyOrdinaryUser, function(req,res,next) { // delete all the bragss
  Brags.remove({}, function(err, resp) {
    if (err) throw err;
    res.json(resp); // resp indicates how many dishes were deleted
  });
}); // semicolon completes the chain

bragRouter.route('/:bragId')

.get(function(req,res,next) {
  Brags.findById(req.params.bragId)
    .populate('comments.postedBy')
    .exec(function(err, brag) {
    if (err) throw err;
    res.json(brag);
  });
})

.put(function(req,res,next) {
  Brags.findByIdAndUpdate(req.params.bragId, {
    $set: req.body
  }, {
    new: true
  }, function (err, brag) {
    if (err) throw err;
    res.json(brag);
  });
})

.delete(function(req,res,next) {
  Brags.findByIdAndRemove(req.params.bragId, function(err, resp) {
    if (err) throw err;
    res.json(resp);
  });
}); // completes this chain

bragRouter.route('/:bragId/comments')
.all(Verify.verifyOrdinaryUser)
.get(function(req,res,next) {
  Brags.findById(req.params.bragId)
    .populate('comments.postedBy')
    .exec(function(err, brag) {
    if (err) throw err;
    res.json(brag.comments);
  });
})

.post(function(req,res,next) {
  Brags.findById(req.params.bragId, function(err, brag) {
    if (err) throw err;
    req.body.postedBy = req.decoded._doc._id;
    brag.comments.push(req.body);
    brag.save(function (err, brag) {
      if (err) throw err;
      console.log('Updated comments!');
      res.json(brag);
    });
  });
})

.delete(Verify.verifyAdmin, function(req,res,next) {
  if (err) throw err;
  for (var i = brag.comments.length - 1; i >= 0; i--) {
    brag.comments.id(brag.comments[i]._id).remove();
  }
  brag.save(function(err, result) {
    if (err) throw err;
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Deleted all comments!');
  });
});

bragRouter.route('/:bragId/comments/:commentId')
.all(Verify.verifyOrdinaryUser)
.get(function(req,res,next) {
  Brags.findById(req.params.bragId)
    .populate('comments.postedBy')
    .exec(function(err, brag) {
    if (err) throw err;
    res.json(brag.comments.id(req.params.commentId));
  });
})

.put(function(req,res,next) {
  Brags.findById(req.params.bragId, function(err, brag) {
    if (err) throw err;
    brag.comments.id(req.params.commentId).remove(); // drop existing comment
    req.body.postedBy = req.decoded._doc._id;
    brag.comments.push(req.body); // adding new comment
    brag.save(function(err,brag) {
      if (err) throw err;
      console.log('Updated comments!');
      console.log(brag);
      res.json(brag);
    });
  });
})

.delete(function(req,res,next) {
  Brags.findById(req.params.bragId, function(err, brag) {
    if (brag.comments.id(req.params.commentId).postedBy
        != req.decoded._doc._id) {
      var err = new Error('You are not authorized to perform this operation!');
      err.status = 403;
      return next(err);
    }
    brag.comments.id(req.params.commentId).remove();
    brag.save(function(err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  });
});


module.exports = bragRouter; // so server can use


