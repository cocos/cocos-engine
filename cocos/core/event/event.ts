/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
 ****************************************************************************/

/**
 * !#en Base class of all kinds of events.
 * !#zh 包含事件相关信息的对象。
 * @class Event
 */
export default class Event {
    // Event types

    /**
     * !#en Code for event without type.
     * !#zh 没有类型的事件
     */
    public static NO_TYPE = 'no_type';

    /**
     * !#en The type code of Touch event.
     * !#zh 触摸事件类型
     */
    public static TOUCH = 'touch';
    /**
     * !#en The type code of Mouse event.
     * !#zh 鼠标事件类型
     */
    public static MOUSE = 'mouse';
    /**
     * !#en The type code of Keyboard event.
     * !#zh 键盘事件类型
     */
    public static KEYBOARD = 'keyboard';
    /**
     * !#en The type code of Acceleration event.
     * !#zh 加速器事件类型
     */
    public static ACCELERATION = 'acceleration';

    // Event phases

    /**
     * !#en Events not currently dispatched are in this phase
     * !#zh 尚未派发事件阶段
     */
    public static NONE = 0;

    /**
     * !#en
     * The capturing phase comprises the journey from the root to the last node before the event target's node
     * see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
     * !#zh 捕获阶段，包括事件目标节点之前从根节点到最后一个节点的过程。
     */
    public static CAPTURING_PHASE = 1;

    /**
     * !#en
     * The target phase comprises only the event target node
     * see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
     * !#zh 目标阶段仅包括事件目标节点。
     */
    public static AT_TARGET = 2;

    /**
     * !#en
     * The bubbling phase comprises any subsequent nodes encountered on the return trip to the root of the hierarchy
     * see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
     * !#zh 冒泡阶段， 包括回程遇到到层次根节点的任何后续节点。
     */
    public static BUBBLING_PHASE = 3;

    /**
     * !#en The name of the event (case-sensitive), e.g. "click", "fire", or "submit".
     * !#zh 事件类型。
     */
    public type: string;

    /**
     * !#en Indicate whether the event bubbles up through the tree or not.
     * !#zh 表示该事件是否进行冒泡。
     */
    public bubbles: boolean;

    /**
     * !#en A reference to the target to which the event was originally dispatched.
     * !#zh 最初事件触发的目标
     */
    public target: Object | null = null;

    /**
     * !#en A reference to the currently registered target for the event.
     * !#zh 当前目标
     */
    public currentTarget: Object | null = null;

    /**
     * !#en
     * Indicates which phase of the event flow is currently being evaluated.
     * Returns an integer value represented by 4 constants:
     *  - Event.NONE = 0
     *  - Event.CAPTURING_PHASE = 1
     *  - Event.AT_TARGET = 2
     *  - Event.BUBBLING_PHASE = 3
     * The phases are explained in the [section 3.1, Event dispatch and DOM event flow]
     * (http://www.w3.org/TR/DOM-Level-3-Events/#event-flow), of the DOM Level 3 Events specification.
     * !#zh 事件阶段
     */
    public eventPhase = 0;

    /*
    * Indicates whether or not event.stopPropagation() has been called on the event.
    */
    private _propagationStopped = false;

    /*
    * Indicates whether or not event.stopPropagationImmediate() has been called on the event.
    */
    private _propagationImmediateStopped = false;

    /**
     * @param type - The name of the event (case-sensitive), e.g. "click", "fire", or "submit"
     * @param bubbles - A boolean indicating whether the event bubbles up through the tree or not
     */
    constructor (type: string, bubbles?: boolean) {
        this.type = type;
        this.bubbles = !!bubbles;
    }

    /**
     * !#en Reset the event for being stored in the object pool.
     * !#zh 重置对象池中存储的事件。
     */
    public unuse () {
        this.type = Event.NO_TYPE;
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = Event.NONE;
        this._propagationStopped = false;
        this._propagationImmediateStopped = false;
    }

    /**
     * !#en Reuse the event for being used again by the object pool.
     * !#zh 用于对象池再次使用的事件。
     */
    public reuse (type: string, bubbles?: boolean) {
        this.type = type;
        this.bubbles = bubbles || false;
    }

    /**
     * !#en Stops propagation for current event.
     * !#zh 停止传递当前事件。
     */
    public stopPropagation () {
        this._propagationStopped = true;
    }

    /**
     * !#en Stops propagation for current event immediately,
     * the event won't even be dispatched to the listeners attached in the current target.
     * !#zh 立即停止当前事件的传递，事件甚至不会被分派到所连接的当前目标。
     */
    public stopPropagationImmediate () {
        this._propagationImmediateStopped = true;
    }

    /**
     * !#en Checks whether the event has been stopped.
     * !#zh 检查该事件是否已经停止传递.
     */
    public isStopped () {
        return this._propagationStopped || this._propagationImmediateStopped;
    }

    /**
     * !#en
     * <p>
     *     Gets current target of the event                                                            <br/>
     *     note: It only be available when the event listener is associated with node.                <br/>
     *          It returns 0 when the listener is associated with fixed priority.
     * </p>
     * !#zh 获取当前目标节点
     * @returns The target with which the event associates.
     */
    public getCurrentTarget () {
        return this.currentTarget;
    }

    /**
     * !#en Gets the event type.
     * !#zh 获取事件类型
     */
    public getType () {
        return this.type;
    }
}

/* tslint:disable:no-string-literal */
cc['Event'] = Event;
