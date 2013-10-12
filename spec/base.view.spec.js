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

  describe('Template management', function() {

    it('should be able to fetch a template', function() {
      expect(true).toBe(false);
    });

    it('should be able to compile a template', function() {
      expect(true).toBe(false);
    });

    it('should return a compiled template when getTemplate is used', function() {
      expect(true).toBe(false);
    });

    it('should cache templates', function() {
      expect(true).toBe(false);
    });

  });

  describe('Rendering', function() {
    it('should render itself in the DOM', function() {
      $('body').append(view1.render().$el);
      expect(view1.el).toExist();
    });

    it('should call beforeRender before render is invoked', function() {
      expect(true).toBe(false);
    });

    it('should call afterRender after render is invoked', function() {
      expect(true).toBe(false);
    });
  });

  describe('Loading', function() {
    it('should call render once data has been fetched', function() {
      expect(true).toBe(false);
    });

    it('should render a loading template while fetching data', function() {
      expect(true).toBe(false);
    });

    it('should allow render be binded to different model events', function() {
      expect(true).toBe(false);
    });
  });

  describe('Disposal', function() {
    it('should dispose itself', function() {
      expect(true).toBe(false);
    });

    it('should not exist in the DOM after disposal', function() {
      expect(true).toBe(false);
    });

    it('should not be binded to any event after disposal', function() {
      expect(true).toBe(false);
    });
  });
});