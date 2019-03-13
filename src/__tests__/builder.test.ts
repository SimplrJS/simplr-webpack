jest.mock("fork-ts-checker-webpack-plugin");
import { Configuration } from "webpack";
import { Builder } from "../builder";
import * as path from "path";
import * as fs from "fs-extra";
import { TypeScriptPlugin } from "../plugins/simplr-webpack-ts/simplr-webpack-ts";
import { StylesPlugin } from "../plugins/simplr-webpack-styles/simplr-webpack-styles";
import { ImagesPlugin } from "../plugins/simplr-webpack-images/simplr-webpack-images";
import { CleanPlugin } from "../plugins/simplr-wepack-clean/simplr-wepack-clean";

let SAMPLE_CONFIGURATION: Configuration = {};
const TEST_PROJECT_LOCATION: string = path.resolve(__dirname, "../../");

beforeEach(() => {
    SAMPLE_CONFIGURATION = {
        entry: "./src/index.ts",
        mode: "development",
        output: {
            path: path.resolve(TEST_PROJECT_LOCATION, "dist"),
            filename: "index.js"
        }
    };
});


it("Simple configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("No configuration given", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION)
        .update(webpack => {
            webpack.entry = SAMPLE_CONFIGURATION.entry;
            webpack.output = SAMPLE_CONFIGURATION.output;
            return webpack;
        })
        .toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Update simple configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .update(webpack => {
            webpack.mode = "production";
            return webpack;
        })
        .toConfig();

    expect(configuration).toMatchSnapshot();
});

it("No entry file given to configuration", () => {
    const noEntryFileDefined = Object.assign({}, SAMPLE_CONFIGURATION);
    noEntryFileDefined.entry = undefined;
    const configuration = new Builder(TEST_PROJECT_LOCATION, noEntryFileDefined);

    expect(() => configuration.toConfig()).toThrowError("[Simplr Webpack] Entry file is undefined.");
});

it("No configuration output given", () => {
    const noOutputDefined = Object.assign({}, SAMPLE_CONFIGURATION);
    noOutputDefined.output = undefined;
    const configuration = new Builder(TEST_PROJECT_LOCATION, noOutputDefined);

    expect(() => configuration.toConfig()).toThrowError("[Simplr Webpack] Output directory is undefined.");
});

it("Adding typescript plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(TypeScriptPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("baseURL exists at tsconfig", () => {
    const projectLocation = path.resolve(__dirname, "./tsconfig-baseURL-exist");
    const configuration = new Builder(projectLocation, SAMPLE_CONFIGURATION).use(TypeScriptPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("tsconfig with single space baseUrl", () => {
    const configuration = new Builder(path.resolve(__dirname, "./empty-space-baseURL"), SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin)
        .toConfig();
    expect(configuration).toMatchSnapshot();
});
it("tsconfig jsx property exist", () => {
    const configuration = new Builder(path.resolve(__dirname, "./tsconfig-jsx-exist"), SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin)
        .toConfig();
    expect(configuration).toMatchSnapshot();
});

it("tsconfig and tslint do not exist", () => {
    const projectLocation = path.resolve(__dirname, "./tsconfig-tslint-not-exist");
    fs.emptyDir(projectLocation);
    const configuration = new Builder(projectLocation, SAMPLE_CONFIGURATION).use(TypeScriptPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Adding styles plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION).use(StylesPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("PostCss config do not exist", () => {
    const projectLocation = path.resolve(__dirname, "./postcss-config-not-exist");
    fs.emptyDir(projectLocation);
    const configuration = new Builder(projectLocation, SAMPLE_CONFIGURATION).use(StylesPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});
it("Adding more than one plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(StylesPlugin)
        .use(TypeScriptPlugin)
        .toConfig();
    expect(configuration).toMatchSnapshot();
});
it("Adding image plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin)
        .use(StylesPlugin)
        .use(ImagesPlugin)
        .toConfig();
    expect(configuration).toMatchSnapshot();
});
it("Adding clean plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin)
        .use(StylesPlugin)
        .use(ImagesPlugin)
        .use(CleanPlugin)
        .toConfig();
    expect(configuration).toMatchSnapshot();
});
