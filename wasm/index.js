
let useWasm = window._CCSettings.supportWasm && !!window.WebAssembly;

let modules = [
    require('./box2d')
];

window.loadWasmModules = function (cb) {
    if (modules.length === 0) {
        if (cb) cb();
        return;
    }

    let i = 0;
    function loadModule () {
        if (i >= modules.length) {
            if (cb) cb();
            return;
        }

        modules[i++].load(useWasm, loadModule);
    }

    loadModule();
};

