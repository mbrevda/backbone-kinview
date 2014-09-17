var KinView = require('./views/kin.js')

module.exports = KinView

KinView.models = KinView.collections = {}
KinView.models.model = require('./models/model.js')
KinView.collections.collection = require('./collections/collection.js')
