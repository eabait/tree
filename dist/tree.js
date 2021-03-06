var Tree = Tree || {};

Tree.BaseView = function(a, b) {
    "use strict";
    return b.View.extend({
        template: "",
        loadingTemplate: "",
        emptyTemplate: "",
        compiledTemplates: {},
        bindOn: "sync",
        action: "render",
        name: null,
        jst: null,
        initialize: function(a) {
            this.options = a || {};
            this.template = this.options.template || this.template;
            this.loadingTemplate = this.options.loadingTemplate || this.loadingTemplate;
            this.action = this.options.action || this.action;
            this.bindOn = this.options.bindOn || this.bindOn;
            this.name = this.options.name || this.name;
            this.jst = this.options.jst || this.jst;
            this.emptyTemplate = this.options.emptyTemplate || this.emptyTemplate;
            this.compiledTemplates = {};
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
        getElementsToRender: function() {
            var a = this.options.data || {};
            if (this.model) {
                a = this.model.toJSON();
            }
            return this.getTemplate(this.template)(a);
        },
        createDomElements: function(a) {
            this.$el.html(a);
        },
        render: function() {
            this.beforeRender();
            this.createDomElements(this.getElementsToRender());
            this.afterRender();
            return this;
        },
        beforeRender: function() {},
        afterRender: function() {},
        load: function(a) {
            if (!this.bindOn) {
                throw new Error("Tree error. View " + this.getId() + " requires a bindOn property to be set");
            }
            this.model.off(this.bindOn, this.render);
            this.listenTo(this.model, this.bindOn, this.render);
            if (this.loadingTemplate) {
                this.renderLoadingView();
            }
            return this.model.fetch(a);
        },
        renderLoadingView: function() {
            this.createDomElements(this.getTemplate(this.loadingTemplate)());
            return this;
        },
        noOp: function() {
            if (this.emptyTemplate) {
                this.renderEmptyView();
            }
            return this;
        },
        renderEmptyView: function() {
            this.createDomElements(this.getTemplate(this.emptyTemplate)());
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
        createDomElements: function(b) {
            a.prototype.createDomElements.apply(this, arguments);
            for (var c in this.regions) {
                this.showView(c);
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

Tree.ListView = function(a, b) {
    "use strict";
    return a.extend({
        modelToViewMap: {},
        itemView: null,
        bindOn: "reset",
        initialize: function() {
            a.prototype.initialize.apply(this, arguments);
            if (!this.options.itemView) {
                throw new Error("Tree error. View " + this.getId() + " requires an " + "itemView to be passed to the constructor in the config object");
            }
            this.itemView = this.options.itemView;
            this.listenTo(this.model, "reset", this.render);
            this.listenTo(this.model, "add", this.onAddedModel);
            this.listenTo(this.model, "remove", this.onRemovedModel);
        },
        at: function(a) {
            var c = b.values(this.modelToViewMap);
            return c.length ? c[a] : null;
        },
        render: function() {
            this.beforeRender();
            this.$el.empty();
            this.model.each(b.bind(function(a, b) {
                var c = new this.itemView({
                    model: a
                });
                this.$el.append(c.render().$el);
                this.modelToViewMap[a.id] = c;
            }, this));
            this.afterRender();
            return this;
        },
        onAddedModel: function(a) {
            var b = new this.itemView({
                model: a
            });
            this.modelToViewMap[a.id] = b;
            this.$el.append(b.render().$el);
        },
        onRemovedModel: function(a) {
            var b = this.modelToViewMap[a.id];
            if (b) {
                b.remove();
                delete this.modelToViewMap[a.id];
            } else {
                throw new Error("Tree error. View " + this.getId() + " is trying to remove " + "a subView that does not exists");
            }
        },
        dispose: function() {
            a.prototype.dispose.apply(this, arguments);
            for (var b in this.modelToViewMap) {
                this.modelToViewMap[b].dispose();
                delete this.modelToViewMap[b];
            }
            this.modelToViewMap = {};
            delete this.modelToViewMap;
        }
    });
}(Tree.BaseView, _);