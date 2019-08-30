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
import { array, Pool } from '../utils/js';
import { tryCatchFunctor_EDITOR } from '../utils/misc';
import ComponentScheduler from './component-scheduler';

const MAX_POOL_SIZE = 4;

// @ts-ignore
const IsPreloadStarted = CCObject.Flags.IsPreloadStarted;
// @ts-ignore
const IsOnLoadStarted = CCObject.Flags.IsOnLoadStarted;
// @ts-ignore
const IsOnLoadCalled = CCObject.Flags.IsOnLoadCalled;
// @ts-ignore
const Deactivating = CCObject.Flags.Deactivating;

const callPreloadInTryCatch = CC_EDITOR && tryCatchFunctor_EDITOR('__preload');
const callOnLoadInTryCatch = CC_EDITOR && tryCatchFunctor_EDITOR('onLoad', null,
        'target._objFlags |= ' + IsOnLoadCalled + '; arg(target);', _onLoadInEditor);
const callOnDestroyInTryCatch = CC_EDITOR && tryCatchFunctor_EDITOR('onDestroy');
const callResetInTryCatch = CC_EDITOR && tryCatchFunctor_EDITOR('resetInEditor');
const callOnFocusInTryCatch = CC_EDITOR && tryCatchFunctor_EDITOR('onFocusInEditor');
const callOnLostFocusInTryCatch = CC_EDITOR && tryCatchFunctor_EDITOR('onLostFocusInEditor');

const callPreload = CC_SUPPORT_JIT ? 'c.__preload();' : (c) => { c.__preload(); };
const callOnLoad = CC_SUPPORT_JIT ? ('c.onLoad();c._objFlags|=' + IsOnLoadCalled) : (c) => {
    c.onLoad();
    c._objFlags |= IsOnLoadCalled;
};

// for __preload: used internally, no sort
class UnsortedInvoker extends ComponentScheduler.LifeCycleInvoker {
    public add (comp) {
        this._zero.array.push(comp);
    }
    public remove (comp) {
        this._zero.fastRemove(comp);
    }
    public cancelInactive (flagToClear) {
        ComponentScheduler.LifeCycleInvoker.stableRemoveInactive(this._zero, flagToClear);
    }
    public invoke () {
        this._invoke(this._zero);
        this._zero.array.length = 0;
    }
}

const invokePreload = ComponentScheduler.createInvokeImpl(
    CC_EDITOR ? callPreloadInTryCatch : callPreload,
);
const invokeOnLoad = ComponentScheduler.createInvokeImpl(
    CC_EDITOR ? callOnLoadInTryCatch : callOnLoad,
);

const activateTasksPool = new Pool(MAX_POOL_SIZE);
activateTasksPool.get = function getActivateTask () {
    const task: any = this._get() || {
        preload: new UnsortedInvoker(invokePreload),
        onLoad: new ComponentScheduler.OneOffInvoker(invokeOnLoad),
        onEnable: new ComponentScheduler.OneOffInvoker(ComponentScheduler.invokeOnEnable),
    };

    // reset index to -1 so we can skip invoked component in cancelInactive
    task.preload._zero.i = -1;
    let invoker = task.onLoad;
    invoker._zero.i = -1;
    invoker._neg.i = -1;
    invoker._pos.i = -1;
    invoker = task.onEnable;
    invoker._zero.i = -1;
    invoker._neg.i = -1;
    invoker._pos.i = -1;

    return task;
};

function _componentCorrupted (node, comp, index) {
    if (CC_DEV) {
        cc.errorID(3817, node.name, index);
        console.log('Corrupted component value:', comp);
    }
    if (comp) {
        node._removeComponent(comp);
    }
    else {
        array.removeAt(node._components, index);
    }
}

function _onLoadInEditor (comp) {
    if (comp.onLoad && !cc.engine._isPlaying) {
        const focused = Editor.Selection.curActivate('node') === comp.node.uuid;
        if (focused) {
            if (comp.onFocusInEditor) {
                callOnFocusInTryCatch(comp);
            }
        }
        else {
            if (comp.onLostFocusInEditor) {
                callOnLostFocusInTryCatch(comp);
            }
        }
    }
    if ( !CC_TEST ) {
        // @ts-ignore
        _Scene.AssetsWatcher.start(comp);
    }
}

/**
 * The class used to perform activating and deactivating operations of node and component.
 */
export default class NodeActivator {
    public resetComp: any;
    protected _activatingStack!: any[];

    constructor () {
        this.reset();
    }

    public reset () {
        // a stack of node's activating tasks
        this._activatingStack = [];
    }

    public activateNode (node, active) {
        if (active) {
            const task: any = activateTasksPool.get();
            this._activatingStack.push(task);

            this._activateNodeRecursively(node, task.preload, task.onLoad, task.onEnable);
            task.preload.invoke();
            task.onLoad.invoke();
            task.onEnable.invoke();

            this._activatingStack.pop();
            activateTasksPool.put(task);
        }
        else {
            this._deactivateNodeRecursively(node);

            // remove children of this node from previous activating tasks to debounce
            // (this is an inefficient operation but it ensures general case could be implemented in a efficient way)
            const stack = this._activatingStack;
            for (const lastTask of stack) {
                lastTask.preload.cancelInactive(IsPreloadStarted);
                lastTask.onLoad.cancelInactive(IsOnLoadStarted);
                lastTask.onEnable.cancelInactive();
            }
        }
        node.emit('active-in-hierarchy-changed', node);
    }

    public activateComp (comp, preloadInvoker?, onLoadInvoker?, onEnableInvoker?) {
        if (!(comp._objFlags & IsPreloadStarted)) {
            comp._objFlags |= IsPreloadStarted;
            if (comp.__preload) {
                if (preloadInvoker) {
                    preloadInvoker.add(comp);
                }
                else {
                    comp.__preload();
                }
            }
        }
        if (!(comp._objFlags & IsOnLoadStarted)) {
            comp._objFlags |= IsOnLoadStarted;
            if (comp.onLoad) {
                if (onLoadInvoker) {
                    onLoadInvoker.add(comp);
                }
                else {
                    comp.onLoad();
                    comp._objFlags |= IsOnLoadCalled;
                }
            }
            else {
                comp._objFlags |= IsOnLoadCalled;
            }
        }
        if (comp._enabled) {
            const deactivatedOnLoading = !comp.node._activeInHierarchy;
            if (deactivatedOnLoading) {
                return;
            }
            cc.director._compScheduler.enableComp(comp, onEnableInvoker);
        }
    }

    public destroyComp (comp) {
        // ensure onDisable called
        cc.director._compScheduler.disableComp(comp);

        if (comp.onDestroy && (comp._objFlags & IsOnLoadCalled)) {
            comp.onDestroy();
        }
    }

    protected _activateNodeRecursively (node, preloadInvoker, onLoadInvoker, onEnableInvoker) {
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
        let originCount = node._components.length;
        // activate components
        for (let i = 0; i < originCount; ++i) {
            const component = node._components[i];
            if (component instanceof cc.Component) {
                this.activateComp(component, preloadInvoker, onLoadInvoker, onEnableInvoker);
            }
            else {
                _componentCorrupted(node, component, i);
                --i;
                --originCount;
            }
        }
        node._childArrivalOrder = node._children.length;
        // activate children recursively
        for (let i = 0, len = node._children.length; i < len; ++i) {
            const child = node._children[i];
            if (child._active) {
                this._activateNodeRecursively(child, preloadInvoker, onLoadInvoker, onEnableInvoker);
            }
        }
        node._onPostActivated(true);
    }

    protected _deactivateNodeRecursively (node) {
        if (CC_DEV) {
            cc.assert(!(node._objFlags & Deactivating), 'node should not deactivating');
            // ensures _activeInHierarchy is always changing when Deactivating flagged
            cc.assert(node._activeInHierarchy, 'node should not deactivated');
        }
        node._objFlags |= Deactivating;
        node._activeInHierarchy = false;

        // component maybe added during onEnable, and the onEnable of new component is already called
        // so we should record the origin length
        const originCount = node._components.length;
        for (let c = 0; c < originCount; ++c) {
            const component = node._components[c];
            if (component._enabled) {
                cc.director._compScheduler.disableComp(component);

                if (node._activeInHierarchy) {
                    // reactivated from root
                    node._objFlags &= ~Deactivating;
                    return;
                }
            }
        }
        for (let i = 0, len = node._children.length; i < len; ++i) {
            const child = node._children[i];
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
    }
}

if (CC_EDITOR) {
    NodeActivator.prototype.activateComp = (comp, preloadInvoker, onLoadInvoker, onEnableInvoker) => {
        if (cc.engine._isPlaying || comp.constructor._executeInEditMode) {
            if (!(comp._objFlags & IsPreloadStarted)) {
                comp._objFlags |= IsPreloadStarted;
                if (comp.__preload) {
                    if (preloadInvoker) {
                        preloadInvoker.add(comp);
                    }
                    else {
                        callPreloadInTryCatch(comp);
                    }
                }
            }
            if (!(comp._objFlags & IsOnLoadStarted)) {
                comp._objFlags |= IsOnLoadStarted;
                if (comp.onLoad) {
                    if (onLoadInvoker) {
                        onLoadInvoker.add(comp);
                    }
                    else {
                        callOnLoadInTryCatch(comp);
                    }
                }
                else {
                    comp._objFlags |= IsOnLoadCalled;
                    _onLoadInEditor(comp);
                }
            }
        }
        if (comp._enabled) {
            const deactivatedOnLoading = !comp.node._activeInHierarchy;
            if (deactivatedOnLoading) {
                return;
            }
            cc.director._compScheduler.enableComp(comp, onEnableInvoker);
        }
    };

    NodeActivator.prototype.destroyComp = (comp) => {
        // ensure onDisable called
        cc.director._compScheduler.disableComp(comp);

        if (comp.onDestroy && (comp._objFlags & IsOnLoadCalled)) {
            if (cc.engine._isPlaying || comp.constructor._executeInEditMode) {
                callOnDestroyInTryCatch(comp);
            }
        }
    };

    NodeActivator.prototype.resetComp = (comp) => {
        if (comp.resetInEditor) {
            callResetInTryCatch(comp);
        }
    };
}
