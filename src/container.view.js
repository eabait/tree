var ContainerView = (function (BaseView) {
  'use strict';

  return BaseView.extend({

    regions: {},

    initialize: function() {
      BaseView.prototype.initialize.apply(this, arguments);
      this.regions = {};
    },

    addView: function(region, view) {
      if (this.regions[region]) {
        this.regions[region].dispose();
      }

      this.regions[region] = view;
      view.el = region;
    },

    showView: function(region) {
      var view = this.regions[region];

      if (view) {
        view.setElement(region);
        view.defaultAction();
      } else {
        throw new Error('There is no view mapped to region ' + region);
      }
    },


    render: function() {
      BaseView.prototype.render.apply(this, arguments);

      for (var view in this.regions) {
        this.showView(view);
      }
    },

    disposeViews: function() {
      for (var view in this.regions) {
        this.regions[view].dispose();
        delete this.regions[view];
      }

      this.regions = {};
      delete this.regions;
    },

    dispose: function() {
      BaseView.prototype.dispose.apply(this, arguments);
      this.disposeViews();
    }

  });

}(BaseView));
