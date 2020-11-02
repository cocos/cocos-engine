/**
 * @packageDocumentation
 * @module physics
 */

import { ccclass, tooltip, displayOrder, displayName, readOnly, type, serializable } from 'cc.decorator';
import { Eventify } from '../../../../core/event';
import { Vec3 } from '../../../../core/math';
import { CollisionEventType, TriggerEventType } from '../../physics-interface';
import { RigidBody } from '../rigid-body';
import { PhysicsMaterial } from '../../assets/physics-material';
import { PhysicsSystem } from '../../physics-system';
import { Component, error, Node } from '../../../../core';
import { IBaseShape } from '../../../spec/i-physics-shape';
import { EDITOR } from 'internal:constants';
import { aabb, sphere } from '../../../../core/geometry';
import { EColliderType, EAxisDirection } from '../../physics-enum';
import { createShape } from '../../instance';

/**
 * @en
 * Base class of collider.
 * @zh
 * 碰撞器的基类。
 */
@ccclass('cc.Collider')
export class Collider extends Eventify(Component) {

    /**
     * @en
     * Enumeration of collider types.
     * @zh
     * 碰撞体类型的枚举。
     */
    static readonly Type = EColliderType;
    
    /**
     * @en
     * Enumeration of axes.
     * @zh
     * 坐标轴方向的枚举。
     */
    static readonly Axis = EAxisDirection;

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets the collider attached rigid-body, this may be null.
     * @zh
     * 获取碰撞器所绑定的刚体组件，可能为 null 。
     */
    @type(RigidBody)
    @readOnly
    @displayName('Attached')
    @displayOrder(-2)
    public get attachedRigidBody (): RigidBody | null {
        return findAttachedBody(this.node);
        // return this._attachedRigidBody;
    }

    /**
     * @en
     * Gets or sets the physical material for this collider.
     * @zh
     * 获取或设置此碰撞器的物理材质。
     */
    @type(PhysicsMaterial)
    @displayName('Material')
    @displayOrder(-1)
    @tooltip('源材质')
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
        if (this._isSharedMaterial && this._material != null) {
            this._material.off('physics_material_update', this._updateMaterial, this);
            this._material = this._material.clone();
            this._material.on('physics_material_update', this._updateMaterial, this);
            this._isSharedMaterial = false;
        }
        return this._material;
    }

    public set material (value) {
        if (this._shape) {
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
    }

    /**
     * @en
     * Gets or sets the collider is trigger, this will be always trigger if using builtin.
     * @zh
     * 获取或设置碰撞器是否为触发器。(builtin中无论真假都为触发器)
     */
    @displayOrder(0)
    @tooltip('是否为触发器，触发器不会产生物理反馈')
    public get isTrigger () {
        return this._isTrigger;
    }

    public set isTrigger (value) {
        this._isTrigger = value;
        if (this._shape) {
            this._shape.setAsTrigger(this._isTrigger);
        }
    }

    /**
     * @en
     * Gets or sets the center of the collider, in local space.
     * @zh
     * 获取或设置碰撞器的中心点。
     */
    @type(Vec3)
    @displayOrder(1)
    @tooltip('形状的中心点（与所在 Node 中心点的相对位置）')
    public get center () {
        return this._center;
    }

    public set center (value: Vec3) {
        Vec3.copy(this._center, value);
        if (this._shape) {
            this._shape.setCenter(this._center);
        }
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

    public get worldBounds (): Readonly<aabb> {
        if (this._aabb == null) this._aabb = new aabb();
        if (this._shape) this._shape.getAABB(this._aabb);
        return this._aabb;
    }

    public get boundingSphere (): Readonly<sphere> {
        if (this._boundingSphere == null) this._boundingSphere = new sphere();
        if (this._shape) this._shape.getBoundingSphere(this._boundingSphere);
        return this._boundingSphere;
    }

    public get needTriggerEvent () {
        return this._needTriggerEvent;
    }

    public get needCollisionEvent () {
        return this._needCollisionEvent;
    }

    readonly TYPE: EColliderType;

    /// PROTECTED PROPERTY ///

    protected _shape: IBaseShape | null = null;
    protected _aabb: aabb | null = null;
    protected _boundingSphere: sphere | null = null;
    protected _isSharedMaterial: boolean = true;
    protected _needTriggerEvent: boolean = false;
    protected _needCollisionEvent: boolean = false;
    // protected _attachedRigidBody: RigidBody | null = null;

    @type(PhysicsMaterial)
    protected _material: PhysicsMaterial | null = null;

    @serializable
    protected _isTrigger: boolean = false;

    @serializable
    protected readonly _center: Vec3 = new Vec3();

    protected get _assertOnLoadCalled (): boolean {
        const r = this._isOnLoadCalled == 0;
        if (r) { error('[Physics]: Please make sure that the node has been added to the scene'); }
        return !r;
    }

    constructor (type: EColliderType) {
        super();
        this.TYPE = type;
    }

    /// EVENT INTERFACE ///

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
        const ret = super.on(type, callback, target, once);
        this._updateNeedEvent(type);
        return ret;
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
        this._updateNeedEvent();
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
        //TODO: callback invoker now is a entity, after `once` will not calling the upper `off`.
        const ret = super.once(type, callback, target);
        this._updateNeedEvent(type);
        return ret;
    }

    /**
     * @en
     * Removes all registered events of the specified target or type.
     * @zh
     * 移除所有指定目标或类型的注册事件。
     * @param typeOrTarget - The event type or target.
     */
    public removeAll (typeOrTarget: TriggerEventType | CollisionEventType | {}) {
        super.removeAll(typeOrTarget);
        this._updateNeedEvent();
    }

    /// GROUP MASK ///

    /**
     * @en
     * Gets the group value.
     * @zh
     * 获取分组值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getGroup (): number {
        if (this._assertOnLoadCalled) {
            return this._shape!.getGroup();
        }
        return 0;
    }

    /**
     * @en
     * Sets the group value.
     * @zh
     * 设置分组值。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public setGroup (v: number): void {
        if (this._assertOnLoadCalled) {
            this._shape!.setGroup(v);
        }
    }

    /**
     * @en
     * Add a grouping value to fill in the group you want to join.
     * @zh
     * 添加分组值，可填要加入的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addGroup (v: number) {
        if (this._assertOnLoadCalled) {
            this._shape!.addGroup(v);
        }
    }

    /**
     * @en
     * Subtract the grouping value to fill in the group to be removed.
     * @zh
     * 减去分组值，可填要移除的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public removeGroup (v: number) {
        if (this._assertOnLoadCalled) {
            this._shape!.removeGroup(v);
        }
    }

    /**
     * @en
     * Gets the mask value.
     * @zh
     * 获取掩码值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getMask (): number {
        if (this._assertOnLoadCalled) {
            return this._shape!.getMask();
        }
        return 0;
    }

    /**
     * @en
     * Sets the mask value.
     * @zh
     * 设置掩码值。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public setMask (v: number) {
        if (this._assertOnLoadCalled) {
            this._shape!.setMask(v);
        }
    }

    /**
     * @en
     * Add mask values to fill in groups that need to be checked.
     * @zh
     * 添加掩码值，可填入需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addMask (v: number) {
        if (this._assertOnLoadCalled) {
            this._shape!.addMask(v);
        }
    }

    /**
     * @en
     * Subtract the mask value to fill in the group that does not need to be checked.
     * @zh
     * 减去掩码值，可填入不需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public removeMask (v: number) {
        if (this._assertOnLoadCalled) {
            this._shape!.removeMask(v);
        }
    }


    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        if (!EDITOR) {
            this._shape = createShape(this.TYPE);
            this._shape.initialize(this);
            this.sharedMaterial = this._material == null ? PhysicsSystem.instance.defaultMaterial : this._material;
            this._shape.onLoad!();
        }
    }

    protected onEnable () {
        if (this._shape) {
            this._shape.onEnable!();
        }
    }

    protected onDisable () {
        if (this._shape) {
            this._shape.onDisable!();
        }
    }

    protected onDestroy () {
        if (this._shape) {
            if (this._material) {
                this._material.off('physics_material_update', this._updateMaterial, this);
            }
            this._shape.onDestroy!();
        }
        if (this._boundingSphere) this._boundingSphere.destroy();
    }

    private _updateMaterial () {
        if (this._shape) {
            this._shape.setMaterial(this._material);
        }
    }

    private _updateNeedEvent (type?: string) {
        if (this.isValid) {
            if (type !== undefined) {
                if (type == 'onCollisionEnter' || type == 'onCollisionStay' || type == 'onCollisionExit') {
                    this._needCollisionEvent = true;
                }
                if (type == 'onTriggerEnter' || type == 'onTriggerStay' || type == 'onTriggerExit') {
                    this._needTriggerEvent = true;
                }
            } else {
                if (!(this.hasEventListener('onTriggerEnter') || this.hasEventListener('onTriggerStay') || this.hasEventListener('onTriggerExit'))) {
                    this._needTriggerEvent = false;
                }
                if (!(this.hasEventListener('onCollisionEnter') || this.hasEventListener('onCollisionStay') || this.hasEventListener('onCollisionExit'))) {
                    this._needCollisionEvent = false;
                }
            }
        }
    }
}

export namespace Collider {
    export type Type = EnumAlias<typeof EColliderType>;
    export type Axis = EnumAlias<typeof EAxisDirection>;
}

function findAttachedBody (node: Node): RigidBody | null {
    const rb = node.getComponent(RigidBody);
    if (rb && rb.isValid) {
        return rb;
    } else {
        return null;
        // if (node.parent == null || node.parent == node.scene) return null;
        // return findAttachedBody(node.parent);
    }
}
