cc.game.restart = function () {
};

cc.game._setAnimFrame = function () {
    this._lastTime = performance.now();
    const frameRate = this.config.frameRate;
    this._frameTime = 1000 / frameRate;
    ral.setPreferredFramesPerSecond(frameRate);
    window.rAF = window.requestAnimationFrame;
    window.cAF = window.cancelAnimationFrame;
};

ral.onHide(function (data) {
    cc.game.emit(cc.Game.EVENT_HIDE);
});

ral.onShow(function () {
    cc.game.emit(cc.Game.EVENT_SHOW);
});

ral.onWindowResize && ral.onWindowResize(function (width, height) {
    // Since the initialization of the creator engine may not take place until after the onWindowResize call,
    // you need to determine whether the canvas already exists before you can call the setCanvasSize method
    cc.game.canvas && cc.view.setCanvasSize(width, height);
});
