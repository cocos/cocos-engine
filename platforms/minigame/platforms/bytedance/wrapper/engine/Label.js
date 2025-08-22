if (cc && cc.Label) {
    // const gfx = cc.gfx;
    const Label = cc.Label;

    // shared label canvas
    const _sharedLabelCanvas = document.createElement('canvas');
    const _sharedLabelCanvasCtx = _sharedLabelCanvas.getContext('2d');
    const canvasData = {
        canvas: _sharedLabelCanvas,
        context: _sharedLabelCanvasCtx,
    };

    cc.game.on(cc.Game.EVENT_ENGINE_INITED, () => {
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
