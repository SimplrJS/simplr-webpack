import * as path from "path";
import * as WriteFilePlugin from "write-file-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as CleanWebpackPlugin from "clean-webpack-plugin";
import * as HtmlWebpackTemplate from "html-webpack-template";
import { Options } from "html-webpack-template";
import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import * as CopyWebpackPlugin from "copy-webpack-plugin";

interface SimplrWebpackOptions {
    appPort?: number;
    devServerPort?: number;
}

const simplrWebpackOptions: SimplrWebpackOptions = {
    appPort: 3000,
    devServerPort: 3000
};

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "[name].bundle.js",
        chunkFilename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            babelrc: true,
                            plugins: ["syntax-dynamic-import"]
                        }
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            // disable type checker - we will use it in fork plugin
                            // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
                            happyPackMode: true,
                            transpileOnly: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new WriteFilePlugin(),
        new HtmlWebpackPlugin({
            inject: false,
            template: HtmlWebpackTemplate,
            appMountIds: ["root"],

            links: [
                // {
                //     rel: "stylesheet",
                //     href: "https://use.fontawesome.com/releases/v5.0.10/css/all.css",
                //     integrity: "sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg",
                //     crossorigin: "anonymous"
                // }
            ],
            meta: [
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1"
                }
            ]
        } as Options),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tslint: true
        }),
        new CopyWebpackPlugin([
            {
                from: "src/static"
            }
        ])
    ],
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    // addition - add source-map support
    devtool: "inline-source-map",
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        host: "0.0.0.0",
        quiet: false,
        port: simplrWebpackOptions.appPort
    },
    target: "web",
    mode: "development",
    node: {
        fs: "empty",
        net: "empty",
        tls: "empty"
    }
};
