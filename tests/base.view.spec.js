describe('BaseView', function() {
  'use strict';


  describe('Creating a base.view', function() {
    var view1;

    beforeEach(function() {
      var TestModel = Backbone.Model.extend({
        testAttr1: "attr1"
      });

      view1 = new BaseView({
        tagName: 'ul',
        template: '<p>example</p>',
        model: new TestModel()
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
  });

  describe('Subscription', function() {
    var view1;

    beforeEach(function() {
      var TestModel = Backbone.Model.extend({
        testAttr1: "attr1"
      });

      view1 = new BaseView({
        tagName: 'ul',
        template: '<p>example</p>',
        channel: 'view.test',
        model: new TestModel()
      });

      it('can subscribe to a channel', function() {
        expect(1).toBeThruthy();
      });

      it('can publish messages to a channel', function() {
        expect(1).toBeThruthy();
      });

      it('can unsubscribe from channels', function() {
        expect(1).toBeThruthy();
      });
    });
  });
});