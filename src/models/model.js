var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
    defaults: {
        state: null,
        hasState: true,
        view: null,
        data: null
    },
    initialize: function() {
        // remove is triggerd by the collection when it removes a model
        this.listenTo(this, 'remove', this.remove)
    },
    remove: function() {
        // if this model contains a view, call its remove method
        // all other model cleanup is handeled externaly from the model

        if (this.get('view')) {
            this.get('view').remove()
        }
    },
    toggleState: function() {
        // default state handler, toggels the state
        // can be overridden for advance state handeling

        this.set('state', this.get('state') ? false : true)
    }
})
