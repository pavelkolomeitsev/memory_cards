const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/app.ts",
    devtool: "source-map",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    }
};