var GameGlobal = getApp().GameGlobal;
exports.adapt = function (canvas, width, height) {
    GameGlobal.canvas = canvas;
    GameGlobal.CCWebAssembly = GameGlobal.WXWebAssembly = WXWebAssembly;
    GameGlobal.requestAnimationFrame = GameGlobal.canvas.requestAnimationFrame || globalThis.setTimeout;
    GameGlobal.cancelAnimationFrame = GameGlobal.canvas.cancelAnimationFrame || globalThis.setTimeout;
    GameGlobal.setTimeout = globalThis.setTimeout;
    GameGlobal.setInterval = globalThis.setInterval;
    GameGlobal.clearTimeout = globalThis.clearTimeout;
    GameGlobal.clearInterval = globalThis.clearInterval;

    let isFirstCall = true;

    wx.createCanvas = function () {
        console.log('wx.createCanvas called');
        if (isFirstCall) {
            isFirstCall = false;
            return canvas;
        } else {
            return wx.createOffscreenCanvas({type:"2d", width: width, height: height});
        }
    }

    wx.createImage = function () {
        console.log('wx.creatImage in miniapp-adapter')
        let image = canvas.createImage();
        return image;
    }

    wx.onTouchStart = function (cb) {
        GameGlobal._touchStart = function (event) {
            handleTouchEvent(event);
            cb(event);
        };
    };
    wx.onTouchMove = function (cb) {
        GameGlobal._touchMove = function (event) {
            handleTouchEvent(event);
            cb(event);
        };
    };
    wx.onTouchEnd = function (cb) {
        GameGlobal._touchEnd = function (event) {
            handleTouchEvent(event);
            cb(event);
        };
    };
    wx.onTouchCancel = function (cb) {
        GameGlobal._touchCancel = function (event) {
            handleTouchEvent(event);
            cb(event);
        };
    };

    wx.onKeyboardInput = function (cb) {
        GameGlobal._onKeyboardInput = function (event) {
            cb(event.detail);
        };
    };

    wx.onKeyboardConfirm = function (cb) {
        GameGlobal._onKeyboardConfirm = function (event) {
            cb(event.detail);
        };
    };

    wx.onKeyboardComplete = function (cb) {
        GameGlobal._onKeyboardComplete = function (event) {
            GameGlobal.indexThis.setData({
                showInput: false,
            });
            cb(event.detail);
        };
    };

    wx.showKeyboard = function (obj) {
        GameGlobal.indexThis.setData({
            showInput: true,
            isPassword: false,
            maxLength: obj.maxLength,
            confirmType: obj.confirmType
        });
    };

    function handleTouchEvent (event) {
        let changedTouches = event.changedTouches;
        if (changedTouches) {
            for (let touch of changedTouches) {
                touch.clientX = touch.x;
                touch.clientY = touch.y;
            }
        }
    }

    //TODO: use wx.onDeviceMotionChange to instead
    wx.onDeviceOrientationChange = function () {
    }
};
