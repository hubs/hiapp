var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');

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
  externals: {
    //"sequelize":"sequelize",
    //'sqlite3':"require('sqlite3')",
   // "sequelize":"require('sequelize')",
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
      { from: './src/res', to: 'res' },
      { from: './src/style/img',to: 'img'},
      { from: './src/style/js',to:'js'}
    ]),
    new DashboardPlugin()
  ],
  //它告知 webpack 每一种文件都需要使用什么加载器来处理
  module: {
    loaders: [
      { test: /\.less$/, loader: lessLoader },
      { test: /\.html$/, loader: 'html'},
      { test: /.*\.(gif|png|jpe?g|svg)$/i, loader: 'url' },
      { test: /\.(woff|woff2)$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf$|\.eot$|\.svg$/, loader: 'file-loader' },
      { test: /\.json/, loader: 'json-loader' },
      { test: /\.node/, loader: 'ignore-styles' },
      { test: /aws-sdk/, loaders: ["transform?brfs"]},
    ],

    noParse: [
        /localforage/
      // /nedb
    ]
  },
  //其它解决方案配置
  resolve: {
    //查找module的话从这里开始查找
    root: '/home/hubs/workspace/hiapp/node_modules', //绝对路径
    //自动扩展文件后缀名，意味着我们re`quire模块可以省略不写后缀名
    extensions: ['', '.js', '.json', '.scss']
    //模块别名定义，方便后续直接引用别名，无须多写长长的地址
  },
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },

  //http://webpack.github.io/docs/configuration.html#node
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: 'empty'
  }
};
