// libs
const path = require('path');

// vars
const APP_DIR = path.resolve(__dirname, './src');
const BUILD_DIR = path.resolve(__dirname, './dist');

// config
module.exports = {
    entry: path.resolve(APP_DIR, './konami.js'),
    output: {
        path: BUILD_DIR,
        filename: 'konami.js',
        library: 'Konami',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    }
};
