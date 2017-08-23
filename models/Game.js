const mongoose = require('mongoose')

// TL - Top Left, TC - Top Center, TR - Top Right,
// CL - Center Left, CC - Center Center, CR - Center Right,
// BL - Bottom Left, BC - Bottom Center, BR - Bottom Right,

const gameSchema = mongoose.Schema({
  playerX: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  playerO: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  createdAt: { type: Date, default: Date.now },
  moves: [ String ] // ex. ['10', '11', ...] corresponds to coordinates on board
})

module.exports = mongoose.model('Game', gameSchema)
