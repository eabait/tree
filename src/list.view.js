var ListView = (function (BaseView) {
  'use strict';

  return BaseView.extend({

    name: 'ListView',

    items: [],

    constructor: function() {
      ListView.__super__.constructor.apply(this, arguments);
      this.model.on('reset', this.render, this);

      if (!this.options.itemView) {
        throw new Error('Hari UI: an ItemView constructor function must be provided');
      }

      this.ItemViewConstructor = this.options.itemView;

      this.before('load', function() {
          this.$el.html('<p>Loading...</p>'); //removed on doRender
        }, this);
    },

    defaultAction : function() {
      this.load();
    },

    doLoad : function() {
      return this.model.fetch();
    },

    doRender : function() {
      var itemView;
      var item;
      var that = this;

      this.$el.empty();

      this.model.each(function(m) {
        itemView = new that.ItemViewConstructor({
          model: m
        });
        that.items.push(itemView);

        item = $(that.cachedTemplate()).appendTo(that.$el);
        itemView.setElement(item);
        itemView.render();
      });
    },

    disposal : function() {
      BaseView.prototype.disposal.apply(this);
      for (var i = 0, l = this.items.length; i < l; i++) {
        this.items[i].dispose();
      }
      delete this.items;
    }
  });

}(BaseView));
