Tree.ListView = (function(BaseView, _) {
  'use strict';

  return BaseView.extend({

    modelToViewMap: {},

    itemView: null,

    bindOn: 'reset',

    /**
     * Initialize the ListView instance with the passed options
     */
    initialize: function() {
      BaseView.prototype.initialize.apply(this, arguments);

      if (!this.options.itemView) {
        throw new Error('Tree error. View ' + this.getId() + ' requires an ' +
          'itemView to be passed to the constructor in the config object');
      }

      this.itemView = this.options.itemView;

      this.listenTo(this.model, 'reset', this.render);
      this.listenTo(this.model, 'add', this.onAddedModel);
      this.listenTo(this.model, 'remove', this.onRemovedModel);
    },

    /**
     * Returns the view at a given index
     * @param  {Number} subViewIndex Index
     * @return {Object}              View stored at index
     */
    at: function(subViewIndex) {
      var subViews = _.values(this.modelToViewMap);
      return (subViews.length) ? subViews[subViewIndex] : null;
    },

    /**
     * @Override Tree.BaseView
     * Will be called when the associated collection triggers
     * a <i>reset</i> event
     */
    render: function() {
      this.beforeRender();
      this.$el.empty();

      this.model.each(_.bind(function(model, index) {

        var subView = new this.itemView({
          model: model
        });

        this.$el.append(subView.render().$el);

        this.modelToViewMap[model.id] = subView;

      }, this));

      this.afterRender();
      return this;
    },

    /**
     * Used to add a new view item each time a model
     * is added to the collection
     * @param  {Object} model Inserted Backbone.Model
     */
    onAddedModel: function(model) {
      var subView = new this.itemView({
          model: model
      });
      this.modelToViewMap[model.id] = subView;
      this.$el
        .append(subView.render().$el);
    },

    /**
     * Used to remove a view, once its associated model
     * has been removed from the collection
     * @param  {Object} model Removed Backbone.Model
     */
    onRemovedModel: function(model) {
      var viewToRemove = this.modelToViewMap[model.id];
      if (viewToRemove) {
        viewToRemove.remove();
        delete this.modelToViewMap[model.id];
      } else {
        throw new Error('Tree error. View ' + this.getId() + ' is trying to remove ' +
          'a subView that does not exists');
      }
    },

    /**
     * @Override Tree.BaseView
     */
    dispose: function() {
      BaseView.prototype.dispose.apply(this, arguments);

      for (var modelId in this.modelToViewMap) {
        this.modelToViewMap[modelId].dispose();
        delete this.modelToViewMap[modelId];
      }

      this.modelToViewMap = {};
      delete this.modelToViewMap;
    }

  });

}(Tree.BaseView, _));