var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var mode = process.env.NODE_ENV;
var lessLoader;

if (mode === 'production') {
  lessLoader = ExtractTextPlugin.extract('css!less');
} else {
  lessLoader = 'style!css!less';
}
/**
 * https://segmentfault.com/a/1190000002889630
 * https://segmentfault.com/a/1190000005106383
 * http://www.cnblogs.com/vajoy/p/4650467.html
 */

module.exports = {
  // entry 是页面入口文件配置
  entry: {
    app: './src/modules/main.js'
  },
  //output 是对应输出项配置
  output: {
    path: './www',
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),//根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小，该模块推荐使用
    new webpack.optimize.DedupePlugin(),//打包的时候删除重复或者相似的文件
    new HtmlWebpackPlugin({     //生成html
      template: './src/index.html',
      filename: 'index.html',
      minify: false,
      inject: 'body'
    }),
    new CopyWebpackPlugin([
      { from: './src/api', to: 'api' },
      { from: './src/page', to: 'page' },
      { from: './src/res', to: 'res' }
    ])
  ],
  //它告知 webpack 每一种文件都需要使用什么加载器来处理
  module: {
    loaders: [
      { test: /\.less$/, loader: lessLoader },
      { test: /\.html$/, loader: 'html'},
      { test: /.*\.(gif|png|jpe?g|svg)$/i, loader: 'url' },
      { test: /\.(woff|woff2)$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf$|\.eot$|\.svg$/, loader: 'file-loader' }
    ]
  }
};
