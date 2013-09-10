var BaseView = (function (_, Backbone) {
  'use strict';

  return Backbone.View.extend({

    channel: null,

    subscriptions: [],

    initialize: function() {
      if (!this.template &&
        (!this.options.template || !_.isString(this.options.template))) {
        throw new Error('All views must specify their template at creation');
      } else {
        this.template = this.template ? this.template : this.options.template;
      }

      this.channel = this.options.channel;
      this.subscriptions = [];

      _.bindAll(this, 'beforeRender', 'render', 'afterRender');
      var _this = this;
      this.render = _.wrap(this.render, function(render) {
        _this.beforeRender();
        render();
        _this.afterRender();
        return _this;
      });
    },

    compileTemplate: function() {

    },

    getTemplate: function() {

    },

    render: function() {
      var data = this.options.data || {};
      var templateFunction;

      if (this.model) {
        data = this.model.toJSON();
      }

      if (this.template in JST) {
        templateFunction = JST[this.template];
        this.$el.html(templateFunction(data));
      } else {
        this.$el.html(this.template);
      }
    },

    // load: function(config) {
    //   if (this.model) {
    //     this.loadRender();
    //     this.model.fetch();
    //   } else {
    //     this.render();
    //   }
    // },

    // loadRender: function() {
    //   this.$el.html('<p>Loading widget..</p>');
    // },

    defaultAction: function() {
      this.render();
    },

    beforeRender: function() {
    },

    afterRender: function() {
    },

    subscribe: function(topic, callback) {
      var subscription = this.channel.subscribe(topic, callback);
      this.subscriptions.push(subscription);
    },

    publish: function(topic, data) {
      this.channel.publish(topic, data);
    },

    unsubscribeAll: function() {
      _.each(this.subscriptions, function(subscription) {
        subscription.unsubscribe();
      });
    },

    dispose: function() {
      this.$el.empty(); //remove from DOM

      if (this.model) {
        this.model.off();
      }

      this.unsubscribeAll();
    }
  });

}(_, Backbone));
