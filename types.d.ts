declare module "fork-ts-checker-webpack-plugin";

declare module "write-file-webpack-plugin";

declare module "worker-loader!*" {
    namespace WorkerLoaderWorker {}
    class WorkerLoaderWorker extends Worker {
        constructor();
    }

    export = WorkerLoaderWorker;
}
