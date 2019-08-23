const merge = require('webpack-merge')
const common = require('./webpack.common')
const webpack = require('webpack')

module.exports = merge(common, {
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ]
  },
  plugins: [
    // 触发热替换显示要修补的文件
    new webpack.NamedModulesPlugin(),
    // 启用热替换插件
    new webpack.HotModuleReplacementPlugin() 
  ],
  devServer: {
    contentBase: './dist',
    open: true,
    /**
     * 热替换
     * 注: 此项并不能真正的开启热替换，但若要实现热替换，此项为热替换的前置条件
     * webpack4 官方文档有一篇关于此的解读，热替换必须得借助对应的 loader 方能实现。
     * 官网示例虽然看似简单实则晦涩至极，但对于理解热替换的思想有极大的帮助
     * 一切复杂的事物都是由一系列简单事物组合而来
     */
    hot: true
  },
  // 开启模式下开启 sourcemap 且 模式为 inline-source-map
  devtool: 'inline-source-map'
})