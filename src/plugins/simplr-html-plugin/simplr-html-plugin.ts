import HtmlWebpackPlugin from "html-webpack-plugin";
import HtmlWebpackTemplate from "html-webpack-template";
import { Plugin } from "../../builder";

interface HtmlPluginOptions {
    options?: HtmlWebpackPlugin.Options;
}

export const HtmlPlugin: Plugin<HtmlPluginOptions> = (config, projectDirectory) => webpack => {
    if (webpack.plugins == null) {
        webpack.plugins = [];
    }

    let htmlPluginOptions: HtmlWebpackPlugin.Options | undefined = {
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
    };

    if (config != null) {
        htmlPluginOptions = config.options;
    }

    webpack.plugins.push(new HtmlWebpackPlugin(htmlPluginOptions));
    return webpack;
};
