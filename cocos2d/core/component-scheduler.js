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
var IsOnLoadStarted = Flags.IsOnLoadStarted;
var IsOnLoadCalled = Flags.IsOnLoadCalled;
var Deactivating = Flags.Deactivating;

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

// This class contains some queues used to invoke life-cycle methods by script execution order
var LifeCycleInvoker = cc.Class({
    __ctor__ (invokeFunc) {
        // components which priority === 0 (default)
        this.compsZero = new JsArray.MutableForwardIterator([]);
        // components which priority > 0
        this.compsPos = new JsArray.MutableForwardIterator([]);
        // components which priority < 0
        this.compsNeg = new JsArray.MutableForwardIterator([]);

        this._invoke = invokeFunc;
    },
    add: null,
    remove: null,
    invoke: null,
    sort (iterator) {
        iterator.array.sort(function (a, b) {
            return a.constructor._executionOrder - b.constructor._executionOrder;
        });
    },
});

function stableRemoveInactive (iterator) {
    var array = iterator.array;
    for (var i = 0; i < array.length;) {
        var comp = array[i];
        if (comp._enabled && comp.node._activeInHierarchy) {
            ++i;
        }
        else {
            iterator.removeAt(i);
        }
    }
}

// for onLoad: sort once all components registered, invoke once
var OneOffInvoker = cc.Class({
    extends: LifeCycleInvoker,
    add (comp) {
        var order = comp.constructor._executionOrder;
        if (order === 0) {
            this.compsZero.array.push(comp);
        }
        else if (order < 0) {
            this.compsNeg.array.push(comp);
        }
        else {
            this.compsPos.array.push(comp);
        }
    },
    remove (comp) {
        var order = comp.constructor._executionOrder;
        if (order === 0) {
            this.compsZero.fastRemove(comp);
        }
        else if (order < 0) {
            this.compsNeg.fastRemove(comp);
        }
        else {
            this.compsPos.fastRemove(comp);
        }
    },
    cancelInactive () {
        stableRemoveInactive(this.compsZero);
        stableRemoveInactive(this.compsNeg);
        stableRemoveInactive(this.compsPos);
    },
    invoke () {
        var compsNeg = this.compsNeg;
        if (compsNeg.array.length > 0) {
            this.sort(compsNeg);
            this._invoke(compsNeg);
            compsNeg.array.length = 0;
        }

        this._invoke(this.compsZero);
        this.compsZero.array.length = 0;

        var compsPos = this.compsPos;
        if (compsPos.array.length > 0) {
            this.sort(compsPos);
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
            this.compsZero.array.push(comp);
        }
        else {
            var array = order < 0 ? this.compsNeg.array : this.compsPos.array;
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
            this.compsZero.fastRemove(comp);
        }
        else {
            var iterator = order < 0 ? this.compsNeg : this.compsPos;
            var i = sortedIndex(iterator.array, comp);
            if (i >= 0) {
                iterator.removeAt(i);
            }
        }
    },
    invoke (dt) {
        if (this.compsNeg.array.length > 0) {
            this._invoke(this.compsNeg, dt);
        }

        this._invoke(this.compsZero, dt);

        if (this.compsPos.array.length > 0) {
            this._invoke(this.compsPos, dt);
        }
    },
});

// for __preload: use internally, no sort
var UnsortedInvoker = cc.Class({
    extends: LifeCycleInvoker,
    add (comp) {
        this.compsZero.array.push(comp);
    },
    remove (comp) {
        this.compsZero.fastRemove(comp);
    },
    cancelInactive () {
        stableRemoveInactive(this.compsZero);
    },
    invoke () {
        this._invoke(this.compsZero);
        this.compsZero.array.length = 0;
    },
});

function enableInEditor (comp) {
    if (!(comp._objFlags & IsEditorOnEnableCalled)) {
        cc.engine.emit('component-enabled', comp.uuid);
        comp._objFlags |= IsEditorOnEnableCalled;
    }
}

// function getInvokeImpl (code, param) {
//     // function (it) {
//     //     var a = it.array;
//     //     for (it.i = 0; it.i < a.length; ++it.i) {
//     //         let comp = a[it.i];
//     //         // ...
//     //     }
//     // }
//     return Misc.cleanEval_1P('(function(it){' +
//                                   'var a=it.array;' +
//                                   'for(it.i=0;it.i<a.length;++it.i){' +
//                                       'var comp=a[it.i];' +
//                                       code +
//                                   '}' +
//                               '})', param);
// }

function createActivateTask () {
    var preload = CC_EDITOR ? new UnsortedInvoker(function (iterator) {
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            let comp = array[iterator.i];
            callPreloadInTryCatch(comp);
        }
    }) : new UnsortedInvoker(function (iterator) {
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            let comp = array[iterator.i];
            comp.__preload();
        }
    });
    var onLoad = CC_EDITOR ? new OneOffInvoker(function (iterator) {
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            let comp = array[iterator.i];
            callOnLoadInTryCatch(comp);
            if (!comp.node._activeInHierarchy) {
                // deactivated during onLoad
                break;
            }
        }
    }) : new OneOffInvoker(function (iterator) {
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            let comp = array[iterator.i];
            comp.onLoad();
            if (!comp.node._activeInHierarchy) {
                // deactivated during onLoad
                break;
            }
        }
    });
    var onEnable = CC_EDITOR ? new OneOffInvoker(function (iterator) {
        var scheduler = cc.director.getScheduler();
        var compScheduler = cc.director._compScheduler;
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            let comp = array[iterator.i];
            if (comp._enabled) {
                callOnEnableInTryCatch(comp);

                var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                if (!deactivatedDuringOnEnable) {
                    scheduler.resumeTarget(comp);
                    compScheduler.schedule(comp);
                    comp._objFlags |= IsOnEnableCalled;
                }
            }
        }
    }) : new OneOffInvoker(function (iterator) {
        var scheduler = cc.director.getScheduler();
        var compScheduler = cc.director._compScheduler;
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            let comp = array[iterator.i];
            if (comp._enabled) {
                comp.onEnable();
                var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                if (!deactivatedDuringOnEnable) {
                    scheduler.resumeTarget(comp);
                    compScheduler.schedule(comp);
                    comp._objFlags |= IsOnEnableCalled;
                }
            }
        }
    });

    return { preload, onLoad, onEnable };
}

var MAX_POOL_SIZE = 4;
var activateTasksPool = [];
// get invoker temporary
function getActivateTask () {
    return activateTasksPool.pop() || createActivateTask();
}
// release invoker temporary
function putActivateTask (task) {
    if (activateTasksPool.length < MAX_POOL_SIZE) {
        activateTasksPool.push(task);
    }
}

function ctor () {
    // during a loop
    this._updating = false;

    // invokers

    this.startInvoker = new OneOffInvoker(CC_EDITOR ? function (iterator) {
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            let comp = array[iterator.i];
            callStartInTryCatch(comp);
            comp._objFlags |= IsStartCalled;
        }
    } : function (iterator) {
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            let comp = array[iterator.i];
            comp.start();
            comp._objFlags |= IsStartCalled;
        }
    });

    // var invokeImpl;
    // if (CC_EDITOR) {
    //     invokeImpl = getInvokeImpl(
    //         'P1(comp);' +
    //         'comp._objFlags |= P2;',
    //         callStartInTryCatch, IsStartCalled
    //     );
    // }
    // else {
    //     invokeImpl = getInvokeImpl(
    //         'comp.start();' +
    //         'comp._objFlags |= P1;',
    //         IsStartCalled
    //     );
    // }
    // this.startInvoker = new OneOffInvoker(invokeImpl);

    this.updateInvoker = new ReusableInvoker(CC_EDITOR ? function (iterator, dt) {
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            let comp = array[iterator.i];
            callUpdateInTryCatch(comp, dt);
        }
    } : function (iterator, dt) {
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            let comp = array[iterator.i];
            comp.update(dt);
        }
    });

    this.lateUpdateInvoker = new ReusableInvoker(CC_EDITOR ? function (iterator, dt) {
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            let comp = array[iterator.i];
            callLateUpdateInTryCatch(comp, dt);
        }
    } : function (iterator, dt) {
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            let comp = array[iterator.i];
            comp.lateUpdate(dt);
        }
    });

    // components deferred to next frame
    this.scheduleInNextFrame = [];

    // a stack of node's activating tasks
    this._activatingStack = [];
}

function _componentCorrupted (node, comp, index) {
    if (CC_DEV) {
        cc.errorID(3817, node.name, index);
        console.log('Corrupted component value:', comp);
    }
    if (comp) {
        node._removeComponent(comp);
    }
    else {
        JS.array.removeAt(node._components, index);
    }
}

/**
 * The Manager for Component's life-cycle methods.
 */
var ComponentScheduler = cc.Class({
    ctor: ctor,
    unscheduleAll: ctor,

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
                cc.director.getScheduler().resumeTarget(comp);
                this.schedule(comp);
                
                comp._objFlags |= IsOnEnableCalled;
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

    _activateNodeRecursively (node, preloadInvoker, onLoadInvoker, onEnableInvoker) {
        if (node._objFlags & Deactivating) {
            // en:
            // Forbid reactive the same node during its deactivating procedure
            // to avoid endless loop and simplify the implementation.
            // zh:
            // 对相同节点而言，无法撤销反激活，防止反激活 - 激活 - 反激活的死循环发生。
            // 这样设计简化了一些引擎的实现，而且对调用者来说能保证反激活操作都能成功。
            cc.errorID(3816, node.name);
            return;
        }

        node._activeInHierarchy = true;

        // component maybe added during onEnable, and the onEnable of new component is already called
        // so we should record the origin length
        var originCount = node._components.length;
        // activate components
        for (let i = 0; i < originCount; ++i) {
            let component = node._components[i];
            if (component instanceof cc.Component) {
                this.activateComp(component, preloadInvoker, onLoadInvoker, onEnableInvoker);
            }
            else {
                _componentCorrupted(node, component, i);
                --i;
                --originCount;
            }
        }
        // activate children recursively
        for (let i = 0, len = node._children.length; i < len; ++i) {
            let child = node._children[i];
            if (child._active) {
                this._activateNodeRecursively(child, preloadInvoker, onLoadInvoker, onEnableInvoker);
            }
        }

        node._onPostActivated(true);
    },

    _deactivateNodeRecursively (node) {
        if (CC_TEST || CC_DEV) {
            cc.assert(!(node._objFlags & Deactivating), 'node should not deactivating');
            // ensures _activeInHierarchy is always changing when Deactivating flagged
            cc.assert(node._activeInHierarchy, 'node should not deactivated');
        }
        node._objFlags |= Deactivating;
        node._activeInHierarchy = false;

        // component maybe added during onEnable, and the onEnable of new component is already called
        // so we should record the origin length
        var originCount = node._components.length;
        for (let c = 0; c < originCount; ++c) {
            let component = node._components[c];
            if (component._enabled) {
                this.disableComp(component);

                if (node._activeInHierarchy) {
                    // reactivated from root
                    node._objFlags &= ~Deactivating;
                    return;
                }
            }
        }
        for (let i = 0, len = node._children.length; i < len; ++i) {
            let child = node._children[i];
            if (child._activeInHierarchy) {
                this._deactivateNodeRecursively(child);

                if (node._activeInHierarchy) {
                    // reactivated from root
                    node._objFlags &= ~Deactivating;
                    return;
                }
            }
        }

        node._onPostActivated(false);
        node._objFlags &= ~Deactivating;
    },

    activateNode (node, active) {
        if (active) {
            var task = getActivateTask(node);
            this._activatingStack.push(task);

            this._activateNodeRecursively(node, task.preload, task.onLoad, task.onEnable);
            task.preload.invoke();
            task.onLoad.invoke();
            task.onEnable.invoke();

            this._activatingStack.pop();
            putActivateTask(task);
        }
        else {
            this._deactivateNodeRecursively(node);

            // remove children of this node from previous activating tasks to debounce
            // (this is an inefficient operation but it ensures general case could be implemented in a efficient way)
            var stack = this._activatingStack;
            for (var i = 0; i < stack.length; i++) {
                var lastTask = stack[i];
                lastTask.preload.cancelInactive(node);
                lastTask.onLoad.cancelInactive(node);
                lastTask.onEnable.cancelInactive(node);
            }
        }
        node.emit('active-in-hierarchy-changed', node);
    },

    activateComp: CC_EDITOR ? function (comp, preloadInvoker, onLoadInvoker, onEnableInvoker) {
        if (!(comp._objFlags & IsOnLoadStarted) &&
            (cc.engine._isPlaying || comp.constructor._executeInEditMode)) {
            comp._objFlags |= IsOnLoadStarted;

            if (typeof comp.__preload === 'function') {
                if (preloadInvoker) {
                    preloadInvoker.add(comp);
                }
                else {
                    callPreloadInTryCatch(comp);
                }
            }
            if (comp.onLoad) {
                if (onLoadInvoker) {
                    onLoadInvoker.add(comp);
                }
                else {
                    callOnLoadInTryCatch(comp);
                }
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
            this.enableComp(comp, onEnableInvoker);
        }
    } : function (comp, preloadInvoker, onLoadInvoker, onEnableInvoker) {
        if (!(comp._objFlags & IsOnLoadStarted)) {
            comp._objFlags |= IsOnLoadStarted;

            if (typeof comp.__preload === 'function') {
                if (preloadInvoker) {
                    preloadInvoker.add(comp);
                }
                else {
                    comp.__preload();
                }
            }
            if (comp.onLoad) {
                if (onLoadInvoker) {
                    onLoadInvoker.add(comp);
                }
                else {
                    comp.onLoad();
                }
            }

            comp._objFlags |= IsOnLoadCalled;
        }
        if (comp._enabled) {
            var deactivatedOnLoading = !comp.node._activeInHierarchy;
            if (deactivatedOnLoading) {
                return;
            }
            this.enableComp(comp, onEnableInvoker);
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
            this.startInvoker.remove(comp);
        }
        if (comp.update) {
            this.updateInvoker.remove(comp);
        }
        if (comp.lateUpdate) {
            this.lateUpdateInvoker.remove(comp);
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
