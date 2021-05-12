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

    // need to fix ttf font black border at the sdk verion lower than 2.0.0
    let sysInfo = tt.getSystemInfoSync();
    if (Number.parseInt(sysInfo.SDKVersion[0]) < 2) {
        let _originUpdateBlendFunc = Label.prototype._updateBlendFunc;
        let gfxBlendFactor = cc.gfx.BlendFactor;
        Object.assign(Label.prototype, {
            _updateBlendFunc () {
                _originUpdateBlendFunc.call(this);
                // only fix when srcBlendFactor is SRC_ALPHA
                if (this.srcBlendFactor !== gfxBlendFactor.SRC_ALPHA
                    || isDevTool || this.font instanceof cc.BitmapFont) {
                    return;
                }
                // Premultiplied alpha on runtime when sdk verion is lower than 2.0.0
                this.srcBlendFactor = gfxBlendFactor.ONE;
            },
        });
    }
}
