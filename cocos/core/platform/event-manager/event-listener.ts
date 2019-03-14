import { MaskComponent } from "../../../3d/ui/components/mask-component";

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

export interface IEventListenerCreateInfo {
    event?: number;

    [x: string]: any;
}

/**
 * !#en
 * <p>
 *     The base class of event listener.                                                                        <br/>
 *     If you need custom listener which with different callback, you need to inherit this class.               <br/>
 *     For instance, you could refer to EventListenerAcceleration, EventListenerKeyboard,                       <br/>
 *      EventListenerTouchOneByOne, EventListenerCustom.
 * </p>
 *
 * !#zh
 * 封装用户的事件处理逻辑。
 * 注意：这是一个抽象类，开发者不应该直接实例化这个类，请参考 {{#crossLink "EventListener/create:method"}}cc.EventListener.create{{/crossLink}}。
 */
export class EventListener {

    public get onEvent () {
        return this._onEvent;
    }
    /**
     * !#en The type code of unknown event listener.
     * !#zh 未知的事件监听器类型
     */
    public static UNKNOWN = 0;

    /*
    * !#en The type code of one by one touch event listener.
    * !#zh 触摸事件监听器类型，触点会一个一个得分开被派发
    */
    public static TOUCH_ONE_BY_ONE = 1;

    /*
    * !#en The type code of all at once touch event listener.
    * !#zh 触摸事件监听器类型，触点会被一次性全部派发
    */
    public static TOUCH_ALL_AT_ONCE = 2;

    /**
     * !#en The type code of keyboard event listener.
     * !#zh 键盘事件监听器类型
     */
    public static KEYBOARD = 3;

    /*
    * !#en The type code of mouse event listener.
    * !#zh 鼠标事件监听器类型
    */
    public static MOUSE = 4;

    /**
     * !#en The type code of acceleration event listener.
     * !#zh 加速器事件监听器类型
     */
    public static ACCELERATION = 6;

    /*
    * !#en The type code of custom event listener.
    * !#zh 自定义事件监听器类型
    */
    public static CUSTOM = 8;

    public static ListenerID = {
        MOUSE: '__cc_mouse',
        TOUCH_ONE_BY_ONE: '__cc_touch_one_by_one',
        TOUCH_ALL_AT_ONCE: '__cc_touch_all_at_once',
        KEYBOARD: '__cc_keyboard',
        ACCELERATION: '__cc_acceleration',
    };

    /**
     * !#en
     * Create a EventListener object with configuration including the event type, handlers and other parameters.
     * In handlers, this refer to the event listener object itself.
     * You can also pass custom parameters in the configuration object,
     * all custom parameters will be polyfilled into the event listener object and can be accessed in handlers.
     * !#zh 通过指定不同的 Event 对象来设置想要创建的事件监听器。
     * @param {Object} argObj a json object
     * @example {@link cocos2d/core/event-manager/CCEventListener/create.js}
     */
    public static create (argObj: IEventListenerCreateInfo): EventListener {
        cc.assertID(argObj && argObj.event, 1900);

        const listenerType = argObj.event;
        delete argObj.event;

        let listener: EventListener | null = null;
        if (listenerType === cc.EventListener.TOUCH_ONE_BY_ONE) {
            listener = new TouchOneByOne();
        } else if (listenerType === cc.EventListener.TOUCH_ALL_AT_ONCE) {
            listener = new TouchAllAtOnce();
        } else if (listenerType === cc.EventListener.MOUSE) {
            listener = new Mouse();
        } else if (listenerType === cc.EventListener.KEYBOARD) {
            listener = new Keyboard();
        } else if (listenerType === cc.EventListener.ACCELERATION) {
            listener = new Acceleration(argObj.callback);
            delete argObj.callback;
        }

        if (listener) {
            for (const key of Object.keys(argObj)) {
                listener[key] = argObj[key];
            }
        }

        return listener!;
    }

    // hack: How to solve the problem of uncertain attribute
    // callback's this object
    public owner: Object | null = null;
    public mask: MaskComponent | null = null;
    public _previousIn?: boolean = false;

    public _target: any = null;

    // Event callback function
    protected _onEvent: ((...args: any[]) => any) | null;

    // Event listener type
    private _type: number;

    // Event listener ID
    private _listenerID: string;

    // Whether the listener has been added to dispatcher.
    private _registered = false;

    // The higher the number, the higher the priority, 0 is for scene graph base priority.
    private _fixedPriority = 0;

    // scene graph based priority
    // @type {Node}
    private _node: any = null;          // scene graph based priority

    // Whether the listener is paused
    private _paused = true;        // Whether the listener is paused

    // Whether the listener is enabled
    private _isEnabled = true;     // Whether the listener is enabled

    constructor (type: number, listenerID: string, callback: ((...args: any[]) => any) | null) {
        this._onEvent = callback;
        this._type = type || 0;
        this._listenerID = listenerID || '';
    }

    /**
     * <p>
     *     Sets paused state for the listener
     *     The paused state is only used for scene graph priority listeners.
     *     `EventDispatcher::resumeAllEventListenersForTarget(node)` will set the paused state to `true`,
     *     while `EventDispatcher::pauseAllEventListenersForTarget(node)` will set it to `false`.
     *     @note 1) Fixed priority listeners will never get paused. If a fixed priority doesn't want to receive events,
     *              call `setEnabled(false)` instead.
     *            2) In `Node`'s onEnter and onExit, the `paused state` of the listeners
     *              which associated with that node will be automatically updated.
     * </p>
     * @private
     */
    public _setPaused (paused: boolean) {
        this._paused = paused;
    }

    /**
     * Checks whether the listener is paused.
     * @private
     */
    public _isPaused () {
        return this._paused;
    }

    /**
     * Marks the listener was registered by EventDispatcher.
     * @private
     */
    public _setRegistered (registered: boolean) {
        this._registered = registered;
    }

    /**
     * Checks whether the listener was registered by EventDispatcher
     * @private
     */
    public _isRegistered () {
        return this._registered;
    }

    /**
     * Gets the type of this listener
     * @note It's different from `EventType`, e.g.
     * TouchEvent has two kinds of event listeners - EventListenerOneByOne, EventListenerAllAtOnce
     * @private
     */
    public _getType () {
        return this._type;
    }

    /**
     * Gets the listener ID of this listener
     * When event is being dispatched, listener ID is used as key for searching listeners according to event type.
     * @private
     */
    public _getListenerID () {
        return this._listenerID;
    }

    /**
     * Sets the fixed priority for this listener
     * @note This method is only used for `fixed priority listeners`,
     *   it needs to access a non-zero value. 0 is reserved for scene graph priority listeners
     * @private
     */
    public _setFixedPriority (fixedPriority: number) {
        this._fixedPriority = fixedPriority;
    }

    /**
     * Gets the fixed priority of this listener
     * @return 0 if it's a scene graph priority listener, non-zero for fixed priority listener
     * @private
     */
    public _getFixedPriority () {
        return this._fixedPriority;
    }

    /**
     * Sets scene graph priority for this listener
     * @private
     * @param {Node} node
     */
    public _setSceneGraphPriority (node: any) {
        this._target = node;
        this._node = node;
    }

    /**
     * Gets scene graph priority of this listener
     * @return if it's a fixed priority listener, non-null for scene graph priority listener
     * @private
     */
    public _getSceneGraphPriority () {
        return this._node;
    }

    /**
     * !#en Checks whether the listener is available.
     * !#zh 检测监听器是否有效
     */
    public checkAvailable () {
        return this._onEvent !== null;
    }

    /**
     * !#en Clones the listener, its subclasses have to override this method.
     * !#zh 克隆监听器,它的子类必须重写此方法。
     */
    public clone (): EventListener | null {
        return null;
    }

    /**
     *  !#en Enables or disables the listener
     *  !#zh 启用或禁用监听器。
     *  @note Only listeners with `enabled` state will be able to receive events.
     *          When an listener was initialized, it's enabled by default.
     *          An event listener can receive events when it is enabled and is not paused.
     *          paused state is always false when it is a fixed priority listener.
     */
    public setEnabled (enabled: boolean) {
        this._isEnabled = enabled;
    }

    /**
     * !#en Checks whether the listener is enabled
     * !#zh 检查监听器是否可用。
     */
    public isEnabled () {
        return this._isEnabled;
    }
}

const ListenerID = EventListener.ListenerID;

export class Mouse extends EventListener {
    public onMouseDown: Function | null = null;
    public onMouseUp: Function | null = null;
    public onMouseMove: Function | null = null;
    public onMouseScroll: Function | null = null;

    constructor () {
        super(EventListener.MOUSE, ListenerID.MOUSE, null);
        this._onEvent = (event: any) => this._callback(event);
    }

    public _callback (event) {
        const eventType = cc.Event.EventMouse;
        switch (event._eventType) {
            case eventType.DOWN:
                if (this.onMouseDown) {
                    this.onMouseDown(event);
                }
                break;
            case eventType.UP:
                if (this.onMouseUp) {
                    this.onMouseUp(event);
                }
                break;
            case eventType.MOVE:
                if (this.onMouseMove) {
                    this.onMouseMove(event);
                }
                break;
            case eventType.SCROLL:
                if (this.onMouseScroll) {
                    this.onMouseScroll(event);
                }
                break;
            default:
                break;
        }
    }

    public clone () {
        const eventListener = new Mouse();
        eventListener.onMouseDown = this.onMouseDown;
        eventListener.onMouseUp = this.onMouseUp;
        eventListener.onMouseMove = this.onMouseMove;
        eventListener.onMouseScroll = this.onMouseScroll;
        return eventListener;
    }

    public checkAvailable () {
        return true;
    }
}

export class TouchOneByOne extends EventListener {
    public swallowTouches = false;
    public onTouchBegan: Function | null = null;
    public onTouchMoved: Function | null = null;
    public onTouchEnded: Function | null = null;
    public onTouchCancelled: Function | null = null;

    private _claimedTouches: any[] = [];

    constructor () {
        super(EventListener.TOUCH_ONE_BY_ONE, ListenerID.TOUCH_ONE_BY_ONE, null);
    }

    public setSwallowTouches (needSwallow) {
        this.swallowTouches = needSwallow;
    }

    public isSwallowTouches () {
        return this.swallowTouches;
    }

    public clone () {
        const eventListener = new TouchOneByOne();
        eventListener.onTouchBegan = this.onTouchBegan;
        eventListener.onTouchMoved = this.onTouchMoved;
        eventListener.onTouchEnded = this.onTouchEnded;
        eventListener.onTouchCancelled = this.onTouchCancelled;
        eventListener.swallowTouches = this.swallowTouches;
        return eventListener;
    }

    public checkAvailable () {
        if (!this.onTouchBegan) {
            cc.logID(1801);
            return false;
        }
        return true;
    }
}

export class TouchAllAtOnce extends EventListener {
    public onTouchesBegan: Function | null = null;
    public onTouchesMoved: Function | null = null;
    public onTouchesEnded: Function | null = null;
    public onTouchesCancelled: Function | null = null;

    constructor () {
        super(EventListener.TOUCH_ALL_AT_ONCE, ListenerID.TOUCH_ALL_AT_ONCE, null);
    }

    public clone () {
        const eventListener = new TouchAllAtOnce();
        eventListener.onTouchesBegan = this.onTouchesBegan;
        eventListener.onTouchesMoved = this.onTouchesMoved;
        eventListener.onTouchesEnded = this.onTouchesEnded;
        eventListener.onTouchesCancelled = this.onTouchesCancelled;
        return eventListener;
    }

    public checkAvailable () {
        if (this.onTouchesBegan === null && this.onTouchesMoved === null
            && this.onTouchesEnded === null && this.onTouchesCancelled === null) {
            cc.logID(1802);
            return false;
        }
        return true;
    }
}

// Acceleration
export class Acceleration extends EventListener {
    public _onAccelerationEvent: Function | null = null;

    constructor (callback: Function | null) {
        super(EventListener.ACCELERATION, ListenerID.ACCELERATION, null);
        this._onEvent = (event: any) => this._callback(event);
        this._onAccelerationEvent = callback;
    }

    public _callback (event) {
        if (this._onAccelerationEvent) {
            this._onAccelerationEvent(event.acc, event);
        }
    }

    public checkAvailable () {
        cc.assertID(this._onAccelerationEvent, 1803);
        return true;
    }

    public clone () {
        return new Acceleration(this._onAccelerationEvent);
    }
}

// Keyboard
export class Keyboard extends EventListener {
    public onKeyPressed: Function | null = null;
    public onKeyReleased: Function | null = null;

    constructor () {
        super(EventListener.KEYBOARD, ListenerID.KEYBOARD, null);
        this._onEvent = (event: any) => this._callback(event);
    }

    public _callback (event) {
        if (event.isPressed) {
            if (this.onKeyPressed) {
                this.onKeyPressed(event.keyCode, event);
            }
        } else {
            if (this.onKeyReleased) {
                this.onKeyReleased(event.keyCode, event);
            }
        }
    }

    public clone () {
        const eventListener = new Keyboard();
        eventListener.onKeyPressed = this.onKeyPressed;
        eventListener.onKeyReleased = this.onKeyReleased;
        return eventListener;
    }

    public checkAvailable () {
        if (this.onKeyPressed === null && this.onKeyReleased === null) {
            cc.logID(1800);
            return false;
        }
        return true;
    }
}

cc.EventListener = EventListener;
