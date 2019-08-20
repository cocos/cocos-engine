/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @category scene-graph
 */

import { CCObject } from '../data/object';
import { MutableForwardIterator } from '../utils/array';
import { array } from '../utils/js';
import { tryCatchFunctor_EDITOR } from '../utils/misc';
const fastRemoveAt = array.fastRemoveAt;

// @ts-ignore
const IsStartCalled = CCObject.Flags.IsStartCalled;
// @ts-ignore
const IsOnEnableCalled = CCObject.Flags.IsOnEnableCalled;
// @ts-ignore
const IsEditorOnEnableCalled = CCObject.Flags.IsEditorOnEnableCalled;

const callerFunctor: any = CC_EDITOR && tryCatchFunctor_EDITOR;
const callOnEnableInTryCatch = CC_EDITOR && callerFunctor('onEnable');
const callStartInTryCatch = CC_EDITOR && callerFunctor('start', null, 'target._objFlags |= ' + IsStartCalled);
const callUpdateInTryCatch = CC_EDITOR && callerFunctor('update', 'dt');
const callLateUpdateInTryCatch = CC_EDITOR && callerFunctor('lateUpdate', 'dt');
const callOnDisableInTryCatch = CC_EDITOR && callerFunctor('onDisable');

const callStart = CC_SUPPORT_JIT ? 'c.start();c._objFlags|=' + IsStartCalled : (c) => {
    c.start();
    c._objFlags |= IsStartCalled;
};
const callUpdate = CC_SUPPORT_JIT ? 'c.update(dt)' : (c, dt) => {
    c.update(dt);
};
const callLateUpdate = CC_SUPPORT_JIT ? 'c.lateUpdate(dt)' : (c, dt) => {
    c.lateUpdate(dt);
};

function sortedIndex (array, comp) {
    const order = comp.constructor._executionOrder;
    const id = comp._id;
    let l = 0;
    for (let h = array.length - 1, m = h >>> 1;
         l <= h;
         m = (l + h) >>> 1
    ) {
        const test = array[m];
        const testOrder = test.constructor._executionOrder;
        if (testOrder > order) {
            h = m - 1;
        }
        else if (testOrder < order) {
            l = m + 1;
        }
        else {
            const testId = test._id;
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
    const array = iterator.array;
    let next = iterator.i + 1;
    while (next < array.length) {
        const comp = array[next];
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
class LifeCycleInvoker {
    public static stableRemoveInactive = stableRemoveInactive;

    protected _zero: MutableForwardIterator<any>;
    protected _neg: MutableForwardIterator<any>;
    protected _pos: MutableForwardIterator<any>;
    protected _invoke: any;
    constructor (invokeFunc) {
        const Iterator = MutableForwardIterator;
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
    }
}

function compareOrder (a, b) {
    return a.constructor._executionOrder - b.constructor._executionOrder;
}

// for onLoad: sort once all components registered, invoke once
class OneOffInvoker extends LifeCycleInvoker {
    public add (comp) {
        const order = comp.constructor._executionOrder;
        (order === 0 ? this._zero : (order < 0 ? this._neg : this._pos)).array.push(comp);
    }

    public remove (comp) {
        const order = comp.constructor._executionOrder;
        (order === 0 ? this._zero : (order < 0 ? this._neg : this._pos)).fastRemove(comp);
    }

    public cancelInactive (flagToClear) {
        stableRemoveInactive(this._zero, flagToClear);
        stableRemoveInactive(this._neg, flagToClear);
        stableRemoveInactive(this._pos, flagToClear);
    }

    public invoke () {
        const compsNeg = this._neg;
        if (compsNeg.array.length > 0) {
            compsNeg.array.sort(compareOrder);
            this._invoke(compsNeg);
            compsNeg.array.length = 0;
        }

        this._invoke(this._zero);
        this._zero.array.length = 0;

        const compsPos = this._pos;
        if (compsPos.array.length > 0) {
            compsPos.array.sort(compareOrder);
            this._invoke(compsPos);
            compsPos.array.length = 0;
        }
    }
}

// for update: sort every time new component registered, invoke many times
class ReusableInvoker extends LifeCycleInvoker {
    public add (comp) {
        const order = comp.constructor._executionOrder;
        if (order === 0) {
            this._zero.array.push(comp);
        }
        else {
            const array = order < 0 ? this._neg.array : this._pos.array;
            const i = sortedIndex(array, comp);
            if (i < 0) {
                array.splice(~i, 0, comp);
            }
            else if (CC_DEV) {
                cc.error('component already added');
            }
        }
    }

    public remove (comp) {
        const order = comp.constructor._executionOrder;
        if (order === 0) {
            this._zero.fastRemove(comp);
        }
        else {
            const iterator = order < 0 ? this._neg : this._pos;
            const i = sortedIndex(iterator.array, comp);
            if (i >= 0) {
                iterator.removeAt(i);
            }
        }
    }

    public invoke (dt) {
        if (this._neg.array.length > 0) {
            this._invoke(this._neg, dt);
        }

        this._invoke(this._zero, dt);

        if (this._pos.array.length > 0) {
            this._invoke(this._pos, dt);
        }
    }
}

function enableInEditor (comp) {
    if (!(comp._objFlags & IsEditorOnEnableCalled)) {
        cc.engine.emit('component-enabled', comp.uuid);
        comp._objFlags |= IsEditorOnEnableCalled;
    }
}

function createInvokeImpl (funcOrCode, useDt?) {
    if (typeof funcOrCode === 'function') {
        if (useDt) {
            return (iterator, dt) => {
                const array = iterator.array;
                for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                    const comp = array[iterator.i];
                    funcOrCode(comp, dt);
                }
            };
        }
        else {
            return (iterator) => {
                const array = iterator.array;
                for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                    const comp = array[iterator.i];
                    funcOrCode(comp);
                }
            };
        }
    }
    else {
        // function (it) {
        //     let a = it.array;
        //     for (it.i = 0; it.i < a.length; ++it.i) {
        //         let comp = a[it.i];
        //         // ...
        //     }
        // }
        const body = 'var a=it.array;' +
                   'for(it.i=0;it.i<a.length;++it.i){' +
                   'var c=a[it.i];' +
                   funcOrCode +
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
class ComponentScheduler {
    public static LifeCycleInvoker = LifeCycleInvoker;
    public static OneOffInvoker = OneOffInvoker;
    public static createInvokeImpl = createInvokeImpl;
    public static invokeOnEnable = CC_EDITOR ? (iterator) => {
        const compScheduler = cc.director._compScheduler;
        const array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            const comp = array[iterator.i];
            if (comp._enabled) {
                callOnEnableInTryCatch(comp);
                const deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                if (!deactivatedDuringOnEnable) {
                    compScheduler._onEnabled(comp);
                }
            }
        }
    } : (iterator) => {
        const compScheduler = cc.director._compScheduler;
        const array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            const comp = array[iterator.i];
            if (comp._enabled) {
                comp.onEnable();
                const deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                if (!deactivatedDuringOnEnable) {
                    compScheduler._onEnabled(comp);
                }
            }
        }
    };

    public startInvoker!: OneOffInvoker;
    public updateInvoker!: ReusableInvoker;
    public lateUpdateInvoker!: ReusableInvoker;
    public scheduleInNextFrame!: any[];
    protected _updating!: boolean;

    constructor () {
        this.unscheduleAll();
    }

    public unscheduleAll () {
        // invokers
        this.startInvoker = new OneOffInvoker(createInvokeImpl(
            CC_EDITOR ? callStartInTryCatch : callStart));
        this.updateInvoker = new ReusableInvoker(createInvokeImpl(
            CC_EDITOR ? callUpdateInTryCatch : callUpdate, true));
        this.lateUpdateInvoker = new ReusableInvoker(createInvokeImpl(
            CC_EDITOR ? callLateUpdateInTryCatch : callLateUpdate, true));

        // components deferred to next frame
        this.scheduleInNextFrame = [];

        // during a loop
        this._updating = false;
    }

    public _onEnabled (comp) {
        cc.director.getScheduler().resumeTarget(comp);
        comp._objFlags |= IsOnEnableCalled;

        // schedule
        if (this._updating) {
            this.scheduleInNextFrame.push(comp);
        }
        else {
            this._scheduleImmediate(comp);
        }
    }

    public _onDisabled (comp) {
        cc.director.getScheduler().pauseTarget(comp);
        comp._objFlags &= ~IsOnEnableCalled;

        // cancel schedule task
        const index = this.scheduleInNextFrame.indexOf(comp);
        if (index >= 0) {
            fastRemoveAt(this.scheduleInNextFrame, index);
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
    }

    public enableComp (comp, invoker) {
        if (!(comp._objFlags & IsOnEnableCalled)) {
            if (comp.onEnable) {
                if (invoker) {
                    invoker.add(comp);
                    return;
                }
                else {
                    comp.onEnable();

                    const deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                    if (deactivatedDuringOnEnable) {
                        return;
                    }
                }
            }
            this._onEnabled(comp);
        }
    }

    public disableComp (comp) {
        if (comp._objFlags & IsOnEnableCalled) {
            if (comp.onDisable) {
                comp.onDisable();
            }
            this._onDisabled(comp);
        }
    }

    public startPhase () {
        // Start of this frame
        this._updating = true;

        if (this.scheduleInNextFrame.length > 0) {
            this._deferredSchedule();
        }

        // call start
        this.startInvoker.invoke();
        // if (CC_PREVIEW) {
        //     try {
        //         this.startInvoker.invoke();
        //     }
        //     catch (e) {
        //         // prevent start from getting into infinite loop
        //         this.startInvoker._neg.array.length = 0;
        //         this.startInvoker._zero.array.length = 0;
        //         this.startInvoker._pos.array.length = 0;
        //         throw e;
        //     }
        // }
        // else {
        //     this.startInvoker.invoke();
        // }
    }

    public updatePhase (dt) {
        this.updateInvoker.invoke(dt);
    }

    public lateUpdatePhase (dt) {
        this.lateUpdateInvoker.invoke(dt);

        // End of this frame
        this._updating = false;
    }

    protected _scheduleImmediate (comp) {
        if (comp.start && !(comp._objFlags & IsStartCalled)) {
            this.startInvoker.add(comp);
        }
        if (comp.update) {
            this.updateInvoker.add(comp);
        }
        if (comp.lateUpdate) {
            this.lateUpdateInvoker.add(comp);
        }
    }

    protected _deferredSchedule () {
        const comps = this.scheduleInNextFrame;
        for (let i = 0, len = comps.length; i < len; i++) {
            const comp = comps[i];
            this._scheduleImmediate(comp);
        }
        comps.length = 0;
    }

}

if (CC_EDITOR) {
    ComponentScheduler.prototype.enableComp = function (comp, invoker) {
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

                        const deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                        if (deactivatedDuringOnEnable) {
                            return;
                        }
                    }
                }
                this._onEnabled(comp);
            }
        }
        enableInEditor(comp);
    };

    ComponentScheduler.prototype.disableComp = function (comp) {
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
    };
}

export default ComponentScheduler;
