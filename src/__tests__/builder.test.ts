import { Builder } from "../builder";
import path from "path";
import { TypeScriptPlugin } from "../plugins/simplr-webpack-ts/simplr-webpack-ts";

it("simple test", () => {
    const configuration = new Builder(__dirname)
        .update(webpack => {
            webpack.mode = "production";
            return webpack;
        })
        .toConfig();

    expect(configuration).toMatchSnapshot();
});

it("Simple configuration", () => {
    const configuration = new Builder(__dirname)
        .update(webpack => {
            webpack.mode = "development";
            webpack.output = {
                path: path.resolve(__dirname, "dist"),
                filename: "index.js"
            };
            webpack.entry = "./src/index.ts";
            return webpack;
        })
        .toConfig();

    expect(configuration).toMatchSnapshot();
});

it("constructor", () => {
    const configuration = new Builder(__dirname, {}).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Empty options for plugin for `use` ", () => {
    const configuration = new Builder(__dirname).use(TypeScriptPlugin, undefined).toConfig();
    expect(configuration).toMatchSnapshot();
});

it("Give options for plugin for `use` ", () => {
    const configuration = new Builder(__dirname).use(TypeScriptPlugin, { skipLibCheck: false }).toConfig();
    expect(configuration).toMatchSnapshot();
});
