"use strict";

var _ = require("underscore");
var Data = require("substance-data");

// Substance.Library.Collection
// -----------------

var Collection = function(node, library) {
  this.library = library;
  this.properties = node;
};


Collection.Prototype = function() {
  this.getRecords = function() {
    return _.map(this.properties.records, function(recordId) {
      return this.library.get(recordId);
    }, this);
  };

};

Collection.prototype = new Collection.Prototype();
Collection.prototype.constructor = Collection;


// Add convenience accessors for attributes
// --------
//
Data.defineNodeProperties(Collection.prototype, ["id", "name", "updated_at", "description", "image", "records", "isEditable"]);

module.exports = Collection;
