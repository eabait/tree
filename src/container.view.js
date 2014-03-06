Tree.ContainerView = (function (BaseView) {
  'use strict';

  return BaseView.extend({

    /**
     * Regions hashmap. Associates subviews with DOM
     * elements
     * @type {Object}
     */
    regions: null,

    initialize: function() {
      BaseView.prototype.initialize.apply(this, arguments);
      this.regions = {};
    },

    /**
     * Associates a view with a region. Sets this mapping
     * into regions property.
     *
     * Disposes previously rendered views in the region.
     *
     * @param {string}   region is a selector for a DOM element
     * @param {BaseView} view   view to be rendered into the region
     */
    addView: function(region, view) {
      if (this.regions[region]) {
        this.regions[region].dispose();
      }

      this.regions[region] = view;
      view.el = region;
    },

    /**
     * Renders a view into a region
     * @param  {string} region selector for a DOM element where this view will be rendered
     * @throws {error}  If the region has no view associated
     */
    showView: function(region) {
      var view = this.regions[region];

      if (view) {
        view.setElement(region);
        view[view.action]();
      } else {
        throw new Error('Tree error. There is no view mapped to region ' + region);
      }
    },

    /**
     * Composite render.
     * 1) If () Renders a template to create the DOM elements that will serve as regions
     * 2) Renders subviews into their own region as defined in this.regions
     */
    createDomElements: function(elements) {
      BaseView.prototype.createDomElements.apply(this, arguments);

      for (var view in this.regions) {
        this.showView(view);
      }

      return this;
    },

    /**
     * Disposes all the views from the container
     */
    disposeViews: function() {
      for (var view in this.regions) {
        this.regions[view].dispose();
        delete this.regions[view];
      }

      this.regions = {};
      delete this.regions;
    },

    /**
     * Disposes this view, and all the associated subviews
     */
    dispose: function() {
      BaseView.prototype.dispose.apply(this, arguments);
      this.disposeViews();
    }

  });

}(Tree.BaseView));
