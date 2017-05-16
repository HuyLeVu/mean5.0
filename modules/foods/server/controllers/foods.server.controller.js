'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Food = mongoose.model('Food'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Food
 */
exports.create = function(req, res) {
  var food = new Food(req.body);
  food.user = req.user;

  food.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(food);
    }
  });
};

/**
 * Show the current Food
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var food = req.food ? req.food.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  food.isCurrentUserOwner = req.user && food.user && food.user._id.toString() === req.user._id.toString();

  res.jsonp(food);
};

/**
 * Update a Food
 */
exports.update = function(req, res) {
  var food = req.food;

  food = _.extend(food, req.body);

  food.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(food);
    }
  });
};

/**
 * Delete an Food
 */
exports.delete = function(req, res) {
  var food = req.food;

  food.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(food);
    }
  });
};

/**
 * List of Foods
 */
exports.list = function(req, res) {
  Food.find().sort('-created').populate('user', 'displayName').exec(function(err, foods) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(foods);
    }
  });
};

/**
 * Food middleware
 */
exports.foodByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Food is invalid'
    });
  }

  Food.findById(id).populate('user', 'displayName').exec(function (err, food) {
    if (err) {
      return next(err);
    } else if (!food) {
      return res.status(404).send({
        message: 'No Food with that identifier has been found'
      });
    }
    req.food = food;
    next();
  });
};
