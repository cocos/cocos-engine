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

// Macros, if "global_defs" not preprocessed by uglify, just declare them globally
Function(
    /* use evaled code to prevent the uglify from renaming symbols */
    'if(typeof CC_TEST=="undefined")' +
        'window.CC_TEST=typeof describe!="undefined"||typeof QUnit=="object";' +
    'if(typeof CC_EDITOR=="undefined")' +
        'window.CC_EDITOR=typeof Editor=="object"&&typeof process=="object"&&"electron" in process.versions;' +
    'if(typeof CC_DEV=="undefined")' +
        'window.CC_DEV=CC_EDITOR||CC_TEST;' +
    'if(typeof CC_JSB=="undefined")' +
        'window.CC_JSB=true;'
)();

require('./jsb-predefine');
require('./jsb-game');
require('./jsb-loader');
require('./jsb-director');
require('./jsb-tex-sprite-frame');
require('./jsb-scale9sprite');
require('./jsb-label');
require('./jsb-editbox');
require('./jsb-videoplayer');
require('./jsb-webview.js');
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
