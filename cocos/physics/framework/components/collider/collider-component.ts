/**
 * @category physics
 */

import { ccclass, property } from '../../../../core/data/class-decorator';
import { Eventify } from '../../../../core/event';
import { Vec3 } from '../../../../core/math';
import { CollisionCallback, CollisionEventType, TriggerCallback, TriggerEventType } from '../../physics-interface';
import { RigidBodyComponent } from '../rigid-body-component';
import { PhysicMaterial } from '../../assets/physic-material';
import { PhysicsSystem } from '../../physics-system';
import { Component, error } from '../../../../core';
import { IBaseShape } from '../../../spec/i-physics-shape';
import { EDITOR, PHYSICS_BUILTIN } from 'internal:constants';

/**
 * @en
 * Base class of collider.
 * @zh
 * 碰撞器的基类。
 */
@ccclass('cc.ColliderComponent')
export class ColliderComponent extends Eventify(Component) {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the physical material for this collider.
     * @zh
     * 获取或设置此碰撞器的物理材质。
     */
    @property({
        type: PhysicMaterial,
        displayName: 'Material',
        displayOrder: -1,
        tooltip: '源材质',
    })
    public get sharedMaterial () {
        return this._material;
    }

    public set sharedMaterial (value) {
        if (EDITOR) {
            this._material = value;
        } else {
            this.material = value;
        }
    }

    /**
     * @en
     * Gets or sets the physics material for this collider, which in Shared state will generate a new instance.
     * @zh
     * 获取或设置此碰撞器的物理材质，共享状态下获取将会生成新的实例。
     */
    public get material () {
        if (!PHYSICS_BUILTIN) {
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
        if (!EDITOR) {
            if (!PHYSICS_BUILTIN) {
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
     * Gets or sets the collider is trigger, this will be always trigger if using builtin.
     * @zh
     * 获取或设置碰撞器是否为触发器，若使用 builtin ，属性值无论真假 ，此碰撞器都为触发器。
     */
    @property({
        displayOrder: 0,
        tooltip: '是否与其它碰撞器产生碰撞，并产生物理行为',
    })
    public get isTrigger () {
        return this._isTrigger;
    }

    public set isTrigger (value) {
        this._isTrigger = value;
        if (!EDITOR) {
            this._shape.setAsTrigger(this._isTrigger);
        }
    }

    /**
     * @en
     * Gets or sets the center of the collider, in local space.
     * @zh
     * 获取或设置碰撞器的中心点。
     */
    @property({
        type: Vec3,
        displayOrder: 1,
        tooltip: '形状的中心点（与所在 Node 中心点的相对位置）',
    })
    public get center () {
        return this._center;
    }

    public set center (value: Vec3) {
        Vec3.copy(this._center, value);
        if (!EDITOR) {
            this._shape.setCenter(this._center);
        }
    }

    /**
     * @en
     * Gets the collider attached rigid-body, this may be null
     * @zh
     * 获取碰撞器所绑定的刚体组件，可能为 null
     */
    public get attachedRigidBody (): RigidBodyComponent | null {
        return this.shape.attachedRigidBody;
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    public get shape () {
        return this._shape;
    }

    /// PRIVATE PROPERTY ///

    protected _shape!: IBaseShape;

    protected _isSharedMaterial: boolean = true;

    @property({ type: PhysicMaterial })
    protected _material: PhysicMaterial | null = null;

    @property
    protected _isTrigger: boolean = false;

    @property
    protected readonly _center: Vec3 = new Vec3();

    protected get _assertOnload (): boolean {
        const r = this._isOnLoadCalled == 0;
        if (r) { error('Physics Error: Please make sure that the node has been added to the scene'); }
        return !r;
    }

    constructor () { super() }

    /**
     * @en
     * Registers callbacks associated with triggered or collision events.
     * @zh
     * 注册触发或碰撞事件相关的回调。
     * @param type - The event type, onTriggerEnter|onTriggerStay|onTriggerExit|onCollisionEnter|onCollisionStay|onCollisionExit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    public on (type: TriggerEventType | CollisionEventType, callback: Function, target?: Object, once?: boolean): any {
        super.on(type, callback, target, once);
    }

    /**
     * @en
     * Unregisters callbacks associated with trigger or collision events that have been registered.
     * @zh
     * 取消已经注册的触发或碰撞事件相关的回调。
     * @param type - The event type, onTriggerEnter|onTriggerStay|onTriggerExit|onCollisionEnter|onCollisionStay|onCollisionExit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    public off (type: TriggerEventType | CollisionEventType, callback?: Function, target?: Object) {
        super.off(type, callback, target);
    }

    /**
     * @en
     * Registers a callback associated with a trigger or collision event, which is automatically unregistered once executed.
     * @zh
     * 注册触发或碰撞事件相关的回调，执行一次后会自动取消注册。
     * @param type - The event type, onTriggerEnter|onTriggerStay|onTriggerExit|onCollisionEnter|onCollisionStay|onCollisionExit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    public once (type: TriggerEventType | CollisionEventType, callback: Function, target?: Object): any {
        super.once(type, callback, target);
    }

    /// GROUP MASK ///

    /**
     * @en
     * Sets the group value.
     * @zh
     * 设置分组值。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public setGroup (v: number): void {
        this._shape!.setGroup(v);
    }

    /**
     * @en
     * Gets the group value.
     * @zh
     * 获取分组值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getGroup (): number {
        return this._shape.getGroup();
    }

    /**
     * @en
     * Add a grouping value to fill in the group you want to join.
     * @zh
     * 添加分组值，可填要加入的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addGroup (v: number) {
        this._shape.addGroup(v);
    }

    /**
     * @en
     * Subtract the grouping value to fill in the group to be removed.
     * @zh
     * 减去分组值，可填要移除的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public removeGroup (v: number) {
        this._shape.removeGroup(v);
    }

    /**
     * @en
     * Gets the mask value.
     * @zh
     * 获取掩码值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getMask (): number {
        return this._shape.getMask();
    }

    /**
     * @en
     * Sets the mask value.
     * @zh
     * 设置掩码值。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public setMask (v: number) {
        this._shape.setMask(v);
    }

    /**
     * @en
     * Add mask values to fill in groups that need to be checked.
     * @zh
     * 添加掩码值，可填入需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addMask (v: number) {
        this._shape.addMask(v);
    }

    /**
     * @en
     * Subtract the mask value to fill in the group that does not need to be checked.
     * @zh
     * 减去掩码值，可填入不需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public removeMask (v: number) {
        this._shape.removeMask(v);
    }

    /// COMPONENT LIFECYCLE ///

    protected __preload () {
        if (!EDITOR) {
            this._shape.initialize(this);
        }
    }

    protected onLoad () {
        if (!EDITOR) {
            if (!PHYSICS_BUILTIN) {
                this.sharedMaterial = this._material == null ? PhysicsSystem.instance.defaultMaterial : this._material;
            }
            this._shape.onLoad!();
        }

    }

    protected onEnable () {
        if (!EDITOR) {
            this._shape.onEnable!();
        }
    }

    protected onDisable () {
        if (!EDITOR) {
            this._shape.onDisable!();
        }
    }

    protected onDestroy () {
        if (!EDITOR) {
            if (this._material) {
                this._material.off('physics_material_update', this._updateMaterial, this);
            }
            this._shape.onDestroy!();
        }
    }

    private _updateMaterial () {
        if (!EDITOR) {
            this._shape.setMaterial(this._material);
        }
    }

}
