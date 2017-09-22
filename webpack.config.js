const path = require('path');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const dist = path.resolve(__dirname, 'dist')
module.exports = {
    entry:{
        app:'./app.js'
    },
    output:{
        filename:'[name].js',
        path: dist
    },
    devtool: 'cheap-source-map',
    resolve:{
        alias: {
            src: path.resolve(__dirname, 'src')
        }
    },
    plugins:[
        new HtmlWebpackPlugin({
            title: 'snabbdom',
            chunks: ['app'],
            // hash:true,
            template: path.resolve(__dirname, 'index.html')
        }),
        new CleanWebpackPlugin([dist])
    ],
    devServer: {
        inline:true,
        // hot: true,
        port: 9000
    }
}