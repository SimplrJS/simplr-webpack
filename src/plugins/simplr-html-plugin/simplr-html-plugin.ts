import HtmlWebpackPlugin from "html-webpack-plugin";
import HtmlWebpackTemplate from "html-webpack-template";
import { Plugin } from "../../builder";

export const HtmlPlugin: Plugin = (config, projectDirectory) => {
    return webpack => {
        if (webpack.plugins == null) {
            webpack.plugins = [];
        }
        webpack.plugins.push(
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
                ]
            })
        );
        return webpack;
    };
};
