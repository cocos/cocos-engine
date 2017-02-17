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
var CCObject = require('./platform/CCObject');
var JsArray = require('./platform/js').array;

var Flags = CCObject.Flags;
var IsStartCalled = Flags.IsStartCalled;
var IsOnEnableCalled = Flags.IsOnEnableCalled;
var IsEditorOnEnableCalled = Flags.IsEditorOnEnableCalled;
var IsPreloadCalled = Flags.IsPreloadCalled;
var IsOnLoadStarted = Flags.IsOnLoadStarted;
var IsOnLoadCalled = Flags.IsOnLoadCalled;

var callerFunctor;
if (CC_EDITOR) {
    callerFunctor = require('./utils/misc').tryCatchFunctor_EDITOR;
}
var callPreloadInTryCatch = CC_EDITOR && callerFunctor('__preload');
var callOnLoadInTryCatch = CC_EDITOR && callerFunctor('onLoad');
var callOnEnableInTryCatch = CC_EDITOR && callerFunctor('onEnable');
var callStartInTryCatch = CC_EDITOR && callerFunctor('start');
var callUpdateInTryCatch = CC_EDITOR && callerFunctor('update', 'dt', 'dt');
var callLateUpdateInTryCatch = CC_EDITOR && callerFunctor('lateUpdate', 'dt', 'dt');
var callOnDisableInTryCatch = CC_EDITOR && callerFunctor('onDisable');
var callOnDestroyInTryCatch = CC_EDITOR && callerFunctor('onDestroy');
var callResetInTryCatch = CC_EDITOR && callerFunctor('resetInEditor');
var callOnFocusInTryCatch = CC_EDITOR && callerFunctor('onFocusInEditor');
var callOnLostFocusInTryCatch = CC_EDITOR && callerFunctor('onLostFocusInEditor');


function preloadNode (node) {
    // set _activeInHierarchy to true before invoking onLoad
    // to allow preload triggered on nodes which created in parent's onLoad dynamically.
    node._activeInHierarchy = true;

    var comps = node._components;
    var i = 0, len = comps.length;
    for (; i < len; ++i) {
        var comp = comps[i];
        if (comp && !(comp._objFlags & IsPreloadCalled) && typeof comp.__preload === 'function') {
            if (CC_EDITOR) {
                callPreloadInTryCatch(comp);
            }
            else {
                comp.__preload();
            }
            comp._objFlags |= IsPreloadCalled;
        }
    }
    var children = node._children;
    for (i = 0, len = children.length; i < len; ++i) {
        var child = children[i];
        if (child._active) {
            preloadNode(child);
        }
    }
}

function ctor () {
    // during a loop
    this._updating = false;

    // component lists
    this.startsZero = new JsArray.MutableForwardIterator([]);   // components which priority === 0 (default)
    // this.startsPos = [];    // components which priority > 0
    // this.startsNeg = [];    // components which priority < 0

    this.updatesZero = new JsArray.MutableForwardIterator([]);
    this.lateUpdatesZero = new JsArray.MutableForwardIterator([]);

    this.scheduleInNextFrame = []; // components deferred to next frame
}

/**
 * The Manager for Component's life-cycle methods.
 */
var ComponentScheduler = cc.Class({
    ctor: ctor,
    unscheduleAll: ctor,

    enableComp: CC_EDITOR ? function (comp) {
        if (cc.engine.isPlaying || comp.constructor._executeInEditMode) {
            if (!(comp._objFlags & IsOnEnableCalled)) {
                if (comp.onEnable) {
                    callOnEnableInTryCatch(comp);

                    var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                    if (deactivatedDuringOnEnable) {
                        return;
                    }
                }

                cc.director.getScheduler().resumeTarget(comp);
                this.schedule(comp);

                comp._objFlags |= IsOnEnableCalled;
            }
        }

        if (!(comp._objFlags & IsEditorOnEnableCalled)) {
            cc.engine.emit('component-enabled', comp.uuid);
            comp._objFlags |= IsEditorOnEnableCalled;
        }
    } : function (comp) {
        if (!(comp._objFlags & IsOnEnableCalled)) {
            if (comp.onEnable) {
                comp.onEnable();

                var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                if (deactivatedDuringOnEnable) {
                    return;
                }
            }

            cc.director.getScheduler().resumeTarget(comp);
            this.schedule(comp);

            comp._objFlags |= IsOnEnableCalled;
        }
    },

    disableComp: CC_EDITOR ? function (comp) {
        if (cc.engine.isPlaying || comp.constructor._executeInEditMode) {
            if (comp._objFlags & IsOnEnableCalled) {
                if (comp.onDisable) {
                    callOnDisableInTryCatch(comp);
                }

                cc.director.getScheduler().pauseTarget(comp);
                this.unschedule(comp);

                comp._objFlags &= ~IsOnEnableCalled;
            }
        }
        if (comp._objFlags & IsEditorOnEnableCalled) {
            cc.engine.emit('component-disabled', comp.uuid);
            comp._objFlags &= ~IsEditorOnEnableCalled;
        }
    } : function (comp) {
        if (comp._objFlags & IsOnEnableCalled) {
            if (comp.onDisable) {
                comp.onDisable();
            }

            cc.director.getScheduler().pauseTarget(comp);
            this.unschedule(comp);

            comp._objFlags &= ~IsOnEnableCalled;
        }
    },

    preloadNode: preloadNode,

    doPreloadComp: CC_EDITOR ? function (comp) {
        callPreloadInTryCatch(comp);
        comp._objFlags |= IsPreloadCalled;
    } : function (comp) {
        comp.__preload();
        comp._objFlags |= IsPreloadCalled;
    },

    activateComp: CC_EDITOR ? function (comp) {
        if (!(comp._objFlags & IsOnLoadStarted) &&
            (cc.engine._isPlaying || comp.constructor._executeInEditMode)) {
            comp._objFlags |= IsOnLoadStarted;

            if (comp.onLoad) {
                callOnLoadInTryCatch(comp);
            }

            comp._objFlags |= IsOnLoadCalled;

            if (comp.onLoad && !cc.engine._isPlaying) {
                var focused = Editor.Selection.curActivate('node') === comp.node.uuid;
                if (focused && comp.onFocusInEditor) {
                    callOnFocusInTryCatch(comp);
                }
                else if (comp.onLostFocusInEditor) {
                    callOnLostFocusInTryCatch(comp);
                }
            }
            if ( !CC_TEST ) {
                _Scene.AssetsWatcher.start(comp);
            }
        }
        if (comp._enabled) {
            var deactivatedOnLoading = !comp.node._activeInHierarchy;
            if (deactivatedOnLoading) {
                return;
            }
            this.enableComp(comp);
        }
    } : function (comp) {
        if (!(comp._objFlags & IsOnLoadStarted)) {
            comp._objFlags |= IsOnLoadStarted;
            if (comp.onLoad) {
                comp.onLoad();
            }
            comp._objFlags |= IsOnLoadCalled;
        }
        if (comp._enabled) {
            var deactivatedOnLoading = !comp.node._activeInHierarchy;
            if (deactivatedOnLoading) {
                return;
            }
            this.enableComp(comp);
        }
    },

    destroyComp: CC_EDITOR ? function (comp) {
        // ensure onDisable called
        this.disableComp(comp);

        if (comp.onDestroy && (comp._objFlags & IsOnLoadCalled)) {
            if (cc.engine._isPlaying || comp.constructor._executeInEditMode) {
                callOnDestroyInTryCatch(comp);
            }
        }
    } : function (comp) {
        // ensure onDisable called
        this.disableComp(comp);

        if (comp.onDestroy && (comp._objFlags & IsOnLoadCalled)) {
            comp.onDestroy();
        }
    },

    resetComp: CC_EDITOR && function (comp) {
        if (typeof comp.resetInEditor === 'function') {
            callResetInTryCatch(comp);
        }
    },

    schedule (comp) {
        if (this._updating) {
            this.scheduleInNextFrame.push(comp);
            return;
        }
        this._scheduleImmediate(comp);
    },
    unschedule (comp) {
        // cancel schedule task
        var index = this.scheduleInNextFrame.indexOf(comp);
        if (index >= 0) {
            JsArray.fastRemoveAt(this.scheduleInNextFrame, index);
            return;
        }
        // unschedule
        if (comp.start && !(comp._objFlags & IsStartCalled)) {
            this.startsZero.fastRemove(comp);
        }
        if (comp.update) {
            this.updatesZero.fastRemove(comp);
        }
        if (comp.lateUpdate) {
            this.lateUpdatesZero.fastRemove(comp);
        }
    },

    _scheduleImmediate (comp) {
        if (comp.start && !(comp._objFlags & IsStartCalled)) {
            this.startsZero.array.push(comp);
        }
        if (comp.update) {
            this.updatesZero.array.push(comp);
        }
        if (comp.lateUpdate) {
            this.lateUpdatesZero.array.push(comp);
        }
    },

    _deferredSchedule () {
        var comps = this.scheduleInNextFrame;
        for (var i = 0, len = comps.length; i < len; i++) {
            var comp = comps[i];
            this._scheduleImmediate(comp);
        }
        comps.length = 0;
    },

    startPhase () {
        // Start of this frame
        this._updating = true;

        if (this.scheduleInNextFrame.length > 0) {
            this._deferredSchedule();
        }

        // call start
        var iterator = this.startsZero;
        var array = iterator.array;
        if (CC_EDITOR) {
            for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                let comp = array[iterator.i];
                callStartInTryCatch(comp);
                comp._objFlags |= IsStartCalled;
            }
        }
        else {
            for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                let comp = array[iterator.i];
                comp.start();
                comp._objFlags |= IsStartCalled;
            }
        }
        array.length = 0;
    },

    updatePhase (dt) {
        // call update
        var iterator = this.updatesZero;
        var array = iterator.array;
        if (CC_EDITOR) {
            for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                let comp = array[iterator.i];
                callUpdateInTryCatch(comp, dt);
            }
        }
        else {
            for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                let comp = array[iterator.i];
                comp.update(dt);
            }
        }
    },

    lateUpdatePhase (dt) {
        // call lateUpdate
        var iterator = this.lateUpdatesZero;
        var array = iterator.array;
        if (CC_EDITOR) {
            for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                let comp = array[iterator.i];
                callLateUpdateInTryCatch(comp, dt);
            }
        }
        else {
            for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                let comp = array[iterator.i];
                comp.lateUpdate(dt);
            }
        }

        // End of this frame
        this._updating = false;
    }
});

module.exports = ComponentScheduler;
