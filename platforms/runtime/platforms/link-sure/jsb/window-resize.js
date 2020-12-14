window.jsb = window.jsb || {};

const _onWindowResize = wuji.onWindowResize;
jsb.onWindowResize = function (callBack) {
    _onWindowResize(function (size) {
        let pixelRatio = jsb.pixelRatio;
        let width = (size.width || size.windowWidth) / pixelRatio,
            height = (size.height || size.windowHeight) / pixelRatio;
        jsb.width = width;
        jsb.height = height;
        callBack(width, height);
    });
};

// 屏蔽废弃的函数
window.resize = function () {};