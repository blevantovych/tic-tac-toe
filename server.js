const express = require('express')
const path = require('path')
const app = express()
require('express-ws')(app)

app.use(express.static(path.join(__dirname, 'public')))

function * getChar () {
  while (true) {
    yield 'X'
    yield '0'
  }
}
const charGen = getChar()

let counter = 0
const allClients = {}
app.ws('/', function (ws, req) {
  ws.send(JSON.stringify({
    char: charGen.next().value,
    type: 'assignChar'
  }))
  const id = counter++
  allClients[id] = ws
  ws.on('message', function (msg) {
    for (const clientId in allClients) {
      if (ws !== allClients[clientId]) {
        allClients[clientId].send(JSON.stringify({
          type: 'move',
          move: JSON.parse(msg)
        }))
      }
    }
  })

  ws.on('close', function () {
    delete allClients[id]
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server listening on port ${PORT}`))
