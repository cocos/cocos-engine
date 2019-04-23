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

// tslint:disable

import { Script } from '../assets';
import { ccclass, property } from '../core/data/class-decorator';
import { CCObject } from '../core/data/object';
import IDGenerator from '../core/utils/id-generator';
import { getClassName, value } from '../core/utils/js';
import { Node } from '../scene-graph';
import { RenderScene } from '../renderer/scene/render-scene';
import { Rect } from '../core';

const idGenerator = new IDGenerator('Comp');
// @ts-ignore
const IsOnEnableCalled = CCObject.Flags.IsOnEnableCalled;
// @ts-ignore
const IsOnLoadCalled = CCObject.Flags.IsOnLoadCalled;

const NullNode = null as unknown as Node;

/**
 * !#en
 * Base class for everything attached to Node(Entity).<br/>
 * <br/>
 * NOTE: Not allowed to use construction parameters for Component's subclasses,
 *       because Component is created by the engine.
 * !#zh
 * 所有附加到节点的基类。<br/>
 * <br/>
 * 注意：不允许使用组件的子类构造参数，因为组件是由引擎创建的。
 *
 * @class Component
 * @extends Object
 */
@ccclass('cc.Component')
class Component extends CCObject {

    @property({
        visible: false,
    })
    get name () {
        if (this._name) {
            return this._name;
        }
        let className = getClassName(this);
        const trimLeft = className.lastIndexOf('.');
        if (trimLeft >= 0) {
            className = className.slice(trimLeft + 1);
        }
        return this.node.name + '<' + className + '>';
    }
    set name (value) {
        this._name = value;
    }

    /**
     * !#en The uuid for editor.
     * !#zh 组件的 uuid，用于编辑器。
     * @property uuid
     * @type {String}
     * @readOnly
     * @example
     * cc.log(comp.uuid);
     */
    @property({
        visible: false,
    })
    get uuid () {
        return this._id;
    }

    @property({
        displayName: 'Script',
        type: Script,
        tooltip: CC_DEV ? 'i18n:INSPECTOR.component.script' : undefined,
    })
    get __scriptAsset () { return null; }

    /**
     * !#en indicates whether this component is enabled or not.
     * !#zh 表示该组件自身是否启用。
     * @property enabled
     * @type {Boolean}
     * @default true
     * @example
     * comp.enabled = true;
     * cc.log(comp.enabled);
     */
    @property({
        visible: false,
    })
    get enabled () {
        return this._enabled;
    }
    set enabled (value) {
        if (this._enabled !== value) {
            this._enabled = value;
            if (this.node.activeInHierarchy) {
                const compScheduler = cc.director._compScheduler;
                if (value) {
                    compScheduler.enableComp(this);
                }
                else {
                    compScheduler.disableComp(this);
                }
            }
        }
    }

    /**
     * !#en indicates whether this component is enabled and its node is also active in the hierarchy.
     * !#zh 表示该组件是否被启用并且所在的节点也处于激活状态。
     * @property enabledInHierarchy
     * @type {Boolean}
     * @readOnly
     * @example
     * cc.log(comp.enabledInHierarchy);
     */
    @property({
        visible: false,
    })
    get enabledInHierarchy () {
        return this._enabled && this.node && this.node.activeInHierarchy;
    }

    /**
     * !#en Returns a value which used to indicate the onLoad get called or not.
     * !#zh 返回一个值用来判断 onLoad 是否被调用过，不等于 0 时调用过，等于 0 时未调用。
     * @property _isOnLoadCalled
     * @type {Number}
     * @readOnly
     * @example
     * cc.log(this._isOnLoadCalled > 0);
     */
    get _isOnLoadCalled () {
        return this._objFlags & IsOnLoadCalled;
    }

    public static system = null;
    /**
     * !#en The node this component is attached to. A component is always attached to a node.
     * !#zh 该组件被附加到的节点。组件总会附加到一个节点。
     * @property node
     * @type {Node}
     * @example
     * cc.log(comp.node);
     */
    @property({
        visible: false,
    })
    public node: Node = NullNode;
    // set __scriptAsset (value) {
    //    if (this.__scriptUuid !== value) {
    //        if (value && Editor.Utils.UuidUtils.isUuid(value._uuid)) {
    //            var classId = Editor.Utils.UuidUtils.compressUuid(value._uuid);
    //            var NewComp = cc.js._getClassById(classId);
    //            if (cc.js.isChildClassOf(NewComp, cc.Component)) {
    //                cc.warn('Sorry, replacing component script is not yet implemented.');
    //                //Editor.Ipc.sendToWins('reload:window-scripts', Editor._Sandbox.compiled);
    //            }
    //            else {
    //                cc.error('Can not find a component in the script which uuid is "%s".', value._uuid);
    //            }
    //        }
    //        else {
    //            cc.error('Invalid Script');
    //        }
    //    }
    // }

    /**
     * @property _enabled
     * @type {Boolean}
     * @private
     */
    @property
    public _enabled = true;

    public _sceneGetter: null | (() => RenderScene) = null;

    /**
     * For internal usage.
     */
    public _id: string;

    /**
     * Register all related EventTargets,
     * all event callbacks will be removed in _onPreDestroy
     */
    private _eventTargets: any[] = [];

    private __scriptUuid = '';

    constructor () {
        super();
        if (CC_EDITOR) {
            // @ts-ignore
            if (window._Scene && _Scene.AssetsWatcher) {
                // @ts-ignore
                _Scene.AssetsWatcher.initComponent(this);
            }
            // @ts-ignore
            this._id = Editor.Utils.UuidUtils.uuid();
        }
        else {
            this._id = idGenerator.getNewId();
        }
    }

    public _getRenderScene () {
        if (this._sceneGetter) {
            return this._sceneGetter();
        } else {
            return this.node.scene._renderScene!;
        }
    }

    // PUBLIC

    /**
     * !#en Adds a component class to the node. You can also add component to node by passing in the name of the script.
     * !#zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
     * @example
     * var sprite = node.addComponent(cc.Sprite);
     */
    public addComponent<T extends Component> (classConstructor: Constructor<T>): T | null;

    /**
     * !#en Adds a component class to the node. You can also add component to node by passing in the name of the script.
     * !#zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
     * @example
     * var test = node.addComponent("Test");
     */
    public addComponent (className: string): Component | null;

    public addComponent (typeOrClassName: any) {
        return this.node.addComponent(typeOrClassName);
    }

    /**
     * !#en
     * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
     * You can also get component in the node by passing in the name of the script.
     * !#zh
     * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
     * 传入参数也可以是脚本的名称。
     * @example
     * // get sprite component.
     * var sprite = node.getComponent(cc.Sprite);
     */
    public getComponent<T extends Component> (classConstructor: Constructor<T>): T | null;

    /**
     * !#en
     * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
     * You can also get component in the node by passing in the name of the script.
     * !#zh
     * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
     * 传入参数也可以是脚本的名称。
     * @example
     * // get custom test calss.
     * var test = node.getComponent("Test");
     */
    public getComponent (className: string): Component | null;

    public getComponent (typeOrClassName: any) {
        return this.node.getComponent(typeOrClassName);
    }

    /**
     * !#en Returns all components of supplied type in the node.
     * !#zh 返回节点上指定类型的所有组件。
     * @example
     * var sprites = node.getComponents(cc.Sprite);
     */
    public getComponents<T extends Component> (classConstructor: Constructor<T>): T[];

    /**
     * !#en Returns all components of supplied type in the node.
     * !#zh 返回节点上指定类型的所有组件。
     * @example
     * var tests = node.getComponents("Test");
     */
    public getComponents (className: string): Component[];

    public getComponents<T extends Component> (typeOrClassName: any) {
        return this.node.getComponents(typeOrClassName);
    }

    /**
     * !#en Returns the component of supplied type in any of its children using depth first search.
     * !#zh 递归查找所有子节点中第一个匹配指定类型的组件。
     * @example
     * var sprite = node.getComponentInChildren(cc.Sprite);
     */
    public getComponentInChildren<T extends Component> (classConstructor: Constructor<T>): T | null;

    /**
     * !#en Returns the component of supplied type in any of its children using depth first search.
     * !#zh 递归查找所有子节点中第一个匹配指定类型的组件。
     * @example
     * var Test = node.getComponentInChildren("Test");
     */
    public getComponentInChildren (className: string): Component | null;

    public getComponentInChildren (typeOrClassName: any) {
        return this.node.getComponentInChildren(typeOrClassName);
    }

    /**
     * !#en Returns all components of supplied type in self or any of its children.
     * !#zh 递归查找自身或所有子节点中指定类型的组件
     * @example
     * var sprites = node.getComponentsInChildren(cc.Sprite);
     */
    public getComponentsInChildren<T extends Component> (classConstructor: Constructor<T>): T[];

    /**
     * !#en Returns all components of supplied type in self or any of its children.
     * !#zh 递归查找自身或所有子节点中指定类型的组件
     * @example
     * var tests = node.getComponentsInChildren("Test");
     */
    public getComponentsInChildren (className: string): Component[];

    public getComponentsInChildren (typeOrClassName: any) {
        return this.node.getComponentsInChildren(typeOrClassName);
    }

    // OVERRIDE

    public destroy () {
        if (CC_EDITOR) {
            // @ts-ignore
            const depend = this.node._getDependComponent(this);
            if (depend) {
                return cc.errorID(3626,
                    getClassName(this), getClassName(depend));
            }
        }
        if (super.destroy()) {
            if (this._enabled && this.node.activeInHierarchy) {
                cc.director._compScheduler.disableComp(this);
            }
        }
    }

    public _onPreDestroy () {
        // Schedules
        this.unscheduleAllCallbacks();

        // Remove all listeners
        const eventTargets = this._eventTargets;
        for (let i = 0, l = eventTargets.length; i < l; ++i) {
            const target = eventTargets[i];
            target && target.targetOff(this);
        }
        eventTargets.length = 0;

        //
        if (CC_EDITOR && !CC_TEST) {
            // @ts-ignore
            _Scene.AssetsWatcher.stop(this);
        }

        // onDestroy
        cc.director._nodeActivator.destroyComp(this);

        // do remove component
        this.node._removeComponent(this);
    }

    public _instantiate (cloned) {
        if (!cloned) {
            cloned = cc.instantiate._clone(this, this);
        }
        cloned.node = null;
        return cloned;
    }

    // Scheduler

    /**
     * !#en
     * Schedules a custom selector.<br/>
     * If the selector is already scheduled, then the interval parameter will be updated without scheduling it again.
     * !#zh
     * 调度一个自定义的回调函数。<br/>
     * 如果回调函数已调度，那么将不会重复调度它，只会更新时间间隔参数。
     * @method schedule
     * @param {function} callback The callback function
     * @param {Number} [interval=0]  Tick interval in seconds. 0 means tick every frame.
     * @param {Number} [repeat=cc.macro.REPEAT_FOREVER]    The selector will be executed (repeat + 1) times, you can use cc.macro.REPEAT_FOREVER for tick infinitely.
     * @param {Number} [delay=0]     The amount of time that the first tick will wait before execution.
     * @example
     * var timeCallback = function (dt) {
     *   cc.log("time: " + dt);
     * }
     * this.schedule(timeCallback, 1);
     */
    public schedule (callback, interval, repeat, delay) {
        cc.assertID(callback, 1619);
        cc.assertID(interval >= 0, 1620);

        interval = interval || 0;
        repeat = isNaN(repeat) ? cc.macro.REPEAT_FOREVER : repeat;
        delay = delay || 0;

        const scheduler = cc.director.getScheduler();

        // should not use enabledInHierarchy to judge whether paused,
        // because enabledInHierarchy is assigned after onEnable.
        // Actually, if not yet scheduled, resumeTarget/pauseTarget has no effect on component,
        // therefore there is no way to guarantee the paused state other than isTargetPaused.
        const paused = scheduler.isTargetPaused(this);

        scheduler.schedule(callback, this, interval, repeat, delay, paused);
    }

    /**
     * !#en Schedules a callback function that runs only once, with a delay of 0 or larger.
     * !#zh 调度一个只运行一次的回调函数，可以指定 0 让回调函数在下一帧立即执行或者在一定的延时之后执行。
     * @method scheduleOnce
     * @see cc.Node#schedule
     * @param {function} callback  A function wrapped as a selector
     * @param {Number} [delay=0]  The amount of time that the first tick will wait before execution.
     * @example
     * var timeCallback = function (dt) {
     *   cc.log("time: " + dt);
     * }
     * this.scheduleOnce(timeCallback, 2);
     */
    public scheduleOnce (callback, delay) {
        this.schedule(callback, 0, 0, delay);
    }

    /**
     * !#en Unschedules a custom callback function.
     * !#zh 取消调度一个自定义的回调函数。
     * @method unschedule
     * @see cc.Node#schedule
     * @param {function} callback_fn  A function wrapped as a selector
     * @example
     * this.unschedule(_callback);
     */
    public unschedule (callback_fn) {
        if (!callback_fn) {
            return;
        }

        cc.director.getScheduler().unschedule(callback_fn, this);
    }

    /**
     * !#en
     * unschedule all scheduled callback functions: custom callback functions, and the 'update' callback function.<br/>
     * Actions are not affected by this method.
     * !#zh 取消调度所有已调度的回调函数：定制的回调函数以及 'update' 回调函数。动作不受此方法影响。
     * @method unscheduleAllCallbacks
     * @example
     * this.unscheduleAllCallbacks();
     */
    public unscheduleAllCallbacks () {
        cc.director.getScheduler().unscheduleAllForTarget(this);
    }

    // LIFECYCLE METHODS

    // Fireball provides lifecycle methods that you can specify to hook into this process.
    // We provide Pre methods, which are called right before something happens, and Post methods which are called right after something happens.

    /**
     * !#en Update is called every frame, if the Component is enabled.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * !#zh 如果该组件启用，则每帧调用 update。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     * @param dt - the delta time in seconds it took to complete the last frame
     */
    protected update? (dt: number): void;

    /**
     * !#en LateUpdate is called every frame, if the Component is enabled.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * !#zh 如果该组件启用，则每帧调用 LateUpdate。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    protected lateUpdate? (): void;

    /**
     * `__preload` is called before every onLoad.
     * It is used to initialize the builtin components internally,
     * to avoid checking whether onLoad is called before every public method calls.
     * This method should be removed if script priority is supported.
     * @private
     */
    protected __preload? (): void;

    /**
     * !#en
     * When attaching to an active node or its node first activated.
     * onLoad is always called before any start functions, this allows you to order initialization of scripts.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * !#zh
     * 当附加到一个激活的节点上或者其节点第一次激活时候调用。onLoad 总是会在任何 start 方法调用前执行，这能用于安排脚本的初始化顺序。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    protected onLoad? (): void;

    /**
     * !#en
     * Called before all scripts' update if the Component is enabled the first time.
     * Usually used to initialize some logic which need to be called after all components' `onload` methods called.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * !#zh
     * 如果该组件第一次启用，则在所有组件的 update 之前调用。通常用于需要在所有组件的 onLoad 初始化完毕后执行的逻辑。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    protected start? (): void;

    /**
     * !#en Called when this component becomes enabled and its node is active.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * !#zh 当该组件被启用，并且它的节点也激活时。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    protected onEnable? (): void;

    /**
     * !#en Called when this component becomes disabled or its node becomes inactive.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * !#zh 当该组件被禁用或节点变为无效时调用。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    protected onDisable? (): void;

    /**
     * !#en Called when this component will be destroyed.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * !#zh 当该组件被销毁时调用<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    protected onDestroy? (): void;

    protected onFocusInEditor? (): void;

    protected onLostFocusInEditor? (): void;

    /**
     * !#en Called to initialize the component or node’s properties when adding the component the first time or when the Reset command is used.
     * This function is only called in editor.
     * !#zh 用来初始化组件或节点的一些属性，当该组件被第一次添加到节点上或用户点击了它的 Reset 菜单时调用。这个回调只会在编辑器下调用。
     */
    protected resetInEditor? (): void;

    // VIRTUAL

    /**
     * !#en
     * If the component's bounding box is different from the node's, you can implement this method to supply
     * a custom axis aligned bounding box (AABB), so the editor's scene view can perform hit test properly.
     * !#zh
     * 如果组件的包围盒与节点不同，您可以实现该方法以提供自定义的轴向对齐的包围盒（AABB），
     * 以便编辑器的场景视图可以正确地执行点选测试。
     * @param out_rect - the Rect to receive the bounding box
     */
    protected _getLocalBounds? (out_rect: Rect): void;

    /**
     * !#en
     * onRestore is called after the user clicks the Reset item in the Inspector's context menu or performs
     * an undo operation on this component.<br/>
     * <br/>
     * If the component contains the "internal state", short for "temporary member variables which not included<br/>
     * in its CCClass properties", then you may need to implement this function.<br/>
     * <br/>
     * The editor will call the getset accessors of your component to record/restore the component's state<br/>
     * for undo/redo operation. However, in extreme cases, it may not works well. Then you should implement<br/>
     * this function to manually synchronize your component's "internal states" with its public properties.<br/>
     * Once you implement this function, all the getset accessors of your component will not be called when<br/>
     * the user performs an undo/redo operation. Which means that only the properties with default value<br/>
     * will be recorded or restored by editor.<br/>
     * <br/>
     * Similarly, the editor may failed to reset your component correctly in extreme cases. Then if you need<br/>
     * to support the reset menu, you should manually synchronize your component's "internal states" with its<br/>
     * properties in this function. Once you implement this function, all the getset accessors of your component<br/>
     * will not be called during reset operation. Which means that only the properties with default value<br/>
     * will be reset by editor.
     *
     * This function is only called in editor mode.
     * !#zh
     * onRestore 是用户在检查器菜单点击 Reset 时，对此组件执行撤消操作后调用的。<br/>
     * <br/>
     * 如果组件包含了“内部状态”（不在 CCClass 属性中定义的临时成员变量），那么你可能需要实现该方法。<br/>
     * <br/>
     * 编辑器执行撤销/重做操作时，将调用组件的 get set 来录制和还原组件的状态。
     * 然而，在极端的情况下，它可能无法良好运作。<br/>
     * 那么你就应该实现这个方法，手动根据组件的属性同步“内部状态”。
     * 一旦你实现这个方法，当用户撤销或重做时，组件的所有 get set 都不会再被调用。
     * 这意味着仅仅指定了默认值的属性将被编辑器记录和还原。<br/>
     * <br/>
     * 同样的，编辑可能无法在极端情况下正确地重置您的组件。<br/>
     * 于是如果你需要支持组件重置菜单，你需要在该方法中手工同步组件属性到“内部状态”。<br/>
     * 一旦你实现这个方法，组件的所有 get set 都不会在重置操作时被调用。
     * 这意味着仅仅指定了默认值的属性将被编辑器重置。
     * <br/>
     * 此方法仅在编辑器下会被调用。
     */
    protected onRestore? (): void;
}

const proto = Component.prototype;
// @ts-ignore
proto.update = null;
// @ts-ignore
proto.lateUpdate = null;
// @ts-ignore
proto.__preload = null;
// @ts-ignore
proto.onLoad = null;
// @ts-ignore
proto.start = null;
// @ts-ignore
proto.onEnable = null;
// @ts-ignore
proto.onDisable = null;
// @ts-ignore
proto.onDestroy = null;
// @ts-ignore
proto.onFocusInEditor = null;
// @ts-ignore
proto.onLostFocusInEditor = null;
// @ts-ignore
proto.resetInEditor = null;
// @ts-ignore
proto._getLocalBounds = null;
// @ts-ignore
proto.onRestore = null;
// @ts-ignore
Component._requireComponent = null;
// @ts-ignore
Component._executionOrder = 0;

if (CC_EDITOR || CC_TEST) {

    // INHERITABLE STATIC MEMBERS
    // @ts-ignore
    Component._executeInEditMode = false;
    // @ts-ignore
    Component._playOnFocus = false;
    // @ts-ignore
    Component._disallowMultiple = null;
    // @ts-ignore
    Component._help = '';

    // NON-INHERITED STATIC MEMBERS
    // (TypeScript 2.3 will still inherit them, so always check hasOwnProperty before using)

    value(Component, '_inspector', '', true);
    value(Component, '_icon', '', true);

    // COMPONENT HELPERS

    cc._componentMenuItems = [];
    // @ts-ignore
    Component._addMenuItem = function (cls, path, priority) {
        cc._componentMenuItems.push({
            component: cls,
            menuPath: path,
            priority,
        });
    };
}

// we make this non-enumerable, to prevent inherited by sub classes.
value(Component, '_registerEditorProps', function (cls, props) {
    const reqComp = props.requireComponent;
    if (reqComp) {
        cls._requireComponent = reqComp;
    }
    const order = props.executionOrder;
    if (order && typeof order === 'number') {
        cls._executionOrder = order;
    }
    if (CC_EDITOR || CC_TEST) {
        const name = getClassName(cls);
        for (const key in props) {
            const val = props[key];
            switch (key) {
                case 'executeInEditMode':
                    cls._executeInEditMode = !!val;
                    break;

                case 'playOnFocus':
                    if (val) {
                        const willExecuteInEditMode = ('executeInEditMode' in props) ? props.executeInEditMode : cls._executeInEditMode;
                        if (willExecuteInEditMode) {
                            cls._playOnFocus = true;
                        }
                        else {
                            cc.warnID(3601, name);
                        }
                    }
                    break;

                case 'inspector':
                    value(cls, '_inspector', val, true);
                    break;

                case 'icon':
                    value(cls, '_icon', val, true);
                    break;

                case 'menu':
                    // @ts-ignore
                    Component._addMenuItem(cls, val, props.menuPriority);
                    break;

                case 'disallowMultiple':
                    cls._disallowMultiple = cls;
                    break;

                case 'requireComponent':
                case 'executionOrder':
                    // skip here
                    break;

                case 'help':
                    cls._help = val;
                    break;

                default:
                    cc.warnID(3602, key, name);
                    break;
            }
        }
    }
});

cc.Component = Component;
export { Component };
