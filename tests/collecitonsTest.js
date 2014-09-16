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

    it('removeAll', function() {
        this.c.removeAll()

        this.c.length.should.eql(0)
    })
})
