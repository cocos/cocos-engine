const globalJsb = globalThis.jsb ?? {};

export const native = {
    DownloaderHints: globalJsb.DownloaderHints,
    Downloader: globalJsb.Downloader,
    zipUtils: globalJsb.zipUtils,
    fileUtils: globalJsb.fileUtils,
    DebugRenderer: globalJsb.DebugRenderer,
};
