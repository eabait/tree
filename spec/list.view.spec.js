describe('ListView', function() {

  var view1;
  var modelsJSON = [
    {
      id: 0,
      name: 'The Doors',
      year: 1965,
      hit: 'Light my fire'
    },
    {
      id: 1,
      name: 'The Rolling Stones',
      year: 1962,
      hit: 'Gimme shelter'
    },
    {
      id: 2,
      name: 'Red Hot Chilli Peppers',
      year: 1983,
      hit: 'Californication'
    },
    {
      id: 3,
      name: 'Pearl Jam',
      year: 1983,
      hit: 'Even flow'
    }
  ];

  var itemView = Tree.BaseView.extend({
    tagName: 'li',

    template: '#item',

    compileTemplate: function(template) {
      return Handlebars.compile(template);
    },

    fetchTemplate: function(templateId) {
      return $(templateId).html();
    }
  });

  var testCollection = new Backbone.Collection();
  testCollection.url = 'test';

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'spec/templates/';
    loadFixtures('index.html');
    view1 = new Tree.ListView({
      model: testCollection,
      itemView: itemView
    });
  });

  afterEach(function() {
    view1.dispose();
  });

  describe('Instantiation', function() {

    it('should be able to create itself', function() {
      expect(view1).not.toBeNull();
    });

    it('view DOM element has been created', function() {
      expect(view1.el).not.toBeNull();
      expect(view1.$el).not.toBeNull();
    });

    it('should throw an exception when ItemView function is not passed', function() {
      var testExceptionThrowing = function() {
        new Tree.ListView({
          model: testCollection
        });
      }
      expect(testExceptionThrowing).toThrow();
    });

  });

  describe('Render subviews', function() {

    it('should render a collection when the collection is reseted', function() {
      spyOn(view1, 'onAddedModel');
      spyOn(view1, 'onRemovedModel');

      testCollection.reset(modelsJSON);

      expect(view1.onAddedModel).not.toHaveBeenCalled();
      expect(view1.onRemovedModel).not.toHaveBeenCalled();
      expect(view1.$el).toContainElement('li');
      expect(view1.$el.find('li').length).toBe(4);
    });

    it('should add a subview when a model is added', function() {
      var testCollection2 = new Backbone.Collection();
      testCollection2.url = 'test';
      var view2 = new Tree.ListView({
        model: testCollection2,
        itemView: itemView
      });
      spyOn(view2, 'onAddedModel').and.callThrough();
      spyOn(view2, 'onRemovedModel').and.callThrough();

      testCollection2.add(new Backbone.Model({
        id: 4,
        name: 'Foo Fighters',
        year: 1994,
        hit: 'My Hero'
      }));

      testCollection2.add(new Backbone.Model({
        id: 5,
        name: 'Nirvana',
        year: 1987,
        hit: 'Smells Like Teen Spirit'
      }));

      // expect(view2.onAddedModel).toHaveBeenCalled();
      // expect(view2.onAddedModel.calls.count()).toEqual(2);
      // expect(view2.onRemovedModel).not.toHaveBeenCalled();

      view2.dispose();
    });

    it('should remove a subview when a model is removed', function() {
      var testCollection2 = new Backbone.Collection();
      testCollection2.url = 'test';
      var view2 = new Tree.ListView({
        model: testCollection2,
        itemView: itemView
      });

      spyOn(view2, 'onAddedModel');
      spyOn(view2, 'onRemovedModel');

      testCollection2.reset(modelsJSON);
      testCollection2.shift();

      // expect(view2.onAddedModel).not.toHaveBeenCalled();
      // expect(view2.onRemovedModel.calls.count()).toEqual(2);
      // expect(view2.onRemovedModel).toHaveBeenCalled();

      view2.dispose();
    });

    it('should throw an error if the view to remove doesn\'t exists', function() {
      testCollection.reset(modelsJSON);

      function testRemoveThrowException() {
        view1.onRemovedModel(100);
      }

      expect(testRemoveThrowException).toThrow();
    });

  });

  describe('Dispose subviews', function() {

    it('should be able to dispose all of its subviews', function() {
      var testCollection2 = new Backbone.Collection();
      testCollection2.url = 'test';
      var view2 = new Tree.ListView({
        model: testCollection2,
        itemView: itemView
      });
      var firstView, lastView;

      testCollection2.reset(modelsJSON);

      firstView = view2.at(0);
      lastView = view2.at(3);

      spyOn(firstView, 'dispose');
      spyOn(lastView, 'dispose');

      view2.dispose();

      expect(firstView.dispose).toHaveBeenCalled();
      expect(lastView.dispose).toHaveBeenCalled();
      expect(view2.modelToViewMap).toEqual({});
    });

  });
});