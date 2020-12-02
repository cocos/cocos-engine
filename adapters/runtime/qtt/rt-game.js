let rt =  loadRuntime();

cc.game.restart = function () {
};

rt && rt.onHide(function (data) {
    cc.game.emit(cc.Game.EVENT_HIDE);
});

rt && rt.onShow(function () {
    cc.game.emit(cc.Game.EVENT_SHOW);
});

rt && rt.onWindowResize && rt.onWindowResize(function () {
    // Since the initialization of the creator engine may not take place until after the onWindowResize call,
    // you need to determine whether the canvas already exists before you can call the setCanvasSize method
    cc.game.canvas && cc.view.setCanvasSize(window.innerWidth, window.innerHeight);
});
