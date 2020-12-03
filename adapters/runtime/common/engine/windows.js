window.__canvas = new HTMLCanvasElement();
if (window.__gl) {
    window.__gl.canvas = window.__canvas;
}
window.document.body.appendChild(window.__canvas);
window.addEventListener("resize", function () {
    window.__canvas.width = window.innerWidth;
    window.__canvas.height = window.innerHeight;
});

// 获取系统语言
window.__getCurrentLanguage = function () {
    return jsb.language;
};

// 获取 cc 中定义的 os 字符串
window.__getOS = function () {
    let platform = jsb.platform.toLowerCase();

    if (platform === "android") {
        return cc.sys.OS_ANDROID;
    } else if (jsb.platform === "ios") {
        return cc.sys.OS_IOS;
    }
};

// cc 获取系统版本号
window.__getOSVersion = function () {
    let lastIndex = jsb.system.lastIndexOf(" ");
    return jsb.system.substr(lastIndex + 1);
};

// 获取 cc 中定义的 platform 码
window.__getPlatform = function () {
    let platform = jsb.platform.toLowerCase();
    let model = jsb.model.toLowerCase();

    if (platform === "android") {
        return cc.sys.ANDROID;
    } else if (platform === "ios") {
        if (model.indexOf("iphone")) {
            return cc.sys.IPHONE;
        } else if (model.indexOf("ipad")) {
            return cc.sys.IPAD;
        }
    }
};


// 没有明确的需求，v1 接口（定义为保留接口字段）
window.__isObjectValid = function () {
    console.warn("window.__isObjectValid() deprecated!");
};

window.__getVersion = function () {
    console.warn("window.__getVersion() deprecated!");
};

window.__restartVM = function () {
    console.warn("window.__restartVM() is deprecated!");
};

window.__cleanScript = function () {
    console.warn("window.__cleanScript() deprecated!");
};

window.saveImageData = function () {
    console.warn("window.saveImageData() is deprecated!");
};