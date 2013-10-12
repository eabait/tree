describe('BaseView', function() {

  var view1;

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'spec/templates/';
    loadFixtures('index.html')

    var TestModel = Backbone.Model.extend({
    });

    HandlebarsView = Tree.BaseView.extend({
      compileTemplate: function(template) {
        return Handlebars.compile(template);
      },
      fetchTemplate: function(templateId) {
        return $(templateId).html();
      }
    });

    view1 = new HandlebarsView({
      tagName: 'ul',
      template: '#helloWorld',
      model: new TestModel({sayHi: 'Hello World'})
    })
  });

  describe('Instantiation', function() {

    it('should be able to create itself', function() {
      expect(view1).not.toBeNull();
    });

    it('view DOM element has been created', function() {
      expect(view1.el).not.toBeNull();
      expect(view1.$el).not.toBeNull();
    });

  });

  describe('Rendering', function() {
    it('renders itself', function() {
      $('body').append(view1.render().$el);
      expect(view1.el).toExist();
    });
  });

});