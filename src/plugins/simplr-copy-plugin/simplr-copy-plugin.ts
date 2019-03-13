import CopyWebpackPlugin from "copy-webpack-plugin";
import { Plugin } from "../../builder";

const STATIC_CONTENT_DIRECTORY: string = "./src/static";
const STATIC_CONTENT_DIRECTORY_OUTPUT: string = "./static";

export const CopyPlugin: Plugin = (config, projectDirectory) => {
    return webpack => {
        if (webpack.plugins == null) {
            webpack.plugins = [];
        }
        webpack.plugins.push(
            new CopyWebpackPlugin([
                {
                    from: STATIC_CONTENT_DIRECTORY,
                    to: STATIC_CONTENT_DIRECTORY_OUTPUT
                }
            ])
        );
        return webpack;
    };
};
