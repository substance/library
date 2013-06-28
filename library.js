(function(root){ "use_strict";

var _,
    util,
    Data,
    errors;

if (typeof exports !== 'undefined') {
  _ = require('underscore');
  util = require('../../util/util');
  errors = require('../../util/errors');
  Data = require('../../data/data');
} else {
  _ = root._;
  util = root.Substance.util;
  errors = root.Substance.errors;
  Data = root.Substance.Data;
}

var LibraryError = errors.define('LibraryError', -1);

// Library Schema
// --------

var SCHEMA = {
  // Static indexes
  "indexes": {
    // all comments are now indexed by node association
    "collections": {
      "type": "collection",
      "properties": []
    }
  },

  "types": {
    // Usually refers to a substance document, but we'd like to keep this generic
    "entry": {
      "properties": {
        "title": "string",
        "publications": ["array", "publication"], // representing current publications serialized as string
        "updated_at": "date",
        "created_at": "date",
        "creator": "user",
        "collaborators": ["array", "user"],
        "keywords": ["array", "string"]
      }
    },

    "user": {
      "properties": {
        "username": "string",
        "name": "string"
      }
    },

    // A publication entry (for local caching)
    "publication": {
      "properties": {
        "network": "network",
        "document": "entry",
        "creator": "user"
      }
    },

    // A collection contains a number of documents
    "collection": {
      "properties": {
        "name": "string",
        "documents": ["array", "entry"] // entries
      }
    },

    "network": {
      "parent": "collection"
    },

    // Article is a concrete document type
    "article": {
      "parent": "entry"
    },

    // A book chapter
    "chapter": {
      "parent": "entry"
    },

    // A book is a concrete collectino of documents (usually chapters)
    "book": {
      "parent": "collection"
    }
  }
};

var Library = function(options) {
  this.graph = new Data.Graph(SCHEMA, options);
  this.schema = this.graph.schema;
};

// Library: Public Interface
// ========
//

Library.__prototype__ = function() {

  // delegate all methods to graph
  _.each(Data.Graph.prototype, function(f, name) {
    if (_.isFunction(f)) {
      this[name] = function() {
        return this.graph[name].apply(this.graph, arguments);
      };
    }
  }, this);


  // Get a document entry by id (read-only version ready for the view)
  // --------
  //

  this.getEntry = function(id) {
    // 1. Get current working copy to derive information from
    // var workingCopy = localDocStore.get(id);
    return this.get(id);
    // return {
    //   id: id,
    //   title: "Untitled", // workingCopy.get('document').title,
    //   authors: ["John Doe", "Jane Foo"], // Dynamically extract creator + collaborators
    //   created_at: new Date(),
    //   updated_at: new Date()
    // };
  };

  // Get document (the contents)
  // --------
  //
  // returns a Substance.Document instance

  this.getDocument = function(id) {
    var workingCopy = this.localDocStore.get(id);
    return workingCopy;
  };

  // Get a collection (read-only version ready for the view)
  // --------
  //

  this.getCollection = function(id) {
    var collection = this.get(id);
    var res = util.deepclone(collection);

    res.documents = _.map(collection.documents, function(docId) {
      var entry = this.getEntry(docId);
      return util.deepclone(entry);
    }, this);
    return res;
  };
};

// Set parent prototype (Data.Graph)
Library.__prototype__.prototype = Data.Graph.prototype;

// Assign main prototype
Library.prototype = new Library.__prototype__();

// Exports
if (typeof exports !== 'undefined') {
  exports.Library = Library;
} else {
  root.Substance.Library = Library;
}

})(this);
