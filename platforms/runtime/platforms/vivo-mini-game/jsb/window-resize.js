window.jsb = window.jsb || {};

jsb.onWindowResize = function (callBack) {
    console.warn('jsb.onWindowResize not supported');
};

// 屏蔽废弃的函数
window.resize = function () {};