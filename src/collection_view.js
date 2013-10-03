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
  // .collection-view
  //   .records
  //     .title
  //     .authors

  this.render = function() {

    // Render the collection
    var collection = this.collectionCtrl.collection;
    var records = collection.records;

    // Collection metadata
    // ----------

    this.el.appendChild($$('.collection', {
      children: [
        $$('.name', {text: collection.name}),
        $$('.description', {text: collection.description}),
        $$('img.teaser', {src: collection.image})
      ]
    }));


    // Collection records
    // ----------

    var recordsEl = $$('.records');

    // Sort by published_on date
    records = _.sortBy(records, function(record){ 
      return record.published_on;
    });

    // Flip the array
    records.reverse();

    _.each(records, function(record) {
      var children = [];
      var dateStr;

      // Publish date (if available)
      // ----------

      if (record.published_on) {
        children.push($$('.date', {
          text: new Date(record.published_on).toDateString()
        }));
      }

      // Title
      // ----------

      children.push($$('a.title', {
        href: "#"+collection.id+"/"+record.id,
        text: record.title 
      }));

      // Authors
      // ----------

      children.push($$('.authors', { 
        html: record.authors.join(', ')
      }));

      recordsEl.appendChild($$('.record', {
        children: children
      }));

    }, this);

    this.el.appendChild(recordsEl);
    return this;
  };

  this.dispose = function() {
    this.stopListening();
  };
};

CollectionView.Prototype.prototype = View.prototype;
CollectionView.prototype = new CollectionView.Prototype();

module.exports = CollectionView;
