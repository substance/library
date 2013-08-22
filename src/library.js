"use strict";

var _ = require("underscore");
var util = require("substance-util");
var Data = require("substance-data");


// Library Schema
// --------

var SCHEMA = {
  "id": "substance-library",
  "version": "0.1.0",
  "types": {
    "library": {
      "properties": {
        "collections": ["array", "collection"]
      }
    },

    // A collection contains a number of documents
    "collection": {
      "properties": {
        "name": "string",
        "documents": ["array", "entry"] // entries
      }
    },

    // Usually references a substance document, but we'd like to keep this generic
    "record": {
      "properties": {
        "title": "string",
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

  // options.schema = SCHEMA;

  console.log(options);

  // debugger;
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

};


Library.Prototype.prototype = Data.Graph.prototype;
Library.prototype = new Library.Prototype();
Library.prototype.constructor = Library;

// Add convenience accessors for builtin document attributes
Object.defineProperties(Library.prototype, {
  id: {
    get: function () {
      return this.get("library").guid;
    },
    set: function() {
      throw "library.id is immutable";
    }
  },
  // creator: {
  //   get: function () {
  //     return this.get("document").creator;
  //   }
  // },
  // created_at: {
  //   get: function () {
  //     return this.get("document").created_at;
  //   }
  // },
  // title: {
  //   get: function () {
  //     return this.get("document").title;
  //   }
  // },
  // abstract: {
  //   get: function () {
  //     return this.get("document").abstract;
  //   }
  // },
  // views: {
  //   get: function () {
  //     // Note: returing a copy to avoid inadvertent changes
  //     return this.get("document").views.slice(0);
  //   }
  // }
});

module.exports = Library;