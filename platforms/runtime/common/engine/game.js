cc.game.restart = function () {
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
