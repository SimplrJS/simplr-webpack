import { Options } from "html-webpack-template";

export interface SimplrWebpackOptions {
    devServerPort?: number;
    emitHtml?: boolean;
    htmlOptions?: Options;
    projectDirectory: string;
    entryFile?: string;
    outputDirectory?: string;
    staticContentDirectory?: string;
    target?: "web" | "node";
}
