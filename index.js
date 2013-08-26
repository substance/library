"use strict";

var Library = require("./src/library");
Library.Controller = require("./src/library_controller");
Library.View = require("./src/library_controller");
Library.Collection = {};
Library.Collection.View = require("./src/collection_view");

module.exports = Library;
