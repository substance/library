"use strict";

var _ = require("underscore");
var util = require("substance-util");
var Data = require("substance-data");
var Collection = require("./collection");
var Chronicle = require("substance-chronicle");

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
        "documents": ["array", "record"]
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

  // Get Document by id
  // --------
  // 
  // It reads the corresponding document record and tries to fetch the article from the URL provided
  // TODO: Get rid of lens-article dependency here

  this.loadDocument = function(docId, cb) {
    
    var record = this.get(docId);
    var doc;
    console.log('LOADING DOC from: ', record.url);
    // check schema
    $.getJSON(record.url, function(data) {

      if (data.schema && data.schema[0] === "lens-article") {
        console.log('lens article');
        var Article = require("lens-article");
        doc = Article.fromSnapshot(data);
      } else {
        console.log('substance article');
        var Article = require("substance-article");
        doc = Article.fromSnapshot(data);
      }
      
      cb(null, doc);
    });
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
