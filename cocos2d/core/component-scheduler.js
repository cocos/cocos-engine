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
var Flags = require('./platform/CCObject').Flags;
var JsArray = require('./platform/js').array;

var IsStartCalled = Flags.IsStartCalled;
var IsOnEnableCalled = Flags.IsOnEnableCalled;
var IsEditorOnEnableCalled = Flags.IsEditorOnEnableCalled;

var callerFunctor = CC_EDITOR && require('./utils/misc').tryCatchFunctor_EDITOR;
var callOnEnableInTryCatch = CC_EDITOR && callerFunctor('onEnable');
var callStartInTryCatch = CC_EDITOR && callerFunctor('start', null, 'target._objFlags |= ' + IsStartCalled);
var callUpdateInTryCatch = CC_EDITOR && callerFunctor('update', 'dt');
var callLateUpdateInTryCatch = CC_EDITOR && callerFunctor('lateUpdate', 'dt');
var callOnDisableInTryCatch = CC_EDITOR && callerFunctor('onDisable');

function sortedIndex (array, comp) {
    var order = comp.constructor._executionOrder;
    var id = comp.__instanceId;
    for (var l = 0, h = array.length - 1, m = h >>> 1;
         l <= h;
         m = (l + h) >>> 1
    ) {
        var test = array[m];
        var testOrder = test.constructor._executionOrder;
        if (testOrder > order) {
            h = m - 1;
        }
        else if (testOrder < order) {
            l = m + 1;
        }
        else {
            var testId = test.__instanceId;
            if (testId > id) {
                h = m - 1;
            }
            else if (testId < id) {
                l = m + 1;
            }
            else {
                return m;
            }
        }
    }
    return ~l;
}

// remove disabled and not invoked component from array
function stableRemoveInactive (iterator, flagToClear) {
    var array = iterator.array;
    var next = iterator.i + 1;
    while (next < array.length) {
        var comp = array[next];
        if (comp._enabled && comp.node._activeInHierarchy) {
            ++next;
        }
        else {
            iterator.removeAt(next);
            if (flagToClear) {
                comp._objFlags &= ~flagToClear;
            }
        }
    }
}

// This class contains some queues used to invoke life-cycle methods by script execution order
var LifeCycleInvoker = cc.Class({
    __ctor__ (invokeFunc) {
        var Iterator = JsArray.MutableForwardIterator;
        // components which priority === 0 (default)
        this._zero = new Iterator([]);
        // components which priority < 0
        this._neg = new Iterator([]);
        // components which priority > 0
        this._pos = new Iterator([]);

        if (CC_TEST) {
            cc.assert(typeof invokeFunc === 'function', 'invokeFunc must be type function');
        }
        this._invoke = invokeFunc;
    },
    statics: {
        stableRemoveInactive
    },
    add: null,
    remove: null,
    invoke: null,
});

function compareOrder (a, b) {
    return a.constructor._executionOrder - b.constructor._executionOrder;
}

// for onLoad: sort once all components registered, invoke once
var OneOffInvoker = cc.Class({
    extends: LifeCycleInvoker,
    add (comp) {
        var order = comp.constructor._executionOrder;
        (order === 0 ? this._zero : (order < 0 ? this._neg : this._pos)).array.push(comp);
    },
    remove (comp) {
        var order = comp.constructor._executionOrder;
        (order === 0 ? this._zero : (order < 0 ? this._neg : this._pos)).fastRemove(comp);
    },
    cancelInactive (flagToClear) {
        stableRemoveInactive(this._zero, flagToClear);
        stableRemoveInactive(this._neg, flagToClear);
        stableRemoveInactive(this._pos, flagToClear);
    },
    invoke () {
        var compsNeg = this._neg;
        if (compsNeg.array.length > 0) {
            compsNeg.array.sort(compareOrder);
            this._invoke(compsNeg);
            compsNeg.array.length = 0;
        }

        this._invoke(this._zero);
        this._zero.array.length = 0;

        var compsPos = this._pos;
        if (compsPos.array.length > 0) {
            compsPos.array.sort(compareOrder);
            this._invoke(compsPos);
            compsPos.array.length = 0;
        }
    },
});

// for update: sort every time new component registered, invoke many times
var ReusableInvoker = cc.Class({
    extends: LifeCycleInvoker,
    add (comp) {
        var order = comp.constructor._executionOrder;
        if (order === 0) {
            this._zero.array.push(comp);
        }
        else {
            var array = order < 0 ? this._neg.array : this._pos.array;
            var i = sortedIndex(array, comp);
            if (i < 0) {
                array.splice(~i, 0, comp);
            }
            else if (CC_DEV) {
                cc.error('component already added');
            }
        }
    },
    remove (comp) {
        var order = comp.constructor._executionOrder;
        if (order === 0) {
            this._zero.fastRemove(comp);
        }
        else {
            var iterator = order < 0 ? this._neg : this._pos;
            var i = sortedIndex(iterator.array, comp);
            if (i >= 0) {
                iterator.removeAt(i);
            }
        }
    },
    invoke (dt) {
        if (this._neg.array.length > 0) {
            this._invoke(this._neg, dt);
        }

        this._invoke(this._zero, dt);

        if (this._pos.array.length > 0) {
            this._invoke(this._pos, dt);
        }
    },
});

function enableInEditor (comp) {
    if (!(comp._objFlags & IsEditorOnEnableCalled)) {
        cc.engine.emit('component-enabled', comp.uuid);
        comp._objFlags |= IsEditorOnEnableCalled;
    }
}

function createInvokeImpl (code, useDt) {
    if (CC_EDITOR) {
        if (useDt) {
            return function (iterator, dt) {
                var array = iterator.array;
                for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                    var comp = array[iterator.i];
                    code(comp, dt);
                }
            };
        }
        else {
            return function (iterator) {
                var array = iterator.array;
                for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                    var comp = array[iterator.i];
                    code(comp);
                }
            };
        }
    }
    else {
        // function (it) {
        //     var a = it.array;
        //     for (it.i = 0; it.i < a.length; ++it.i) {
        //         var comp = a[it.i];
        //         // ...
        //     }
        // }
        var body = 'var a=it.array;' +
                   'for(it.i=0;it.i<a.length;++it.i){' +
                   'var c=a[it.i];' +
                   code +
                   '}';
        if (useDt) {
            return Function('it', 'dt', body);
        }
        else {
            return Function('it', body);
        }
    }
}


/**
 * The Manager for Component's life-cycle methods.
 */
function ctor () {
    // invokers
    this.startInvoker = new OneOffInvoker(createInvokeImpl(
        CC_EDITOR ? callStartInTryCatch : 'c.start();c._objFlags|=' + IsStartCalled));
    this.updateInvoker = new ReusableInvoker(createInvokeImpl(
        CC_EDITOR ? callUpdateInTryCatch : 'c.update(dt)', true));
    this.lateUpdateInvoker = new ReusableInvoker(createInvokeImpl(
        CC_EDITOR ? callLateUpdateInTryCatch : 'c.lateUpdate(dt)', true));

    // components deferred to next frame
    this.scheduleInNextFrame = [];

    // during a loop
    this._updating = false;
}
var ComponentScheduler = cc.Class({
    ctor: ctor,
    unscheduleAll: ctor,

    statics: {
        LifeCycleInvoker,
        OneOffInvoker,
        createInvokeImpl,
        invokeOnEnable: CC_EDITOR ? function (iterator) {
            var compScheduler = cc.director._compScheduler;
            var array = iterator.array;
            for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                let comp = array[iterator.i];
                if (comp._enabled) {
                    callOnEnableInTryCatch(comp);
                    var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                    if (!deactivatedDuringOnEnable) {
                        compScheduler._onEnabled(comp);
                    }
                }
            }
        } : function (iterator) {
            var compScheduler = cc.director._compScheduler;
            var array = iterator.array;
            for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                let comp = array[iterator.i];
                if (comp._enabled) {
                    comp.onEnable();
                    var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                    if (!deactivatedDuringOnEnable) {
                        compScheduler._onEnabled(comp);
                    }
                }
            }
        }
    },

    _onEnabled (comp) {
        cc.director.getScheduler().resumeTarget(comp);
        comp._objFlags |= IsOnEnableCalled;

        // schedule
        if (this._updating) {
            this.scheduleInNextFrame.push(comp);
            return;
        }
        this._scheduleImmediate(comp);
    },

    _onDisabled (comp) {
        cc.director.getScheduler().pauseTarget(comp);
        comp._objFlags &= ~IsOnEnableCalled;

        // cancel schedule task
        var index = this.scheduleInNextFrame.indexOf(comp);
        if (index >= 0) {
            JsArray.fastRemoveAt(this.scheduleInNextFrame, index);
            return;
        }

        // unschedule
        if (comp.start && !(comp._objFlags & IsStartCalled)) {
            this.startInvoker.remove(comp);
        }
        if (comp.update) {
            this.updateInvoker.remove(comp);
        }
        if (comp.lateUpdate) {
            this.lateUpdateInvoker.remove(comp);
        }
    },

    enableComp: CC_EDITOR ? function (comp, invoker) {
        if (cc.engine.isPlaying || comp.constructor._executeInEditMode) {
            if (!(comp._objFlags & IsOnEnableCalled)) {
                if (comp.onEnable) {
                    if (invoker) {
                        invoker.add(comp);
                        enableInEditor(comp);
                        return;
                    }
                    else {
                        callOnEnableInTryCatch(comp);

                        var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                        if (deactivatedDuringOnEnable) {
                            return;
                        }
                    }
                }
                this._onEnabled(comp);
            }
        }
        enableInEditor(comp);
    } : function (comp, invoker) {
        if (!(comp._objFlags & IsOnEnableCalled)) {
            if (comp.onEnable) {
                if (invoker) {
                    invoker.add(comp);
                    return;
                }
                else {
                    comp.onEnable();

                    var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                    if (deactivatedDuringOnEnable) {
                        return;
                    }
                }
            }
            this._onEnabled(comp);
        }
    },

    disableComp: CC_EDITOR ? function (comp) {
        if (cc.engine.isPlaying || comp.constructor._executeInEditMode) {
            if (comp._objFlags & IsOnEnableCalled) {
                if (comp.onDisable) {
                    callOnDisableInTryCatch(comp);
                }
                this._onDisabled(comp);
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
            this._onDisabled(comp);
        }
    },

    _scheduleImmediate (comp) {
        if (comp.start && !(comp._objFlags & IsStartCalled)) {
            this.startInvoker.add(comp);
        }
        if (comp.update) {
            this.updateInvoker.add(comp);
        }
        if (comp.lateUpdate) {
            this.lateUpdateInvoker.add(comp);
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
        this.startInvoker.invoke();
    },

    updatePhase (dt) {
        this.updateInvoker.invoke(dt);
    },

    lateUpdatePhase (dt) {
        this.lateUpdateInvoker.invoke(dt);

        // End of this frame
        this._updating = false;
    }
});

module.exports = ComponentScheduler;
