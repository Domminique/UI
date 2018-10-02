/*Author: Dommy, Date: April 2, 2018, edited   August 14 2018
  This Node module is implemented and used within my server to support
  the /leaders end point. The REST API supports GET, POST and DELETE
  operations on /leaders and GET, PUT and DELETE operations on
  /leaders/:id end points.
*/

var express = require('express');
var bodyParser = require('body-parser');
// enables us to parse the data and add it to a javascript object

var mongoose = require('mongoose');
var Leaders = require('../models/leadership');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
//if json, bodyParser will parse and make available to leaderRouter
leaderRouter.route('/')
.get(function(req,res,next) {
  Leaders.find({}, function(err, leader) {
    if (err) throw err;
    res.json(leader);
  });
})

.post(function(req,res,next) {
  Leaders.create(req.body, function(err, leader) {
    if (err) throw err;
    console.log('Leader created!');
    var id = leader._id;
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Added the leader with id: ' + id);
  });
})

.delete(function(req,res,next) {
  Leaders.remove({}, function(err, resp) {
    if (err) throw err;
    res.json(resp);
  });
}); // semicolon completes the chain

leaderRouter.route('/:leaderId')
.get(function(req,res,next) {
  Leaders.findById(req.params.leaderId, function(err, leader) {
    if (err) throw err;
    res.json(leader);
  });
})

.put(function(req,res,next) {
  Leaders.findByIdAndUpdate(req.params.leaderId, {
    $set: req.body
  }, {
    new: true
  }, function (err, leader) {
    if (err) throw err;
    res.json(leader);
  });
})

.delete(function(req,res,next) {
  Leaders.findByIdAndRemove(req.params.leaderId, function(err, resp) {
    if (err) throw err;
    res.json(resp);
  });
}); // completes this chain

leaderRouter.route('/:leaderId/comments')
.get(function(req,res,next) {
  Leaders.findById(req.params.leaderId, function(err, leader) {
    if (err) throw err;
    res.json(leader.comments);
  });
})

.post(function(req,res,next) {
  Leaders.findById(req.params.leaderId, function(err, leader) {
    leader.comments.push(req.body);
    leader.save(function (err, leader) {
      if (err) throw err;
      console.log('Updated comments!');
      res.json(leader);
    });
  });
})

.delete(function(req,res,next) {
  if (err) throw err;
  for (var i = leader.comments.length - 1; i >= 0; i--) {
    leader.comments.id(leader.comments[i]._id).remove();
  }
  leader.save(function(err, result) {
    if (err) throw err;
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Deleted all comments!');
  });
});

leaderRouter.route('/:leaderId/comments/:commentId')

.get(function(req,res,next) {
  Leaders.findById(req.params.leaderId, function(err, leader) {
    if (err) throw err;
    res.json(leader.comments.id(req.params.commentId));
  });
})

.put(function(req,res,next) {
  Leaders.findById(req.params.leaderId, function(err, leader) {
    if (err) throw err;
    leader.comments.id(req.params.commentId).remove(); // drop existing comment
    leader.comments.push(req.body); // adding new comment
    leader.save(function(err,leader) {
      if (err) throw err;
      console.log('Updated comments!');
      console.log(leader);
      res.json(leader);
    });
  });
})

.delete(function(req,res,next) {
  Leaders.findById(req.params.leaderId, function(err, leader) {
    leader.comments.id(req.params.commentId).remove();
    leader.save(function(err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  });
});


module.exports = leaderRouter; // so server can use
