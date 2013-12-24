describe('ContainerView', function() {

  var view1;
  var subview1;
  var header;
  var footer;

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'spec/templates/';
    loadFixtures('index.html');

    var MainView = Tree.ContainerView.extend({
      compileTemplate: function(template) {
        return Handlebars.compile(template);
      },

      fetchTemplate: function(templateId) {
        return $(templateId).html();
      }
    });

    var SubView = Tree.BaseView.extend({
      compileTemplate: function(template) {
        return Handlebars.compile(template);
      },

      fetchTemplate: function(templateId) {
        return $(templateId).html();
      }
    });

    view1 = new MainView({
      el: '.wrapper',
      template: '#layout'
    });

    subview1 = new SubView({
      tagName: 'p',
      template: '#helloWorld'
    });

    header = new SubView({
      tagName: 'p',
      template: '#header'
    });

    footer = new SubView({
      tagName: 'p',
      template: '#footer'
    });
  });

  describe('Instantiation', function() {

    it('should be able to create itself', function() {
      expect(view1).not.toBeNull();
    });

    it('view DOM element has been created', function() {
      expect(view1.el).not.toBeNull();
      expect(view1.$el).not.toBeNull();
      expect(view1.el).toExist();
    });

  });

  describe('Manage subviews', function() {

    it('should be able to add a subview in a region', function() {
      view1.addView('header', header);
      expect(view1.regions['header'].cid).toBe(header.cid);
    });

    it('should be able to add a subview in a region and dispose the previous one', function() {
      spyOn(header, 'dispose');

      view1.addView('header', header);
      view1.addView('header', subview1);

      expect(view1.regions['header'].cid).toBe(subview1.cid);
      expect(header.dispose).toHaveBeenCalled();
    });

  });

  describe('Render subviews', function() {

    it('should be able to render all of its subviews', function() {
      spyOn(header, 'render');
      spyOn(footer, 'render');
      spyOn(subview1, 'render');

      view1.addView('header', header);
      view1.addView('footer', footer);
      view1.addView('.main-content', subview1);

      view1.render();

      expect(header.render).toHaveBeenCalled();
      expect(footer.render).toHaveBeenCalled();
      expect(subview1.render).toHaveBeenCalled();
    });

  });

  describe('Dispose subviews', function() {

    it('should be able to render all of its subviews', function() {
      spyOn(header, 'dispose');
      spyOn(footer, 'dispose');
      spyOn(subview1, 'dispose');

      view1.addView('header', header);
      view1.addView('footer', footer);
      view1.addView('.main-content', subview1);

      view1.dispose();

      expect(header.dispose).toHaveBeenCalled();
      expect(footer.dispose).toHaveBeenCalled();
      expect(subview1.dispose).toHaveBeenCalled();
    });

  });

});