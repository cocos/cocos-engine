

export function createApplication(options: ICreateApplicationOptions): Promise<{
    /**
     * Starts the application.
     */
    start(startOptions: IStartApplicationOptions): Promise<void>;

    /**
     * Imports the specified module.
     * @param url 
     */
    import(url: string): Promise<any>;
}>;

interface ICreateApplicationOptions {
    /**
     * Load js-list file hook.
     */
    loadJsListFile: (path: string) => Promise<void>;
}

interface IStartApplicationOptions {
    /**
     * Find canvas hook.
     */
    findCanvas: (canvasName: string) => any;
}
