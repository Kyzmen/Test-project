// const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

/*  "locomotive-scroll": "^3.5.4", */

function config(mode = 'development') {
  const config = {
    mode,
    entry: glob.sync('./src/assets/scripts/gulp-modules/*.js').reduce((acc, item) => {
      const path1 = item.split('/');
      // path1.pop();
      const name = path1.pop().replace(/\.js/, '');
      console.warn('\x1b[31m', 'Dont use index.js in gulp-modules folder, it will be ignored');
      if (name === 'index-app') {
        acc[name] = './src/assets/scripts/index-app.js';
      }
      else if (name === 'libs') {
        console.log('\x1b[31m', 'libs script ingrored by webpack');
      }
      else {
        acc[name] = item;
      }
      return { ...acc, 'index-app': './src/assets/scripts/index-app.js'};
    }, {}),
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, './assets/scripts/'),
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
        },
      ],
    },
    plugins: [
      new UglifyJSPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            drop_console: mode === 'production',
          }
        }
      }),
    ],
  };
  return config;
}


module.exports = config;
