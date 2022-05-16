

// SystemJS support.
window.self = window;
require("src/system.bundle.js");

const importMapJson = jsb.fileUtils.getStringFromFile("src/import-map.json");
const importMap = JSON.parse(importMapJson);
System.warmup({
    importMap,
    importMapUrl: 'src/import-map.json',
    defaultHandler: (urlNoSchema) => {
        require(urlNoSchema.startsWith('/') ? urlNoSchema.substr(1) : urlNoSchema);
    },
});

System.import('./src/application.js').then(({ createApplication }) => {
    return createApplication({
        loadJsListFile: (url) => require(url),
        fetchWasm: (url) => url,
    });
}).then((application) => {
    return application.import('cc').then((cc) => {
        require('jsb-adapter/jsb-engine.js');
        cc.macro.CLEANUP_IMAGE_CACHE = false;
    }).then(() => {
        return application.start({
            settings: window._CCSettings,
            findCanvas: () => {
                var container = document.createElement('div');
                var frame = document.documentElement;
                var canvas = window.__canvas;
                return { frame, canvas, container };
            },
        });
    });
}).catch((err) => {
    console.error(err.toString());
});
