Tree.ListView = (function(BaseView, _) {
  'use strict';

  return BaseView.extend({

    modelToViewMap: {},

    listItemWrapper: 'li',

    itemView: null,

    bindOn: 'reset',

    initialize: function() {
      BaseView.prototype.initialize.apply(this, arguments);

      if (!this.options.itemView) {
        throw new Error('Tree error. View ' + this.getId() + ' requires an ' +
          'itemView to be passed to the constructor in the config object');
      }

      this.itemView = this.options.itemView;
      this.listItemWrapper= this.options.listItemWrapper || this.listItemWrapper;

      this.listenTo(this.model, 'reset', this.render);
      this.listenTo(this.model, 'add', this.onAddedModel);
      this.listenTo(this.model, 'remove', this.onRemovedModel);
    },

    at: function(subViewIndex) {
      var subViews = _.values(this.modelToViewMap);
      return (subViews.length) ? subViews[subViewIndex] : null;
    },

    render: function() {
      var elementsToRender = '';

      this.model.each(_.bind(function(model, index) {

        var subView = new this.itemView({
          model: model
        });

        elementsToRender += this.makeItemViewElements(subView);

        this.modelToViewMap[model.id] = subView;

      }, this));

      this.createDomElements(elementsToRender);

      return this;
    },

    makeItemViewElements: function(subView) {
      return '<' + this.listItemWrapper + '>' + subView.getElementsToRender() +
        '</' + this.listItemWrapper + '>';
    },

    onAddedModel: function(model) {
      var subView = new this.itemView({
          model: model
      });
      var elementsToRender = '';
      elementsToRender += this.makeItemViewElements(subView);
      this.modelToViewMap[model.id] = subView;
      this.$el
        .append(elementsToRender);
    },

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