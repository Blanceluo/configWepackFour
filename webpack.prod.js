const merge = require('webpack-merge')
const common = require('./webpack.common')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      }
    ]
  },
  plugins: [
    /**
     * 删除未引用的代码且压缩
     * 鼓励 prod 环境下开启
     * webpack4开始，prod 模式下，内部会自动引入该插件
     * 启用此插件，必须有将 es6 代码编译转化为 es5 的能力，因此需引入 babel 套件转译 es6
     * babel 套件的使用，必须注意版本的问题(此处有坑)
     * 如果 devtool 开启了 sourceMap，则需配合开启
     */
    new UglifyJSPlugin({
      sourceMap: true
    }),
    /**
     * 抽离 css 文件
     * 目前不支持 webpack4，npm i 时需加后缀 @next 安装beta版本
     */
    // new ExtractTextPlugin({
    //   filename: '[name].[chunkhash:8].style.css'
    // })

    // webpack4 官方推荐此插件将 css 从 js bundle 文件中抽离
    new MiniCssExtractPlugin({
      // 输出到 /css 文件夹下
      filename: 'css/[name].[contenthash:8].css'
    }),
    /**
     * 压缩 css 文件
     */
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      // cssProcessor: require('cssnano'), // 默认使用 cssnano 解析
      cssProcessorOptions: {
        preset: ['default', {
          discardComments: {removeAll: true}, // 对注释的处理，全部移除
          normalizeUnicode: false
        }],
        /**
         * 在开启 sourcemap 后，本会默认生成 css map 文件
         * 引入此插件默认配置则会去除 sourcemap 文件
         * 必须得有如下配置方能正常生成 sourcemap 文件
         */
        map: {
          inline: false,  // 不生成内联映射，如此便会生成 sourcemap 文件
          annotation: true // 为压缩后的 css 添加 sourcemap 路径注释
        }
      },
      canPrint: true  // 是否打印编译过程中的日志
    }),
    // build bundle 分析
    // new BundleAnalyzerPlugin()
  ],
  // 开启 sourcemap, 且采用 source-map 模式
  devtool: 'source-map',
  // 抽离公共代码 js css
  optimization: {
    splitChunks: {
      // 作用的范围，async, inital, all
      chunks: 'all',
      // default 30000/30kb，这是一种合理的情况，因为分割并不能带来性能的提升，反而会增加浏览器请求的次数
      minSize: 1000,
      name: 'vendors',
    },
  },
})