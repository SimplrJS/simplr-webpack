import { Plugin } from "../../builder";

// TODO: Add to default options.
// Fonts location.
const IMAGES_OUTPUT_LOCATION: string = "assets/images";
const PUBLIC_PATH: string = "/";

export const ImagesPlugin: Plugin = (config, projectDirectory) => {
    return webpack => {
        if (webpack.module == null) {
            webpack.module = {
                rules: []
            };
        }

        webpack.module.rules.push({
            test: /\.(png|jpg|gif|svg)$/,
            options: {
                name: `./${IMAGES_OUTPUT_LOCATION}/[name].[ext]`,
                publicPath: PUBLIC_PATH,
                limit: 10000
            },
            loader: "url-loader"
        });
        return webpack;
    };
};
