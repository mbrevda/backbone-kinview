var Backbone = require('backbone'),
    _ = require('underscore'),
    Collection = require('../collections/collection.js')

module.exports = Backbone.View.extend({
    exclusiveState: false,
    exclusiveEvent: 'click',
    constructor: function() {
        this.children = new Collection([], {exclusiveState: this.exclusiveState})

        this.listenTo(this.children, 'add', this.appendChild)
        this.listenTo(
            this.children,
            'change:state',
            this.stateChange
        )

        Backbone.View.apply(this, arguments);

        this.superRemove = Backbone.View.prototype.remove
    },
    add: function() {
        return this.children.add.apply(this.children, arguments)
    },
    appendChild: function(model, collection, opts) {
        if (!opts.positioned || !this.$el.children().length) {
            this.$el.append(model.get('view').$el)
        } else {
            // at must be zero based; will fail if before el is not found
            this.$el.children().eq(opts.at).before(model.get('view').$el)
        }

        // add a  handler if exclusivity is set
        if (this.exclusiveState && model.get('hasState')) {
            model.get('view').$el.on(
                this.exclusiveEvent,
                _.bind(model.toggleState, model)
            )

        }
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
