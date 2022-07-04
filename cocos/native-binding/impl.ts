const globalJsb = globalThis.jsb ?? {};

export const native = {
    DownloaderHints: globalJsb.DownloaderHints,
    Downloader: globalJsb.Downloader,
    zipUtils: globalJsb.ZipUtils,
    fileUtils: globalJsb.fileUtils,
};
