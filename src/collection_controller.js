"use strict";

var _ = require("underscore");
var Controller = require("substance-application").Controller;
var CollectionView = require("./collection_view");
var util = require("substance-util");

// CollectionController
// --------
// options:
//  - 'import': a function(collectionId, doc, cb) which imports a given document into the collection.
//

var CollectionController = function(collection, options) {
  Controller.call(this);
  this.collection = collection;
  this.options = options || {};
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

  this.importDocument = function(doc) {
    if (this.options["import"]) {
      this.options["import"](this.collection.id, doc, function(error) {
        if(error) {
          console.error(error.message);
          util.printStackTrace(error, error);
        }
      });
    } else {
      console.error("Import not supported.");
    }
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
