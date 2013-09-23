"use strict";

var _ = require("underscore");
var Controller = require("substance-application").Controller;
var LibraryView = require("./library_view");
var util = require("substance-util");


// Substance.Library.Controller
// -----------------
//

var LibraryController = function(library, state) {
  this.library = library; 

  this.state = state;

  Controller.call(this);
  
  // Create library view
  this.view = new LibraryView(this);
};


LibraryController.Prototype = function() {

  this.createView = function() {
    var view = new LibraryView(this);
    return view;
  };

  // Transitions
  // ==================================

  this.getActiveControllers = function() {
    return [];
  };
};


// Exports
// --------

LibraryController.Prototype.prototype = Controller.prototype;
LibraryController.prototype = new LibraryController.Prototype();
_.extend(LibraryController.prototype, util.Events);


module.exports = LibraryController;
