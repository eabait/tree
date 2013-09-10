describe('BaseView', function() {

  var view1;

  beforeEach(function() {
    var TestModel = Backbone.Model.extend({
      testAttr1: "attr1"
    });

    console.log(BaseView);

    view1 = new BaseView({
      tagName: 'body',
      template: '<p>example</p>',
      model: new TestModel()
    });
  });

  it('should be able to create itself', function() {
    expect(view1).not.toBeNull();
    expect(view1.el).not.toBeNull();
    expect(view1.$el).not.toBeNull();
  });
});