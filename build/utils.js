const miniCssExtract = require('mini-css-extract-plugin')

const isProduction = process.env.BASE_ENV === 'production'

const config = require('../config')

const path = require('path')

exports.resolve = function(dir) {
    const assetsPath = isProduction ? config.dev.assetsPath : config.build.assetsPath

    return path.join(assetsPath, dir)
}

exports.generateLoader = function(options) {

    function collectLoader(loader) {

        options.usePostCss && output.push('postcss-loader')
        
        var output = isProduction ? [miniCssExtract.loader, 'css-loader'] : ['style-loader', 'css-loader']
        
        if (loader) {
            output.push(loader + '-loader')
        }

        return output
    }

    return {
        'css': collectLoader(),
        'less': collectLoader('less'),
        'scss' : collectLoader('scss')
    }
}

exports.generateRules = function(options) {
    var loaders = exports.generateLoader(options),
        output = []

    for (var key in loaders) {
        output.push({
            test: new RegExp('\.' + key + '$'),
            use: loaders[key]
        })
    }

    return output
}