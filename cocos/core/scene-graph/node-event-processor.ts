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
 * @hidden
 */

import { CallbacksInvoker } from '../event/callbacks-invoker';
import { Event, EventListener, EventMouse, EventTouch, Touch } from '../../input/types';
import { Vec2 } from '../math/vec2';
import { eventManager } from '../../input/event-manager';
import { BaseNode } from './base-node';
import { Node } from './node';
import { errorID } from '../platform/debug';
import { legacyCC } from '../global-exports';
import { Component } from '../components/component';
import { NodeEventType } from './node-event';

const _cachedArray = new Array<BaseNode>(16);
let _currentHovered: BaseNode | null = null;
let pos = new Vec2();

const _touchEvents = [
    NodeEventType.TOUCH_START,
    NodeEventType.TOUCH_MOVE,
    NodeEventType.TOUCH_END,
    NodeEventType.TOUCH_CANCEL,
];

const _mouseEvents = [
    NodeEventType.MOUSE_DOWN,
    NodeEventType.MOUSE_ENTER,
    NodeEventType.MOUSE_MOVE,
    NodeEventType.MOUSE_LEAVE,
    NodeEventType.MOUSE_UP,
    NodeEventType.MOUSE_WHEEL,
];

// TODO: rearrange event
function _touchStartHandler (this: EventListener, touch: Touch, event: EventTouch) {
    const node = this.owner as Node | null;
    if (!node || !node._uiProps.uiTransformComp) {
        return false;
    }

    touch.getUILocation(pos);

    if (node._uiProps.uiTransformComp.isHit(pos, this)) {
        event.type = NodeEventType.TOUCH_START;
        event.touch = touch;
        event.bubbles = true;
        node.dispatchEvent(event);
        return true;
    }

    return false;
}

function _touchMoveHandler (this: EventListener, touch: Touch, event: EventTouch) {
    const node = this.owner as Node;
    if (!node || !node._uiProps.uiTransformComp) {
        return false;
    }

    event.type = NodeEventType.TOUCH_MOVE;
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
    return true;
}

function _touchEndHandler (this: EventListener, touch: Touch, event: EventTouch) {
    const node = this.owner as Node;
    if (!node || !node._uiProps.uiTransformComp) {
        return;
    }

    touch.getUILocation(pos);

    if (node._uiProps.uiTransformComp.isHit(pos, this)) {
        event.type = NodeEventType.TOUCH_END;
    } else {
        event.type = NodeEventType.TOUCH_CANCEL;
    }
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
}

function _touchCancelHandler (this: EventListener, touch: Touch, event: EventTouch) {
    const node = this.owner as Node;
    if (!node || !node._uiProps.uiTransformComp) {
        return;
    }

    event.type = NodeEventType.TOUCH_CANCEL;
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
}

function _mouseDownHandler (this: EventListener, event: EventMouse) {
    const node = this.owner as Node;
    if (!node || !node._uiProps.uiTransformComp) {
        return;
    }

    pos = event.getUILocation();

    if (node._uiProps.uiTransformComp.isHit(pos, this)) {
        event.type = NodeEventType.MOUSE_DOWN;
        event.bubbles = true;
        node.dispatchEvent(event);
    }
}

function _mouseMoveHandler (this: EventListener, event: EventMouse) {
    const node = this.owner as Node;
    if (!node || !node._uiProps.uiTransformComp) {
        return;
    }

    pos = event.getUILocation();

    const hit = node._uiProps.uiTransformComp.isHit(pos, this);
    if (hit) {
        if (!this._previousIn) {
            // Fix issue when hover node switched, previous hovered node won't get MOUSE_LEAVE notification
            if (_currentHovered && _currentHovered.eventProcessor.mouseListener) {
                event.type = NodeEventType.MOUSE_LEAVE;
                _currentHovered.dispatchEvent(event);
                if (_currentHovered.eventProcessor.mouseListener) {
                    _currentHovered.eventProcessor.mouseListener._previousIn = false;
                }
            }
            _currentHovered = node;
            event.type = NodeEventType.MOUSE_ENTER;
            node.dispatchEvent(event);
            this._previousIn = true;
        }
        event.type = NodeEventType.MOUSE_MOVE;
        event.bubbles = true;
        node.dispatchEvent(event);
    } else if (this._previousIn) {
        event.type = NodeEventType.MOUSE_LEAVE;
        node.dispatchEvent(event);
        this._previousIn = false;
        _currentHovered = null;
    } else {
        // continue dispatching
        return;
    }

    // Event processed, cleanup
    // event.propagationStopped = true;
    event.propagationStopped = true;
}

function _mouseUpHandler (this: EventListener, event: EventMouse) {
    const node = this.owner as Node;
    if (!node || !node._uiProps.uiTransformComp) {
        return;
    }

    pos = event.getUILocation();

    if (node._uiProps.uiTransformComp.isHit(pos, this)) {
        event.type = NodeEventType.MOUSE_UP;
        event.bubbles = true;
        node.dispatchEvent(event);
        // event.propagationStopped = true;
        event.propagationStopped = true;
    }
}

function _mouseWheelHandler (this: EventListener, event: EventMouse) {
    const node = this.owner as Node;
    if (!node || !node._uiProps.uiTransformComp) {
        return;
    }

    pos = event.getUILocation();

    if (node._uiProps.uiTransformComp.isHit(pos, this)) {
        event.type = NodeEventType.MOUSE_WHEEL;
        event.bubbles = true;
        node.dispatchEvent(event);
        // event.propagationStopped = true;
        event.propagationStopped = true;
    }
}

function _doDispatchEvent (owner: BaseNode, event: Event) {
    let target: BaseNode;
    let i = 0;
    event.target = owner;

    // Event.CAPTURING_PHASE
    _cachedArray.length = 0;
    owner.eventProcessor.getCapturingTargets(event.type, _cachedArray);
    // capturing
    event.eventPhase = 1;
    for (i = _cachedArray.length - 1; i >= 0; --i) {
        target = _cachedArray[i];
        if (target.eventProcessor.capturingTargets) {
            event.currentTarget = target;
            // fire event
            target.eventProcessor.capturingTargets.emit(event.type, event, _cachedArray);
            // check if propagation stopped
            if (event.propagationStopped) {
                _cachedArray.length = 0;
                return;
            }
        }
    }
    _cachedArray.length = 0;

    // Event.AT_TARGET
    // checks if destroyed in capturing callbacks
    event.eventPhase = 2;
    event.currentTarget = owner;
    if (owner.eventProcessor.capturingTargets) {
        owner.eventProcessor.capturingTargets.emit(event.type, event);
    }
    if (!event.propagationImmediateStopped && owner.eventProcessor.bubblingTargets) {
        owner.eventProcessor.bubblingTargets.emit(event.type, event);
    }

    if (!event.propagationStopped && event.bubbles) {
        // Event.BUBBLING_PHASE
        owner.eventProcessor.getBubblingTargets(event.type, _cachedArray);
        // propagate
        event.eventPhase = 3;
        for (i = 0; i < _cachedArray.length; ++i) {
            target = _cachedArray[i];
            if (target.eventProcessor.bubblingTargets) {
                event.currentTarget = target;
                // fire event
                target.eventProcessor.bubblingTargets.emit(event.type, event);
                // check if propagation stopped
                if (event.propagationStopped) {
                    _cachedArray.length = 0;
                    return;
                }
            }
        }
    }
    _cachedArray.length = 0;
}

function _searchComponentsInParent<T extends Component> (node: Node | null, ctor: Constructor<T> | null) {
    if (ctor) {
        let index = 0;
        let list: any[] = [];
        for (let curr = node; curr && Node.isNode(curr); curr = curr.parent, ++index) {
            const comp = curr.getComponent(ctor);
            if (comp) {
                const next = {
                    index,
                    comp,
                };

                if (list) {
                    list.push(next);
                } else {
                    list = [next];
                }
            }
        }

        return list.length > 0 ? list : null;
    }

    return null;
}

function _checkListeners (node: BaseNode, events: string[]) {
    if (!node._persistNode) {
        if (node.eventProcessor.bubblingTargets) {
            for (let i = 0; i < events.length; ++i) {
                if (node.eventProcessor.bubblingTargets.hasEventListener(events[i])) {
                    return true;
                }
            }
        }
        if (node.eventProcessor.capturingTargets) {
            for (let i = 0; i < events.length; ++i) {
                if (node.eventProcessor.capturingTargets.hasEventListener(events[i])) {
                    return true;
                }
            }
        }
        return false;
    }
    return true;
}

/**
 * @zh
 * 节点事件类。
 */
export class NodeEventProcessor {
    public static _comp: Constructor<Component> | null = null;

    public get node () {
        return this._node;
    }

    /**
     * @zh
     * 节点冒泡事件监听器
     */
    public bubblingTargets: CallbacksInvoker | null = null;

    /**
     * @zh
     * 节点捕获事件监听器
     */
    public capturingTargets: CallbacksInvoker | null = null;
    /**
     * @zh
     * 触摸监听器
     */
    public touchListener: EventListener | null = null;
    /**
     * @zh
     * 鼠标监听器
     */
    public mouseListener: EventListener | null = null;

    private _node: BaseNode;

    constructor (node: BaseNode) {
        this._node = node;
    }

    public reattach (): void {
        let currMask;
        this.node.walk((node) => {
            if (!currMask) {
                currMask = _searchComponentsInParent(node as Node, NodeEventProcessor._comp);
            }
            if (node.eventProcessor.touchListener) {
                node.eventProcessor.touchListener.mask = currMask;
            }
            if (node.eventProcessor.mouseListener) {
                node.eventProcessor.mouseListener.mask = currMask;
            }
        });
    }

    public destroy (): void {
        if (_currentHovered === this._node) {
            _currentHovered = null;
        }

        // Remove all event listeners if necessary
        if (this.touchListener || this.mouseListener) {
            eventManager.removeListeners(this._node);
            if (this.touchListener) {
                this.touchListener.owner = null;
                this.touchListener.mask = null;
                this.touchListener = null;
            }
            if (this.mouseListener) {
                this.mouseListener.owner = null;
                this.mouseListener.mask = null;
                this.mouseListener = null;
            }
        }

        if (this.capturingTargets) this.capturingTargets.clear();
        if (this.bubblingTargets) this.bubblingTargets.clear();
    }

    /**
     * @zh
     * 在节点上注册指定类型的回调函数，也可以设置 target 用于绑定响应函数的 this 对象。<br/>
     * 鼠标或触摸事件会被系统调用 dispatchEvent 方法触发，触发的过程包含三个阶段：<br/>
     * 1. 捕获阶段：派发事件给捕获目标（通过 `getCapturingTargets` 获取），比如，节点树中注册了捕获阶段的父节点，从根节点开始派发直到目标节点。<br/>
     * 2. 目标阶段：派发给目标节点的监听器。<br/>
     * 3. 冒泡阶段：派发事件给冒泡目标（通过 `getBubblingTargets` 获取），比如，节点树中注册了冒泡阶段的父节点，从目标节点开始派发直到根节点。<br/>
     * 同时您可以将事件派发到父节点或者通过调用 stopPropagation 拦截它。<br/>
     * 推荐使用这种方式来监听节点上的触摸或鼠标事件，请不要在节点上直接使用 `eventManager`。<br/>
     * 你也可以注册自定义事件到节点上，并通过 emit 方法触发此类事件，对于这类事件，不会发生捕获冒泡阶段，只会直接派发给注册在该节点上的监听器。<br/>
     * 你可以通过在 emit 方法调用时在 type 之后传递额外的参数作为事件回调的参数列表。<br/>
     *
     * @param type - 一个监听事件类型的字符串。参见：[[EventType]]
     * @param callback - 事件分派时将被调用的回调函数。如果该回调存在则不会重复添加。
     * @param callback.event - 事件派发的时候回调的第一个参数。
     * @param callback.arg2 - 第二个参数。
     * @param callback.arg3 - 第三个参数。
     * @param callback.arg4 - 第四个参数。
     * @param callback.arg5 - 第五个参数。
     * @param target - 调用回调的目标。可以为空。
     * @param useCapture - 当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     * @return - 返回监听回调函数自身。
     *
     * @example
     * ```ts
     * import { Node } from 'cc';
     * this.node.on(Node.EventType.TOUCH_START, this.memberFunction, this);  // if "this" is component and the "memberFunction" declared in CCClass.
     * this.node.on(Node.EventType.TOUCH_START, callback, this);
     * this.node.on(Node.EventType.ANCHOR_CHANGED, callback);
     * ```
     */
    public on (type: NodeEventType, callback: AnyFunction, target?: unknown, useCapture?: boolean) {
        const forDispatch = this._checknSetupSysEvent(type);
        if (forDispatch) {
            return this._onDispatch(type, callback, target, useCapture);
        } else {
            // switch (type) {
            //     case EventType.POSITION_CHANGED:
            //         this._eventMask |= POSITION_ON;
            //         break;
            //     case EventType.SCALE_CHANGED:
            //         this._eventMask |= SCALE_ON;
            //         break;
            //     case EventType.ROTATION_CHANGED:
            //         this._eventMask |= ROTATION_ON;
            //         break;
            //     case EventType.SIZE_CHANGED:
            //         this._eventMask |= SIZE_ON;
            //         break;
            //     case EventType.ANCHOR_CHANGED:
            //         this._eventMask |= ANCHOR_ON;
            //         break;
            // }
            if (!this.bubblingTargets) {
                this.bubblingTargets = new CallbacksInvoker();
            }
            return this.bubblingTargets.on(type, callback, target);
        }
    }

    /**
     * @zh
     * 注册节点的特定事件类型回调，回调会在第一时间被触发后删除自身。
     *
     * @param type - 一个监听事件类型的字符串。参见：[[EventType]]。
     * @param callback - 事件分派时将被调用的回调函数。如果该回调存在则不会重复添加。
     * @param callback.event - 事件派发的时候回调的第一个参数。
     * @param callback.arg2 - 第二个参数。
     * @param callback.arg3 - 第三个参数。
     * @param callback.arg4 - 第四个参数。
     * @param callback.arg5 - 第五个参数。
     * @param target - 调用回调的目标。可以为空。
     * @param useCapture - 当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     *
     * @example
     * ```ts
     * import { Node } from 'cc';
     * node.once(Node.EventType.ANCHOR_CHANGED, callback);
     * ```
     */
    public once (type: NodeEventType, callback: AnyFunction, target?: unknown, useCapture?: boolean) {
        const forDispatch = this._checknSetupSysEvent(type);

        let listeners: CallbacksInvoker;
        if (forDispatch && useCapture) {
            listeners = this.capturingTargets = this.capturingTargets || new CallbacksInvoker();
        } else {
            listeners = this.bubblingTargets = this.bubblingTargets || new CallbacksInvoker();
        }

        listeners.on(type, callback, target, true);
        listeners.on(type, () => {
            this.off(type, callback, target);
        }, undefined, true);
    }

    /**
     * @zh
     * 删除之前与同类型，回调，目标或 useCapture 注册的回调。
     *
     * @param type - 一个监听事件类型的字符串。参见：[[EventType]]。
     * @param callback - 移除指定注册回调。如果没有给，则删除全部同事件类型的监听。
     * @param target - 调用回调的目标。配合 callback 一起使用。
     * @param useCapture - 当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     *
     * @example
     * ```ts
     * import { Node } from 'cc';
     * this.node.off(Node.EventType.TOUCH_START, this.memberFunction, this);
     * node.off(Node.EventType.TOUCH_START, callback, this.node);
     * node.off(Node.EventType.ANCHOR_CHANGED, callback, this);
     * ```
     */
    public off (type: NodeEventType, callback?: AnyFunction, target?: unknown, useCapture?: boolean) {
        const touchEvent = _touchEvents.indexOf(type) !== -1;
        const mouseEvent = !touchEvent && _mouseEvents.indexOf(type) !== -1;
        if (touchEvent || mouseEvent) {
            this._offDispatch(type, callback, target, useCapture);

            if (touchEvent) {
                if (this.touchListener && !_checkListeners(this._node, _touchEvents)) {
                    eventManager.removeListener(this.touchListener);
                    this.touchListener = null;
                }
            } else if (mouseEvent) {
                if (this.mouseListener && !_checkListeners(this._node, _mouseEvents)) {
                    eventManager.removeListener(this.mouseListener);
                    this.mouseListener = null;
                }
            }
        } else if (this.bubblingTargets) {
            this.bubblingTargets.off(type, callback, target);

            // const hasListeners = this.bubblingTargets.hasEventListener(type);
            // All listener removed
            // if (!hasListeners) {
            //     switch (type) {
            //         case EventType.POSITION_CHANGED:
            //             this._eventMask &= ~POSITION_ON;
            //             break;
            //         case EventType.SCALE_CHANGED:
            //             this._eventMask &= ~SCALE_ON;
            //             break;
            //         case EventType.ROTATION_CHANGED:
            //             this._eventMask &= ~ROTATION_ON;
            //             break;
            //         case EventType.SIZE_CHANGED:
            //             this._eventMask &= ~SIZE_ON;
            //             break;
            //         case EventType.ANCHOR_CHANGED:
            //             this._eventMask &= ~ANCHOR_ON;
            //             break;
            //     }
            // }
        }
    }

    /**
     * @zh
     * 通过事件名发送自定义事件
     *
     * @param type - 一个监听事件类型的字符串。
     * @param arg0 - 回调第一个参数。
     * @param arg1 - 回调第二个参数。
     * @param arg2 - 回调第三个参数。
     * @param arg3 - 回调第四个参数。
     * @param arg4 - 回调第五个参数。
     * @example
     * ```ts
     * eventTarget.emit('fire', event);
     * eventTarget.emit('fire', message, emitter);
     * ```
     */
    public emit (type: string, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any) {
        if (this.bubblingTargets) {
            this.bubblingTargets.emit(type, arg0, arg1, arg2, arg3, arg4);
        }
    }

    /**
     * @zh
     * 分发事件到事件流中。
     *
     * @param event - 分派到事件流中的事件对象。
     */
    public dispatchEvent (event: Event) {
        _doDispatchEvent(this._node, event);
        _cachedArray.length = 0;
    }

    /**
     * @zh
     * 是否监听过某事件。
     *
     * @param type - 一个监听事件类型的字符串。
     * @param callback - The callback function of the event listener, if absent all event listeners for the given type will be removed
     * @param target - The callback callee of the event listener
     * @return - 返回是否当前节点已监听该事件类型。
     */
    public hasEventListener (type: string, callback?: AnyFunction, target?: unknown) {
        let has = false;
        if (this.bubblingTargets) {
            has = this.bubblingTargets.hasEventListener(type, callback, target);
        }
        if (!has && this.capturingTargets) {
            has = this.capturingTargets.hasEventListener(type, callback, target);
        }
        return has;
    }

    /**
     * @zh
     * 移除在特定事件类型中注册的所有回调或在某个目标中注册的所有回调。
     *
     * @param target - 要删除的事件键或要删除的目标。
     */
    public targetOff (target: string | unknown) {
        if (this.capturingTargets) {
            this.capturingTargets.removeAll(target);
        }
        if (this.bubblingTargets) {
            this.bubblingTargets.removeAll(target);
        }

        if (this.touchListener && !_checkListeners(this.node, _touchEvents)) {
            eventManager.removeListener(this.touchListener);
            this.touchListener = null;
        }
        if (this.mouseListener && !_checkListeners(this.node, _mouseEvents)) {
            eventManager.removeListener(this.mouseListener);
            this.mouseListener = null;
        }
    }

    /**
     * @zh
     * 获得所提供的事件类型在目标捕获阶段监听的所有目标。
     * 捕获阶段包括从根节点到目标节点的过程。
     * 结果保存在数组参数中，并且必须从子节点排序到父节点。
     *
     * @param type - 一个监听事件类型的字符串。
     * @param array - 接收目标的数组。
     */
    public getCapturingTargets (type: string, targets: BaseNode[]) {
        let parent = this._node.parent;
        while (parent) {
            if (parent.eventProcessor.capturingTargets && parent.eventProcessor.capturingTargets.hasEventListener(type)) {
                targets.push(parent);
            }
            parent = parent.parent;
        }
    }

    /**
     * @zh
     * 获得所提供的事件类型在目标冒泡阶段监听的所有目标。
     * 冒泡阶段目标节点到根节点的过程。
     * 结果保存在数组参数中，并且必须从子节点排序到父节点。
     *
     * @param type - 一个监听事件类型的字符串。
     * @param array - 接收目标的数组。
     */
    public getBubblingTargets (type: string, targets: BaseNode[]) {
        let parent = this._node.parent;
        while (parent) {
            if (parent.eventProcessor.bubblingTargets && parent.eventProcessor.bubblingTargets.hasEventListener(type)) {
                targets.push(parent);
            }
            parent = parent.parent;
        }
    }

    // EVENT TARGET

    private _checknSetupSysEvent (type: NodeEventType) {
        let newAdded = false;
        let forDispatch = false;
        // just for ui
        if (_touchEvents.indexOf(type) !== -1) {
            if (!this.touchListener) {
                this.touchListener = legacyCC.EventListener.create({
                    event: legacyCC.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    owner: this._node,
                    mask: _searchComponentsInParent(this._node as Node, NodeEventProcessor._comp),
                    onTouchBegan: _touchStartHandler,
                    onTouchMoved: _touchMoveHandler,
                    onTouchEnded: _touchEndHandler,
                    onTouchCancelled: _touchCancelHandler,
                });
                eventManager.addListener(this.touchListener as EventListener, this._node);
                newAdded = true;
            }
            forDispatch = true;
        } else if (_mouseEvents.indexOf(type) !== -1) {
            if (!this.mouseListener) {
                this.mouseListener = legacyCC.EventListener.create({
                    event: legacyCC.EventListener.MOUSE,
                    _previousIn: false,
                    owner: this._node,
                    mask: _searchComponentsInParent(this._node as Node, NodeEventProcessor._comp),
                    onMouseDown: _mouseDownHandler,
                    onMouseMove: _mouseMoveHandler,
                    onMouseUp: _mouseUpHandler,
                    onMouseScroll: _mouseWheelHandler,
                });
                eventManager.addListener(this.mouseListener as EventListener, this._node);
                newAdded = true;
            }
            forDispatch = true;
        }
        if (newAdded && !this._node.activeInHierarchy) {
            legacyCC.director.getScheduler().schedule(() => {
                if (!this._node.activeInHierarchy) {
                    eventManager.pauseTarget(this._node as Node);
                }
            }, this._node, 0, 0, 0, false);
        }
        return forDispatch;
    }

    private _onDispatch (type: string, callback: AnyFunction, target?: unknown, useCapture?: boolean) {
        // Accept also patameters like: (type, callback, useCapture)
        if (typeof target === 'boolean') {
            useCapture = target;
            target = undefined;
        } else { useCapture = !!useCapture; }
        if (!callback) {
            errorID(6800);
            return undefined;
        }

        let listeners: CallbacksInvoker | null = null;
        if (useCapture) {
            listeners = this.capturingTargets = this.capturingTargets || new CallbacksInvoker();
        } else {
            listeners = this.bubblingTargets = this.bubblingTargets || new CallbacksInvoker();
        }

        if (!listeners.hasEventListener(type, callback, target)) {
            listeners.on(type, callback, target);
        }

        return callback;
    }

    private _offDispatch (type: string, callback?: AnyFunction, target?: unknown, useCapture?: boolean) {
        // Accept also patameters like: (type, callback, useCapture)
        if (typeof target === 'boolean') {
            useCapture = target;
            target = undefined;
        } else { useCapture = !!useCapture; }
        if (!callback) {
            if (this.capturingTargets) {
                this.capturingTargets.removeAll(type);
            }

            if (this.bubblingTargets) {
                this.bubblingTargets.removeAll(type);
            }
        } else {
            const listeners = useCapture ? this.capturingTargets : this.bubblingTargets;
            if (listeners) {
                listeners.off(type, callback, target);
            }
        }
    }
}

legacyCC.NodeEventProcessor = NodeEventProcessor;
