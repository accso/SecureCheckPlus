const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    entry: {
        app: "./src/App.tsx",
        login: "./src/Login.tsx"
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".tsx", ".ts", ".js", ".jsx"]
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    devtool: false,
    cache: true,
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            },
            {
                test: /\.(css)$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader"
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "./dist"),
        publicPath: '/'
    },
    plugins: [
        // Main app bundle – served by nginx for all authenticated routes
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['app'],
        }),
        // Login bundle – served by nginx at /login
        new HtmlWebpackPlugin({
            template: './src/login.html',
            filename: 'login.html',
            chunks: ['login'],
        }),
        new webpack.DefinePlugin({
            'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || ''),
        })
    ],
}
