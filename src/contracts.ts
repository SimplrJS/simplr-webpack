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
    entryFile?: string;
    outputDirectory?: string;
    staticContentDirectory?: string;
    /**
     * Full path is: {outputDirectory} + {staticContentDirectoryOutput}
     * Example: `./dist` + `./static` = `./dist/static`
     */
    staticContentDirectoryOutput?: string;
    target?: SimplrWebpackTarget;
}
