import { NormalizedMessage } from "fork-ts-checker-webpack-plugin/lib/NormalizedMessage";

declare type Formatter = (message: NormalizedMessage, useColors: boolean) => string;

interface Logger {
    error(message?: any): void;
    warn(message?: any): void;
    info(message?: any): void;
}

export interface ForkTsCheckerWebpackPluginOptions {
    typescript: string;
    tsconfig: string;
    compilerOptions: object;
    tslint: string | true;
    tslintAutoFix: boolean;
    watch: string | string[];
    async: boolean;
    ignoreDiagnostics: number[];
    ignoreLints: string[];
    ignoreLintWarnings: boolean;
    reportFiles: string[];
    colors: boolean;
    logger: Logger;
    formatter: "default" | "codeframe" | Formatter;
    formatterOptions: any;
    silent: boolean;
    checkSyntacticErrors: boolean;
    memoryLimit: number;
    workers: number;
    vue: boolean;
    useTypescriptIncrementalApi: boolean;
    measureCompilationTime: boolean;
}
