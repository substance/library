"use strict";

var _ = require("underscore");
var util = require('substance-util');
var html = util.html;
var View = require("substance-application").View;
var $$ = require("substance-application").$$;

// Substance.Collection.View
// ==========================================================================
//
// The Substance Collection display

var CollectionView = function(collectionCtrl) {
  View.call(this);

  this.$el.addClass('collection-view');
  this.collectionCtrl = collectionCtrl;
};

CollectionView.Prototype = function() {

  // Rendering
  // --------
  //
  // .collection
  //   .title

  this.render = function() {


    // Render the collection
    var collection = this.collectionCtrl.collection;
    var records = collection.records;
    console.log(this.collectionCtrl);

    _.each(records, function(record) {
      this.el.appendChild($$('a.document', {
        href: "#"+collection.id+"/"+record.id,
        children: [
          $$('.title', { text: record.title }),
          $$('.authors', { text: record.authors.join(', ') }),
        ]
      }));
    }, this);
    return this;
  };

  this.dispose = function() {
    this.stopListening();
  };
};

CollectionView.Prototype.prototype = View.prototype;
CollectionView.prototype = new CollectionView.Prototype();

module.exports = CollectionView;
