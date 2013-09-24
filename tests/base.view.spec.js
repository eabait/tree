describe('BaseView', function() {
  'use strict';


  describe('base.view test suite', function() {
    var view1;

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
            console.log('subscribed');
          },
          publish: function(topic, data) {
            console.log('publish');
          },
          unsubscribeAll: function() {
            console.log('unsubscribed from all');
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

    // it('can subscribe to a channel', function() {
    //   var message;
    //   view1.channel = postal.channel('test');

    //   view1.subscribe('sayHello', function(data) {
    //     message = data;
    //   });

    //   postal.publish({
    //     channel: 'test',
    //     topic: 'sayHello',
    //     data: 'Hello'
    //   });

    //   waitsFor(function() { return message; });

    //   runs(function() {
    //     expect(message).toBe('Hello');
    //   });
    // });

    // it('can publish messages to a channel', function() {
    //   var message;
    //   view1.channel = postal.channel('test');

    //   var sub = postal.subscribe({
    //     channel: 'test',
    //     topic: 'sayHello',
    //     callback: function(data) {
    //       message = data;
    //     }
    //   });

    //   view1.publish('sayHello', 'Hello');

    //   waitsFor(function() { return message; });

    //   runs(function() {
    //     expect(message).toBe('Hello');
    //   });
    // });
  });

});