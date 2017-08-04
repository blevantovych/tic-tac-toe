const path = require('path')

module.exports = {
  context: path.resolve(__dirname, 'public'),
  entry: './js/main.js',
  output: {
    filename: './public/js/bundle.js'
  },
  node: {
    fs: 'empty'
  }
}
