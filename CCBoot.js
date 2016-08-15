/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

cc._tmp = cc._tmp || {};
cc._LogInfos = cc._LogInfos || {};

var _p = window;
/** @expose */
_p.gl;
/** @expose */
_p.WebGLRenderingContext;
/** @expose */
_p.DeviceOrientationEvent;
/** @expose */
_p.DeviceMotionEvent;
/** @expose */
_p.AudioContext;
if (!_p.AudioContext) {
    /** @expose */
    _p.webkitAudioContext;
}
/** @expose */
_p.mozAudioContext;
_p = Object.prototype;
/** @expose */
_p._super;
/** @expose */
_p.ctor;
_p = null;

/**
 * The current version of Cocos2d-JS being used.<br/>
 * Please DO NOT remove this String, it is an important flag for bug tracking.<br/>
 * If you post a bug to forum, please attach this flag.
 * @type {String}
 * @name cc.ENGINE_VERSION
 */
var engineVersion;
engineVersion = '1.2.1-beta.3';
window['CocosEngine'] = cc.ENGINE_VERSION = engineVersion;

/**
 * drawing primitive of game engine
 * @type {cc.DrawingPrimitive}
 */
cc._drawingUtil = null;

/**
 * main Canvas 2D/3D Context of game engine
 * @type {CanvasRenderingContext2D|WebGLRenderingContext}
 */
cc._renderContext = null;
cc._supportRender = false;

/**
 * Main canvas of game engine
 * @type {HTMLCanvasElement}
 */
cc._canvas = null;

/**
 * The element contains the game canvas
 * @type {HTMLDivElement}
 */
cc.container = null;
cc._gameDiv = null;

require('./cocos2d/core/utils');
require('./cocos2d/core/platform/CCSys');


//+++++++++++++++++++++++++Engine initialization function begin+++++++++++++++++++++++++++
(function () {

var _jsAddedCache = {}, //cache for js and module that has added into jsList to be loaded.
    _engineInitCalled = false,
    _engineLoadedCallback = null;

cc._engineLoaded = false;

function _determineRenderType(config) {
    var CONFIG_KEY = cc.game.CONFIG_KEY,
        userRenderMode = parseInt(config[CONFIG_KEY.renderMode]) || 0;

    // Adjust RenderType
    if (isNaN(userRenderMode) || userRenderMode > 2 || userRenderMode < 0)
        config[CONFIG_KEY.renderMode] = 0;

    // Determine RenderType
    cc._renderType = cc.game.RENDER_TYPE_CANVAS;
    cc._supportRender = false;

    if (userRenderMode === 0) {
        if (cc.sys.capabilities['opengl']) {
            cc._renderType = cc.game.RENDER_TYPE_WEBGL;
            cc._supportRender = true;
        }
        else if (cc.sys.capabilities['canvas']) {
            cc._renderType = cc.game.RENDER_TYPE_CANVAS;
            cc._supportRender = true;
        }
    }
    else if (userRenderMode === 1 && cc.sys.capabilities['canvas']) {
        cc._renderType = cc.game.RENDER_TYPE_CANVAS;
        cc._supportRender = true;
    }
    else if (userRenderMode === 2 && cc.sys.capabilities['opengl']) {
        cc._renderType = cc.game.RENDER_TYPE_WEBGL;
        cc._supportRender = true;
    }
}

function _getJsListOfModule(moduleMap, moduleName, dir) {
    if (_jsAddedCache[moduleName]) return null;
    dir = dir || "";
    var jsList = [];
    var tempList = moduleMap[moduleName];
    if (!tempList) throw new Error("can not find module [" + moduleName + "]");
    var ccPath = cc.path;
    for (var i = 0, li = tempList.length; i < li; i++) {
        var item = tempList[i];
        if (_jsAddedCache[item]) continue;
        var extname = ccPath.extname(item);
        if (!extname) {
            var arr = _getJsListOfModule(moduleMap, item, dir);
            if (arr) jsList = jsList.concat(arr);
        } else if (extname.toLowerCase() === ".js") jsList.push(ccPath.join(dir, item));
        _jsAddedCache[item] = 1;
    }
    return jsList;
}

function _afterEngineLoaded(config) {
    cc._initDebugSetting(config[cc.game.CONFIG_KEY.debugMode]);
    cc._engineLoaded = true;
    cc.log(cc.ENGINE_VERSION);
    if (_engineLoadedCallback) _engineLoadedCallback();
}

function _load(config) {
    var self = this;
    var CONFIG_KEY = cc.game.CONFIG_KEY, engineDir = config[CONFIG_KEY.engineDir], loader = cc.loader;

    if (cc._Class) {
        // Single file loaded
        _afterEngineLoaded(config);
    } else {
        // Load cocos modules
        var ccModulesPath = cc.path.join(engineDir, "moduleConfig.json");
        loader.load(ccModulesPath, function (err, modulesJson) {
            if (err) throw new Error(err);
            var modules = config["modules"] || [];
            var moduleMap = modulesJson["module"];
            var jsList = [];
            if (cc.sys.capabilities["opengl"] && modules.indexOf("base4webgl") < 0) modules.splice(0, 0, "base4webgl");
            else if (modules.indexOf("core") < 0) modules.splice(0, 0, "core");
            for (var i = 0, li = modules.length; i < li; i++) {
                var arr = _getJsListOfModule(moduleMap, modules[i], engineDir);
                if (arr) jsList = jsList.concat(arr);
            }
            loader.load(jsList, function (err) {
                if (err) throw new Error(JSON.stringify(err));
                _afterEngineLoaded(config);
            });
        });
    }
}

function _windowLoaded() {
    window.removeEventListener('load', _windowLoaded, false);
    _load(cc.game.config);
}

cc.initEngine = function (config, cb) {
    if (_engineInitCalled) {
        var previousCallback = _engineLoadedCallback;
        _engineLoadedCallback = function () {
            previousCallback && previousCallback();
            cb && cb();
        };
        return;
    }

    _engineLoadedCallback = cb;

    // Config uninitialized and given, initialize with it
    if (!cc.game.config && config) {
        cc.game.config = config;
    }
    // No config given and no config set before, load it
    else if (!cc.game.config) {
        cc.game._loadConfig();
    }
    config = cc.game.config;

    _determineRenderType(config);

    document.body ? _load(config) : window.addEventListener('load', _windowLoaded, false);
    _engineInitCalled = true;
};

})();
//+++++++++++++++++++++++++Engine initialization function end+++++++++++++++++++++++++++++
