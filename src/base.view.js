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

      if ((!this.options.pubsub) || (_.difference(_.keys(this.options.pubsub), ['subscribe', 'publish', 'unsubscribeAll']).length !== 0)) {
        throw new Error('All views must specify their own pubsub methods (subscribe, publish, unsubscribeAll).');
      } else {
        this.subscribe = this.options.pubsub.subscribe;
        this.publish = this.options.pubsub.publish;
        this.unsubscribeAll = this.options.pubsub.unsubscribeAll;
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
     * Executes before rendering the view.
     */
    beforeRender: function() {},

    /**
     * Renders the current view in the specified template.
     */
    render: function() {
      var data = this.options.data,
          templateFunction;

      if (this.model) {
        data = this.model.toJSON();
      }

      this.compileTemplate();
      this.$el.html(this.getTemplate(data));
    },

    /**
     * Executes after rendering the view.
     */
    afterRender: function() {},

    /**
     * This should be redefined by the extended class. It should compile the raw template into
     * a javascript function.
     */
    compileTemplate: function() {
    },

    /**
     * This should be redefined by the extended class. It should take the compiled template and
     * attach the parameters, if any, and return the output.
     * @param  {[object]} data The data that we want to send to the template.
     */
    getTemplate: function(data) {
      return _.template(this.template, data);
    },

    /**
     * Default action of the view.
     */
    defaultAction: function() {
      this.render();
    },

    /**
     * Subscribe the view to a topic of a channel.
     */
    subscribe: function() {
    },

    /**
     * Publishes data in a postal channel.
     */
    publish: function() {
    },

    /**
     * Removes all the Postal subscriptions of the view.
     */
    unsubscribeAll: function() {
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
    }
  });

}(_, Backbone));
