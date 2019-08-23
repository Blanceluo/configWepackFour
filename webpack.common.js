const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  // 模块配置 loader
  module: {
    rules: [
      // 将 js 文件中的 es6 代码转化为低版本浏览器兼容的 es5
      // 还需配置 .babelrc，搭配 @babel-core @babel/preset-env 一起使用
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      /**
       * 处理 图片 文件
       * 此处也可使用 file-loader,但 url-loader 比之具有优化图片大小功能
       * 在 limit 不满足时，url-loader 内部会调用 file-loader 解析文件
       * 故此处使用 url-loader
       */
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 500, // 文件小于 50kb 时返回一个 dataUrl base64
              name: 'images/[name].[hash:8].[ext]',
              // 打包后被输出到同级不同得文件夹，css 文件引入需要加上 ../ 相对路径
              publicPath: '../',
            }
          }
        ]
      },
      // 处理字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 500,
              name: 'fonts/[name].[hash:8].[ext]',
              publicPath: '../'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // build 前清理 dist 文件夹
    new CleanWebpackPlugin(),
    // 生成或指定 html 模板文件，以此动态引入文件无需每次 build 后手动引入
    // 后续很多自动化的动态操作都需要此插件方能完成
    new HtmlWebpackPlugin({
      template: './index.html',
      // 该插件内部集成了 html-minifier 插件，该压缩选项与 html-minifier 插件完全一样
      // 压缩生成的 html 文件
      minify: {
        // 压缩时不会在元素中留下任何空格, 需配合 collapseWhitespace 使用
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true
      }
    })
  ]
}