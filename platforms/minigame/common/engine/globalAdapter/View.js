function adaptView (viewProto) {
    Object.assign(viewProto, {
        _adjustViewportMeta () {
            // minigame not support
        },

        setRealPixelResolution (width, height, resolutionPolicy) {
            // Reset the resolution size and policy
            this.setDesignResolutionSize(width, height, resolutionPolicy);
        },

        enableAutoFullScreen (enabled) {
            cc.warn('cc.view.enableAutoFullScreen() is not supported on minigame platform.');
        },

        isAutoFullScreenEnabled () {
            return false;
        },

        setCanvasSize () {
            cc.warn('cc.view.setCanvasSize() is not supported on minigame platform.');
        },

        setFrameSize () {
            cc.warn('frame size is readonly on minigame platform.');
        },

        _initFrameSize () {
            let locFrameSize = this._frameSize;
            if (__globalAdapter.isSubContext) {
                let sharedCanvas = window.sharedCanvas || __globalAdapter.getSharedCanvas();
                locFrameSize.width = sharedCanvas.width;
                locFrameSize.height = sharedCanvas.height;
            }
            else {
                locFrameSize.width = window.innerWidth;
                locFrameSize.height = window.innerHeight;
            }
        },
    });
}

module.exports = adaptView;