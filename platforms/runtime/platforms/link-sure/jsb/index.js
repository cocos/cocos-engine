import "./accelerometer"
import "./input-touch"
import "./opengl"
import "./window-resize"
import "./fs-utils"

window.jsb = window.jsb || {};

let _systemInfo = wuji.getSystemInfoSync();

if (!jsb.setPreferredFramesPerSecond) {
    if (wuji.setPreferredFramesPerSecond) {
        jsb.setPreferredFramesPerSecond = wuji.setPreferredFramesPerSecond;
    } else {
        jsb.setPreferredFramesPerSecond = function () {
            console.error("The jsb.setPreferredFramesPerSecond is not define!");
        }
    }
}

jsb.AudioEngine = wuji.AudioEngine;
// not supported
// jsb.createCanvas = wuji.createCanvas;
// jsb.createImage = wuji.createImage;
jsb.loadImageData = wuji.loadImageData;
jsb.loadSubpackage = wuji.loadSubpackage;
jsb.showKeyboard = wuji.showKeyboard;
jsb.hideKeyboard = wuji.hideKeyboard;
jsb.platform = _systemInfo.platform;
// NOTE: systemInfo doesn't have language info
jsb.language = _systemInfo.language || (__getCurrentLanguage && __getCurrentLanguage());
if (!jsb.loadFont) {
    if (wuji.loadFont) {
        jsb.loadFont = wuji.loadFont;
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
jsb.onKeyboardConfirm = wuji.onKeyboardConfirm;
jsb.onKeyboardComplete = wuji.onKeyboardComplete;
jsb.onKeyboardInput = wuji.onKeyboardInput;

jsb.offKeyboardInput = wuji.offKeyboardInput;
jsb.offKeyboardConfirm = wuji.offKeyboardConfirm;
jsb.offKeyboardComplete = wuji.offKeyboardComplete;

jsb.env = wuji.env;
jsb.getFileSystemManager = wuji.getFileSystemManager;
jsb.downloadFile = wuji.downloadFile;
jsb.getBatteryInfoSync = wuji.getBatteryInfoSync;

jsb.onShow = wuji.onShow;
jsb.onHide = wuji.onHide;
jsb.offShow = wuji.offShow;
jsb.offHide = wuji.offHide;