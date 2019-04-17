const path = require('path')

const isProduction = process.env.BASE_ENV === 'production'

const config = require('../config')

const utils = require('./utils')

module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: utils.resolve('js/[name]_[hash:4].js'),
        publicPath: isProduction ? config.dev.publicPath : config.build.publicPath
    },
    resolve: {
        extensions: ['.js', '.json', '.ts'],
        alias: {
            '@': path.resolve(__dirname, '../src')
            // 'angular': 'angular'
        }
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|svg|gif)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 5000,
                            name: utils.resolve('img/[name].[ext]')
                        }
                    }
                ]
            }
        ]
    }
}