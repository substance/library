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

    // Sort by published_on date
    collections = _.sortBy(collections, function(c) {
      return c.updated_at;
    });

    // Flip the array
    collections.reverse();

    var collectionToggles = $$('.collections', {
      children: _.map(collections, function(c) {
        return $$('div', {
          id: "collection_"+c.id,
          class: "collection",
          children: [
            $$('a.name', {href: "#"+c.id, text: c.name}),
            $$('.description', {text: c.description}),
            $$('img.teaser', {src: c.image}),
            $$('.count', {text: c.records.length + " documents"})
          ]
        });
      })
    });

    var children = [];
    children.push($$('div.title', {text: "Substance"}));
    children.push($$('div.description', {text: "Towards open digital publishing."}));

    children.push(
      $$('.links', {
        children: [
          $$('a.learn-more', {href: "#substance/about", text: "Learn more"})
        ]
      })
    );

    var teaser = $$('div.library-info', {
      children: [$$('div.inner', {
        children: children
      })]
    });

    this.el.appendChild(teaser);

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
