var Backbone = require('backbone'),
    _ = require('underscore'),
    Collection = require('../collections/collection.js')
    //NativeView = require('backbone.nativeview')

module.exports = Backbone.View.extend({
    exclusiveState: false,
    exclusiveEvent: 'click',
    constructor: function() {
        // define children first
        this.children = new Collection([], {exclusiveState: this.exclusiveState})

        // listenters must be set before apply() is called
        this.listenTo(this.children, 'add', this.appendChild)
        this.listenTo(this.children, 'change:state', this.stateChange)

        // proxy stateChange to children
        this.listenTo(this.children, 'stateChange', function(){
            var args = Array.prototype.slice.call(arguments)
            args.unshift('stateChange')
            this.trigger.apply(this, args)
        })

        // super()
        Backbone.View.apply(this, arguments);

        this.superRemove = Backbone.View.prototype.remove

    },
    add: function() {
        return this.children.add.apply(this.children, arguments)
    },
    appendChild: function(model, collection, opts) {
        // check to see if a location (relative to the parent) is specified
        var el = opts.to ? this.$(opts.to)[0] : this.el

        if (!opts || !opts.positioned || !this.el.children.length || !('at' in opts)) {
            el.appendChild(model.get('view').el)
        } else {
            // at must be zero based; will fail if before el is not found
            el.insertBefore(model.get('view').el, el.children[opts.at])
        }

        // add a  handler if exclusivity is set
        if (this.exclusiveState && model.get('hasState')) {
            model.get('view').delegate(
                this.exclusiveEvent,
                _.bind(model.toggleState, model)
            )

        }

        return model
    },
    stateChange: function(model) {
        // override this
    },
    remove: function() {
        this.children.removeAll()

        // call original remove
        this.superRemove()
    }
})
