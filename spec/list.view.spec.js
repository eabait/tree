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
    template: '#item',

    compileTemplate: function(template) {
      return Handlebars.compile(template);
    },

    fetchTemplate: function(templateId) {
      return $(templateId).html();
    }
  });

  var testCollection = new Backbone.Collection();

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

  });

  describe('Render subviews', function() {

    it('should render a collection when the collection gets loaded', function() {
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
      var view2 = new Tree.ListView({
        model: testCollection2,
        itemView: itemView
      });
      spyOn(view2, 'onAddedModel');
      spyOn(view2, 'onRemovedModel');

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

      //expect(view2.onAddedModel).toHaveBeenCalled();
      //expect(view2.onAddedModel.calls.count()).toEqual(2);
      //expect(view2.onRemovedModel).not.toHaveBeenCalled();

      view2.dispose();
    });

    it('should remove a subview when a model is removed', function() {
      var testCollection2 = new Backbone.Collection();
      var view2 = new Tree.ListView({
        model: testCollection2,
        itemView: itemView
      });
      testCollection2.reset(modelsJSON);
      spyOn(view2, 'onAddedModel');
      spyOn(view2, 'onRemovedModel');

      testCollection2.shift();

      //expect(view2.onAddedModel).toHaveBeenCalled();
      //expect(view2.onAddedModel.calls.count()).toEqual(2);
      //expect(view2.onRemovedModel).toHaveBeenCalled();

      view2.dispose();
    });

  });

  describe('Dispose subviews', function() {

    it('should be able to render all of its subviews', function() {
      expect(view1.at(0)).toBeNull();

      testCollection.reset(modelsJSON);

      expect(view1.at(0)).not.toBeNull();
    });

  });

  describe('Dispose subviews', function() {

    it('should be able to render all of its subviews', function() {
      var testCollection2 = new Backbone.Collection();
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