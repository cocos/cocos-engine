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
var Activating = Flags.Activating;

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
    // clear () {
    //     this.compsZero.array.length = 0;
    //     this.compsPos.array.length = 0;
    //     this.compsNeg.array.length = 0;
    // }
});

function stableRemoveChildOf (iterator, node) {
    var array = iterator.array;
    for (var i = 0; i < array.length;) {
        var comp = array[i];
        if (comp.node.isChildOf(node)) {
            iterator.removeAt(i);
        }
        else {
            ++i;
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
    cancelInvokeChildOf (node) {
        stableRemoveChildOf(this.compsZero, node);
        stableRemoveChildOf(this.compsNeg, node);
        stableRemoveChildOf(this.compsPos, node);
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
        else if (order < 0) {
            // TODO - binary insert
            this.compsNeg.array.push(comp);
            this.sort(this.compsNeg);
        }
        else {
            // TODO - binary insert
            this.compsPos.array.push(comp);
            this.sort(this.compsPos);
        }
    },
    remove (comp) {
        var order = comp.constructor._executionOrder;
        if (order === 0) {
            this.compsZero.fastRemove(comp);
        }
        else if (order < 0) {
            // TODO - binary search
            this.compsNeg.remove(comp);
        }
        else {
            // TODO - binary insert
            this.compsPos.remove(comp);
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

// for __preload: use internally, no dynamic sort
var StaticInvoker = cc.Class({
    extends: LifeCycleInvoker,
    add (comp) {
        this.compsZero.array.push(comp);
    },
    remove (comp) {
        this.compsZero.fastRemove(comp);
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

function ActivatingContext (node, active, preload, onLoad, onEnable) {
    this.node = node;
    this.active = active;
    // invokers if active
    this.preload = preload;
    this.onLoad = onLoad;
    this.onEnable = onEnable;
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

    // a stack of ActivatingContext to save node's activating contexts
    this._activatingStack =[];
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

    // get invoker temporary
    pushActivatingContext: function (node, active) {
        var context;
        if (active) {
            var preload = CC_EDITOR ? new OneOffInvoker(function (iterator) {
                var array = iterator.array;
                for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                    let comp = array[iterator.i];
                    callPreloadInTryCatch(comp);
                }
            }) : new OneOffInvoker(function (iterator) {
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
                    callOnEnableInTryCatch(comp);

                    var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                    if (!deactivatedDuringOnEnable) {
                        scheduler.resumeTarget(comp);
                        compScheduler.schedule(comp);
                        comp._objFlags |= IsOnEnableCalled;
                    }
                }
            }) : new OneOffInvoker(function (iterator) {
                var scheduler = cc.director.getScheduler();
                var compScheduler = cc.director._compScheduler;
                var array = iterator.array;
                for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
                    let comp = array[iterator.i];
                    comp.onEnable();
                    var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;
                    if (!deactivatedDuringOnEnable) {
                        scheduler.resumeTarget(comp);
                        compScheduler.schedule(comp);
                        comp._objFlags |= IsOnEnableCalled;
                    }
                }
            });
            context = new ActivatingContext(node, active, preload, onLoad, onEnable);
        }
        else {
            context = new ActivatingContext(node, active);
        }
        this._activatingStack.push(context);
        return context;
    },

    // release invoker temporary
    popActivatingContext: function (context) {
        if (CC_EDITOR && context !== this._activatingStack[this._activatingStack.length - 1]) {
            cc.error('unknown state');
        }
        this._activatingStack.pop();
        context.node = null;
        // TODO: push context to pool
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

    _activateNodeRecursively (node, newActive, preloadInvoker, onLoadInvoker, onEnableInvoker) {
        // var cancelActivation = false;
        if (node._objFlags & Activating) {
            if (newActive) {
                // abort endless loop
                cc.errorID(3816, node.name);
                return;
            }
            // else {
            //     cancelActivation = true;
            // }
        }
        else if (newActive) {
            node._objFlags |= Activating;
        }

        node._activeInHierarchy = newActive;

        // component maybe added during onEnable, and the onEnable of new component is already called
        // so we should record the origin length
        var originCount = node._components.length;
        for (var c = 0; c < originCount; ++c) {
            var component = node._components[c];
            if (component instanceof cc.Component) {
                if (newActive) {
                    this.activateComp(component, preloadInvoker, onLoadInvoker, onEnableInvoker);
                }
                else if (component._enabled) {
                    this.disableComp(component);

                    if (node._activeInHierarchy) {
                        // reactivated from root
                        return;
                    }
                }
            }
            else {
                _componentCorrupted(node, component, c);
                --c;
                --originCount;
            }
        }

        // activate children recursively
        for (var i = 0, len = node._children.length; i < len; ++i) {
            var child = node._children[i];
            if (child._active) {
                this._activateNodeRecursively(child, newActive, preloadInvoker, onLoadInvoker, onEnableInvoker);

                if (!newActive && node._activeInHierarchy) {
                    // reactivated from root
                    return;
                }
            }
        }

        node._objFlags &= ~Activating;

        if (/*!cancelActivation &&*/ node._onPostActivated) {
            node._onPostActivated(newActive);
        }
    },

    activateNode (node, active) {
        var context = this.pushActivatingContext(node, active);

        if (active) {
            this._activateNodeRecursively(node, active, context.preload, context.onLoad, context.onEnable);
            context.preload.invoke();
            context.onLoad.invoke();
            context.onEnable.invoke();
        }
        else {
            this._activateNodeRecursively(node, active);
        }
        node.emit('active-in-hierarchy-changed', node);

        this.popActivatingContext(context);

        // remove child of this node from previous activating tasks to debounce
        // (this is not an efficient operation but it ensures general case could be implemented in a efficient way)
        var stack = this._activatingStack;
        for (var i = 0; i < stack.length; i++) {
            var runningContext = stack[i];
            // can not just check runningContext.node because hierarchy may change during activating
            runningContext.preload.cancelInvokeChildOf(node);
            runningContext.onLoad.cancelInvokeChildOf(node);
            runningContext.onEnable.cancelInvokeChildOf(node);
        }
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
            this.enableComp(comp, onEnableInvoker);  //
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
            this.enableComp(comp, onEnableInvoker);  //
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
