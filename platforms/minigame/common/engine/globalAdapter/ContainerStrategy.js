function adaptContainerStrategy (containerStrategyProto) {
    containerStrategyProto._setupContainer = function (view, width, height) {
        let locCanvas = cc.game.canvas;
        // Setup pixel ratio for retina display
        var devicePixelRatio = view._devicePixelRatio = 1;
        if (view.isRetinaEnabled())
            devicePixelRatio = view._devicePixelRatio = Math.min(view._maxPixelRatio, window.devicePixelRatio || 1);
        // Setup canvas
        width *= devicePixelRatio;
        height *= devicePixelRatio;
        // FIX: black screen on Baidu platform
        // reset canvas size may call gl.clear(), especially when you call cc.director.loadScene()
        if (locCanvas.width !== width || locCanvas.height !== height) {
            locCanvas.width = width;
            locCanvas.height = height;
        }
    };
}

module.exports = adaptContainerStrategy;