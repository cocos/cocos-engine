import "./accelerometer"
import "./input-touch"
// import "./opengl"
import "./window-resize"
import "./fs-utils"

window.jsb = window.jsb || {};

let _systemInfo = hbs.getSystemInfoSync();

if (!jsb.setPreferredFramesPerSecond) {
    if (hbs.setPreferredFramesPerSecond) {
        jsb.setPreferredFramesPerSecond = hbs.setPreferredFramesPerSecond;
    } else {
        jsb.setPreferredFramesPerSecond = function () {
            console.error("The jsb.setPreferredFramesPerSecond is not define!");
        }
    }
}

// CanvasRenderingContext2D class not defined on vivo
window.CanvasRenderingContext2D = window.CanvasRenderingContext2D || window.__canvas.getContext('2d').constructor;

jsb.AudioEngine = hbs.AudioEngine;
// jsb.createCanvas = hbs.createCanvas;
// jsb.createImage = hbs.createImage;
jsb.loadImageData = hbs.loadImageData;
jsb.loadSubpackage = hbs.loadSubpackage;
jsb.showKeyboard = hbs.showKeyboard;
jsb.hideKeyboard = hbs.hideKeyboard;
jsb.platform = _systemInfo.platform;
jsb.language = _systemInfo.language;
if (!jsb.loadFont) {
    if (hbs.loadFont) {
        jsb.loadFont = hbs.loadFont;
    } else {
        jsb.loadFont = function () {
            console.warn("jsb.loadFont() is not support!");
        };
    }
}
jsb.model = _systemInfo.model;
jsb.system = _systemInfo.system;
jsb.height = _systemInfo.windowHeight;
jsb.width = _systemInfo.windowWidth;
jsb.pixelRatio = _systemInfo.pixelRatio;
jsb.onKeyboardConfirm = hbs.onKeyboardConfirm;
jsb.onKeyboardComplete = hbs.onKeyboardComplete;
jsb.onKeyboardInput = hbs.onKeyboardInput;

jsb.offKeyboardInput = hbs.offKeyboardInput;
jsb.offKeyboardConfirm = hbs.offKeyboardConfirm;
jsb.offKeyboardComplete = hbs.offKeyboardComplete;

jsb.env = hbs.env;
jsb.getFileSystemManager = hbs.getFileSystemManager;
jsb.downloadFile = hbs.downloadFile;
jsb.getBatteryInfoSync = hbs.getBatteryInfoSync;

jsb.onShow = hbs.onShow;
jsb.onHide = hbs.onHide;
jsb.offShow = hbs.offShow;
jsb.offHide = hbs.offHide;