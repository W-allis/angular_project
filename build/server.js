const express = require('express')

const webpack = require('webpack')

const app = express()

const devConfig = require('./webpack.config.dev')

const webpackDevMiddleware = require('webpack-dev-middleware')

const complier = webpack(devConfig)

const webpack_module = webpackDevMiddleware(complier)
const static_module = express.static('../dist')

app.use(webpack_module)
app.use(static_module)

app.listen(9528, function() {
    
})