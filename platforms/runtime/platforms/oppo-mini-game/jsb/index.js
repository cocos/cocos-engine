import "./accelerometer"
import "./input-touch"
// import "./opengl"
import "./window-resize"
import "./fs-utils"

window.jsb = window.jsb || {};

let _systemInfo = qg.getSystemInfoSync();

if (!jsb.setPreferredFramesPerSecond) {
    if (qg.setPreferredFramesPerSecond) {
        jsb.setPreferredFramesPerSecond = qg.setPreferredFramesPerSecond;
    } else {
        jsb.setPreferredFramesPerSecond = function () {
            console.error("The jsb.setPreferredFramesPerSecond is not define!");
        }
    }
}

// CanvasRenderingContext2D class not defined on vivo
window.CanvasRenderingContext2D = window.CanvasRenderingContext2D || window.__canvas.getContext('2d').constructor;

jsb.AudioEngine = qg.AudioEngine;
// jsb.createCanvas = qg.createCanvas;
// jsb.createImage = qg.createImage;
jsb.loadImageData = qg.loadImageData;
jsb.loadSubpackage = qg.loadSubpackage;
jsb.showKeyboard = qg.showKeyboard;
jsb.hideKeyboard = qg.hideKeyboard;
jsb.platform = _systemInfo.platform;
jsb.language = _systemInfo.language;
if (!jsb.loadFont) {
    if (qg.loadFont) {
        jsb.loadFont = qg.loadFont;
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
jsb.onKeyboardConfirm = qg.onKeyboardConfirm;
jsb.onKeyboardComplete = qg.onKeyboardComplete;
jsb.onKeyboardInput = qg.onKeyboardInput;

jsb.offKeyboardInput = qg.offKeyboardInput;
jsb.offKeyboardConfirm = qg.offKeyboardConfirm;
jsb.offKeyboardComplete = qg.offKeyboardComplete;

jsb.env = qg.env;
jsb.getFileSystemManager = qg.getFileSystemManager;
jsb.downloadFile = qg.downloadFile;
jsb.getBatteryInfoSync = qg.getBatteryInfoSync;

jsb.onShow = qg.onShow;
jsb.onHide = qg.onHide;
jsb.offShow = qg.offShow;
jsb.offHide = qg.offHide;

jsb.createVideo = qg.createVideo;