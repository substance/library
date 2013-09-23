"use strict";

var Library = require("./src/library");
Library.Controller = require("./src/library_controller");
Library.View = require("./src/library_view");
Library.Collection = {};
Library.Collection.Controller = require("./src/collection_controller");
Library.Collection.View = require("./src/collection_view");

module.exports = Library;
