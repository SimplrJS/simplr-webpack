import * as path from "path";
import { Configuration } from "webpack";
import * as WriteFilePlugin from "write-file-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as CleanWebpackPlugin from "clean-webpack-plugin";
import * as HtmlWebpackTemplate from "html-webpack-template";
import { Options } from "html-webpack-template";
import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin/lib";
import * as CopyWebpackPlugin from "copy-webpack-plugin";

import { SimplrWebpackOptions } from "./contracts";
import { Helpers } from "./helpers";

export function getDefaultWebOptions(): Partial<SimplrWebpackOptions> {
    return {
        htmlOptions: {} as Options,
        devServerPort: 3000,
        entryFile: "./src/index.ts",
        outputDirectory: "./wwwroot",
        staticContentDirectory: "./src/static",
        staticContentDirectoryOutput: "./static",
        fontsDirectoryOutput: "./assets/fonts",
        imagesDirectoryOutput: "./assets/images",
        emitHtml: true,
        target: "web",
        publicPath: "/"
    };
}

export function getDefaultNodeOptions(): Partial<SimplrWebpackOptions> {
    return {
        devServerPort: 3000,
        entryFile: "./src/index.ts",
        outputDirectory: "./dist",
        target: "node"
    };
}

export function generateWebpackConfig(options: SimplrWebpackOptions): Configuration {
    if (options.entryFile == null) {
        throw new Error("[Simplr Webpack] Entry file is undefined.");
    }
    if (options.outputDirectory == null) {
        throw new Error("[Simplr Webpack] Output directory is undefined.");
    }

    const fullOutputDirectoryLocation = path.resolve(options.projectDirectory, options.outputDirectory);
    const fullTsconfigLocation = path.resolve(options.projectDirectory, Helpers.TS_CONFIG_NAME);

    try {
        Helpers.checkPostCssConfig(options.projectDirectory);
    } catch (error) {
        console.error(`Failed while initiating "${Helpers.POSTCSS_CONFIG_NAME}".`, error);
    }

    try {
        Helpers.checkTsConfig(options.projectDirectory);
    } catch (error) {
        console.error(`Failed while initiating "${Helpers.TS_CONFIG_NAME}".`, error);
    }

    try {
        Helpers.checkTslintConfig(options.projectDirectory);
    } catch (error) {
        console.error(`Failed while initiating "${Helpers.TSLINT_CONFIG_NAME}".`, error);
    }

    return {
        entry: options.entryFile,
        output: {
            filename: "[name].bundle.js",
            chunkFilename: "[name].bundle.js",
            path: fullOutputDirectoryLocation,
            publicPath: options.publicPath
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json", ".scss", ".css"],
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: fullTsconfigLocation
                })
            ]
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
                },
                {
                    test: /\.scss$/,
                    use: [
                        // Creates style nodes from JS strings.
                        "style-loader",
                        // // Translates CSS into CommonJS.
                        // "css-loader",
                        // Autoprefixer
                        "postcss-loader",
                        // Compiles Sass to CSS.
                        "sass-loader"
                    ]
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    options: {
                        name: `./${options.fontsDirectoryOutput}/[name].[ext]`,
                        publicPath: options.publicPath,
                        limit: 10000
                    },
                    loader: "url-loader"
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    options: {
                        name: `./${options.imagesDirectoryOutput}/[name].[ext]`,
                        publicPath: options.publicPath,
                        limit: 10000
                    },
                    loader: "url-loader"
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin([fullOutputDirectoryLocation], { root: options.projectDirectory }),
            new WriteFilePlugin(),
            ...(!options.emitHtml
                ? []
                : [
                      new HtmlWebpackPlugin({
                          inject: false,
                          template: HtmlWebpackTemplate,
                          baseHref: "/",
                          appMountIds: ["root"],
                          meta: [
                              {
                                  name: "viewport",
                                  content: "width=device-width, initial-scale=1"
                              }
                          ],
                          ...options.htmlOptions
                      } as Options)
                  ]),
            new ForkTsCheckerWebpackPlugin({
                checkSyntacticErrors: true,
                tslint: true
            }),
            ...(options.staticContentDirectory != null && options.staticContentDirectoryOutput != null
                ? [
                      new CopyWebpackPlugin([
                          {
                              from: options.staticContentDirectory,
                              to: options.staticContentDirectoryOutput
                          }
                      ])
                  ]
                : [])
        ],
        optimization: {
            splitChunks: {
                chunks: "all"
            }
        },
        // addition - add source-map support
        devtool: "inline-source-map",
        devServer:
            options.target === "node"
                ? {}
                : {
                      contentBase: fullOutputDirectoryLocation,
                      compress: true,
                      host: "0.0.0.0",
                      quiet: false,
                      port: options.devServerPort,
                      historyApiFallback: true
                  },
        target: options.target,
        mode: "development",
        node:
            options.target === "node"
                ? {}
                : {
                      fs: "empty",
                      net: "empty",
                      tls: "empty"
                  }
    };
}
