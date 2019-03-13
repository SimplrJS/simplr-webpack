import WriteFileWebpackPlugin from "write-file-webpack-plugin";
import { Plugin } from "../../builder";

export const WriteFilePlugin: Plugin = (config, projectDirectory) => {
    return webpack => {
        if (webpack.plugins == null) {
            webpack.plugins = [];
        }
        webpack.plugins.push(new WriteFileWebpackPlugin());
        return webpack;
    };
}
