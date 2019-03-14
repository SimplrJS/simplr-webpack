import { Plugin } from "../../builder";

// TODO: Add to default options.
// Fonts location.
const IMAGES_OUTPUT_LOCATION: string = "assets/images";
const PUBLIC_PATH: string = "/";

interface ImagesPluginOptions {
    imagesOutputLocation?: string;
    publicPath?: string;
}

export const ImagesPlugin: Plugin<ImagesPluginOptions> = (config, projectDirectory) => webpack => {
    if (webpack.module == null) {
        webpack.module = {
            rules: []
        };
    }

    const imagesOutputLocation: string =
        config != null && config.imagesOutputLocation != null ? config.imagesOutputLocation : IMAGES_OUTPUT_LOCATION;
    const publicPath: string = config != null && config.publicPath != null ? config.publicPath : PUBLIC_PATH;

    webpack.module.rules.push({
        test: /\.(png|jpg|gif|svg)$/,
        options: {
            name: `./${imagesOutputLocation}/[name].[ext]`,
            publicPath: publicPath,
            limit: 10000
        },
        loader: "url-loader"
    });
    return webpack;
};
