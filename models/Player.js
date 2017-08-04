const mongoose = require('mongoose')

const playerSchema = mongoose.Schema({
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }]
})

module.exports = mongoose.model('Player', playerSchema)
