describe('BaseView', function() {

  var view1;
  var model1;

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'spec/templates/';
    loadFixtures('index.html');

    jasmine.Ajax.useMock();

    var TestModel = Backbone.Model.extend({
      url: 'testUrl'
    });

    HandlebarsView = Tree.BaseView.extend({
      compileTemplate: function(template) {
        return Handlebars.compile(template);
      },
      fetchTemplate: function(templateId) {
        return $(templateId).html();
      }
    });

    model1 = new TestModel({
      sayHi: 'Hello World'
    });

    view1 = new HandlebarsView({
      tagName: 'ul',
      template: '#helloWorld',
      model: model1
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

    it('should be able to fetch a template from the DOM', function() {
      expect(view1.fetchTemplate(view1.template)).toEqual($(view1.template).html());
    });

    it('should be able to compile a template', function() {
      var tplFunction = view1.compileTemplate(view1.fetchTemplate(view1.template));
      expect(_.isFunction(tplFunction)).toBe(true);
    });

    it('should use fetchTemplate and compileTemplate when getTemplate is called', function() {
      spyOn(view1, 'fetchTemplate');
      spyOn(view1, 'compileTemplate');

      view1.getTemplate(view1.template);

      expect(view1.fetchTemplate).toHaveBeenCalled();
      expect(view1.compileTemplate).toHaveBeenCalled();
    });

    it('should cache templates', function() {
      var nonCachedFunction, cachedFunction;

      nonCachedFunction = view1.getTemplate(view1.template);

      spyOn(view1, 'fetchTemplate');
      spyOn(view1, 'compileTemplate');

      cachedFunction = view1.getTemplate(view1.template);

      expect(view1.fetchTemplate).not.toHaveBeenCalled();
      expect(view1.compileTemplate).not.toHaveBeenCalled();

      expect(cachedFunction).toEqual(nonCachedFunction);
    });

  });

  describe('Rendering', function() {
    it('should return the view object', function() {
      expect(view1.render()).toEqual(view1);
    });

    it('should render itself in the DOM', function() {
      $('body').append(view1.render().$el);
      expect(view1.el).toExist();
    });

    it('should call beforeRender before render is invoked', function() {
      spyOn(view1, 'beforeRender');
      view1.render();
      expect(view1.beforeRender).toHaveBeenCalled();
    });

    it('should call afterRender after render is invoked', function() {
      spyOn(view1, 'afterRender');
      view1.render();
      expect(view1.afterRender).toHaveBeenCalled();
    });
  });

  describe('Loading', function() {
    var request, response;

    beforeEach(function() {
      response = {
        status: 200,
        contentType: 'application/json',
        responseText: '{"sayHi" : "Hi"}'
      };
    });

    it('should call render once data has been fetched', function() {
      spyOn(view1, 'render');
      view1.load();
      request = mostRecentAjaxRequest();
      request.response(response);
      expect(view1.render).toHaveBeenCalled();
    });

    it('should render a loading template while fetching data', function() {
      view1.loadingTemplate = '#spinner';
      spyOn(view1, 'renderLoadingView');
      view1.load();
      request = mostRecentAjaxRequest();
      request.response(response);
      expect(view1.renderLoadingView).toHaveBeenCalled();
    });

    it('should allow render be binded to different model events', function() {
      view1.bindModelWith = 'change:sayHi';
      spyOn(view1, 'render');
      view1.load();
      request = mostRecentAjaxRequest();
      request.response(response);
      expect(view1.render).toHaveBeenCalled();
    });
  });

  describe('Disposal', function() {
    it('should not exist in the DOM after disposal', function() {
      view1.dispose();
      expect(view1.$el).toBeEmpty();
      expect($(view1.el)).toBeEmpty();
    });

    it('should not be binded to any event after disposal', function() {
      spyOn(view1, 'render');
      model1.trigger('sync');
      expect(view1.render).not.toHaveBeenCalled();
    });
  });
});