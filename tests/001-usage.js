(function(root) {

var _ = root._;
var assert = root.Substance.assert;
var util = root.Substance.util;
var Document = root.Substance.Document;
var Library = root.Substance.Library;
var Data = root.Substance.Data;

var test = {};

test.setup = function() {
  this.library = new Library();
};

test.actions = [
  "Initialization", function() {

  },

  "Create some document entries", function() {
    // Create some articles
    var op1 = Data.Graph.Create({
      id: "document_1",
      type: "article",
      title: "Document 1", // derive dynamically
      creator: "Michael Aureiter", // derive dynamically
      collaborators: ["Oliver Buchtala", "Samo Korosec"],
      publications: ["Science"] // derive dynamically
    });

    var op2 = Data.Graph.Create({
      id: "document_2",
      type: "article",
      title: "Document 2", // derive dynamically
      creator: "Oliver Buchtala", // derive dynamically
      collaborators: ["Matthias Zauner", "Samo Korosec"],
      publications: ["Conspiracy Theories"] // derive dynamically
    });

    this.library.exec(op1);
    this.library.exec(op2);
  },

  "Get document entries from library", function() {
    var doc1 = this.library.getEntry('document_1');
    var doc2 = this.library.getEntry('document_2');

    assert.isEqual('Document 1', doc1.title);
    assert.isEqual('Document 2', doc2.title);
  },

  "Create collection my_documents", function() {
    var op1 = Data.Graph.Create({
      id: "my_documents",
      type: "collection",
      name: "My Documents",
      documents: ["document_1", "document_2"]
    });

    this.library.exec(op1);
  },

  "Retrieve document collection", function() {
    var myDocs = this.library.getCollection('my_documents');

    console.log('MYDOCS', myDocs);

  }

];

root.Substance.registerTest(['Library', 'Library Usage'], test);

})(this);
