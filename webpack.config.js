const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, './examples'),
  entry: {
    app: ['./main.js'],
  },
  output: {
    path: path.resolve(__dirname, './examples'),
    filename: 'build.js',
  },
};