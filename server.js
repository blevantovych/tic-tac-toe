const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => console.log(`server listening on port ${PORT}`))
    // "build": "browserify public/main.js -o public/bundle.js",
    // "watch": "watchify public/main.js -o public/bundle.js -v"
