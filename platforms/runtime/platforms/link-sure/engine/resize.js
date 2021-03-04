let originalResize = window.resize;
let sysInfo = ral.getSystemInfoSync();
let pixelRatio = sysInfo.pixelRatio;

// HACK: window.resize called by platform
window.resize = function (width, height) {
    width /= pixelRatio;
    height /= pixelRatio;
    originalResize.call(window, width, height);
};