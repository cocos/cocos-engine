import { EventTarget } from '../core/event/event-target';
import { ITargetImpl } from '../core/event/event-target-factory';
import { eventManager } from '../core/platform/event-manager';
import Touch from '../core/platform/event-manager/CCTouch';
import { EventType } from '../core/platform/event-manager/event-enum';
import { EventListener } from '../core/platform/event-manager/event-listener';
import { EventMouse, EventTouch} from '../core/platform/event-manager/index';
import * as js from '../core/utils/js';
import { Vec2 } from '../core/value-types';
import { Node } from './node';

const fastRemove = js.array.fastRemove;

const _cachedArray = new Array<Node>(16);
let _currentHovered: Node | null = null;
let pos = new Vec2();

const _touchEvents = [
    EventType.TOUCH_START.toString(),
    EventType.TOUCH_MOVE.toString(),
    EventType.TOUCH_END.toString(),
    EventType.TOUCH_CANCEL.toString(),
];

const _mouseEvents = [
    EventType.MOUSE_DOWN.toString(),
    EventType.MOUSE_ENTER.toString(),
    EventType.MOUSE_MOVE.toString(),
    EventType.MOUSE_LEAVE.toString(),
    EventType.MOUSE_UP.toString(),
    EventType.MOUSE_WHEEL.toString(),
];

// TODO: rearrange event
function _touchStartHandler (this: EventListener, touch: Touch, event: EventTouch) {
    const node = this.owner as Node;
    if (!node || !node.uiTransfromComp) {
        return false;
    }

    pos = touch.getUILocation();

    if (node.uiTransfromComp.isHit(pos, this)) {
        event.type = EventType.TOUCH_START.toString();
        event.touch = touch;
        event.bubbles = true;
        node.dispatchEvent(event);
        return true;
    }

    return false;
}

function _touchMoveHandler (this: EventListener, touch: Touch, event: EventTouch) {
    const node = this.owner as Node;
    if (!node || !node.uiTransfromComp) {
        return false;
    }

    event.type = EventType.TOUCH_MOVE.toString();
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
}

function _touchEndHandler (this: EventListener, touch: Touch, event: EventTouch) {
    const node = this.owner as Node;
    if (!node || !node.uiTransfromComp) {
        return;
    }

    pos = touch.getUILocation();

    if (node.uiTransfromComp.isHit(pos, this)) {
        event.type = EventType.TOUCH_END.toString();
    } else {
        event.type = EventType.TOUCH_CANCEL.toString();
    }
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
}

function _touchCancelHandler (this: EventListener, touch: Touch, event: EventTouch) {
    const node = this.owner as Node;
    if (!node || !node.uiTransfromComp) {
        return;
    }

    event.type = EventType.TOUCH_CANCEL.toString();
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
}

function _mouseDownHandler (this: EventListener, event: EventMouse) {
    const node = this.owner as Node;
    if (!node || !node.uiTransfromComp) {
        return;
    }

    pos = event.getUILocation();

    if (node.uiTransfromComp.isHit(pos, this)) {
        event.type = EventType.MOUSE_DOWN.toString();
        event.bubbles = true;
        node.dispatchEvent(event);
    }
}

function _mouseMoveHandler (this: EventListener, event: EventMouse) {
    const node = this.owner as Node;
    if (!node || !node.uiTransfromComp) {
        return;
    }

    pos = event.getUILocation();

    const hit = node.uiTransfromComp.isHit(pos, this);
    if (hit) {
        if (!this._previousIn) {
            // Fix issue when hover node switched, previous hovered node won't get MOUSE_LEAVE notification
            if (_currentHovered && _currentHovered!.eventProcessor.mouseListener) {
                event.type = EventType.MOUSE_LEAVE;
                _currentHovered!.dispatchEvent(event);
                if (_currentHovered!.eventProcessor.mouseListener) {
                    _currentHovered!.eventProcessor.mouseListener!._previousIn = false;
                }
            }
            _currentHovered = node;
            event.type = EventType.MOUSE_ENTER.toString();
            node.dispatchEvent(event);
            this._previousIn = true;
        }
        event.type = EventType.MOUSE_MOVE.toString();
        event.bubbles = true;
        node.dispatchEvent(event);
    } else if (this._previousIn) {
        event.type = EventType.MOUSE_LEAVE.toString();
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
    if (!node || !node.uiTransfromComp) {
        return;
    }

    pos = event.getUILocation();

    if (node.uiTransfromComp.isHit(pos, this)) {
        event.type = EventType.MOUSE_UP.toString();
        event.bubbles = true;
        node.dispatchEvent(event);
        // event.propagationStopped = true;
        event.propagationStopped = true;
    }
}

function _mouseWheelHandler (this: EventListener, event: EventMouse) {
    const node = this.owner as Node;
    if (!node || !node.uiTransfromComp) {
        return;
    }

    pos = event.getUILocation();

    if (node.uiTransfromComp!.isHit(pos, this)) {
        event.type = EventType.MOUSE_WHEEL.toString();
        event.bubbles = true;
        node.dispatchEvent(event);
        // event.propagationStopped = true;
        event.propagationStopped = true;
    }
}

function _doDispatchEvent (owner: Node, event: EventTouch) {
    let target: Node;
    let i = 0;
    event.target = owner;

    // Event.CAPTURING_PHASE
    _cachedArray.length = 0;
    owner.eventProcessor._getCapturingTargets(event.type, _cachedArray);
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
        owner.eventProcessor._getBubblingTargets(event.type, _cachedArray);
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

function _searchMaskInParent (node: Node | null) {
    const Mask = cc.MaskComponent;
    if (Mask) {
        let index = 0;
        for (let curr = node; curr && Node.isNode(curr); curr = curr.parent, ++index) {
            if (curr.getComponent(Mask)) {
                return {
                    index,
                    node: curr,
                };
            }
        }
    }
    return null;
}

function _checkListeners (node: Node, events: string[]) {
    if (!node._persistNode) {
        let i = 0;
        if (node.eventProcessor.bubblingTargets) {
            for (; i < events.length; ++i) {
                if (node.eventProcessor.bubblingTargets.hasEventListener(events[i])) {
                    return true;
                }
            }
        }
        if (node.eventProcessor.capturingTargets) {
            for (; i < events.length; ++i) {
                if (node.eventProcessor.capturingTargets.hasEventListener(events[i])) {
                    return true;
                }
            }
        }
        return false;
    }
    return true;
}

export class NodeEventProcessor {
    public get node (): Node {
        return this._node;
    }
    // Event listeners
    public bubblingTargets: EventTarget | null = null;
    public capturingTargets: EventTarget | null = null;
    // Touch event listener
    public touchListener: EventListener | null = null;
    // Mouse event listener
    public mouseListener: EventListener | null = null;

    private _node: Node;

    constructor (node: Node) {
        this._node = node;
    }

    /**
     * !#en
     * Register a callback of a specific event type on Node.<br/>
     * Use this method to register touch or mouse event permit propagation based on scene graph,<br/>
     * These kinds of event are triggered with dispatchEvent, the dispatch process has three steps:<br/>
     * 1. Capturing phase: dispatch in capture targets (`_getCapturingTargets`), e.g. parents in node tree, from root to the real target<br/>
     * 2. At target phase: dispatch to the listeners of the real target<br/>
     * 3. Bubbling phase: dispatch in bubble targets (`_getBubblingTargets`), e.g. parents in node tree, from the real target to root<br/>
     * In any moment of the dispatching process, it can be stopped via `event.propagationStopped = true` or `event.stopPropagationImmidiate()`.<br/>
     * It's the recommended way to register touch/mouse event for Node,<br/>
     * please do not use cc.eventManager directly for Node.<br/>
     * You can also register custom event and use `emit` to trigger custom event on Node.<br/>
     * For such events, there won't be capturing and bubbling phase, your event will be dispatched directly to its listeners registered on the same node.<br/>
     * You can also pass event callback parameters with `emit` by passing parameters after `type`.
     * !#zh
     * 在节点上注册指定类型的回调函数，也可以设置 target 用于绑定响应函数的 this 对象。<br/>
     * 鼠标或触摸事件会被系统调用 dispatchEvent 方法触发，触发的过程包含三个阶段：<br/>
     * 1. 捕获阶段：派发事件给捕获目标（通过 `_getCapturingTargets` 获取），比如，节点树中注册了捕获阶段的父节点，从根节点开始派发直到目标节点。<br/>
     * 2. 目标阶段：派发给目标节点的监听器。<br/>
     * 3. 冒泡阶段：派发事件给冒泡目标（通过 `_getBubblingTargets` 获取），比如，节点树中注册了冒泡阶段的父节点，从目标节点开始派发知道根节点。<br/>
     * 同时您可以将事件派发到父节点或者通过调用 stopPropagation 拦截它。<br/>
     * 推荐使用这种方式来监听节点上的触摸或鼠标事件，请不要在节点上直接使用 cc.eventManager。<br/>
     * 你也可以注册自定义事件到节点上，并通过 emit 方法触发此类事件，对于这类事件，不会发生捕获冒泡阶段，只会直接派发给注册在该节点上的监听器<br/>
     * 你可以通过在 emit 方法调用时在 type 之后传递额外的参数作为事件回调的参数列表
     * @method on
     * @param {String|Node.EventType} type - A string representing the event type to listen for.
     * <br>See {{#crossLink "Node/EventTyupe/POSITION_CHANGED"}}Node Events{{/crossLink}} for all builtin events.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     * The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {Event|any} [callback.event] event or first argument when emit
     * @param {any} [callback.arg2] arg2
     * @param {any} [callback.arg3] arg3
     * @param {any} [callback.arg4] arg4
     * @param {any} [callback.arg5] arg5
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     * @param {Boolean} [useCapture=false] - When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit,
     * otherwise it will be triggered during bubbling phase.
     * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
     * @typescript
     * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
     * @example
     * this.node.on(cc.Node.EventType.TOUCH_START, this.memberFunction, this);  // if "this" is component and the "memberFunction" declared in CCClass.
     * this.node.on(cc.Node.EventType.TOUCH_START, callback, this);
     * this.node.on(cc.Node.EventType.ANCHOR_CHANGED, callback);
     */
    public on (type: string, callback: Function, target?: Object, useCapture?: Object) {
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
                this.bubblingTargets = new EventTarget();
            }
            return this.bubblingTargets.on(type, callback, target);
        }
    }

    /**
     * !#en
     * Register an callback of a specific event type on the Node,
     * the callback will remove itself after the first time it is triggered.
     * !#zh
     * 注册节点的特定事件类型回调，回调会在第一时间被触发后删除自身。
     *
     * @method once
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {Event|any} [callback.event] event or first argument when emit
     * @param {any} [callback.arg2] arg2
     * @param {any} [callback.arg3] arg3
     * @param {any} [callback.arg4] arg4
     * @param {any} [callback.arg5] arg5
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     * @typescript
     * once<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
     * @example
     * node.once(cc.Node.EventType.ANCHOR_CHANGED, callback);
     */
    public once (type: string, callback: Function, target?: Object, useCapture?: Object) {
        const forDispatch = this._checknSetupSysEvent(type);
        const eventType_hasOnceListener = '__ONCE_FLAG:' + type;

        let listeners: EventTarget;
        if (forDispatch && useCapture) {
            listeners = this.capturingTargets = this.capturingTargets || new EventTarget();
        }
        else {
            listeners = this.bubblingTargets = this.bubblingTargets || new EventTarget();
        }

        const hasOnceListener = listeners!.hasEventListener(eventType_hasOnceListener, callback, target);
        if (!hasOnceListener) {
            const self = this;
            const onceWrapper = function (this: Object, ...args: any[]) {
                self.off(type, onceWrapper, target);
                listeners.remove(eventType_hasOnceListener, callback, target);
                callback.call(this, ...args);
            };
            this.on(type, onceWrapper, target);
            listeners.add(eventType_hasOnceListener, callback, target);
        }
    }

    /**
     * !#en
     * Removes the callback previously registered with the same type, callback, target and or useCapture.
     * This method is merely an alias to removeEventListener.
     * !#zh 删除之前与同类型，回调，目标或 useCapture 注册的回调。
     * @method off
     * @param {String} type - A string representing the event type being removed.
     * @param {Function} [callback] - The callback to remove.
     * @param {Object} [target] - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
     * @param {Boolean} [useCapture=false] - When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit,
     *  otherwise it will be triggered during bubbling phase.
     * @example
     * this.node.off(cc.Node.EventType.TOUCH_START, this.memberFunction, this);
     * node.off(cc.Node.EventType.TOUCH_START, callback, this.node);
     * node.off(cc.Node.EventType.ANCHOR_CHANGED, callback, this);
     */
    public off (type: string, callback?: Function, target?: Object, useCapture?: Object) {
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
     * !#en
     * Trigger an event directly with the event name and necessary arguments.
     * !#zh
     * 通过事件名发送自定义事件
     *
     * @method emit
     * @param {String} type - event type
     * @param {*} [arg1] - First argument in callback
     * @param {*} [arg2] - Second argument in callback
     * @param {*} [arg3] - Third argument in callback
     * @param {*} [arg4] - Fourth argument in callback
     * @param {*} [arg5] - Fifth argument in callback
     * @example
     *
     * eventTarget.emit('fire', event);
     * eventTarget.emit('fire', message, emitter);
     */
    public emit (type: string, ...args: any[]) {
        if (this.bubblingTargets) {
            this.bubblingTargets.emit(type, ...args);
        }
    }

    /**
     * !#en
     * Dispatches an event into the event flow.
     * The event target is the EventTarget object upon which the dispatchEvent() method is called.
     * !#zh 分发事件到事件流中。
     *
     * @method dispatchEvent
     * @param {Event} event - The Event object that is dispatched into the event flow
     */
    public dispatchEvent (event: EventTouch) {
        _doDispatchEvent(this._node, event);
        _cachedArray.length = 0;
    }

    public hasEventListener (type: string) {
        let has = false;
        if (this.bubblingTargets) {
            has = this.bubblingTargets.hasEventListener(type);
        }
        if (!has && this.capturingTargets) {
            has = this.capturingTargets.hasEventListener(type);
        }
        return has;
    }

    public targetOff (target: string | Object) {
        if (this.capturingTargets) {
            this.capturingTargets.targetOff(target);
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

    // EVENT TARGET

    private _checknSetupSysEvent (type: string) {
        let newAdded = false;
        let forDispatch = false;
        // just for ui
        if (_touchEvents.indexOf(type) !== -1) {
            if (!this.touchListener) {
                this.touchListener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    owner: this._node,
                    mask: _searchMaskInParent(this._node),
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
                this.mouseListener = cc.EventListener.create({
                    event: cc.EventListener.MOUSE,
                    _previousIn: false,
                    owner: this._node,
                    mask: _searchMaskInParent(this._node),
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
            cc.director.getScheduler().schedule(() => {
                if (!this._node.activeInHierarchy) {
                    eventManager.pauseTarget(this);
                }
            }, this, 0, 0, 0, false);
        }
        return forDispatch;
    }

    private _onDispatch (type: string, callback: Function, target?: Object, useCapture?: Object) {
        // Accept also patameters like: (type, callback, useCapture)
        if (typeof target === 'boolean') {
            useCapture = target;
            target = undefined;
        } else { useCapture = !!useCapture; }
        if (!callback) {
            cc.errorID(6800);
            return;
        }

        let listeners: EventTarget | null = null;
        if (useCapture) {
            listeners = this.capturingTargets = this.capturingTargets || new EventTarget();
        } else {
            listeners = this.bubblingTargets = this.bubblingTargets || new EventTarget();
        }

        if (!listeners.hasEventListener(type, callback, target)) {
            listeners.add(type, callback, target);

            const targetImpl = target as ITargetImpl;
            if (target) {
                if (targetImpl.__eventTargets) {
                    targetImpl.__eventTargets.push(this);
                } else if (targetImpl.node && targetImpl.node.__eventTargets) {
                    targetImpl.node.__eventTargets.push(this);
                }
            }
        }

        return callback;
    }

    private _offDispatch (type: string, callback?: Function, target?: Object, useCapture?: Object) {
        // Accept also patameters like: (type, callback, useCapture)
        if (typeof target === 'boolean') {
            useCapture = target;
            target = undefined;
        } else { useCapture = !!useCapture; }
        if (!callback) {
            if (this.capturingTargets){
                this.capturingTargets.removeAll(type);
            }

            if (this.bubblingTargets){
                this.bubblingTargets.removeAll(type);
            }
        } else {
            const listeners = useCapture ? this.capturingTargets : this.bubblingTargets;
            if (listeners) {
                listeners.remove(type, callback, target);

                const targetImpl = target as ITargetImpl;
                if (target) {
                    if (targetImpl.__eventTargets) {
                        fastRemove(targetImpl.__eventTargets, this);
                    } else if (targetImpl.node && targetImpl.node.__eventTargets) {
                        fastRemove(targetImpl.node.__eventTargets, this);
                    }
                }
            }

        }
    }

    /**
     * Get all the targets listening to the supplied type of event in the target's capturing phase.
     * The capturing phase comprises the journey from the root to the last node BEFORE the event target's node.
     * The result should save in the array parameter, and MUST SORT from child nodes to parent nodes.
     *
     * Subclasses can override this method to make event propagable.
     * @method _getCapturingTargets
     * @private
     * @param {String} type - the event type
     * @param {Array} array - the array to receive targets
     * @example {@link cocos2d/core/event/_getCapturingTargets.js}
     */
    private _getCapturingTargets (type: string, targets: Node[]) {
        let parent = this._node.parent;
        while (parent) {
            if (parent.eventProcessor.capturingTargets && parent.eventProcessor.capturingTargets.hasEventListener(type)) {
                targets.push(parent);
            }
            parent = parent.parent;
        }
    }

    /**
     * Get all the targets listening to the supplied type of event in the target's bubbling phase.
     * The bubbling phase comprises any SUBSEQUENT nodes encountered on the return trip to the root of the tree.
     * The result should save in the array parameter, and MUST SORT from child nodes to parent nodes.
     *
     * Subclasses can override this method to make event propagable.
     * @method _getBubblingTargets
     * @private
     * @param {String} type - the event type
     * @param {Array} array - the array to receive targets
     */
    private _getBubblingTargets (type: string, targets: Node[]) {
        let parent = this._node.parent;
        while (parent) {
            if (parent.eventProcessor.bubblingTargets && parent.eventProcessor.bubblingTargets.hasEventListener(type)) {
                targets.push(parent);
            }
            parent = parent.parent;
        }
    }
}

cc.NodeEventProcessor = NodeEventProcessor;
