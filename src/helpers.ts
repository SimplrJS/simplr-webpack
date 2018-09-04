import * as path from "path";
import * as fs from "fs-extra";

export namespace Helpers {
    export const POSTCSS_CONFIG_NAME: string = "postcss.config.js";
    export const DEFAULT_POSTCSS_CONFIG_LOCATION: string = path.resolve(__dirname, "../assets", POSTCSS_CONFIG_NAME);
    export const TSLINT_CONFIG_NAME: string = "tslint.json";
    export const DEFAULT_TSLINT_CONFIG_LOCATION: string = path.resolve(__dirname, "../assets", TSLINT_CONFIG_NAME);
    export const TS_CONFIG_NAME: string = "tsconfig.json";
    export const DEFAULT_TS_CONFIG_LOCATION: string = path.resolve(__dirname, "../assets", TS_CONFIG_NAME);

    export function checkPostCssConfig(projectDirectory: string): void {
        const configLocation = path.resolve(projectDirectory, POSTCSS_CONFIG_NAME);

        if (!fs.pathExistsSync(configLocation)) {
            console.info(`File "${POSTCSS_CONFIG_NAME}" not found at ${configLocation}. Creating...`);
            fs.copySync(DEFAULT_POSTCSS_CONFIG_LOCATION, configLocation);
            console.info("Created.");
        }
    }

    export function checkTslintConfig(projectDirectory: string): void {
        const configLocation = path.resolve(projectDirectory, TSLINT_CONFIG_NAME);

        if (!fs.pathExistsSync(configLocation)) {
            console.info(`File "${TSLINT_CONFIG_NAME}" not found at ${configLocation}. Creating...`);
            fs.copySync(DEFAULT_TSLINT_CONFIG_LOCATION, configLocation);
            console.info("Created.");
        }
    }

    export function checkTsConfig(projectDirectory: string): void {
        const configLocation = path.resolve(projectDirectory, TS_CONFIG_NAME);

        if (!fs.pathExistsSync(configLocation)) {
            console.info(`File "${TS_CONFIG_NAME}" not found at ${configLocation}. Creating...`);
            fs.copySync(DEFAULT_TS_CONFIG_LOCATION, configLocation);
            console.info("Created.");
        }
    }
}
