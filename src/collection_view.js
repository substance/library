"use strict";

var _ = require("underscore");
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
    this.el.innerHTML = "";

    // Render the collection
    var collection = this.collectionCtrl.collection;
    var records = collection.getRecords();

    // Collection metadata
    // ----------

    // this.el.appendChild($$('a.back-nav', {
    //   'href': '#',
    //   'title': 'Go back',
    //   'html': '<i class=" icon-chevron-up"></i>'
    // }));

    this.el.appendChild($$('.collection', {
      children: [
        $$('.inner', {
          children: [
            $$('.path', {
              children: [
                $$('a.back', {href: '#', text: "Substance"}),
                $$('span.sep', {html: "&middot;"}),
                $$('span.name', {text: collection.name}),
              ]
            }),
            $$('.description', {text: collection.description}),
            $$('img.teaser', {src: collection.image}),

          ]
        })
      ]
    }));

    // Collection records
    // ----------

    var recordsEl = $$('.records');

    // Experimental: entry to create a new document
    if (collection.isEditable) {
      var newDoc = $$('a.title', {
        href: "#"+collection.id+"/new",
        text: "Create Document"
      });
      recordsEl.appendChild($$('.record', {
        children: [newDoc]
      }));
    }

    // Sort by published_on date
    records = _.sortBy(records, function(record){
      return record.published_on;
    });

    // Flip the array
    records.reverse();

    var self = this;
    _.each(records, function(record) {

      // Publish date (if available)
      // ----------
      var recordEl = $$('.record');
      var content = $$('.content');

      if (record.published_on) {
        content.appendChild($$('.date', {
          text: new Date(record.published_on).toDateString()
        }));
      }

      // Title
      // ----------

      content.appendChild($$('a.title', {
        href: "#"+collection.id+"/"+record.id,
        text: record.title
      }));

      // Authors
      // ----------

      content.appendChild($$('.authors', {
        html: record.authors.join(', ')
      }));

      recordEl.appendChild(content);

      if (collection.isEditable) {
        var controls = $$('.controls');
        var deleteEl = $$('i.delete.icon-trash', {
          title: "Delete Document"
        });
        deleteEl.onclick = function(e) {
          self.collectionCtrl.deleteDocument(record.id);
        };
        controls.appendChild(deleteEl);
        recordEl.appendChild(controls);
      }

      recordsEl.appendChild(recordEl);
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
