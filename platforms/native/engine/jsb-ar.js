const ARModule = cc.ARModule;

const JSB_ARModule = jsb.ARModule;

cc.ARModuleHelper.getARConstructor = function () {
    return ARModuleNative;
}

class ARModuleNative extends ARModule {
    constructor() {
        super();
        this._native = new JSB_ARModule();
    }

    start() {
        this._native.start();
    }

    update() {
        this._native.update();
    }

    setCameraTextureName (id) {
        this._native.setCameraTextureName(id);
    }

    getCameraPose () {
        return this._native.getCameraPose();
    }

    getCameraViewMatrix () {
        return this._native.getCameraViewMatrix();
    }

    getCameraProjectionMatrix () {
        return this._native.getCameraProjectionMatrix();
    }
}
