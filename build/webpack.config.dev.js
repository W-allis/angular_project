const merge = require('webpack-merge')

const baseConfig = require('./webpack.config.base')

const utils = require('./utils')

const htmlWebpackPlugin = require('html-webpack-plugin')

const miniCssExtract = require('mini-css-extract-plugin')

const cleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = merge(baseConfig, {
    module: {
        rules: utils.generateRules({
            usePostcss: false
        })
    },
    devtool: 'source-map',
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new miniCssExtract({
            filename: utils.resolve('css/[name]_[hash:4].css')
        }),
        // new cleanWebpackPlugin({
        //     cleanOnceBeforeBuildPatterns: ['../dist/**.*']
        // })
    ]
})  