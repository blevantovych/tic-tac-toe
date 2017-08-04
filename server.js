const express = require('express')
const path = require('path')
const app = express()
const expressWs = require('express-ws')(app)
const PORT = process.env.PORT || 3000

let counter = 0;
app.use(express.static(path.join(__dirname, 'public')))

const allClients = {}
app.ws('/', function(ws, req) {
  const id = counter++;
  // console.log('ID: ', id)
  allClients[id] = ws
  // console.log(`Active clients: ${Object.keys(allClients).length}`)
  ws.on('message', function(msg) {
    console.log('Message from client: ')
    console.log(msg)
    for (const clientId in allClients) {
      if (ws !== allClients[clientId])
        allClients[clientId].send(msg)
    }
  })

  ws.on('close', function() {
    delete allClients[id]
    // console.log(`Active clients: ${Object.keys(allClients).length}`)
  })
})

app.listen(PORT, () => console.log(`server listening on port ${PORT}`))
