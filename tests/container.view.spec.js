describe('ContainerView', function() {
  'use strict';

  /**
   * Before loading the specs, create a div in the DOM to append the views to and then remove it.
   */
  beforeEach(function () {
    $('body').append('<div class="testing"></div>');
  });

  afterEach(function () {
    $('body').find('.testing').remove();
  });

  describe('container.view test suite', function() {
    var containerView,
      TestModel;

    beforeEach(function() {

      TestModel = Backbone.Model.extend({
        testAttr1: "attr1"
      });

      containerView = new ContainerView({
        el: '.testing',
        template: '<div class="container"></div>'
      });
    });

    it('should be able to create itself', function() {
      expect(containerView).not.toBeNull();
    });

    it('can add views', function() {
      containerView.addView('.container', new BaseView({
        template: '<p>view1</p>',
        model: new TestModel()
      }));

      expect(Object.keys(containerView.regions).length).toBe(1);
    });

    it('can render sub-views', function() {
      containerView.addView('.container', new BaseView({
        template: '<p>view1</p>',
        model: new TestModel()
      }));

      containerView.render();

      var text = containerView.$el.find('p').html();

      expect(Object.keys(containerView.regions).length).toBe(1);
      expect(text).toBe('view1');
    });

    it('can dispose sub-views', function() {
      containerView.addView('.container', new BaseView({
        template: '<p>view1</p>',
        model: new TestModel()
      }));

      containerView.dispose();

      expect(Object.keys(containerView.regions).length).toBe(0);
    });

  });
});