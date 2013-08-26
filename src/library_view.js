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

  this.$el.addClass('library');
  this.libraryCtrl = libraryCtrl;

  this.collectionView = new CollectionView(libraryCtrl);
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
    var activeCollection = this.libraryCtrl.collection;


    var collectionToggles = $$('.collection-toggles', {
      children: _.map(collections, function(c) {
        function active() {
          return c.id === activeCollection.id;
        }

        return $$('a', {
          id: "collection_toggle_"+c.id,
          class: "toggle-collection"+(active() ? " active": ""),
          href: "#"+c.id,
          text: c.name
        })
      })
    });

    this.el.appendChild(collectionToggles);

    // Container for collection view
    this.el.appendChild($$('.collection'));

    // Render current collection
    this.$('.collection').replaceWith(this.collectionView.render().el);
    return this;
  };


  this.dispose = function() {
    this.stopListening();
  };
};

LibraryView.Prototype.prototype = View.prototype;
LibraryView.prototype = new LibraryView.Prototype();

module.exports = LibraryView;
