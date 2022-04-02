cc.game.restart = function () {
};

cc.game._setAnimFrame = function () {
    const frameRate = this._frameRate;
    this._frameTime = 1000 / frameRate;
    ral.setPreferredFramesPerSecond(frameRate);
    window.rAF = window.requestAnimationFrame;
    window.cAF = window.cancelAnimationFrame;
};

ral.onWindowResize && ral.onWindowResize(function (width, height) {
    // Since the initialization of the creator engine may not take place until after the onWindowResize call,
    // you need to determine whether the canvas already exists before you can call the setCanvasSize method
    cc.game.canvas && cc.view.setCanvasSize(width, height);
});
