# KinView
**KinView** is a [Backbone.js](http://backbonejs.org) view that provides a simple api to manage child views and auto-appends them to the parent `$el`. It also allows for the child element to have a state attached to it, and [properly](http://backbonejs.org/#View-remove) removes the children when the parent is `remove()`ed.

# Instalation

KinView has been designed to ```require```'d by [browserify](http://browserify.org/), and is currently only supported in that environment. To install:

```
npm install backbone-kinview --save
```

# Code

## CI
KinView continuous integrations is handled by Wercker:

[![wercker status](https://app.wercker.com/status/2efbc54680052f799976eec1a2d029cd/m "wercker status")](https://app.wercker.com/project/bykey/2efbc54680052f799976eec1a2d029cd)

## Testing
KinView proudly maintains 100% test coverage. To manually run the tests, install with with --dev (as above) and run:

```
gulp testc
```

You can optionally generate an HTML code coverage report by appending the `--html` argument

## Issues
Issues can be opened in the [usual location](https://github.com/mbrevda/backbone-kinview/issues), pull requests welcome!

# Usage
## Getting started

Start by creating a new KinView:

```js
var kin = new KinView.extend({
    // regular Backbone.View opts here
})
```

You can now add one or more child view, which all be appended to the parent:

```js
// must always pass a 'view' param with a valid view!
kin.add({view: new Backbone.View()})
```

## Positioning children in the parent
Sometimes you may wish to add a child element to the parent view *at a specific position*. With KinView thats easy to do:

```js
kin.add({
    view: new Backbone.View()
    at: 4,           // specify the position (zero index)
    positioned: true // tells KinView that you want the element at the `at` position
})
```
Once set, a child cannot be repositioned.

# State
## Setting state
KinView can keep track of a view's state.

State doesn't directly affect the view - it's simply 'metadata' that can be used to store what the state *should* be.

Adding a view with a given state is simple:

```js
kin.add({view: new Backbone.View(), state: 'someState'})
```

To change a state, simply find the views model and set it's state:

```js
kin.children.at(6).set('state', 'someState')
```

## Exclusivity
KinView also offers state exclusivity (i.e. only a single view in a given collection can have the same view). If a KinView has state exclusivity, only **one** child view can hold that state an any given time. When a child's state is changed, all other children will have their state set to a default value. By default, state is binary (i.e. either true or false). To get more elaborate states, overwrite the Model used by the KinView.children collection, mainly the [`toggleValue()` ](https://github.com/mbrevda/backbone-kinview/blob/master/src/models/model.js#L18-L20) method.

To activate exclusivity, when instantiate KinView sett `exclusiveState` to `true`:

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

## Lifecycle
KinView will automatically remove all views, calling their `remove()` method, when it is removed. If you have any elaborate cleanup you need to do in your children, be sure to add that the child's `remove()`. To remove KinView, just call `remove()`:

```js
kin.remove()
```







