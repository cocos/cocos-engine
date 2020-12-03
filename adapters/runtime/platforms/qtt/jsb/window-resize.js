let _rt = loadRuntime();
window.jsb = window.jsb || {};

const _onWindowResize = _rt.onWindowResize;
jsb.onWindowResize = function (callBack) {
    _onWindowResize(function (size) {
        callBack(size.width || size.windowWidth, size.height || size.windowHeight);
    });
};

// 屏蔽废弃的函数
window.resize = function () {};