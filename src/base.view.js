var Tree = Tree || {};

Tree.BaseView = (function (_, Backbone) {
  'use strict';

  return Backbone.View.extend({

    /**
     * View's template id
     * @type {String}
     */
    template: '',

    /**
     * View's loading template id
     * @type {String}
     */
    loadingTemplate: '',

    /**
     * Compiled templates cache
     * @type {Object}
     */
    compiledTemplates: {},

    /**
     * bindModelWith this property will be used to bind view's render
     * method to fetch calls to its model
     * @type {String}
     */
    bindModelWith: 'sync',

    /**
     * Main view action. Layout managers will use this property to know
     * which method (render, load) to use when rendering the view as part
     * of a composite view
     */
    action: 'render',

    /**
     * Human readable view identifier, like CartView, or BookView
     * @type {String}
     */
    name: null,

    /**
     * @constructor
     */
    initialize: function() {
      this.template = this.options.template || this.template;
      this.loadingTemplate = this.options.loadingTemplate || this.loadingTemplate;
      this.action = this.options.action || this.action;
      this.bindModelWith = this.options.bindModelWith || this.bindModelWith;
      this.name = this.options.name || this.name;

      this.compiledTemplates = {};

      _.bindAll(this, 'beforeRender', 'render', 'afterRender');
      this.render = _.wrap(this.render, function(render) {
        this.beforeRender();
        render();
        this.afterRender();
        return this;
      });
    },

    /**
     * Returns view's id. Useful for debugging
     * @return {String} view's id
     */
    getId: function() {
      return this.name || this.cid;
    },

    /**
     * Hook method. Compiles a template. Override if a compilation step
     * is needed for templates.
     *
     * @param  {String} template Template to be rendered
     * @return {Function}        Compiled template function
     */
    compileTemplate: function(template) {
      return template;
    },

    /**
     * Hook method. Override if templates will be
     * fetched from DOM, or server.
     * Default implementation relies on a JST object
     *
     * @param {String} templateId  Template id to be fetched
     * @return {String | Function} May return a Function if templates are
     *                   already compiled and stored in a JST object.
     *                   Or strings if they are fetched from DOM or server.
     */
    fetchTemplate: function(templateId) {
      return templateId;
    },

    /**
     * Template method to get a template. Relies on fetchTemplate to fetch
     * the template, and compileTemplate to compile it.
     * Caches compiled template into this.compiledTemplate.
     *
     * @param  {String}   templateId Template identifier
     * @return {Function} returns a compiled template
     */
    getTemplate: function(templateId) {
      if (!this.compiledTemplates.hasOwnProperty(templateId)) {
        this.compiledTemplates[templateId] = this.compileTemplate(this.fetchTemplate(templateId));
      }
      return this.compiledTemplates[templateId];
    },

    /**
     * Hook method to define how to add view elements in the DOM
     */
    createDomElements: function(elements) {
      this.$el.html(elements);
    },

    /**
     * Default render method. Relies on getTemplate, and createDomElements
     * @return {[type]} [description]
     */
    render: function() {
      var data = this.options.data || {};
      if (this.model) {
        data = this.model.toJSON();
      }
      this.createDomElements(this.getTemplate(this.template)(data));
      return this;
    },

    /**
     * To be called before render method
     * @return {Object} return this
     */
    beforeRender: function() {
    },

    /**
     * To be called after render method
     * @return {Object} return this
     */
    afterRender: function() {
    },

    /**
     * Default load method. Calls the fetch method on the view's model.
     * If loadingTemplate has been set, then renders a loading
     * template
     *
     * @return {Promise} returns a promise object on the request
     */
    load: function(options) {
      if (!this.bindModelWith) {
        throw new Error('Tree error. View ' + this.getId() +
          ' requires a bindModelWith property to be set');
      }
      this.listenTo(this.model, this.bindModelWith, this.render);

      if (this.loadingTemplate) {
        this.renderLoadingView(this.loadingTemplate);
      }

      return this.model.fetch(options);
    },

    /**
     * Renders the loading template.
     * @param  {[type]} loadingTemplateId [description]
     * @return {[type]}                   [description]
     */
    renderLoadingView: function(loadingTemplateId) {
      this.createDomElements(this.getTemplate(loadingTemplateId)());
      return this;
    },

    /**
     * Disposes the view.
     */
    dispose: function() {
      if (this.model) {
        this.model.off();
        this.stopListening();
      }
      this.remove();
    },

    toString: function() {
      return '[tree view ' + this.getId() + ' ]';
    }
  });

}(_, Backbone));
