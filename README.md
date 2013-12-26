Tree
====
Tree is a small library that extends Backbone.js with new types of views. These views are based on the author experience building Single-Page Applications using Backbone.js.

Overview
Tree provides two new view types: BaseView, and ContainerView.
* Tree.BaseView: extends Backbone.View with *render*, *load*, and *dispose* methods. Provides hook methods that define the way templates are fetched, and compiled.
It also allows to define *before*, and *after* render methods.
* Tree.ContainerView: extends Tree.BaseView. Allows the management of other views through the concept of "regions".

The main goal behind Tree is reusability of common patterns to construct complex Backbone.js applications. Both BaseView and ContainerView were used as a basis of real applications now in production.

##Roadmap
More view types will be addded in the future: StackedView, ListView, GridView.
AMD support is planned to.

##Getting Started
To start using Tree download its latest version from [here](https://github.com/eabait/tree/releases/latest)
Published in **bower** under: backbone-tree

##API
TBA

##License
Tree is licensed under the [MIT] (https://github.com/eabait/tree/blob/master/LICENSE)