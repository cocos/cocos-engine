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

    onResume() {
        this._native.onResume();
    }

    onPause() {
        this._native.onPause();
    }

    beforeUpdate() {
        this._native.beforeUpdate();
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

    updatePlanesInfo () {
        return this._native.updatePlanesInfo();
    }

    getAddedPlanesInfo () {
        return this._native.getAddedPlanesInfo();
    }

    getRemovedPlanesInfo () {
        return this._native.getRemovedPlanesInfo();
    }

    getUpdatedPlanesInfo () {
        return this._native.getUpdatedPlanesInfo();
    }

    getAddedPlanesCount () {
        return this._native.getAddedPlanesCount();
    }

    getRemovedPlanesCount () {
        return this._native.getRemovedPlanesCount();
    }

    getUpdatedPlanesCount () {
        return this._native.getUpdatedPlanesCount();
    }
}
