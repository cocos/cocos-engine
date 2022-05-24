const renderer = cc.renderer;
const game = cc.game;
let _frameRate = 60;

Object.assign(game, {
    setFrameRate (frameRate) {
        _frameRate = frameRate;
        if (__globalAdapter.setPreferredFramesPerSecond) {
            __globalAdapter.setPreferredFramesPerSecond(frameRate);
        }
        else {
            this._paused = true;
            this._setAnimFrame();
        }
    },

    getFrameRate () {
        return _frameRate;
    },
});
