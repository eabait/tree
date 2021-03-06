Tree
====
Tree is a small library that extends Backbone.js with new types of views.

##Overview
Tree provides two new view types: BaseView, and ContainerView.
* **Tree.BaseView**: extends Backbone.View with default *render*, *load*, and *dispose* methods. Those methods, are based upon hook methods that define the way templates are fetched, and compiled, and how the DOM is updated.
In addition, BaseView allows to define *before*, and *after* render methods.
* **Tree.ContainerView**: extends Tree.BaseView. Allows the management of other views through the concept of "regions".

The main goal behind Tree is reusability of common patterns to construct complex Backbone.js applications. Both BaseView and ContainerView were used as a basis of real applications now in production.

##Roadmap
More view types will be addded in the future: StackedView, ListView, GridView.
AMD support is planned too.

##Getting Started
- To start using Tree download its latest version from [here](https://github.com/eabait/tree/releases/latest)
- Published in **bower** under: backbone-tree

##Examples
### BaseView template management
By default, BaseView will try to fetch templates from a [JST](http://ricostacruz.com/backbone-patterns/#jst_templates) object. That object can be set when constructing an instance:
```javascript
    var toDoView = new Tree.BaseView({
      el: '.todo',
      jst: JST,
      template: 'todo.hbs'
    });

    toDoView.render();
```
In this example, toDoView will render a todo element using a templating function stored as a property called 'todo.hbs' in the object JST.

The following example demonstrate how to override the hook methods for template management.
```javascript
    var UserModel = Backbone.Model.extend({
      url: '/user/'
    });

    //Override BaseView fetchTemplate, and compileTemplate
    //using a mixin in order to maintain the logic localized.
    //This change will affect all objects that extends from
    //BaseView's prototype including ContainerView
    var HandlebarsMixin = {
      compileTemplate: function(template) {
        return Handlebars.compile(template);
      },

      fetchTemplate: function(templateId) {
        return $(templateId).html();
      }
    };

    _.extend(Tree.BaseView.prototype, HandlebarsMixin);

    userModel = new UserModel({
      name: 'Foo Bar'
    });

    userView = new Tree.BaseView({
      el: '.view-container',
      loadingTemplate: '#spinner-tpl',
      template: '#userTemplate',
      model: userModel,
      bindOn: 'change:name'
    });

    /*
    * Load will:
    *  1) fetch, compile, and render the loadingTemplate
    *  2) call the fetch method of the userModel instance
    *  3) bind the view to the model on the event specified by bindOn
    *  4) fetch, compile, and render the template using the response
    */
    userView.load();
```
### Composing views
ContainerView is used to manage subviews following a composite pattern. Instances of this view can be composed inside other view instances allowing the creation of complex view trees. The following example illustrates a basic example of this view type.

```
    <!-- layout.hbs -->
    <header></header>
    <div class="main-content"></div>
    <footer></footer>
```
```javascript
    var compositeView = new Tree.ContainerView({
      el: '.wrapper',
      template: 'layout.hbs',
      jst: JST
    });

    var mainView = new Tree.BaseView({
      tagName: 'p',
      template: 'main.hbs',
      jst: JST
    });

    var header = new Tree.BaseView({
      tagName: 'p',
      template: 'header.hbs',
      jst: JST
    });

    var footer = new Tree.BaseView({
      tagName: 'p',
      template: 'footer.hbs',
      jst: JST
    });

    compositeView.addView('header', header);
    compositeView.addView('footer', footer);
    compositeView.addView('.main-content', mainView);

    /*
    * Render will:
    * 1) Render layout.hbs template, which will set all regions elements in the DOM
    * 2) Render each subview into its own region
    */
    compositeView.render();

    /*
    * Disposes compositeView along with all its subviews
    * This method is used to avoid the presence of memory leaks
    * It can be overriden if necessary to reflect different requirements
    */
    compositeView.dispose();
```
A more complex example can be found [here](https://gist.github.com/eabait/8136194)
### List view
ListView is used to render views based on a given Backbone.Collection. Structural changes to the underlying collection trigger updates to the view. ListView binds to *reset*, *add*, and *remove* events.

```javascript
    <!-- template definitions -->
    <script id="repository-tpl" type="text/x-handlebars-template">
      <a href={{html_url}}>{{name}}</a>
    </script>

    <script id="layout-tpl" type="text/x-handlebars-template">
      <section>
        <ul class="repositories"></ul>
        <button>Load</button>
      </section>
    </script>

    <script id="spinner-tpl" type="text/x-handlebars-template">
      <p>Loading...</p>
    </script>

    <script id="empty-tpl" type="text/x-handlebars-template">
      <p>Click on Load</p>
    </script>
```
```javascript
      //View definition. Will be used to create each list item view.
      //a tagName = 'li' is set
      var RepoView = Tree.BaseView.extend({
        name: 'RepoView',

        tagName: 'li',

        template: '#repository-tpl',

        events: {
          'click a': 'onRepositoryAnchorClick'
        },

        onRepositoryAnchorClick: function(e) {
          e.preventDefault();
          this.$el.css('font-weight', 'bold');
        }
      });

      //Instance of ListView.
      //tagName is not defined, because the view element will be
      //set by the ContainerView instance
      var repoListView = new Tree.ListView({
        itemView: RepoView,
        model: new StarredRepositoriesCollection(),
        loadingTemplate: '#spinner-tpl',
        emptyTemplate: '#empty-tpl',
        action: 'noOp'
      });

      var MainView = Tree.ContainerView.extend({
        name: 'MainView',

        template: '#layout-tpl',

        events: {
          'click button': 'onButtonClick'
        },

        onButtonClick: function(e) {
          repoListView.load({
            reset: true
          });
        }
      });

      var mainView = new MainView({
        el: '.main-wrapper'
      });

      //.repositories is a <ul> DOM element
      mainView.addView('.repositories', repoListView);
      mainView.render();
```
##License
Tree is licensed under the [MIT] (https://github.com/eabait/tree/blob/master/LICENSE)
