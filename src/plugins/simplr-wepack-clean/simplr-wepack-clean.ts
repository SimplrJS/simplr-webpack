import CleanWebpackPlugin from "clean-webpack-plugin";
import { Plugin } from "../../builder";

export const CleanPlugin: Plugin = (config, projectDirectory) => {
    return webpack => {
        if (webpack.plugins == null) {
            webpack.plugins = [];
        }
        webpack.plugins.push(new CleanWebpackPlugin());
        return webpack;
    };
};
