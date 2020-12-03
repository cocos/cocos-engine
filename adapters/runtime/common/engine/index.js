require("./windows");

let _cc;
let adaptCC;

Object.defineProperty(window, "cc", {
    get() {
        return _cc;
    },
    set(value) {
        _cc = value;
        adaptCC();
    }
});

let _EditBox;
let _internal;
let _assetManager;
let _view;
let adaptInternal;
adaptCC = function () {
    Object.defineProperty(_cc, "EditBox", {
        get() {
            return _EditBox;
        },
        set(value) {
            _EditBox = value;
            require("./EditBox");
        }
    });
    Object.defineProperty(_cc, "internal", {
        get() {
            return _internal;
        },
        set(value) {
            _internal = value;
            adaptInternal();
        }
    });
    Object.defineProperty(_cc, "assetManager", {
        get() {
            return _assetManager;
        },
        set(value) {
            _assetManager = value;
            require("./aassetManager");
        }
    });
    Object.defineProperty(_cc, "view", {
        get() {
            return _view;
        },
        set(value) {
            _view = value;
            _view._maxPixelRatio = 4;
        }
    });
};

let _inputManager;
adaptInternal = function () {
    Object.defineProperty(_internal, "inputManager", {
        get() {
            return _inputManager;
        },
        set(value) {
            _inputManager = value;
            require("./inputManager");
        }
    });
};