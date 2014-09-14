var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
    defaults: {
        state: null,
        hasState: true,
        view: null,
        data: null
    },
    initialize: function() {
        this.listenTo(this, 'remove', this.remove)
    },
    remove: function() {
        if (this.get('view')) {
            this.get('view').remove()
        }
    },
    toggleState: function() {
        this.set('state', this.get('state') ? false : true)
    }
})
