const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
require('express-ws')(app)
const Game = require('./models/Game');

mongoose.connect('mongodb://localhost:27017/tic-tac-toe')

app.use(express.static(path.join(__dirname, 'public')))

function * getChar () {
  while (true) {
    yield 'X'
    yield '0'
  }
}

function handleGameOver (msg) {
  console.log('gameover')
  console.log('Message received: ', msg)
  // put result in db
  var game = new Game({
    moves: msg.moves
  })
  game.save()
}

const charGen = getChar()

let counter = 0
const allClients = {}
app.ws('/', function (ws, req) {
  function handleMove (msg) {
    console.log('handling move')
    console.log(msg)
    for (const clientId in allClients) {
      if (ws !== allClients[clientId]) {
        allClients[clientId].send(JSON.stringify({
          type: 'move',
          move: msg
        }))
      }
    }
  }

  const char = charGen.next().value
  ws.send(JSON.stringify({
    char,
    allowedToMove: char === 'X',
    type: 'assignChar'
  }))
  const id = counter++
  allClients[id] = ws

  ws.on('message', function (msg) {
    msg = JSON.parse(msg)
    switch (msg.type) {
      case 'move':
        handleMove(msg)
        break
      case 'gameover':
        handleGameOver(msg)
    }
  })

  ws.on('close', function () {
    delete allClients[id]
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server listening on port ${PORT}`))
