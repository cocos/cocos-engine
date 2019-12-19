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

import { CollisionCallback, CollisionEventType, TriggerCallback, TriggerEventType } from '../../physics-interface';
import { RigidBody3D } from '../rigid-body-component';
import { PhysicsMaterial } from '../../assets/physics-material';
import { IBaseShape } from '../../../spec/i-physics-shape';

const {ccclass, property} = cc._decorator;
const Vec3 = cc.Vec3;

/**
 * !#en
 * The base class of the collider
 * !#zh
 * 碰撞器的基类
 */
@ccclass('cc.Collider3D')
export class Collider3D extends cc.Component {

    /// PUBLIC PROPERTY GETTER\SETTER ///

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
     * 获取或设置碰撞器是否为触发器
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
     * get the collider attached rigidbody, this may be null
     * !#zh
     * 获取碰撞器所绑定的刚体组件，可能为 null
     */
    public get attachedRigidbody (): RigidBody3D | null {
        return this.shape.attachedRigidBody;
    }

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
     * !#en Register callbacks related to triggering events.
     * !#zh 注册触发事件或碰撞事件相关的回调。
     * @param type The type of collider event can be 'onTriggerEnter'，'onTriggerStay'，'onTriggerExit' or 'onCollisionEnter', 'onCollisionStay', 'onCollisionExit';
     * @param callback Registered callback function
     * @param target Optional argument that executes the target of the callback function
     * @param useCapture Optional. When set to true, the listener will fire during the capture phase or during the bubbling phase. The default is false.
     */
    public on (type: TriggerEventType | CollisionEventType, callback: TriggerCallback | CollisionCallback, target?: Object, useCapture?: any): any {
    }

    /**
     * !#en Cancels the callback associated with a registered triggering event.
     * !#zh 取消已经注册的触发事件或碰撞事件相关的回调。
     * @param type The type of collider event can be 'onTriggerEnter', 'onTriggerStay', 'onTriggerExit' or 'onCollisionEnter', 'onCollisionStay', 'onCollisionExit';
     * @param callback Registered callback function.
     * @param target Optional argument that executes the target of the callback function.
     * @param useCapture Optional. When set to true, the listener will fire during the capture phase or during the bubbling phase. The default is false.
     */
    public off (type: TriggerEventType | CollisionEventType, callback: TriggerCallback | CollisionCallback, target?: Object, useCapture?: any) {
    }

    /**
     * !#en Registers callbacks related to triggering events, but only executes once.
     * !#zh 注册触发事件或碰撞事件相关的回调，但只会执行一次。
     ** @param type The type of collider event can be 'onCollisionEnter', 'onCollisionStay', 'onCollisionExit';
     * @param callback Registered callback function.
     * @param target Optional argument that executes the target of the callback function.
     * @param useCapture Optional. When set to true, the listener will fire during the capture phase or during the bubbling phase. The default is false.
     */
    public once (type: TriggerEventType | CollisionEventType, callback: TriggerCallback | CollisionCallback, target?: Object, useCapture?: any): any {
    }

    /**
     * IEventTarget implementations, they will be overwrote with the same implementation in EventTarget by applyMixins
     */
    public targetOff (keyOrTarget?: TriggerEventType | CollisionEventType | Object): void {
    }

    public dispatchEvent (event: Event): void {
    }

    public hasEventListener (key: TriggerEventType | CollisionEventType, callback?: TriggerCallback | CollisionCallback, target?: Object): boolean {
        return false;
    }

    public removeAll (keyOrTarget?: TriggerEventType | CollisionEventType | Object): void {
    }

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