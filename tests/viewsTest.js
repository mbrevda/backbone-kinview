var should = require('should'),
    Backbone = require('backbone'),
    jsdom = require('jsdom')

var View = require('../index.js')
var Model = require('../index.js').models.model

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
        }).should.throwError('Cannot read property \'el\' of null')
    })

   it('Should attach an event if exclusiveState is true', function(done) {
        this.v.exclusiveState = true
        this.v.children.model = Model.extend({toggleState: function(){
            done()
        }})
        var m = this.v.add({view: new Backbone.View()})
        var view = m.get('view')

        var click = new window.Event('MouseEvents')
        click.initEvent('click', true, true);
        view.el.dispatchEvent(click)
    })

    it('Add from inside the view', function(){
        var Child = Backbone.View.extend({className: 'child'})
        var MyView = View.extend({
            initialize: function(){
                this.render()
            },
            render: function() {
                this.add({view: new Child()})
            }
        })

        var view = new MyView()

        jsdom.serializeDocument(view.el)
            .should.eql('<div><div class="child"></div></div>')
    })

    it('Positioned at 0', function(){
        this.v.exclusiveState = true
        this.v.add({view: new Backbone.View()})
        var m = this.v.add(
            {view: new Backbone.View({className: 'test1'})},
            {at: 0, positioned: true}
        )

        this.v.el.children[0].getAttribute('class').should.eql('test1')
    })

    it('Positioned at 1', function(){
        this.v.exclusiveState = true

        this.v.add({view: new Backbone.View()})
        this.v.add({view: new Backbone.View()})
        this.v.add({view: new Backbone.View()})
        this.v.add(
            {view: new Backbone.View({className: 'test1'})},
            {at: 1, positioned: true}
        )

        this.v.el.children[1].getAttribute('class').should.eql('test1')
    })

    it('Positioned at 2', function(){
        this.v.exclusiveState = true

        this.v.add({view: new Backbone.View()})
        this.v.add({view: new Backbone.View()})
        this.v.add({view: new Backbone.View()})
        this.v.add(
            {view: new Backbone.View({className: 'test1'})},
            {at: 2, positioned: true}
        )

        this.v.el.children[2].getAttribute('class').should.eql('test1')
    })

    it('remove() should remove all children', function(){
        this.v.add([{view: new Backbone.View()}, {view: new Backbone.View()}])
        this.v.children.length.should.eql(2)

        this.v.remove()

        this.v.children.length.should.eql(0)
    })

    it('Attach to', function(){
        this.v.exclusiveState = true
        var div =  document.createElement('div')
        div.className = 'container'

        this.v.el.insertBefore(div,  this.v.el.nextSibling)
        this.v.add(
            {view: new Backbone.View({className: 'test1'})},
            {to: '.container'}
        )

        this.v.el.innerHTML
            .should.eql('<div class="container"><div class="test1"></div></div>')

    })
})
