var Tree = Tree || {};

Tree.BaseView = function(a, b) {
    "use strict";
    return b.View.extend({
        template: "",
        loadingTemplate: "",
        compiledTemplates: {},
        bindOn: "sync",
        action: "render",
        name: null,
        jst: null,
        initialize: function(b) {
            this.options = b;
            this.template = this.options.template || this.template;
            this.loadingTemplate = this.options.loadingTemplate || this.loadingTemplate;
            this.action = this.options.action || this.action;
            this.bindOn = this.options.bindOn || this.bindOn;
            this.name = this.options.name || this.name;
            this.jst = this.options.jst || this.jst;
            this.compiledTemplates = {};
            a.bindAll(this, "beforeRender", "render", "afterRender");
            this.render = a.wrap(this.render, function(a) {
                this.beforeRender();
                a();
                this.afterRender();
                return this;
            });
        },
        getId: function() {
            return this.name || this.cid;
        },
        compileTemplate: function(a) {
            return a;
        },
        fetchTemplate: function(a) {
            return this.jst && this.jst[a] ? this.jst[a] : a;
        },
        getTemplate: function(a) {
            if (!this.compiledTemplates.hasOwnProperty(a)) {
                this.compiledTemplates[a] = this.compileTemplate(this.fetchTemplate(a));
            }
            return this.compiledTemplates[a];
        },
        createDomElements: function(a) {
            this.$el.html(a);
        },
        render: function() {
            var a = this.options.data || {};
            if (this.model) {
                a = this.model.toJSON();
            }
            this.createDomElements(this.getTemplate(this.template)(a));
            return this;
        },
        beforeRender: function() {},
        afterRender: function() {},
        load: function(a) {
            if (!this.bindOn) {
                throw new Error("Tree error. View " + this.getId() + " requires a bindOn property to be set");
            }
            this.listenTo(this.model, this.bindOn, this.render);
            if (this.loadingTemplate) {
                this.renderLoadingView(this.loadingTemplate);
            }
            return this.model.fetch(a);
        },
        renderLoadingView: function(a) {
            this.createDomElements(this.getTemplate(a)());
            return this;
        },
        dispose: function() {
            if (this.model) {
                this.model.off();
                this.stopListening();
            }
            this.remove();
        },
        toString: function() {
            return "[tree view " + this.getId() + " ]";
        }
    });
}(_, Backbone);

Tree.ContainerView = function(a) {
    "use strict";
    return a.extend({
        regions: null,
        initialize: function() {
            a.prototype.initialize.apply(this, arguments);
            this.regions = {};
        },
        addView: function(a, b) {
            if (this.regions[a]) {
                this.regions[a].dispose();
            }
            this.regions[a] = b;
            b.el = a;
        },
        showView: function(a) {
            var b = this.regions[a];
            if (b) {
                b.setElement(a);
                b[b.action]();
            } else {
                throw new Error("Tree error. There is no view mapped to region " + a);
            }
        },
        render: function() {
            a.prototype.render.apply(this, arguments);
            for (var b in this.regions) {
                this.showView(b);
            }
            return this;
        },
        disposeViews: function() {
            for (var a in this.regions) {
                this.regions[a].dispose();
                delete this.regions[a];
            }
            this.regions = {};
            delete this.regions;
        },
        dispose: function() {
            a.prototype.dispose.apply(this, arguments);
            this.disposeViews();
        }
    });
}(Tree.BaseView);