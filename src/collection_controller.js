"use strict";

var _ = require("underscore");
var Controller = require("substance-application").Controller;
var CollectionView = require("./collection_view");
var util = require("substance-util");


// Substance.Library.Controller
// -----------------
//

var CollectionController = function(collection) {
  Controller.call(this);
  this.collection = collection;
};


CollectionController.Prototype = function() {

  var __super__ = Controller.prototype;

  this.initialize = function() {
    this.createView();
    this.state = "initialized";
  };

  this.dispose = function() {
    __super__.dispose.call(this);
    this.view.dispose();
  };

  this.createView = function() {
    var view = new CollectionView(this);
    return view;
  };

};

// Exports
// --------

CollectionController.Prototype.prototype = Controller.prototype;
CollectionController.prototype = new CollectionController.Prototype();
_.extend(CollectionController.prototype, util.Events);

module.exports = CollectionController;
