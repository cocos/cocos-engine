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

'use strict';

// Check version
var _engineNumberVersion = (function () {
    var result = /Cocos2d\-JS\sv([\d]+)\.([\d]+)/.exec(cc.ENGINE_VERSION);
    if (result && result[1]) {
        return {
            major: parseInt(result[1]),
            minor: parseInt(result[2])
        };
    }
    else {
        return null;
    }
})();

var originLog = console.log;

// overwrite original console.log
try {
    console.log = function (...args) {
        originLog(cc.js.formatStr.apply(null, args));
    };
}
catch (e) {
}

function defineMacro (name, defaultValue) {
    // if "global_defs" not preprocessed by uglify, just declare them globally,
    // this may happened in release version's preview page.
    // (use evaled code to prevent mangle by uglify)
    return 'if(typeof ' + name +  '=="undefined")' +
           name + '=' + defaultValue + ';';
}
function defined (name) {
    return 'typeof ' + name + '=="object"';
}
Function(
    defineMacro('CC_TEST', defined('tap') + '||' + defined('QUnit')) +
    defineMacro('CC_EDITOR', defined('Editor') + '&&' + defined('process') + '&&"electron" in process.versions') +
    defineMacro('CC_PREVIEW', '!CC_EDITOR') +
    defineMacro('CC_DEV', true) +    // (CC_EDITOR && !CC_BUILD) || CC_PREVIEW || CC_TEST
    defineMacro('CC_DEBUG', true) +  // CC_DEV || Debug Build
    defineMacro('CC_JSB', defined('jsb')) +
    defineMacro('CC_BUILD', false)
)();

if (!cc.ClassManager) {
    cc.ClassManager = window.ClassManager;
}

if (CC_DEV) {
    /**
     * contains internal apis for unit tests
     * @expose
     */
    cc._Test = {};
}

// polyfills
if (!(CC_EDITOR && Editor.isMainProcess)) {
    require('../polyfill/typescript');
}

// predefine some modules for cocos
require('../cocos2d/core/platform/js');
require('../cocos2d/core/value-types');
require('../cocos2d/core/utils/find');
require('../cocos2d/core/utils/mutable-forward-iterator');
require('../cocos2d/core/event');
require('../cocos2d/core/event-manager/CCEvent');
require('../cocos2d/core/event-manager/CCSystemEvent');
require('../CCDebugger');

if (CC_DEV) {
    //Debug Info ID map
    require('../DebugInfos');
}

// Mark memory model
var macro = require('../cocos2d/core/platform/CCMacro');

if (window.__ENABLE_GC_FOR_NATIVE_OBJECTS__ !== undefined) {
    macro.ENABLE_GC_FOR_NATIVE_OBJECTS = window.__ENABLE_GC_FOR_NATIVE_OBJECTS__;
}

require('./jsb-game');
require('./jsb-loader');
require('./jsb-director');
require('./jsb-tex-sprite-frame');
require('./jsb-scale9sprite');
require('./jsb-label');
require('./jsb-editbox');
require('./jsb-videoplayer');
require('./jsb-webview');
require('./jsb-particle');
require('./jsb-spine');
require('./jsb-enums');
require('./jsb-event');
require('./jsb-action');
require('./jsb-etc');
require('./jsb-audio');
require('./jsb-tiledmap');
require('./jsb-box2d');
require('./jsb-dragonbones');

if (cc.runtime) {
    require('./versions/jsb-polyfill-runtime');
}

require('../extends');
