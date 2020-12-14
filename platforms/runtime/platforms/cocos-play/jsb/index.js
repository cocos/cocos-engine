import "./accelerometer"
import "./input-touch"
import "./opengl"
import "./window-resize"
import "./fs-utils"

window.jsb = window.jsb || {};

let _rt = loadRuntime();
let _systemInfo = _rt.getSystemInfoSync();

if (!jsb.setPreferredFramesPerSecond) {
    if (_rt.setPreferredFramesPerSecond) {
        jsb.setPreferredFramesPerSecond = _rt.setPreferredFramesPerSecond;
    } else {
        jsb.setPreferredFramesPerSecond = function () {
            console.error("The jsb.setPreferredFramesPerSecond is not define!");
        }
    }
}

jsb.AudioEngine = _rt.AudioEngine;
jsb.createCanvas = _rt.createCanvas;
jsb.createImage = _rt.createImage;
jsb.loadImageData = _rt.loadImageData;
jsb.loadSubpackage = _rt.loadSubpackage;
jsb.showKeyboard = _rt.showKeyboard;
jsb.hideKeyboard = _rt.hideKeyboard;
jsb.platform = _systemInfo.platform;
jsb.language = _systemInfo.language;
if (!jsb.loadFont) {
    if (_rt.loadFont) {
        jsb.loadFont = _rt.loadFont;
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
jsb.onKeyboardConfirm = _rt.onKeyboardConfirm;
jsb.onKeyboardComplete = _rt.onKeyboardComplete;
jsb.onKeyboardInput = _rt.onKeyboardInput;

jsb.offKeyboardInput = _rt.offKeyboardInput;
jsb.offKeyboardConfirm = _rt.offKeyboardConfirm;
jsb.offKeyboardComplete = _rt.offKeyboardComplete;

jsb.env = _rt.env;
jsb.getFileSystemManager = _rt.getFileSystemManager;
jsb.downloadFile = _rt.downloadFile;
jsb.getBatteryInfoSync = _rt.getBatteryInfoSync;

jsb.onShow = _rt.onShow;
jsb.onHide = _rt.onHide;
jsb.offShow = _rt.offShow;
jsb.offHide = _rt.offHide;