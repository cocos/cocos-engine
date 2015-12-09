/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * @module cc
 * @main cc
 */

// define cc

cc = {};

_ccsg = {};

//to make sure the cc.log, cc.warn, cc.error, cc._throw and cc.assert would not throw error before init by debugger mode.
cc.log = cc.warn = cc.error = cc._throw = cc.assert = function () {};

if (CC_DEV) {
    /**
     * contains internal apis for unit tests
     * @expose
     */
    cc._Test = {};
}

// predefine some modules for cocos

require('./polyfill');
require('./cocos2d/core/platform/js');
require('./cocos2d/core/value-types');
require('./cocos2d/core/utils');
require('./cocos2d/core/platform/CCInputManager');
require('./cocos2d/core/platform/CCInputExtension');
require('./cocos2d/core/event');
require('./cocos2d/core/platform/CCSys');
require('./cocos2d/core/platform/CCLoader');
require('./CCDebugger');
if (CC_DEV) {
    // output all errors before initialized
    cc._initDebugSetting(1);    // DEBUG_MODE_INFO
}
require('./cocos2d/core/CCDirector');
require('./cocos2d/core/CCDirectorWebGL');
require('./cocos2d/core/CCDirectorCanvas');
require('./cocos2d/core/textures');

ccui = {};
ccs = {};
sp = {};
cp = {};
