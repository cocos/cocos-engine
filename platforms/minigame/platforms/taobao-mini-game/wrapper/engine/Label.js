if (cc && cc.Label) {
    const Label = cc.Label;

    // shared label canvas
    const _sharedLabelCanvas = my.createCanvas();
    const _sharedLabelCanvasCtx = _sharedLabelCanvas.getContext('2d');
    const canvasData = {
        canvas: _sharedLabelCanvas,
        context: _sharedLabelCanvasCtx,
    };
    cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
        Object.assign(Label._canvasPool, {
            get () {
                return canvasData;
            },

            put () {
                // do nothing
            },
        });
    });
}
