var Backbone = require('backbone'),
    _ = require('underscore'),
    Model = require('../models/model.js')

module.exports = Backbone.Collection.extend({
    // default model to be used, can be overridden
    model: Model,
    initialize: function(models, opts) {
        this.exclusiveState = opts && opts.exclusiveState || false

        // rememebr if a state has ever been set
        this.stateSet = false;

        // a models change event bubbles up to the collection causing an
        // event for every model changed. To prevent an endless loop, listen to
        // just the first change event, process it (via the callback), and
        // start listening again after all the models state have been processed
        this.once('change:state', this.toggleState)

        // add models to collection, if provided
        if (models) {
            this.reset(models, _.extend({silent: true}, opts))
        }
    },
    removeAll: function() {
        // removes all models in this collection
        // Unlike Collection.reset(), the remove event will be triggered
        // on every model, giving it the ability to clean itself up

        this.remove(this.models)
    },
    toggleState: function (changed) {
        this.stateSet = true

        // set all other models to state = null
        this.each(function(model){
            // skip the model that triggered the event
            if (_.isEqual(model, changed)) return true

            model.set('state', null)
        })

        // listen for changes again before triggering 'stateChange',
        // so that we dont miss any events
        this.once('change:state', this.toggleState)

        // trigger stateChange event if state is exclusive
        if (this.exclusiveState) {
            this.trigger('stateChange', changed)
        }
    }
})
