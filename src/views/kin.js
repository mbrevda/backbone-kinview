var Backbone = require('backbone'),
    _ = require('underscore'),
    Collection = require('../collections/collection.js')

module.exports = Backbone.View.extend({
    exclusiveState: false,
    exclusiveEvent: 'click',
    constructor: function(a, b) {
        this.children = new Collection()
        
        this.listenTo(this.children, 'add', this.appendChild)
        this.listenTo(
            this.children,
            'change:state',
            this.stateChange
        )

        Backbone.View.apply(this, arguments); 
    },
    add: function() {
        return this.children.add.apply(this.children, arguments)
    },
    appendChild: function(model, collection, options) {
        // first element or if positioning was not requested
        if (!this.$el.children().length || !(options.positioned || false)) {
            this.$el.append(model.get('view').$el)
        } else {
            // specifically positioned element
            this.$el.children().eq(options.at - 2).after(model.get('view').$el)
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
        this.constructor.__super__.remove.apply(this, arguments)
    }
})

