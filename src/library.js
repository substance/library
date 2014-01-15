"use strict";

var _ = require("underscore");
var util = require("substance-util");
var Data = require("substance-data");
var Collection = require("./collection");
var Chronicle = require("substance-chronicle");
var Operator = require("substance-operator");
var ArrayOperation = Operator.ArrayOperation;

// Library Schema
// --------

var SCHEMA = {
  "id": "substance-library",
  "version": "0.1.0",
  "types": {
    "library": {
      "properties": {
        "name": "string",
        "collections": ["array", "collection"]
      }
    },

    // A collection contains a number of records
    "collection": {
      "properties": {
        "name": "string",
        "description": "string",
        "updated_at": "date",
        "image": "string",
        "records": ["array", "record"],
        "isEditable": "bool"
      }
    },

    // Usually references a substance document, but we'd like to keep this generic
    "record": {
      "properties": {
        "title": "string",
        "authors": ["array", "string"],
        "published_on": "date",
        "url": "string"
      }
    }
  }
};


// Substance.Library
// -----------------

var Library = function(options) {

  // Call parent constructor
  // --------

  Data.Graph.call(this, SCHEMA, options);

  // Seed the doc
  // --------

  if (options.seed === undefined) {
    this.create({
      id: "library",
      type: "library",
      guid: options.id, // external global document id
      creator: options.creator,
      created_at: options.created_at,
    });
  }
};


Library.Prototype = function() {

  // Get Collection by id
  // --------
  //
  // Returns a Library.Collection object

  this.getCollection = function(collectionId) {
    var collection = this.get(collectionId);
    return new Collection(collection, this);
  };

  this.removeDocument = function(collectionId, docId) {
    var library = this.get("library");
    var collectionIds = library.collections;

    var collection = this.get(collectionId);
    var index = collection.records.indexOf(docId);

    if (index < 0) {
      throw new Error("Document " + docId + " not in collection "+collectionId);
    }

    // count the occurrences of the docId
    var count = 0;
    _.each(collectionIds, function(collectionId) {
      var collection = this.get(collectionId);
      if (collection.records.indexOf(docId) >= 0) count++;
    }, this);

    this.update([collectionId, "records"], ArrayOperation.Delete(index, docId));

    if (count === 1) {
      this.delete(docId);
    }
  };
};


Library.Prototype.prototype = Data.Graph.prototype;
Library.prototype = new Library.Prototype();
Library.prototype.constructor = Library;


// Add convenience accessors for built in document attributes
// --------
//

Object.defineProperties(Library.prototype, {
  id: {
    get: function() {
      return this.get("library").guid;
    },
    set: function() {
      throw "library.id is immutable";
    }
  },

  name: {
    get: function() {
      return this.get("library").name;
    }
  },

  collections: {
    get: function() {
      return _.map(this.get("library").collections, function(collectionId) {
        return new Collection(this.get(collectionId), this);
      }, this);
    }
  }
});

module.exports = Library;
