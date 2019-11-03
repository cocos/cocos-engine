/**
 * @category physics
 */

import { ccclass, property } from '../../../../core/data/class-decorator';
import { EventTarget } from '../../../../core/event';
import { CallbacksInvoker, ICallbackTable } from '../../../../core/event/callbacks-invoker';
import { applyMixins, IEventTarget } from '../../../../core/event/event-target-factory';
import { createMap } from '../../../../core/utils/js';
import { Vec3 } from '../../../../core/math';
import { CollisionCallback, CollisionEventType, TriggerCallback, TriggerEventType } from '../../physics-interface';
import { RigidBodyComponent } from '../rigid-body-component';
import { PhysicMaterial } from '../../assets/physic-material';
import { PhysicsSystem } from '../../physics-system';
import { Component } from '../../../../core';
import { IBaseShape } from '../../../spec/i-physics-spahe';

/**
 * @zh
 * 碰撞器的基类
 */
@ccclass('cc.ColliderComponent')
export class ColliderComponent extends Component implements IEventTarget {

    /**
     * @zh
     * 存储注册事件的回调列表，请不要直接修改。
     */
    public _callbackTable: ICallbackTable = createMap(true);

    /// PUBLIC PROPERTY GETTER\SETTER ///

    @property({
        type: PhysicMaterial,
        displayName: 'Material',
        displayOrder: -1,
        tooltip:'源材质',
    })
    public get sharedMaterial () {
        return this._material;
    }

    public set sharedMaterial (value) {
        if (CC_EDITOR) {
            this._material = value;
        } else {
            this.material = value;
        }
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
        if (!CC_EDITOR) {
            if (!CC_PHYSICS_BUILTIN) {
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
            } else {
                this._material = value;
            }
        }
    }

    /**
     * @en
     * get or set the collider is trigger, this will be always trigger if using builtin.
     * @zh
     * 获取或设置碰撞器是否为触发器，若使用 builtin ，属性值无论真假 ，此碰撞器都为触发器。
     */
    @property({
        displayOrder: 0,
        tooltip:'是否与其它碰撞器产生碰撞，并产生物理行为',
    })
    public get isTrigger () {
        return this._isTrigger;
    }

    public set isTrigger (value) {
        this._isTrigger = value;
        if (!CC_EDITOR) {
            this._shape.isTrigger = this._isTrigger;
        }
        // if (!CC_EDITOR) {
        //     if (!CC_PHYSICS_BUILTIN) {
        //         if (this.sharedBody) {
        //             const type = this._isTrigger ? ERigidBodyType.DYNAMIC : ERigidBodyType.STATIC;
        //             this.sharedBody.body.setType(type);
        //             this._shapeBase.setCollisionResponse!(!this._isTrigger);
        //         }
        //     }
        // }
    }

    /**
     * @en
     * get or set the center of the collider, in local space.
     * @zh
     * 获取或设置碰撞器的中心点。
     */
    @property({
        type: Vec3,
        displayOrder: 1,
        tooltip:'形状的中心点（与所在 Node 中心点的相对位置）',
    })
    public get center () {
        return this._center;
    }

    public set center (value: Vec3) {
        Vec3.copy(this._center, value);
        if (!CC_EDITOR) {
            this._shape.center = this._center;
        }

        // if (!CC_EDITOR) {
        //     const rigidBody = this.sharedBody.rigidBody as RigidBodyComponent | null;
        //     if (rigidBody != null) {
        //         Vec3.subtract(offset, this.node.worldPosition, rigidBody.node.worldPosition);
        //         Vec3.add(offset, offset, this._center);
        //         this._shapeBase.setCenter(offset);
        //     } else {
        //         this._shapeBase.setCenter(this._center);
        //     }
        // }
    }

    /**
     * @en
     * get the collider attached rigidbody, this may be null
     * @zh
     * 获取碰撞器所绑定的刚体组件，可能为 null
     */
    public get attachedRigidbody (): RigidBodyComponent | null {
        return this.shape.attachedRigidBody;
    }

    public get shape () {
        return this._shape;
    }

    protected _shape!: IBaseShape;

    protected _isSharedMaterial: boolean = true;

    /// PRIVATE PROPERTY ///

    @property({ type: PhysicMaterial })
    protected _material: PhysicMaterial | null = null;

    @property
    protected _isTrigger: boolean = false;

    @property
    protected readonly _center: Vec3 = new Vec3();

    /// EVENT INTERFACE ///

    /**
     * @zh
     * 注册触发事件或碰撞事件相关的回调。
     * @param type - 触发或碰撞事件的类型，可为 'onTriggerEnter'，'onTriggerStay'，'onTriggerExit' 或 'onCollisionEnter'，'onCollisionStay'，'onCollisionExit';
     * @param callback - 注册的回调函数
     * @param target - 可选参数，执行回调函数的目标
     * @param useCapture - 可选参数，当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     */
    public on (type: TriggerEventType | CollisionEventType, callback: TriggerCallback | CollisionCallback, target?: Object, useCapture?: any): any {
    }

    /**
     * @zh
     * 取消已经注册的触发事件或碰撞事件相关的回调。
     * @param type - 触发或碰撞事件的类型，可为 'onTriggerEnter'，'onTriggerStay'，'onTriggerExit' 或 'onCollisionEnter'，'onCollisionStay'，'onCollisionExit';
     * @param callback - 注册的回调函数
     * @param target - 可选参数，执行回调函数的目标
     * @param useCapture - 可选参数，当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     */
    public off (type: TriggerEventType | CollisionEventType, callback: TriggerCallback | CollisionCallback, target?: Object, useCapture?: any) {
    }

    /**
     * @zh
     * 注册触发事件或碰撞事件相关的回调，但只会执行一次。
     * @param type - 触发或碰撞事件的类型，可为 'onTriggerEnter'，'onTriggerStay'，'onTriggerExit' 或 'onCollisionEnter'，'onCollisionStay'，'onCollisionExit';
     * @param callback - 注册的回调函数
     * @param target - 可选参数，执行回调函数的目标
     * @param useCapture - 可选参数，当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
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

    /// GROUP MASK ///

    /**
     * @zh
     * 设置分组值。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public setGroup (v: number): void {
        return this._shape!.setGroup(v);
    }

    /**
     * @zh
     * 获取分组值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getGroup (): number {
        return this._shape.getGroup();
    }

    /**
     * @zh
     * 添加分组值，可填要加入的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addGroup (v: number) {
        return this._shape.addGroup(v);
    }

    /**
     * @zh
     * 减去分组值，可填要移除的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public removeGroup (v: number) {
        return this._shape.removeGroup(v);
    }

    /**
     * @zh
     * 获取掩码值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getMask (): number {
        return this._shape.getMask();
    }

    /**
     * @zh
     * 设置掩码值。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public setMask (v: number) {
        return this._shape.setMask(v);
    }

    /**
     * @zh
     * 添加掩码值，可填入需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addMask (v: number) {
        return this._shape.addMask(v);
    }

    /**
     * @zh
     * 减去掩码值，可填入不需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public removeMask (v: number) {
        return this._shape.removeMask(v);
    }

    /// COMPONENT LIFECYCLE ///

    protected __preload () {
        if (!CC_EDITOR) {
            this._shape.__preload!(this);
        }
    }

    protected onLoad () {
        // if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        //     // init collider
        //     this.isTrigger = this._isTrigger;
        //     this.sharedMaterial = this._material == null ? PhysicsSystem.instance.defaultMaterial : this._material;
        // }

        // this.center = this._center;
        if (!CC_EDITOR) {
            if (!CC_PHYSICS_BUILTIN) {
                this.sharedMaterial = this._material == null ? PhysicsSystem.instance.defaultMaterial : this._material;
            }
            this._shape.onLoad!();
        }

    }

    protected onEnable () {

        // if (!CC_EDITOR) {
        //     super.onEnable();

        //     const rigidBody = this.sharedBody.rigidBody as RigidBodyComponent | null;
        //     if (rigidBody != null) {
        //         Vec3.subtract(offset, this.node.worldPosition, rigidBody.node.worldPosition);
        //         Vec3.add(offset, offset, this._center);
        //         this.sharedBody.body.addShape(this._shapeBase!, offset);
        //     } else {
        //         this.sharedBody.body.addShape(this._shapeBase!, this._center);
        //     }
        //     this.center = this._center;

        //     this._shapeBase.addTriggerCallback(this._trrigerCallback);
        //     if (!CC_PHYSICS_BUILTIN) {
        //         this.sharedBody.body.addCollisionCallback(this._collisionCallBack);
        //     }
        //     // sync after add shape
        //     this.sharedBody.syncPhysWithScene();
        // }
        if (!CC_EDITOR) {
            this._shape.onEnable!();
        }
    }

    protected onDisable () {
        // if (!CC_EDITOR) {
        //     this._shapeBase.removeTriggerCallback(this._trrigerCallback);
        //     if (!CC_PHYSICS_BUILTIN) {
        //         this.sharedBody.body.removeCollisionCllback(this._collisionCallBack);
        //     }
        //     this.sharedBody.body.removeShape(this._shapeBase!);

        //     // TODO : Change to determine the reference count
        //     if (this.sharedBody.isShapeOnly) {
        //         super.onDisable();
        //     }
        // }
        if (!CC_EDITOR) {
            this._shape.onDisable!();
        }
    }

    protected onDestroy () {
        // if (!CC_EDITOR) {
        //     this.sharedBody.body.removeShape(this._shapeBase!);
        //     if (!CC_PHYSICS_BUILTIN) {
        //         if (this._material != null) {
        //             if (this._material._uuid != PhysicsSystem.instance.defaultMaterial!._uuid) {
        //                 this._material.destroy();
        //                 this._material = null;
        //             }
        //         }
        //     }
        // }
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

applyMixins(ColliderComponent, [CallbacksInvoker, EventTarget]);

const offset = new Vec3();
