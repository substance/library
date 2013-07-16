(function(root){ "use strict";

var _,
    util,
    Data,
    errors,
    Operator;

if (typeof exports !== 'undefined') {
  _ = require('underscore');
  util = require('substance-util');
  errors = require('substance-util/errors');
  Data = require('substance-data');
  Operator = require('substance-operator');
} else {
  _ = root._;
  util = root.Substance.util;
  errors = root.Substance.errors;
  Data = root.Substance.Data;
  Operator = root.Substance.Operator;
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
        // document properties
        "title": "string",
        "updated_at": "date",
        "created_at": "date",
        "creator": "user",
        "keywords": ["array", "string"],
        // extra properties
        "publications": ["array", "publication"], // representing current publications serialized as string
        "collaborators": ["array", "user"],
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
    return this.get(id);
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

    // TODO: FIXME handle empty library
    if (!collection) return null;

    var res = util.deepclone(collection);
    res.documents = _.map(collection.documents, function(docId) {
      var entry = this.getEntry(docId);
      return util.deepclone(entry);
    }, this);
    return res;
  };

  var DOC_PROPS = ["title", "creator", "created_at", "keywords"];

  this.onDocumentChanged = function(op, doc) {
    var entry = this.get(doc.id);
    if (entry === undefined) return;

    this.apply(Data.Graph.Set([doc.id, "updated_at"], doc.updated_at));

    // TODO: it is quite inconvenient to implement this, especially due to existence of Compounds
    // Think about, how this could be improved


    function processOp(op) {
      // we are only interested in update paths such as ["document", <prop>]
      // where <prop> is one of the properties specified in DOC_PROPS
      var path = op.path;
      var prop = path[1];
      if (path.length !== 2 || path[0] !== "document") return;
      if (DOC_PROPS.indexOf(prop) < 0) return;

      var newVal = doc.get(op.path);
      this.apply(Data.Graph.Set([doc.id, prop], newVal));
    }

    if (op instanceof Operator.Compound) {
      var ops = op.ops;
      for (var idx = 0; idx < ops.length; idx++) {
        processOp(ops[idx]);
      }
    } else {
      processOp(op);
    }

  };

  this.observeDocument = function(doc) {
    doc.on("graph:changed", this.onDocumentChanged, this);
  };
};

// Set parent prototype (Data.Graph)
Library.__prototype__.prototype = Data.Graph.prototype;

// Assign main prototype
Library.prototype = new Library.__prototype__();

Library.Entry = function(library, id) {
  this.id = id;
};

Library.Entry.__prototype__ = function() {
};

// Exports
if (typeof exports !== 'undefined') {
  exports.Library = Library;
} else {
  root.Substance.Library = Library;
}

})(this);
