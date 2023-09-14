const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js',
  },
  target: 'web',
  devServer: {
	  port: '80',
    static: {
      directory: path.join(__dirname, 'public')
    },
    allowedHosts: "all",
    open: true,
    hot: true,
    liveReload: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/, 
        exclude: /node_modules/, 
        use: 'babel-loader', 
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },      
      {
        test: /\.(png)$/,
        type: 'asset/resource',
        // use: ['url-loader'],
        // include: path.resolve('./src/data/'),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html')
    })
  ]
};
