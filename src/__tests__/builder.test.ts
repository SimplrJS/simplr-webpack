jest.mock("fork-ts-checker-webpack-plugin");
import { Configuration } from "webpack";
import * as path from "path";
import * as fs from "fs-extra";
// Config builder
import { Builder } from "../builder";
// Plugins
import { TypeScriptPlugin } from "../plugins/simplr-webpack-ts/simplr-webpack-ts";
import { StylesPlugin } from "../plugins/simplr-webpack-styles/simplr-webpack-styles";
import { ImagesPlugin } from "../plugins/simplr-webpack-images/simplr-webpack-images";
import { CleanPlugin } from "../plugins/simplr-wepack-clean/simplr-wepack-clean";
import { HtmlPlugin } from "../plugins/simplr-html-plugin/simplr-html-plugin";
import { WriteFilePlugin } from "../plugins/simplr-webpack-write-file/simplr-webpack-write-files";
import { CopyPlugin } from "../plugins/simplr-copy-plugin/simplr-copy-plugin";
import { WebDevPlugin } from "../plugins/simplr-web-dev/simplr-web-dev";

let SAMPLE_CONFIGURATION: Configuration = {};
const TEST_PROJECT_LOCATION: string = path.resolve(__dirname, "../../");

beforeEach(() => {
    SAMPLE_CONFIGURATION = {
        entry: "./src/index.ts",
        mode: "development",
        output: {
            path: path.resolve(TEST_PROJECT_LOCATION, "dist"),
            filename: "[name].bundle.js",
            chunkFilename: "[name].bundle.js",
            publicPath: "./"
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

it("Adding typescript plugin with fork-ts-checker-webpack-plugin options to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin, {
            forkTsCheckerOptions: {
                formatter: "codeframe",
                silent: true,
                colors: true,
                checkSyntacticErrors: false
            }
        })
        .toConfig();

    expect(configuration).toMatchSnapshot();
});

it("Adding typescript plugin with tsconfigPathsPluginOptions to configuration that tsconfig.json do not have baseURL", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION);

    expect(() =>
        configuration
            .use(TypeScriptPlugin, {
                tsconfigPathsPluginOptions: { configFile: path.resolve(TEST_PROJECT_LOCATION, "tsconfig.json") }
            })
            .toConfig()
    ).toThrowError("Cannot add tsconfigPathsPluginOptions because baseUrl do not exist at tsconfig.json");
});

it("Adding typescript plugin with tsconfigPathsPluginOptions to configuration", () => {
    const projectLocation = path.resolve(__dirname, "./tsconfig-baseURL-exist");
    const configuration = new Builder(projectLocation, SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin, {
            tsconfigPathsPluginOptions: {
                logLevel: "INFO"
            }
        })
        .toConfig();

    expect(configuration).toMatchSnapshot();
});

it("baseURL exists at tsconfig", () => {
    const projectLocation = path.resolve(__dirname, "./tsconfig-baseURL-exist");
    const configuration = new Builder(projectLocation, SAMPLE_CONFIGURATION).use(TypeScriptPlugin).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("baseURL exists at tsconfig and adding tsconfigPathsPluginOptions", () => {
    const projectLocation = path.resolve(__dirname, "./tsconfig-baseURL-exist");
    const configuration = new Builder(projectLocation, SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin, {
            tsconfigPathsPluginOptions: { configFile: path.resolve(projectLocation, "tsconfig.json") }
        })
        .toConfig();
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

it("Adding html plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin)
        .use(StylesPlugin)
        .use(ImagesPlugin)
        .use(CleanPlugin)
        .use(HtmlPlugin)
        .toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Adding write file plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin)
        .use(StylesPlugin)
        .use(ImagesPlugin)
        .use(CleanPlugin)
        .use(WriteFilePlugin)
        .use(HtmlPlugin)
        .toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Adding copy plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin)
        .use(StylesPlugin)
        .use(ImagesPlugin)
        .use(CleanPlugin)
        .use(WriteFilePlugin)
        .use(HtmlPlugin)
        .use(CopyPlugin)
        .toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Adding web dev plugin to configuration", () => {
    const configuration = new Builder(TEST_PROJECT_LOCATION, SAMPLE_CONFIGURATION)
        .use(TypeScriptPlugin)
        .use(StylesPlugin)
        .use(ImagesPlugin)
        .use(CleanPlugin)
        .use(WriteFilePlugin)
        .use(HtmlPlugin)
        .use(CopyPlugin)
        .use(WebDevPlugin)
        .toConfig();
    expect(configuration).toMatchSnapshot();
});
