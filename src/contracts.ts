import { Options } from "html-webpack-template";

// prettier-ignore
export type SimplrWebpackTarget =
    | "web"
    | "node"
    | "electron-renderer";
// | "webworker"
// | "async-node"
// | "node-webkit"
// | "atom"
// | "electron-main";

export interface SimplrWebpackOptions {
    devServerPort?: number;
    emitHtml?: boolean;
    htmlOptions?: Options;
    projectDirectory: string;
    entryFile: string;
    outputDirectory: string;
    staticContentDirectory?: string;
    /**
     * Full path is: {outputDirectory} + {staticContentDirectoryOutput}
     * Example: `./dist` + `./static` = `./dist/static`
     */
    staticContentDirectoryOutput?: string;
    /**
     * Full path is: {outputDirectory} + {fontsDirectoryOutput}
     * Example: `./dist` + `./assets/fonts` = `./dist/assets/fonts`
     */
    fontsDirectoryOutput?: string;
    /**
     * Full path is: {outputDirectory} + {imagesDirectoryOutput}
     * Example: `./dist` + `./assets/images` = `./dist/assets/images`
     */
    imagesDirectoryOutput?: string;
    /**
     * For websites "/" is enough. For electron-renderer "./".
     *
     * Default "/"
     */
    publicPath?: string;
    target?: SimplrWebpackTarget;
}
