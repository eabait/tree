Tree
====
Tree is a small library that extends Backbone.js with new types of views. These views are based on the author experience building Single-Page Applications using Backbone.js.

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

The following example demonstrate how to use Tree.BaseView using Handlebar templates stored in the DOM to render Backbone.Model data.
```javascript
    var UserModel = Backbone.Model.extend({
      url: '/user/'
    });

    var YourProjectBaseView = Tree.BaseView.extend({
    
      loadingTemplate: '#spinner-tpl',
      
      fetchTemplate: function(templateId) {
        return $(templateId).html();
      },
      
      compileTemplate: function(template) {
        return Handlebars.compile(template);
      }
      
    });

    userModel = new UserModel({
      name: 'Foo Bar'
    });

    userView = new YourProjectBaseView({
      tagName: '.view-container',
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
ContainerView is used to manage subviews following a composite pattern. ContainerView instances can be composed inside other ContainerView instances allowing the creation of complex view trees. The following example illustrates a basic example of this view type..

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

##License
Tree is licensed under the [MIT] (https://github.com/eabait/tree/blob/master/LICENSE)
