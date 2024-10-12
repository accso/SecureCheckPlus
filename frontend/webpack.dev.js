const common = require("./webpack.common")
const {merge} = require("webpack-merge");
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = merge(common, {
    mode: "development",
    devtool: "eval",
    cache: true,
    devServer: {
        hot: true,
        historyApiFallback: true,
        // static: {
        //    directory: path.join(__dirname, "../backend/assets")
        // },
        headers: {
            'Content-Type': 'application/javascript',
        },
        proxy: {
            // This proxy will forward any request that doesn't match static assets in Webkit
            '**': {
                target: 'http://localhost:8000', // Replace with the URL of the target server
                changeOrigin: true,
                logLevel: "debug",
                secure: false,  // Disable SSL verification if needed
            }
        },
    },
    infrastructureLogging: {
      debug: [name => name.includes('webpack-dev-server')],
    },
    plugins: [new ForkTsCheckerWebpackPlugin()]
})
