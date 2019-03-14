import * as path from "path";
import * as fs from "fs-extra";
import { Plugin } from "../../builder";

// Extensions.
const CSS_EXTENSION: string = ".css";
const SCSS_EXTENSION: string = ".scss";

// Postcss.config.js
const POSTCSS_CONFIG_NAME: string = "postcss.config.js";
const DEFAULT_POSTCSS_CONFIG_LOCATION: string = path.resolve(__dirname, POSTCSS_CONFIG_NAME);

// Fonts location.
const FONTS_OUTPUT_LOCATION: string = "./assets/fonts";
// Public path
const PUBLIC_PATH: string = "./";

interface StylesPluginOptions {
    fontsOutputLocation?: string;
    fontsPublicPath?: string;
}

export const StylesPlugin: Plugin<StylesPluginOptions> = (config, projectDirectory) => {
    try {
        checkPostCssConfig(projectDirectory);
    } catch (error) {
        console.error(`Failed while initiating "${POSTCSS_CONFIG_NAME}".`, error);
    }

    return webpack => {
        if (webpack.module == null) {
            webpack.module = {
                rules: []
            };
        }

        const fontsOutputLocation: string =
            config != null && config.fontsOutputLocation != null ? config.fontsOutputLocation : FONTS_OUTPUT_LOCATION;

        const fontsPublicPath: string = config != null && config.fontsPublicPath != null ? config.fontsPublicPath : PUBLIC_PATH;

        webpack.module.rules.push(
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
                    name: `${fontsOutputLocation}/[name].[ext]`,
                    publicPath: fontsPublicPath,
                    limit: 10000
                },
                loader: "url-loader"
            }
        );

        if (webpack.resolve == null) {
            webpack.resolve = {};
        }

        if (webpack.resolve.extensions == null) {
            webpack.resolve.extensions = [];
        }

        if (webpack.resolve.extensions.indexOf(CSS_EXTENSION) === -1) {
            webpack.resolve.extensions.push(CSS_EXTENSION);
        }

        if (webpack.resolve.extensions.indexOf(SCSS_EXTENSION) === -1) {
            webpack.resolve.extensions.push(SCSS_EXTENSION);
        }

        return webpack;
    };
};

export function checkPostCssConfig(projectDirectory: string): void {
    const configLocation = path.resolve(projectDirectory, POSTCSS_CONFIG_NAME);

    if (!fs.pathExistsSync(configLocation)) {
        console.info(`File "${POSTCSS_CONFIG_NAME}" not found at ${configLocation}. Creating...`);
        fs.copySync(DEFAULT_POSTCSS_CONFIG_LOCATION, configLocation);
        console.info("Created.");
    }
}
