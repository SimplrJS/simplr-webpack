import * as path from "path";
import { Configuration } from "webpack";
import * as WriteFilePlugin from "write-file-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as CleanWebpackPlugin from "clean-webpack-plugin";
import * as HtmlWebpackTemplate from "html-webpack-template";
import { Options } from "html-webpack-template";
import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as fs from "fs-extra";

import { SimplrWebpackOptions } from "./contracts";

const POSTCSS_CONFIG_NAME: string = "postcss.config.js";
const DEFAULT_POSTCSS_CONFIG_LOCATION: string = path.resolve(__dirname, "../assets", POSTCSS_CONFIG_NAME);
const TSLINT_CONFIG_NAME: string = "tslint.json";
const DEFAULT_TSLINT_CONFIG_LOCATION: string = path.resolve(__dirname, "../assets", TSLINT_CONFIG_NAME);
const TSCONFIG_NAME: string = "tsconfig.json";
const DEFAULT_TSCONFIG_LOCATION: string = path.resolve(__dirname, "../assets", TSCONFIG_NAME);

function checkCostCssConfig(projectDirectory: string): void {
    const configLocation = path.resolve(projectDirectory, POSTCSS_CONFIG_NAME);

    if (!fs.pathExistsSync(configLocation)) {
        console.info(`File "${POSTCSS_CONFIG_NAME}" not found at ${configLocation}. Creating...`);
        fs.copySync(DEFAULT_POSTCSS_CONFIG_LOCATION, configLocation);
        console.info("Created.");
    }
}

function checkTslintConfig(projectDirectory: string): void {
    const configLocation = path.resolve(projectDirectory, TSLINT_CONFIG_NAME);

    if (!fs.pathExistsSync(configLocation)) {
        console.info(`File "${TSLINT_CONFIG_NAME}" not found at ${configLocation}. Creating...`);
        fs.copySync(DEFAULT_TSLINT_CONFIG_LOCATION, configLocation);
        console.info("Created.");
    }
}

function checkTsConfig(projectDirectory: string): void {
    const configLocation = path.resolve(projectDirectory, TSCONFIG_NAME);

    if (!fs.pathExistsSync(configLocation)) {
        console.info(`File "${TSCONFIG_NAME}" not found at ${configLocation}. Creating...`);
        fs.copySync(DEFAULT_TSCONFIG_LOCATION, configLocation);
        console.info("Created.");
    }
}

export function generateWebpackConfig(opts: SimplrWebpackOptions): Configuration {
    const options: Required<SimplrWebpackOptions> = {
        ...opts,
        htmlOptions: opts.htmlOptions || ({} as Options),
        devServerPort: opts.devServerPort || 3000,
        entryFile: opts.entryFile || "./src/index.ts",
        outputDirectory: opts.outputDirectory || "./wwwroot",
        staticContentDirectory: opts.staticContentDirectory || "./src/static",
        staticContentDirectoryOutput: opts.staticContentDirectoryOutput || "./static",
        fontsDirectoryOutput: opts.fontsDirectoryOutput || "./fonts",
        emitHtml: opts.emitHtml != null ? opts.emitHtml : true,
        target: opts.target || "web"
    };
    const fullOutputDirectoryLocation = path.resolve(options.projectDirectory, options.outputDirectory);
    const fullTsconfigLocation = path.resolve(options.projectDirectory, TSCONFIG_NAME);

    try {
        checkCostCssConfig(options.projectDirectory);
    } catch (error) {
        console.error(`Failed while initiating "${POSTCSS_CONFIG_NAME}".`, error);
    }

    try {
        checkTsConfig(options.projectDirectory);
    } catch (error) {
        console.error(`Failed while initiating "${TSCONFIG_NAME}".`, error);
    }

    try {
        checkTslintConfig(options.projectDirectory);
    } catch (error) {
        console.error(`Failed while initiating "${TSLINT_CONFIG_NAME}".`, error);
    }

    return {
        entry: options.entryFile,
        output: {
            filename: "[name].bundle.js",
            chunkFilename: "[name].bundle.js",
            path: fullOutputDirectoryLocation,
            publicPath: "/"
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
                        name: `./${options.fontsDirectoryOutput}/[name].[ext]`
                    },
                    loader: "file-loader"
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin([fullOutputDirectoryLocation], { root: options.projectDirectory }),
            new WriteFilePlugin(),
            ...(!opts.emitHtml
                ? []
                : [
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
                          ],
                          ...options.htmlOptions
                      } as Options)
                  ]),
            new ForkTsCheckerWebpackPlugin({
                checkSyntacticErrors: true,
                tslint: true
            }),
            new CopyWebpackPlugin([
                {
                    from: options.staticContentDirectory,
                    to: options.staticContentDirectoryOutput
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
        devServer:
            opts.target === "node"
                ? {}
                : {
                      contentBase: fullOutputDirectoryLocation,
                      compress: true,
                      host: "0.0.0.0",
                      quiet: false,
                      port: options.devServerPort,
                      historyApiFallback: true
                  },
        target: opts.target,
        mode: "development",
        node:
            opts.target === "node"
                ? {}
                : {
                      fs: "empty",
                      net: "empty",
                      tls: "empty"
                  }
    };
}
