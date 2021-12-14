/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @module scene-graph
 */

import { EDITOR, SUPPORT_JIT, DEV, TEST } from 'internal:constants';
import { CCObject } from '../data/object';
import { MutableForwardIterator } from '../utils/array';
import { array } from '../utils/js';
import { tryCatchFunctor_EDITOR } from '../utils/misc';
import { legacyCC } from '../global-exports';
import { error, assert } from '../platform/debug';

const fastRemoveAt = array.fastRemoveAt;

const IsStartCalled = CCObject.Flags.IsStartCalled;
const IsOnEnableCalled = CCObject.Flags.IsOnEnableCalled;
const IsEditorOnEnableCalled = CCObject.Flags.IsEditorOnEnableCalled;

const callerFunctor: any = EDITOR && tryCatchFunctor_EDITOR;
const callOnEnableInTryCatch = EDITOR && callerFunctor('onEnable');
const callOnDisableInTryCatch = EDITOR && callerFunctor('onDisable');

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
        } else if (testOrder < order) {
            l = m + 1;
        } else {
            const testId = test._id;
            if (testId > id) {
                h = m - 1;
            } else if (testId < id) {
                l = m + 1;
            } else {
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
        if (comp.node._activeInHierarchy) {
            ++next;
        } else {
            iterator.removeAt(next);
            if (flagToClear) {
                comp._objFlags &= ~flagToClear;
            }
        }
    }
}

// This class contains some queues used to invoke life-cycle methods by script execution order
export class LifeCycleInvoker {
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

        if (TEST) {
            assert(typeof invokeFunc === 'function', 'invokeFunc must be type function');
        }
        this._invoke = invokeFunc;
    }
}

function compareOrder (a, b) {
    return a.constructor._executionOrder - b.constructor._executionOrder;
}

// for onLoad: sort once all components registered, invoke once
export class OneOffInvoker extends LifeCycleInvoker {
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
        } else {
            const array = order < 0 ? this._neg.array : this._pos.array;
            const i = sortedIndex(array, comp);
            if (i < 0) {
                array.splice(~i, 0, comp);
            } else if (DEV) {
                error('component already added');
            }
        }
    }

    public remove (comp) {
        const order = comp.constructor._executionOrder;
        if (order === 0) {
            this._zero.fastRemove(comp);
        } else {
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
        legacyCC.engine.emit('component-enabled', comp.uuid);
        if (!legacyCC.GAME_VIEW) {
            comp._objFlags |= IsEditorOnEnableCalled;
        }
    }
}

// return function to simply call each component with try catch protection
export function createInvokeImplJit (code: string, useDt?, ensureFlag?) {
    // function (it) {
    //     let a = it.array;
    //     for (it.i = 0; it.i < a.length; ++it.i) {
    //         let c = a[it.i];
    //         // ...
    //     }
    // }
    const body = `${'var a=it.array;'
                + 'for(it.i=0;it.i<a.length;++it.i){'
                + 'var c=a[it.i];'}${
        code
    }}`;
    const fastPath = useDt ? Function('it', 'dt', body) : Function('it', body);
    const singleInvoke = Function('c', 'dt', code);
    return createInvokeImpl(singleInvoke, fastPath, ensureFlag);
}
export function createInvokeImpl (singleInvoke, fastPath, ensureFlag?) {
    return (iterator, dt) => {
        try {
            fastPath(iterator, dt);
        } catch (e) {
            // slow path
            legacyCC._throw(e);
            const array = iterator.array;
            if (ensureFlag) {
                array[iterator.i]._objFlags |= ensureFlag;
            }
            ++iterator.i;   // invoke next callback
            for (; iterator.i < array.length; ++iterator.i) {
                try {
                    singleInvoke(array[iterator.i], dt);
                } catch (e) {
                    legacyCC._throw(e);
                    if (ensureFlag) {
                        array[iterator.i]._objFlags |= ensureFlag;
                    }
                }
            }
        }
    };
}

const invokeStart = SUPPORT_JIT ? createInvokeImplJit(`c.start();c._objFlags|=${IsStartCalled}`, false, IsStartCalled)
    : createInvokeImpl(
        (c) => {
            c.start();
            c._objFlags |= IsStartCalled;
        },
        (iterator) => {
            const array = iterator.array;
            for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                const comp = array[iterator.i];
                comp.start();
                comp._objFlags |= IsStartCalled;
            }
        },
        IsStartCalled,
    );

const invokeUpdate = SUPPORT_JIT ? createInvokeImplJit('c.update(dt)', true)
    : createInvokeImpl(
        (c, dt) => {
            c.update(dt);
        },
        (iterator, dt) => {
            const array = iterator.array;
            for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                array[iterator.i].update(dt);
            }
        },
    );

const invokeLateUpdate = SUPPORT_JIT ? createInvokeImplJit('c.lateUpdate(dt)', true)
    : createInvokeImpl(
        (c, dt) => {
            c.lateUpdate(dt);
        },
        (iterator, dt) => {
            const array = iterator.array;
            for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                array[iterator.i].lateUpdate(dt);
            }
        },
    );

export const invokeOnEnable = EDITOR ? (iterator) => {
    const compScheduler = legacyCC.director._compScheduler;
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
    const compScheduler = legacyCC.director._compScheduler;
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

/**
 * @en The Manager for Component's life-cycle methods.
 * It collaborates with [[NodeActivator]] to schedule and invoke life cycle methods for components
 * @zh 组件生命周期函数的调度器。
 * 它和 [[NodeActivator]] 一起调度并执行组件的生命周期函数。
 */
export class ComponentScheduler {
    /**
     * @en The invoker of `start` callback
     * @zh `start` 回调的调度器
     */
    public startInvoker!: OneOffInvoker;
    /**
     * @en The invoker of `update` callback
     * @zh `update` 回调的调度器
     */
    public updateInvoker!: ReusableInvoker;
    /**
     * @en The invoker of `lateUpdate` callback
     * @zh `lateUpdate` 回调的调度器
     */
    public lateUpdateInvoker!: ReusableInvoker;
    // components deferred to schedule
    private _deferredComps: any[] = [];
    private _updating!: boolean;

    constructor () {
        this.unscheduleAll();
    }

    /**
     * @en Cancel all future callbacks, including `start`, `update` and `lateUpdate`
     * @zh 取消所有未来的函数调度，包括 `start`，`update` 和 `lateUpdate`
     */
    public unscheduleAll () {
        // invokers
        this.startInvoker = new OneOffInvoker(invokeStart);
        this.updateInvoker = new ReusableInvoker(invokeUpdate);
        this.lateUpdateInvoker = new ReusableInvoker(invokeLateUpdate);

        // during a loop
        this._updating = false;
    }

    /**
     * @private_cc
     */
    public _onEnabled (comp) {
        legacyCC.director.getScheduler().resumeTarget(comp);
        comp._objFlags |= IsOnEnableCalled;

        // schedule
        if (this._updating) {
            this._deferredComps.push(comp);
        } else {
            this._scheduleImmediate(comp);
        }
    }

    /**
     * @private_cc
     */
    public _onDisabled (comp) {
        legacyCC.director.getScheduler().pauseTarget(comp);
        comp._objFlags &= ~IsOnEnableCalled;

        // cancel schedule task
        const index = this._deferredComps.indexOf(comp);
        if (index >= 0) {
            fastRemoveAt(this._deferredComps, index);
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

    /**
     * @en Enable a component
     * @zh 启用一个组件
     * @param comp The component to be enabled
     * @param invoker The invoker which is responsible to schedule the `onEnable` call
     */
    public enableComp (comp, invoker?) {
        if (!(comp._objFlags & IsOnEnableCalled)) {
            if (comp.onEnable) {
                if (invoker) {
                    invoker.add(comp);
                    return;
                } else {
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

    /**
     * @en Disable a component
     * @zh 禁用一个组件
     * @param comp The component to be disabled
     */
    public disableComp (comp) {
        if (comp._objFlags & IsOnEnableCalled) {
            if (comp.onDisable) {
                comp.onDisable();
            }
            this._onDisabled(comp);
        }
    }

    /**
     * @en Process start phase for registered components
     * @zh 为当前注册的组件执行 start 阶段任务
     */
    public startPhase () {
        // Start of this frame
        this._updating = true;

        // call start
        this.startInvoker.invoke();
        // Start components of new activated nodes during start
        this._startForNewComps();
        // if (PREVIEW) {
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

    /**
     * @en Process update phase for registered components
     * @zh 为当前注册的组件执行 update 阶段任务
     * @param dt 距离上一帧的时间
     */
    public updatePhase (dt:number) {
        this.updateInvoker.invoke(dt);
    }

    /**
     * @en Process late update phase for registered components
     * @zh 为当前注册的组件执行 late update 阶段任务
     * @param dt 距离上一帧的时间
     */
    public lateUpdatePhase (dt:number) {
        this.lateUpdateInvoker.invoke(dt);

        // End of this frame
        this._updating = false;

        // Start components of new activated nodes during update and lateUpdate
        // They will be running in the next frame
        this._startForNewComps();
    }

    // Call new registered start schedule immediately since last time start phase calling in this frame
    // See cocos-creator/2d-tasks/issues/256
    private _startForNewComps () {
        if (this._deferredComps.length > 0) {
            this._deferredSchedule();
            this.startInvoker.invoke();
        }
    }

    private _scheduleImmediate (comp) {
        if (typeof comp.start === 'function' && !(comp._objFlags & IsStartCalled)) {
            this.startInvoker.add(comp);
        }
        if (typeof comp.update === 'function') {
            this.updateInvoker.add(comp);
        }
        if (typeof comp.lateUpdate === 'function') {
            this.lateUpdateInvoker.add(comp);
        }
    }

    private _deferredSchedule () {
        const comps = this._deferredComps;
        for (let i = 0, len = comps.length; i < len; i++) {
            this._scheduleImmediate(comps[i]);
        }
        comps.length = 0;
    }
}

if (EDITOR) {
    ComponentScheduler.prototype.enableComp = function (comp, invoker) {
        if (legacyCC.GAME_VIEW || comp.constructor._executeInEditMode) {
            if (!(comp._objFlags & IsOnEnableCalled)) {
                if (comp.onEnable) {
                    if (invoker) {
                        invoker.add(comp);
                        enableInEditor(comp);
                        return;
                    } else {
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
        if (legacyCC.GAME_VIEW || comp.constructor._executeInEditMode) {
            if (comp._objFlags & IsOnEnableCalled) {
                if (comp.onDisable) {
                    callOnDisableInTryCatch(comp);
                }
                this._onDisabled(comp);
            }
        }
        if (comp._objFlags & IsEditorOnEnableCalled) {
            legacyCC.engine.emit('component-disabled', comp.uuid);
            comp._objFlags &= ~IsEditorOnEnableCalled;
        }
    };
}
