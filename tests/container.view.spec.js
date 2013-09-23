describe('ContainerView', function() {
  'use strict';


  describe('container.view test suite', function() {
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

  });
});