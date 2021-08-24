
let HtmlWebpackPlugin = require('html-webpack-plugin');
let HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
module.exports = {
  configureWebpack: {
    optimization: {
        splitChunks: false // makes there only be 1 js file - leftover from earlier attempts but doesn't hurt
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/index.html',  //template file to embed the source
        inlineSource: '.(css)$' // embed all javascript and css inline
      }),
      new HtmlWebpackInlineSourcePlugin()
    ]
  }
}