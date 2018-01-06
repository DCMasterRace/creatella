var config = {
   entry: './public/main.js',
   output: {
      filename: 'bundle.js',
   },
   devServer: {
      port: 8080
   },
   module: {
      loaders: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['es2015', 'react']
            }
         }
      ]
   }
}
module.exports = config;

