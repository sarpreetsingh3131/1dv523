var path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

var DIST_DIR = path.resolve(__dirname, 'src/public')
var SRC_DIR = path.resolve(__dirname, 'src/view')

module.exports = {
  entry: SRC_DIR + '/app.jsx',
  output: {
    filename: 'build.js',
    path: DIST_DIR
  },
  devServer: {
    contentBase: path.join(__dirname, 'src/public'),
    port: 4000,
    public: 'localhost:4000'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: SRC_DIR,
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
    new CopyWebpackPlugin([
      {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs'
      }
    ])
  ]
}
