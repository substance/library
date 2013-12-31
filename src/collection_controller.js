"use strict";

var _ = require("underscore");
var Controller = require("substance-application").Controller;
var CollectionView = require("./collection_view");
var util = require("substance-util");


var CollectionController = function(collection) {
  Controller.call(this);
  this.collection = collection;
};

CollectionController.Prototype = function() {

  var __super__ = Controller.prototype;

  this.initialize = function(newState, cb) {
    this.createView().render();
    cb(null);
  };

  this.dispose = function() {
    __super__.dispose.call(this);
    if (this.view) {
      this.view.dispose();
      this.view = null;
    }
  };

  this.createView = function() {
    if (!this.view) this.view = new CollectionView(this);
    return this.view;
  };

  // initialize the controller automatically when it is present as a child controller
  this.AUTO_INIT = true;
};

// Exports
// --------

CollectionController.Prototype.prototype = Controller.prototype;
CollectionController.prototype = new CollectionController.Prototype();
_.extend(CollectionController.prototype, util.Events);

module.exports = CollectionController;
