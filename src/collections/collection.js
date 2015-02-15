var Backbone = require('backbone'),
    _ = require('underscore'),
    Model = require('../models/model.js')

module.exports = Backbone.Collection.extend({
    model: Model,
    initialize: function(models, opts) {
        this.exclusiveState = opts && opts.exclusiveState || false
        this.stateSet = false;
        this.once('change:state', this.toggleState)

        if (models) {
            this.reset(models, _.extend({silent: true}, opts))
        }
    },
    removeAll: function() {
        this.remove(this.models)
    },
    toggleState: function (changed) {
        this.stateSet = true
        // set all other models to state = null, except for the one
        // that was just changed
        this.each(function(child){
            if (_.isEqual(child, changed)) {
                return true
            }

            child.set('state', null)
        })

        // listen for changes again
        this.once('change:state', this.toggleState)

        // trigger stateChange event if state is exclusive
        if (this.exclusiveState) {
            this.trigger('stateChange', changed)
        }
    }
})
