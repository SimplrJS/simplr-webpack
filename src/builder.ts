import { Configuration } from "webpack";

export type UpdateHandler = (webpack: Configuration) => Configuration;
export type Plugin<TConfig = any> = (config: TConfig | undefined) => UpdateHandler;

export class Builder {
    constructor(private configuration: Configuration = {}) {}

    public use<TPlugin extends Plugin>(plugin: TPlugin, config?: Parameters<TPlugin>[0]): this {
        this.configuration = plugin(config)(this.configuration);

        return this;
    }

    public update(callback: UpdateHandler): this {
        this.configuration = callback(this.configuration);

        return this;
    }

    public toConfig(): Configuration {
        return this.configuration;
    }
}
