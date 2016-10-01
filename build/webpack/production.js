var webpack = require('webpack');
var webpackConfig = require('./_base');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

webpackConfig.plugins.push(
  new ExtractTextPlugin('[name].[hash].min.css'),
  /*new webpack.optimize.UglifyJsPlugin({ //压缩js
    compress: {
      warnings: false
    }
  }),*/
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: "'production'"
    }
  }),
    new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        server: { baseDir: ['./www'] }
    })
);

webpackConfig.output.filename = '[name].[hash].min.js';

module.exports = webpackConfig;



