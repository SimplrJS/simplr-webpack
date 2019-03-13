import { Plugin } from "../../builder";
import * as path from "path";

const HOST: string = "0.0.0.0";
const DEFAULT_PORT: number = 3000;
const DEFAULT_OUTPUT_LOCATION: string = "./dist";

export const WebDevPlugin: Plugin = (config, projectDirectory) => {
    return webpack => {
        if (webpack.devServer == null) {
            webpack.devServer = {};
        }
        webpack.devServer = {
            contentBase: path.resolve(projectDirectory, DEFAULT_OUTPUT_LOCATION),
            compress: true,
            host: HOST,
            quiet: false,
            port: DEFAULT_PORT,
            historyApiFallback: true
        };

        return webpack;
    };
};
