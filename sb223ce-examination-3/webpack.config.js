const path = require('path')
const webpack = require('webpack')
var Dotenv = require('dotenv-webpack')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')
var DIST_DIR = path.resolve(__dirname, 'public')
var SRC_DIR = path.resolve(__dirname, 'client')

module.exports = {
  entry: SRC_DIR + '/app.jsx',
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: SRC_DIR,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [
            'react',
            'es2017',
            'stage-2'
          ]
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|svg|jpg|gif|woff2|woff|ttf)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new Dotenv({
      path: process.env.NODE_ENV === 'production' ? 'prod.env' : 'dev.env',
      safe: false
    }),
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}
