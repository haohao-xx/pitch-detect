/** @format */

const {merge} = require('webpack-merge')
const path = require('path')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        port: 9000,
    },
    plugins: [new ReactRefreshPlugin()],
})
