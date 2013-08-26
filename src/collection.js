"use strict";

var _ = require("underscore");

// Substance.Library.Collection
// -----------------

var Collection = function(node, library) {
  this.library = library;
  this.properties = node;
};


Collection.Prototype = function() {

};

Collection.prototype = new Collection.Prototype();
Collection.prototype.constructor = Collection;


// Add convenience accessors for attributes
// --------
// 

Object.defineProperties(Collection.prototype, {
  id: {
    get: function() {
      return this.properties.id;
    }
  },
  name: {
    get: function() {
      return this.properties.name;
    },
    set: function() {
      throw "collection.name is immutable";
    }
  },
  records: {
    get: function() {
      return _.map(this.properties.records, function(recordId) {
        return this.library.get(recordId);
      }, this);
    },
    set: function() {
      throw "collection.records is immutable";
    }
  }
});

module.exports = Collection;