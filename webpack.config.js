var setup = require('./exports.js')
var webpack = require('webpack')
var Promise = require('es6-promise').polyfill()

module.exports = {
  entry: setup.entry,
  output: {
    path: setup.path.join(setup.APP_DIR, "dev"),
    filename: "[name].js"
  },
  plugins: [new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js'})],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'jshint-loader',
        exclude: '/node_modules/',
        include: setup.APP_DIR + "/dev"
      },
      {
        test: /\.jsx?/,
        include: setup.APP_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }, {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ],
  },
  devtool: 'source-map'
}