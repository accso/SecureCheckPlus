const common = require("./webpack.common")
const {merge} = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    devtool: false,
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: false,
        })]
    },
})
