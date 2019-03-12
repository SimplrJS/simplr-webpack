import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin/lib";
import { loadTsconfig, Tsconfig } from "tsconfig-paths/lib/tsconfig-loader";
import * as path from "path";
import * as fs from "fs-extra";
import { Plugin } from "../../builder";

// Extensions.
const TS_EXTENSION: string = ".ts";
const TSX_EXTENSION: string = ".tsx";

// Tsconfig.
const TS_CONFIG_NAME: string = "tsconfig.json";
const DEFAULT_TS_CONFIG_LOCATION: string = path.resolve(__dirname, TS_CONFIG_NAME);

// TsLint.
const TSLINT_CONFIG_NAME: string = "tslint.json";
const DEFAULT_TSLINT_CONFIG_LOCATION: string = path.resolve(__dirname, TSLINT_CONFIG_NAME);

interface TypeScriptPluginOptions {
    skipLibCheck: boolean;
}

export const TypeScriptPlugin: Plugin<TypeScriptPluginOptions> = (config, projectDirectory) => {
    const fullTsconfigLocation = path.resolve(projectDirectory, TS_CONFIG_NAME);

    try {
        checkTsConfig(projectDirectory);
    } catch (error) {
        console.error(`Failed while initiating "${TS_CONFIG_NAME}".`, error);
    }

    try {
        checkTslintConfig(projectDirectory);
    } catch (error) {
        console.error(`Failed while initiating "${TSLINT_CONFIG_NAME}".`, error);
    }

    const tsConfig: Tsconfig | undefined = loadTsconfig(fullTsconfigLocation);

    return webpack => {
        if (webpack.plugins == null) {
            webpack.plugins = [];
        }

        webpack.plugins.push(
            new ForkTsCheckerWebpackPlugin({
                checkSyntacticErrors: true,
                tslint: true
            })
        );

        if (webpack.module == null) {
            webpack.module = {
                rules: []
            };
        }

        if (webpack.resolve == null) {
            webpack.resolve = {};
        }

        if (webpack.resolve.plugins == null) {
            webpack.resolve.plugins = [];
        }

        if (
            tsConfig != null &&
            tsConfig.compilerOptions != null &&
            tsConfig.compilerOptions.baseUrl != null &&
            tsConfig.compilerOptions.baseUrl.trim().length !== 0
        ) {
            webpack.resolve.plugins.push(
                new TsconfigPathsPlugin({
                    configFile: fullTsconfigLocation
                })
            );
        }

        if (webpack.resolve.extensions == null) {
            webpack.resolve.extensions = [];
        }

        if (webpack.resolve.extensions.indexOf(TS_EXTENSION) === -1) {
            webpack.resolve.extensions.push(TS_EXTENSION);
        }

        if (webpack.resolve.extensions.indexOf(TSX_EXTENSION) === -1) {
            webpack.resolve.extensions.push(TSX_EXTENSION);
        }

        webpack.module.rules.push({
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
            ],
            exclude: /node_modules/
        });

        return webpack;
    };
};

export function checkTsConfig(projectDirectory: string): void {
    const configLocation = path.resolve(projectDirectory, TS_CONFIG_NAME);

    if (!fs.pathExistsSync(configLocation)) {
        console.info(`File "${TS_CONFIG_NAME}" not found at ${configLocation}. Creating...`);
        fs.copySync(DEFAULT_TS_CONFIG_LOCATION, configLocation);
        console.info("Created.");
    }
}

export function checkTslintConfig(projectDirectory: string): void {
    const configLocation = path.resolve(projectDirectory, TSLINT_CONFIG_NAME);

    if (!fs.pathExistsSync(configLocation)) {
        console.info(`File "${TSLINT_CONFIG_NAME}" not found at ${configLocation}. Creating...`);
        fs.copySync(DEFAULT_TSLINT_CONFIG_LOCATION, configLocation);
        console.info("Created.");
    }
}
