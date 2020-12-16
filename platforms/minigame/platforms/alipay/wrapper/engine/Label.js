if (cc && cc.LabelComponent) {
    // const gfx = cc.gfx;
    const Label = cc.LabelComponent;
    const isDevTool = __globalAdapter.isDevTool;
    // shared label canvas
    let _sharedLabelCanvas = document.createElement('canvas');
    let _sharedLabelCanvasCtx = _sharedLabelCanvas.getContext('2d');
    let canvasData = {
        canvas: _sharedLabelCanvas,
        context: _sharedLabelCanvasCtx,
    };

    cc.game.on(cc.Game.EVENT_ENGINE_INITED, function () {
        Object.assign(Label._canvasPool, {
            get() {
                return canvasData;
            },

            put() {
                // do nothing
            }
        });
    });
}
