Tree.GridView = (function (BaseView) {
  'use strict';

  return BaseView.extend({

    // subviews: [],

    // initialize: function() {
    //   BaseView.prototype.initialize.apply(this, arguments);
    //   this.subviews = [];
    // },

    // initPackery: function(options) {
    //   var container = document.querySelector('.' + options.root);

    //   window.pckry = new Packery(container, {
    //     itemSelector: '.' + options.item,
    //     columnWidth: '.' + options.size,
    //     rowHeight: '.' + options.size,
    //     gutter: options.gutter
    //   });
    // },

    // hasView: function(view) {
    //   var i;
    //   var length;
    //   var exists = false;
    //   for (i = 0, length = this.subviews.length; i < length && !exists; ++i) {
    //     if (this.subviews[i].cid === view.cid) {
    //       exists = true;
    //     }
    //   }
    //   return exists;
    // },

    // addView: function(view) {
    //   var insert = !this.hasView(view);
    //   if (insert) {
    //     this.subviews.push(view);
    //   }
    //   return insert;
    // },

    // getFirstView: function() {
    //   return this.subviews[1];
    // },

    // render: function() {
    //   var i;
    //   var length;

    //   BaseView.prototype.render.apply(this, arguments);
    //   this.initPackery(this.options);

    //   Utils.timedChunk(this.subviews, this.renderView, this, function() {});

    //   return this;
    // },

    // renderView: function(view) {
    //   var template = '<article id="' + view.cid + '" class="' +
    //   this.options.item + '"></article>';
    //   var currentView =
    //   $(template)
    //   .appendTo(this.$el.find('.' + this.options.root));

    //   view.setElement(currentView);
    //   view.defaultAction();

    //   window.pckry.appended(currentView[0]);

    //   var draggie = new Draggabilly(currentView[0], {
    //     handle: '.' + this.options.handle
    //   });

    //   window.pckry.bindDraggabillyEvents(draggie);
    // },

    // append: function(view) {
    //   if (this.addView(view)) {
    //     this.renderView(view);
    //   }
    // },

    // dispose: function() {
    //   var i;
    //   var length;

    //   BaseView.prototype.dispose.apply(this, arguments);

    //   for (i = 0, length = this.subviews.length; i < length; ++i) {
    //     this.subviews[i].dispose();
    //   }

    //   this.subviews.length = 0;
    //   delete this.subviews;

    //   window.pckry.destroy();
    // }
  });

}(Tree.BaseView));