Tree
====

Tree extends BackboneJS with two new view types: a BaseView, and a ContainerView. This two new object types have been defined from multiple applications now in production.
* Tree.BaseView: extends Backbone.View with render, load, and dispose methods. Provides hook methods that define the way templates are fetched, and compiled. 
It also allows to define before, and after render methods.
* Tree.ContainerView: extends Tree.BaseView. Allows the management of other views through the concept of "regions".

These two view types can be used as a basis to construct complex view hierarchies in Backbone applications. The following concerns are addressed by Tree views:
* View lifecyle: load, render, dispose methods
* Memory management: BaseView provides a default dispose method to release memory used by a view
