const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    main: './src/index.jsx',
  },
  output: {
    filename: `bundle.js`,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(otf|ttf|woff\woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: './src/typography/fonts/',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: true,
              modules: {
                localIdentName: '[local]__[hash:base64:5]',
                // localIdentName: '[name]-[local]',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
        type: 'javascript/auto',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: './public/index.ejs',
      inlineSource: '.(js|css)$',
      inject: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './package.json', to: './', context: './' },
        { from: './manifest.json', to: './', context: 'public' },
        { from: './**/*.ico', to: './', context: 'public' },
        { from: './**/*.png', to: './', context: 'public' },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@content': path.resolve(__dirname, 'src/content/'),
      '@context': path.resolve(__dirname, 'src/context/'),
      '@hooks': path.resolve(__dirname, 'src/hooks/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
    },
  },
  devServer: {
    port: 8080,
    historyApiFallback: true,
    open: false,
    hot: true,
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync(path.resolve(__dirname, '..', 'cert', 'key.pem')),
        cert: fs.readFileSync(
          path.resolve(__dirname, '..', 'cert', 'cert.pem'),
        ),
      },
    },
    static: {
      directory: path.resolve(__dirname, './docs'),
    },
  },
};
