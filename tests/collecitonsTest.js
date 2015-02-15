var should = require('should'),
    Collection = require('../src/collections/collection.js')

describe('Collections', function() {
    beforeEach(function(){
        this.c = new Collection()
        this.model1 = this.c.add({})
        this.model2 = this.c.add({})
    })

    it('Should mark state as set after the first set', function() {
        this.c.stateSet.should.be.false

        this.model1.set('state', true)
        this.c.stateSet.should.be.ok
    })

    it('State change gets triggered', function() {
        this.model1.set('state', true)
        this.model2.set('state', true)

        should.not.exist(this.model1.get('state'))
    })

    it('Should reset change listener after change', function(){
        this.model1.set('state', true)
        this.model2.set('state', true)

        this.model2.get('state').should.be.ok
        should.not.exist(this.model1.get('state'))
    })

    it('Should trigger stateChange for exclusive state', function(done){
        this.c.exclusiveState = true

        this.c.on('stateChange', function(model) {
            model.get('state').should.be.ok
            done()
        })

        this.model1.set('state', true)
    })

    it('Should not trigger stateChange for nonexclusive state', function(done){
        var time = setImmediate(done)

        this.c.on('stateChange', function(model) {
            done(new Error('Should never be called!'))
        })

        this.model1.set('state', true)

    })

    it('removeAll', function() {
        this.c.removeAll()

        this.c.length.should.eql(0)
    })
})
