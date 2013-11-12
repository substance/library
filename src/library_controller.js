"use strict";

var _ = require("underscore");
var Controller = require("substance-application").Controller;
var LibraryView = require("./library_view");
var util = require("substance-util");


// Substance.Library.Controller
// -----------------
//

var LibraryController = function(library) {
  Controller.call(this);
  this.library = library;
  this.view = null;
};

LibraryController.Prototype = function() {

  var __super__ = Controller.prototype;

  this.initialize = function() {
    debugger();
    this.createView();
    this.setState("initialized");
  };

  this.dispose = function() {
    __super__.dispose.call(this);
    if (this.view) this.view.dispose();
    this.view = null;
  };

  this.createView = function() {
    if (!this.view) this.view = new LibraryView(this);
    return this.view;
  };

  // initialize the controller automatically when it is present as a child controller
  this.AUTO_INIT = true;
};

// Exports
// --------

LibraryController.Prototype.prototype = Controller.prototype;
LibraryController.prototype = new LibraryController.Prototype();
_.extend(LibraryController.prototype, util.Events);

module.exports = LibraryController;
