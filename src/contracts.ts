export interface SimplrWebpackOptions {
    devServerPort?: number;
    emitHtml?: boolean;
    projectDirectory: string;
    entryFile?: string;
    outputDirectory?: string;
    staticContentDirectory?: string;
    target?: "web" | "node";
}
