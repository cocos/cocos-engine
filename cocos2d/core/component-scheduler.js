/****************************************************************************
 Copyright (c) 2013-2017 Chukong Technologies Inc.

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

require('./platform/CCClass');
var Object = require('./platform/CCObject');

var Flags = Object.Flags;
var IsStartCalled = Flags.IsStartCalled;

var callStartInTryCatch;
var callUpdate;
var callLateUpdate;

if (CC_EDITOR) {
    var callerFunctor = require('./utils/misc').tryCatchFunctor_EDITOR;
    callStartInTryCatch = callerFunctor('start');
    // TODO: 不用事件的 target 机制
    var localCallUpdate = callerFunctor('update', 'event', 'event.detail');
    callUpdate = function (event) {
        localCallUpdate(this, event);
    };
    var localCallLateUpdate = callerFunctor('lateUpdate', 'event', 'event.detail');
    callLateUpdate = function (event) {
        localCallLateUpdate(this, event);
    };
}
else {
    callUpdate = function (event) {
        this.update(event.detail);
    };
    callLateUpdate = function (event) {
        this.lateUpdate(event.detail);
    };
}

function registerUpdateEvent () {
    var eventTargets = this.__eventTargets;
    var director = cc.director;
    var Director = cc.Director;
    director.__fastOff(Director.EVENT_BEFORE_UPDATE, registerUpdateEvent, this, eventTargets);
    if (this.update) {
        director.__fastOn(Director.EVENT_COMPONENT_UPDATE, callUpdate, this, eventTargets);
    }
    if (this.lateUpdate) {
        director.__fastOn(Director.EVENT_COMPONENT_LATE_UPDATE, callLateUpdate, this, eventTargets);
    }
}

var callStart = CC_EDITOR ? function () {
    cc.director.__fastOff(cc.Director.EVENT_BEFORE_UPDATE, callStart, this, this.__eventTargets);
    callStartInTryCatch(this);
    this._objFlags |= IsStartCalled;
} : function () {
    cc.director.__fastOff(cc.Director.EVENT_BEFORE_UPDATE, callStart, this, this.__eventTargets);
    this.start();
    this._objFlags |= IsStartCalled;
};


var ComponentScheduler = cc.Class({
    ctor: function () {

    },
    // TODO: 不借助 director 的事件派发独立实现
    schedule: function (comp) {
        if (CC_EDITOR && !(comp.constructor._executeInEditMode || cc.engine._isPlaying)) {
            return;
        }
        var Director = cc.Director;
        if (comp.start && !(comp._objFlags & IsStartCalled)) {
            cc.director.__fastOn(Director.EVENT_BEFORE_UPDATE, callStart, comp, comp.__eventTargets);
        }
        if (comp.update || comp.lateUpdate) {
            cc.director.__fastOn(Director.EVENT_BEFORE_UPDATE, registerUpdateEvent, comp, comp.__eventTargets);
        }
    },
    unschedule: function (comp) {
        if (CC_EDITOR && !(comp.constructor._executeInEditMode || cc.engine._isPlaying)) {
            return;
        }
        var Director = cc.Director;
        if (comp.start && !(comp._objFlags & IsStartCalled)) {
            cc.director.__fastOff(Director.EVENT_BEFORE_UPDATE, callStart, comp, comp.__eventTargets);
        }
        var hasUpdate = comp.update;
        var hasLateUpdate = comp.lateUpdate;
        if (hasUpdate || hasLateUpdate) {
            cc.director.__fastOff(Director.EVENT_BEFORE_UPDATE, registerUpdateEvent, comp, comp.__eventTargets);
            if (hasUpdate) {
                cc.director.__fastOff(Director.EVENT_COMPONENT_UPDATE, callUpdate, comp, comp.__eventTargets);
            }
            if (hasLateUpdate) {
                cc.director.__fastOff(Director.EVENT_COMPONENT_LATE_UPDATE, callLateUpdate, comp, comp.__eventTargets);
            }
        }
    },
});

module.exports = ComponentScheduler;
