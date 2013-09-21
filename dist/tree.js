var BaseView = function(a, b) {
    "use strict";
    return b.View.extend({
        channel: null,
        subscriptions: [],
        initialize: function() {
            if (!this.template && (!this.options.template || !a.isString(this.options.template))) {
                throw new Error("All views must specify their template at creation");
            } else {
                this.template = this.template ? this.template : this.options.template;
            }
            var b = this;
            this.channel = this.options.channel;
            a.bindAll(this, "beforeRender", "render", "afterRender");
            this.render = a.wrap(this.render, function(a) {
                b.beforeRender();
                a();
                b.afterRender();
                return b;
            });
        },
        render: function() {
            var b = this.options.data, c;
            if (this.model) {
                b = this.model.toJSON();
            }
            var d = a.template(this.template, b);
            this.$el.html(d);
        },
        defaultAction: function() {
            this.render();
        },
        subscribe: function(a, b) {
            var c = this.channel.subscribe(a, b);
            this.subscriptions.push(c);
        },
        publish: function(a, b) {
            this.channel.publish(a, b);
        },
        unsubscribeAll: function() {
            a.each(this.subscriptions, function(a) {
                a.unsubscribe();
            });
        },
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
}(_, Backbone);

var ContainerView = function(a) {
    "use strict";
    return a.extend({
        regions: {},
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
                b.defaultAction();
            } else {
                throw new Error("There is no view mapped to region " + a);
            }
        },
        render: function() {
            a.prototype.render.apply(this, arguments);
            for (var b in this.regions) {
                this.showView(b);
            }
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
}(BaseView);

var GridView = function(a) {
    "use strict";
    return a.extend({
        subviews: [],
        initialize: function() {
            a.prototype.initialize.apply(this, arguments);
            this.subviews = [];
        },
        initPackery: function(a) {
            var b = document.querySelector("." + a.root);
            window.pckry = new Packery(b, {
                itemSelector: "." + a.item,
                columnWidth: "." + a.size,
                rowHeight: "." + a.size,
                gutter: a.gutter
            });
        },
        hasView: function(a) {
            var b;
            var c;
            var d = false;
            for (b = 0, c = this.subviews.length; b < c && !d; ++b) {
                if (this.subviews[b].cid === a.cid) {
                    d = true;
                }
            }
            return d;
        },
        addView: function(a) {
            var b = !this.hasView(a);
            if (b) {
                this.subviews.push(a);
            }
            return b;
        },
        getFirstView: function() {
            return this.subviews[1];
        },
        render: function() {
            var b;
            var c;
            a.prototype.render.apply(this, arguments);
            this.initPackery(this.options);
            Utils.timedChunk(this.subviews, this.renderView, this, function() {});
            return this;
        },
        renderView: function(a) {
            var b = '<article id="' + a.cid + '" class="' + this.options.item + '"></article>';
            var c = $(b).appendTo(this.$el.find("." + this.options.root));
            a.setElement(c);
            a.defaultAction();
            window.pckry.appended(c[0]);
            var d = new Draggabilly(c[0], {
                handle: "." + this.options.handle
            });
            window.pckry.bindDraggabillyEvents(d);
        },
        append: function(a) {
            if (this.addView(a)) {
                this.renderView(a);
            }
        },
        dispose: function() {
            var b;
            var c;
            a.prototype.dispose.apply(this, arguments);
            for (b = 0, c = this.subviews.length; b < c; ++b) {
                this.subviews[b].dispose();
            }
            this.subviews.length = 0;
            delete this.subviews;
            window.pckry.destroy();
        }
    });
}(BaseView);

var ListView = function(a) {
    "use strict";
    return a.extend({
        name: "ListView",
        items: [],
        constructor: function() {
            ListView.__super__.constructor.apply(this, arguments);
            this.model.on("reset", this.render, this);
            if (!this.options.itemView) {
                throw new Error("Hari UI: an ItemView constructor function must be provided");
            }
            this.ItemViewConstructor = this.options.itemView;
            this.before("load", function() {
                this.$el.html("<p>Loading...</p>");
            }, this);
        },
        defaultAction: function() {
            this.load();
        },
        doLoad: function() {
            return this.model.fetch();
        },
        doRender: function() {
            var a;
            var b;
            var c = this;
            this.$el.empty();
            this.model.each(function(d) {
                a = new c.ItemViewConstructor({
                    model: d
                });
                c.items.push(a);
                b = $(c.cachedTemplate()).appendTo(c.$el);
                a.setElement(b);
                a.render();
            });
        },
        disposal: function() {
            a.prototype.disposal.apply(this);
            for (var b = 0, c = this.items.length; b < c; b++) {
                this.items[b].dispose();
            }
            delete this.items;
        }
    });
}(BaseView);

var StackedView = function(a) {
    "use strict";
    return a.extend({
        name: "StackedView",
        viewMap: {},
        active: null,
        constructor: function() {
            this.data = {};
            this.viewMap = {};
            this.template = "<div></div>";
            StackedView.__super__.constructor.apply(this, arguments);
        },
        addView: function(a, b) {
            this.viewMap[a.cid] = a;
            this.active = b ? a : this.active;
        },
        showView: function(a) {
            var b = this.viewMap[a];
            var c = "wrapper-" + b.cid;
            var d = $("#" + c);
            if (!this.is("started")) {
                d.css("display", "none");
                this.active.$el.css("display", "none");
                this.active.hide();
                this.active = b;
            }
            if (b.can("render")) {
                this.$el.append(this.cachedTemplate({
                    id: c
                }));
                b.setElement("#" + c);
                b.defaultAction();
            } else {
                if (b.can("show")) {
                    d.css("display", "block");
                    b.show();
                } else {
                    throw new Error("Hari UI: View " + b.cid + " is in a state that cannot be displayed: " + b.fsm.current);
                }
            }
        },
        doRender: function() {
            if (!this.active) {
                throw new Error("Hari UI: there is no active view to be displayed");
            }
            this.showView(this.active.cid);
        },
        disposal: function() {
            a.prototype.disposal.apply(this);
            for (var b in this.regions) {
                this.viewMap[b].dispose();
            }
        }
    });
}(BaseView);