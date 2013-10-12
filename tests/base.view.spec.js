describe('BaseView', function() {
  'use strict';


  describe('base.view test suite', function() {
    var view1;

    /*! Tiny Pub/Sub - v0.7.0 - 2013-01-29
     * https://github.com/cowboy/jquery-tiny-pubsub
     * Copyright (c) 2013 "Cowboy" Ben Alman; Licensed MIT */
    (function(n){var u=n({});n.subscribe=function(){u.on.apply(u,arguments)},n.unsubscribe=function(){u.off.apply(u,arguments)},n.publish=function(){u.trigger.apply(u,arguments)}})(jQuery);

    beforeEach(function() {
      var TestModel = Backbone.Model.extend({
        testAttr1: "attr1"
      });

      view1 = new BaseView({
        tagName: 'ul',
        template: '<p>example</p>',
        model: new TestModel(),
        pubsub: {
          subscribe: function(topic, callback) {
            this.subscriptions.push(topic);
            $.subscribe(topic, callback);
          },
          publish: function(topic, data) {
            $.publish(topic, data);
          },
          unsubscribeAll: function() {
            _.each(this.subscriptions, function(topic) {
              $.unsubscribe(topic);
            });
          }
        }
      });
    });

    it('should be able to create itself', function() {
      expect(view1).not.toBeNull();
    });

    it('view DOM element has been created', function() {
      expect(view1.el).not.toBeNull();
      expect(view1.$el).not.toBeNull();
    });

    it('renders itself and creates DOM elements', function() {
      view1.render();
      expect(view1.$el).toBeDefined();
    });

    it('can subscribe to a channel', function() {
      var message;

      view1.subscribe('sayHello', function(_, data) {
        message = data;
      });

      view1.publish('sayHello', 'Hello');

      waitsFor(function() { return message; });

      runs(function() {
        expect(message).toBe('Hello');
      });
    });

    it('can publish messages to a channel', function() {
      var message;

      $.subscribe('sayHello', function(_, data) {
        message = data;
      });

      view1.publish('sayHello', 'Hello');

      waitsFor(function() { return message; });

      runs(function() {
        expect(message).toBe('Hello');
      });
    });
  });

});