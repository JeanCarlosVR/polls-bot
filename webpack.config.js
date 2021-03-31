//webpack.config.js
const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/Launch.ts",
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    fallback: {
        util: require.resolve("util/"),
        os: require.resolve("os/"),
        fs: require.resolve("fs/"),
        path: require.resolve("path/"),
        cluster: require.resolve("cluster/"),
        stream: false,
        http: false,
        https: false,
        "../../../levels": false,
        zlib: false,
        dgram: false,
        assert: false,
        child_process: false,
        tty: false
    }
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
};