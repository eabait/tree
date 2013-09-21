var BaseView = (function (_, Backbone) {
  'use strict';

  return Backbone.View.extend({

    channel: null,

    subscriptions: [],

    /**
     * Sets the configuration object and binds render sub-methods.
     */
    initialize: function() {

      if (!this.template &&
        (!this.options.template || !_.isString(this.options.template))) {
        throw new Error('All views must specify their template at creation');
      } else {
        this.template = this.template ? this.template : this.options.template;
      }

      var that = this;

      this.channel = this.options.channel;

      _.bindAll(this, 'beforeRender', 'render', 'afterRender');

      this.render = _.wrap(this.render, function(render) {
        that.beforeRender();
        render();
        that.afterRender();
        return that;
      });
    },

    /**
     * Renders the current view in the specified template.
     */
    render: function() {
      var data = this.options.data,
          templateFunction;

      if (this.model) {
        data = this.model.toJSON();
      }

      var template = _.template(this.template, data);
      this.$el.html(template);
    },

    /**
     * Default action of the view.
     */
    defaultAction: function() {
      this.render();
    },

    /**
     * Subscribe the view to a topic of a channel.
     * @param  {[type]}   topic
     * @param  {Function} callback
     * @return {[type]}
     */
    subscribe: function(topic, callback) {
      var subscription = this.channel.subscribe(topic, callback);
      this.subscriptions.push(subscription);
    },

    /**
     * Publishes data in a postal channel.
     * @param  {[type]} topic
     * @param  {[type]} data
     */
    publish: function(topic, data) {
      this.channel.publish(topic, data);
    },

    /**
     * Removes all the Postal subscriptions of the view.
     */
    unsubscribeAll: function() {
      _.each(this.subscriptions, function(subscription) {
        subscription.unsubscribe();
      });
    },

    /**
     * Disposes the view.
     */
    dispose: function() {
      this.$el.empty();

      if (this.model) {
        this.model.off();
      }

      this.unsubscribeAll();
    },

    beforeRender: function() {},

    afterRender: function() {}
  });

}(_, Backbone));
