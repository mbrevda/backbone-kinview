# KinView
**KinView** is a [Backbone.js](http://backbonejs.org) view that provides a simple api to manage child views and auto-appends them to the parent `$el`. It also allows for the child element to have a state attached to it, and [properly](http://backbonejs.org/#View-remove) removes the children when the parent is `remove()`ed.

# Installation

KinView has been designed to ```require```'d by [browserify](http://browserify.org/), and is currently only supported in that environment. To install:

```
npm install backbone-kinview --save
```

# Code

### CI
KinView continuous integrations is handled by Wercker:

[![wercker status](https://app.wercker.com/status/2efbc54680052f799976eec1a2d029cd/m "wercker status")](https://app.wercker.com/project/bykey/2efbc54680052f799976eec1a2d029cd)

### Testing
KinView proudly maintains 100% test coverage. To manually run the tests, install with with --dev (as above) and run:

```
gulp testc
```

You can optionally generate an HTML code coverage report by appending the `--html` argument

### Issues
Issues can be opened in the [usual location](https://github.com/mbrevda/backbone-kinview/issues), pull requests welcome!

# Usage
### Getting started

Start by creating a new KinView:

```js
var KinView = require('backbone-kinview')

var kin = new KinView.extend({
    // regular Backbone.View opts here
})
```

You can now add one or more child view, which all be appended to the parent:

```js
// must always pass a 'view' param with a valid view!
kin.add({view: new Backbone.View()})
```

### Positioning children in the parent
Sometimes you may wish to add a child element to the parent view *at a specific position*. With KinView thats easy to do:

```js
kin.add(
    {view: new Backbone.View()},
    {
        at: 4,           // specify the position (zero index)
        positioned: true // tells KinView that you want the element at the `at` position
    }
)
```
Once set, a child cannot be repositioned.

### Positioning a child in a subelement
Add a view directly to the parent is useful when children view are the *only* element in the parent, like this:

```html
<div class="parent">
    <div class="child"></div>
    <div class="child"></div>
    <div class="child"></div>
</div>
```

If the parent view has a template or an otherwise compartmentalized hierarchy, you can specify where in the parent a given child should be appended to, use the `to` option. Pass a selector string thats relative to the parent. `to` delegates to Backbone's [`view.$(selector)`](http://backbonejs.org/#View-dollar) method:

```js
var KinView = require('backbone-kinview')

var kin = new KinView.extend({
    template: _.template('<div class="parent">'
        + '<div class="child1"></div>'
        + '<div class="child2"></div>'
        + '</div>'),
    initialize: function() {
        this.render()
    },
    render: function() {
        this.$el.html(this.template())

        // add child1
        this.add(
            {view: new Backbone.View()}
            {to: '.child1'}
        )

        // add child2
        this.add(
            {view: new Backbone.View()}
            {to: '.child2'}
        )
    }
})
```

# State
### Setting state
KinView can keep track of a view's state.

State doesn't directly affect the view - it's simply 'metadata' that can be used to store what the state *should* be. Your view must listen to changes on the model in order to know when the
state changes. This is a bit unconventional, as you need to first create a view,
then create a new child, passing it the view, and finally have the view listen
to its model. See below for an example.

Adding a view with a given state is simple:

```js
kin.add({view: new Backbone.View(), state: 'someState'})
```

To change a state, simply find the views model and set it's state:

```js
kin.children.at(6).set('state', 'someState')
```

### Exclusivity
KinView also offers state exclusivity. When a KinView has state exclusivity, only **one** child view can hold a given state an any given time. When a child's state is changed, all other children will have their state set to a default value. By default, state is binary (i.e. either true or false). To get more elaborate states, overwrite the Model used by the KinView.children collection, mainly the [`toggleState()` ](https://github.com/mbrevda/backbone-kinview/blob/master/src/models/model.js#L18-L20) method.

To activate exclusivity, when instantiate KinView set `exclusiveState` to `true`:

```js
var kin = new KinView.extend({
    exclusiveState: true
})
```

When `exclusiveState` is `true`, KinView will listen for an event (or events) and will call the [`toggleValue()` ](https://github.com/mbrevda/backbone-kinview/blob/master/src/models/model.js#L18) method on the child. While this event defaults to `click`, it can be set to anything that [`jQuery.on()`](http://api.jquery.com/on/) can accept. I.e:

```js
var kin = new KinView.extend({
    exclusiveState: true,
    exclusiveEvent: 'mouseover' // by default, is 'click'
})
```

### Updating the view when state changes
As explained above, the view is never manipulated when its model changes. You must
manually listen for changes on the model and update your view appropriately. This
is a bit unconventional as the model cannot be directly passed to view. Here is
an example of how to have the view listening to the model:

```js
var model = kin.add({view: Backbone.View()})
var view  = model.get('view')
view.listenTo(model, 'change:state', view.changeHandler)
```


# Lifecycle
KinView will automatically remove all views, calling their `remove()` method, when it is removed. If you have any elaborate cleanup you need to do in your children, be sure to add that the child's `remove()`. To remove KinView, just call `remove()`:

```js
kin.remove()
```
