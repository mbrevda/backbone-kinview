var should = require('should'),
    Backbone = require('backbone')

Backbone.$ = global.window.$
var View = require('../index.js')

describe('View', function(){
    beforeEach(function(){
        this.v = new View({})
    }) 

    it('Add should return a model', function(){
        (this.v.add({view: new Backbone.View()}) instanceof Backbone.Model)
            .should.be.true
    })

    it('Models must contain a view', function(){
        var that = this;
        (function(){
            that.v.add({})
        }).should.throwError('Cannot read property \'$el\' of null')
    })
    
   it('Should attach an event if exclusiveState is true', function() {
        this.v.exclusiveState = true
        var m = this.v.add({view: new Backbone.View()})
        var view = m.get('view')

        Backbone.$._data(view.$el[0], 'events').click.length.should.eql(1)
    })
    
    it('Should position elements if position is set', function(){
        true.should.be.false//todo: todo
    })

    it('RemoveAll should remove all children', function(){
        this.v.add([{view: new Backbone.View()}, {view: new Backbone.View()}])
        this.v.children.length.should.eql(2)

        this.v.remove()

        this.v.children.length.should.eql(0)
    })
})
