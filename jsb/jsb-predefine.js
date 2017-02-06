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

// Run jsb.js before all polyfills
cc.initEngine();

if (!cc.ClassManager) {
    cc.ClassManager = window.ClassManager || {
        id : (0|(Math.random()*998)),
        instanceId : (0|(Math.random()*998)),
        getNewID : function(){
            return this.id++;
        },
        getNewInstanceId : function(){
            return this.instanceId++;
        }
    };
}

if (CC_DEV) {
    /**
     * contains internal apis for unit tests
     * @expose
     */
    cc._Test = {};
}

// predefine some modules for cocos

require('../cocos2d/core/platform/js');
require('../cocos2d/core/value-types');
require('../cocos2d/core/utils/find');
require('../cocos2d/core/utils/mutable-forward-iterator');
require('../cocos2d/core/event');
require('../cocos2d/core/event-manager/CCSystemEvent');
require('../CCDebugger');

cc._initDebugSetting(cc.game.DEBUG_MODE_INFO);

if (CC_DEV) {
    //Debug Info ID map
    require('../DebugInfos');
}

// Mark memory model
var macro = require('../cocos2d/core/platform/CCMacro');

if (window.__ENABLE_GC_FOR_NATIVE_OBJECTS__ !== undefined) {
    macro.ENABLE_GC_FOR_NATIVE_OBJECTS = window.__ENABLE_GC_FOR_NATIVE_OBJECTS__;
}