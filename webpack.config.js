// webpack.config.js
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('[name].bundle.css');

const config = {
    context: path.resolve(__dirname, 'src'),
    entry: './app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['es2015', {modules: false}]
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                loader: extractCSS.extract([
                    'css-loader',
                    'sass-loader'
                ])
            }
        ]
    },
    plugins: [
        extractCSS
    ]
};

module.exports = config;
