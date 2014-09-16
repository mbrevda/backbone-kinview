var should = require('should'),
    Model = require('../src/models/model.js')

describe('Models', function() {
    it('remove should remove the view first', function(){
        var mock = function(){}
        mock.prototype.removeWasCalled = false
        mock.remove = function(){
            this.removeWasCalled = true
        }

        var m = new Model({view: mock})
        m.remove()

        m.get('view').removeWasCalled.should.be.true
    })

    it('toggleState should toggle state', function(){
        var m = new Model()
        should.not.exist(m.get('state')) // null

        m.toggleState()

        m.get('state').should.be.true
        
        m.toggleState()

        m.get('state').should.be.false
    })
})
