/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { CollisionCallback, CollisionEventType, TriggerCallback, TriggerEventType, ICollisionEvent } from '../../physics-interface';
import { RigidBody3D } from '../rigid-body-component';
import { PhysicsMaterial } from '../../assets/physics-material';
import { IBaseShape } from '../../../spec/i-physics-shape';

const {ccclass, property} = cc._decorator;
const Vec3 = cc.Vec3;

/**
 * !#en
 * The base class of the collider.
 * !#zh
 * 碰撞器的基类。
 * @class Collider3D
 * @extends Component
 * @uses EventTarget
 */
@ccclass('cc.Collider3D')
export class Collider3D extends cc.Component {

    /**
     * @property {PhysicsMaterial} sharedMaterial
     */
    @property({
        type: PhysicsMaterial,
        displayName: 'Material',
        displayOrder: -1
    })
    public get sharedMaterial () {
        return this._material;
    }

    public set sharedMaterial (value) {
        this.material = value;
    }

    public get material () {
        if (!CC_PHYSICS_BUILTIN) {
            if (this._isSharedMaterial && this._material != null) {
                this._material.off('physics_material_update', this._updateMaterial, this);
                this._material = this._material.clone();
                this._material.on('physics_material_update', this._updateMaterial, this);
                this._isSharedMaterial = false;
            }
        }
        return this._material;
    }

    public set material (value) {
        if (CC_EDITOR || CC_PHYSICS_BUILTIN) { 
            this._material = value; 
            return;
        }
        if (value != null && this._material != null) {
            if (this._material._uuid != value._uuid) {
                this._material.off('physics_material_update', this._updateMaterial, this);
                value.on('physics_material_update', this._updateMaterial, this);
                this._isSharedMaterial = false;
                this._material = value;
            }
        } else if (value != null && this._material == null) {
            value.on('physics_material_update', this._updateMaterial, this);
            this._material = value;
        } else if (value == null && this._material != null) {
            this._material!.off('physics_material_update', this._updateMaterial, this);
            this._material = value;
        }
        this._updateMaterial();
    }

    /**
     * !#en
     * get or set the collider is trigger, this will be always trigger if using builtin.
     * !#zh
     * 获取或设置碰撞器是否为触发器。
     * @property {Boolean} isTrigger
     */
    @property({
        displayOrder: 0
    })
    public get isTrigger () {
        return this._isTrigger;
    }

    public set isTrigger (value) {
        this._isTrigger = value;
        if (!CC_EDITOR) {
            this._shape.isTrigger = this._isTrigger;
        }
    }

    /**
     * !#en
     * get or set the center of the collider, in local space.
     * !#zh
     * 获取或设置碰撞器的中心点。
     * @property {Vec3} center
     */
    @property({
        type: cc.Vec3,
        displayOrder: 1
    })
    public get center () {
        return this._center;
    }

    public set center (value: cc.Vec3) {
        Vec3.copy(this._center, value);
        if (!CC_EDITOR) {
            this._shape.center = this._center;
        }
    }

    /**
     * !#en
     * get the collider attached rigidbody, this may be null.
     * !#zh
     * 获取碰撞器所绑定的刚体组件，可能为 null。
     * @property {RigidBody3D|null} attachedRigidbody
     * @readonly
     */
    public get attachedRigidbody (): RigidBody3D | null {
        return this.shape.attachedRigidBody;
    }

    /**
     * !#en
     * get collider shape.
     * !#zh
     * 获取碰撞器形状。
     * @property {IBaseShape} shape
     * @readonly
     */
    public get shape () {
        return this._shape;
    }

    /// PRIVATE PROPERTY ///

    protected _shape!: IBaseShape;

    protected _isSharedMaterial: boolean = true;

    @property({ type: PhysicsMaterial })
    protected _material: PhysicsMaterial | null = null;

    @property
    protected _isTrigger: boolean = false;

    @property
    protected readonly _center: cc.Vec3 = new Vec3();

    protected get _assertOnload (): boolean {
        const r = this._isOnLoadCalled == 0;
        if (r) { cc.error('Physics Error: Please make sure that the node has been added to the scene'); }
        return !r;
    }

    protected constructor () { 
        super()
        cc.EventTarget.call(this);
    }

    /// EVENT INTERFACE ///

    /**
     * !#en
     * Register an callback of a specific event type on the EventTarget.
     * This type of event should be triggered via `emit`.
     * !#zh
     * 注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
     *
     * @method on
     * @param {String} type - The type of collider event can be `trigger-enter`, `trigger-stay`, `trigger-exit` or `collision-enter`, `collision-stay`, `collision-exit`.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     * The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {ITriggerEvent|ICollisionEvent} callback.event Callback function argument
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null.
     * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
     * @typescript
     * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
     * @example
     * eventTarget.on('fire', function (event) {
     *     // event is ITriggerEvent or ICollisionEvent
     * }, node);
     */
    public on (type: TriggerEventType | CollisionEventType, callback: TriggerCallback | CollisionCallback, target?: Object, useCapture?: any): any {
    }

    /**
     * !#en
     * Removes the listeners previously registered with the same type, callback, target and or useCapture,
     * if only type is passed as parameter, all listeners registered with that type will be removed.
     * !#zh
     * 删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
     *
     * @method off
     * @param {String} type - The type of collider event can be `trigger-enter`, `trigger-stay`, `trigger-exit` or `collision-enter`, `collision-stay`, `collision-exit`.
     * @param {Function} [callback] - The callback to remove.
     * @param {Object} [target] - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed.
     * @example
     * // register fire eventListener
     * var callback = eventTarget.on('fire', function () {
     *     cc.log("fire in the hole");
     * }, target);
     * // remove fire event listener
     * eventTarget.off('fire', callback, target);
     * // remove all fire event listeners
     * eventTarget.off('fire');
     */
    public off (type: TriggerEventType | CollisionEventType, callback: TriggerCallback | CollisionCallback, target?: any) {
    }

    /**
     * !#en
     * Register an callback of a specific event type on the EventTarget,
     * the callback will remove itself after the first time it is triggered.
     * !#zh
     * 注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
     *
     * @method once
     * @param {String} type - The type of collider event can be `trigger-enter`, `trigger-stay`, `trigger-exit` or `collision-enter`, `collision-stay`, `collision-exit`.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     * The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {ITriggerEvent|ICollisionEvent} callback.event callback function argument.
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null.
     * @example
     * eventTarget.once('fire', function (event) {
     *     // event is ITriggerEvent or ICollisionEvent
     * }, node);
     */
    public once (type: TriggerEventType | CollisionEventType, callback: TriggerCallback | CollisionCallback, target?: Object) {
    }

    /* declare for typescript tip */
    public emit (key: TriggerEventType | CollisionEventType, ...args: any[]): void {
    }

    /// COMPONENT LIFECYCLE ///

    protected __preload () {
        if (!CC_EDITOR) {
            this._shape.__preload!(this);
        }
    }

    protected onLoad () {
        if (!CC_EDITOR) {
            if (!CC_PHYSICS_BUILTIN) {
                this.sharedMaterial = this._material == null ? cc.director.getPhysics3DManager().defaultMaterial : this._material;
            }
            this._shape.onLoad!();
        }
    }

    protected onEnable () {
        if (!CC_EDITOR) {
            this._shape.onEnable!();
        }
    }

    protected onDisable () {
        if (!CC_EDITOR) {
            this._shape.onDisable!();
        }
    }

    protected onDestroy () {
        if (!CC_EDITOR) {
            if (this._material) {
                this._material.off('physics_material_update', this._updateMaterial, this);
            }
            this._shape.onDestroy!();
        }
    }

    private _updateMaterial () {
        if (!CC_EDITOR) {
            this._shape.material = this._material;
        }
    }

}

cc.js.mixin(Collider3D.prototype, cc.EventTarget.prototype);