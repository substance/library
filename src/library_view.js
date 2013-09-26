"use strict";

var _ = require("underscore");
var util = require('substance-util');
var html = util.html;
var View = require("substance-application").View;
var CollectionView = require("./collection_view");
var $$ = require("substance-application").$$;


// Substance.Library.View
// ==========================================================================
//
// The Substance Document Editor

var LibraryView = function(libraryCtrl) {
  View.call(this);

  this.$el.addClass('library-view');
  this.libraryCtrl = libraryCtrl;
};

LibraryView.Prototype = function() {

  // Rendering
  // --------
  //
  // .collection-toggles
  //    .toggle-collection
  // .collection

  this.render = function() {
    var collections = this.libraryCtrl.library.collections;
    // var activeCollection = this.libraryCtrl.collection;

    var collectionToggles = $$('.collections', {
      children: _.map(collections, function(c) {
        return $$('a', {
          id: "collection_"+c.id,
          class: "collection", // +(active() ? " active": "")
          href: "#"+c.id,
          children: [
            $$('.name', {text: c.name}),
            $$('.count', {text: c.records.length + " documents"})
          ]
        });
      })
    });

    this.el.appendChild(collectionToggles);


    return this;
  };


  this.dispose = function() {
    this.stopListening();
  };
};

LibraryView.Prototype.prototype = View.prototype;
LibraryView.prototype = new LibraryView.Prototype();

module.exports = LibraryView;
