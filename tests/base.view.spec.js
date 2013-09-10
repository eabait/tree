describe('BaseView', function() {

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
    expect(view1.$el).toExist();
  });
});