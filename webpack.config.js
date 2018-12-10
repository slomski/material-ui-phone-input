const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './build/lib'),
    filename: 'index.js',
    library: '',
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: ['svg-inline-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: [
    {
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-flag-icon-css': 'react-flag-icon-css',
    },
    /@material-ui\/core\/*./,
    /@material-ui\/icon\/*./,
  ],
};
