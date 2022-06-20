const globalJsb = globalThis.jsb ?? {};

export const native = {
    Downloader: globalJsb.Downloader,
    zipUtils: globalJsb.ZipUtils,
};
