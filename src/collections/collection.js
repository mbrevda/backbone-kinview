var Backbone = require('backbone'),
    _ = require('underscore'),
    Model = require('models/model.js')

module.exports = Backbone.Collection.extend({
    model: Model,
    initialize: function(opts) {
        this.stateSet = false
        this.once('change:state', this.toggleState)
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
    }
})
