"use strict";

var _ = require("underscore");
var Controller = require("substance-application").Controller;
var CollectionView = require("./collection_view");
var util = require("substance-util");


// Substance.Library.Controller
// -----------------
//

var CollectionController = function(collection, state) {
  this.collection = collection;
  this.state = state;
  Controller.call(this);
};


CollectionController.Prototype = function() {

  this.createView = function() {
    var view = new CollectionView(this);
    return view;
  };

  this.getActiveControllers = function() {
    return [];
  };
};


// Exports
// --------

CollectionController.Prototype.prototype = Controller.prototype;
CollectionController.prototype = new CollectionController.Prototype();
_.extend(CollectionController.prototype, util.Events);

module.exports = CollectionController;
