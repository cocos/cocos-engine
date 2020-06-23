/**
 * 物理模块
 * @category physics
 */

import {
    ccclass,
    help,
    disallowMultiple,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../core/data/class-decorator';
import { Vec3 } from '../../../core/math';
import { Component, error } from '../../../core';
import { IRigidBody } from '../../spec/i-rigid-body';
import { createRigidBody } from '../instance';
import { EDITOR, PHYSICS_BUILTIN } from 'internal:constants';


/**
 * @en
 * Rigid body component.
 * @zh
 * 刚体组件。
 */
@ccclass('cc.RigidBodyComponent')
@help('i18n:cc.RigidBodyComponent')
@executionOrder(99)
@menu('Physics/RigidBody')
@executeInEditMode
@disallowMultiple
export class RigidBodyComponent extends Component {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets whether hibernation is allowed.
     * @zh
     * 获取或设置是否允许休眠。
     */
    // @property({
    //     displayOrder: -1,
    // })
    public get allowSleep (): boolean {
        return this._allowSleep;
    }

    public set allowSleep (v: boolean) {
        this._allowSleep = v;
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body.setAllowSleep(v);
        }
    }

    /**
     * @en
     * Gets or sets the mass of the rigid body.
     * @zh
     * 获取或设置刚体的质量。
     */
    @property({
        displayOrder: 0,
        tooltip: '刚体的质量',
    })
    public get mass () {
        return this._mass;
    }

    public set mass (value) {
        this._mass = value;
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body.setMass(value);
        }
    }

    /**
     * @en
     * Gets or sets linear damping.
     * @zh
     * 获取或设置线性阻尼。
     */
    @property({
        displayOrder: 1,
        tooltip: '线性阻尼',
    })
    public get linearDamping () {
        return this._linearDamping;
    }

    public set linearDamping (value) {
        this._linearDamping = value;
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body.setLinearDamping(value);
        }
    }

    /**
     * @en
     * Gets or sets the rotation damping.
     * @zh
     * 获取或设置旋转阻尼。
     */
    @property({
        displayOrder: 2,
        tooltip: '旋转阻尼',
    })
    public get angularDamping () {
        return this._angularDamping;
    }

    public set angularDamping (value) {
        this._angularDamping = value;
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body.setAngularDamping(value);
        }
    }

    /**
     * @en
     * Gets or sets whether a rigid body is controlled by a physical system.
     * @zh
     * 获取或设置刚体是否由物理系统控制运动。
     */
    @property({
        displayOrder: 3,
        tooltip: '刚体是否由物理系统控制运动',
    })
    public get isKinematic () {
        return this._isKinematic;
    }

    public set isKinematic (value) {
        this._isKinematic = value;
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body.setIsKinematic(value);
        }
    }

    /**
     * @en
     * Gets or sets whether a rigid body uses gravity.
     * @zh
     * 获取或设置刚体是否使用重力。
     */
    @property({
        displayOrder: 4,
        tooltip: '刚体是否使用重力',
    })
    public get useGravity () {
        return this._useGravity;
    }

    public set useGravity (value) {
        this._useGravity = value;
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body.useGravity(value);
        }
    }

    /**
     * @en
     * Gets or sets whether the rigid body is fixed for rotation.
     * @zh
     * 获取或设置刚体是否固定旋转。
     */
    @property({
        displayOrder: 5,
        tooltip: '刚体是否固定旋转',
    })
    public get fixedRotation () {
        return this._fixedRotation;
    }

    public set fixedRotation (value) {
        this._fixedRotation = value;
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body.fixRotation(value);
        }
    }

    /**
     * @en
     * Gets or sets the linear velocity factor that can be used to control the scaling of the velocity in each axis direction.
     * @zh
     * 获取或设置线性速度的因子，可以用来控制每个轴方向上的速度的缩放。
     */
    @property({
        displayOrder: 6,
        tooltip: '线性速度的因子，可以用来控制每个轴方向上的速度的缩放',
    })
    public get linearFactor () {
        return this._linearFactor;
    }

    public set linearFactor (value: Vec3) {
        Vec3.copy(this._linearFactor, value);
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body.setLinearFactor(this._linearFactor);
        }
    }

    /**
     * @en
     * Gets or sets the rotation speed factor that can be used to control the scaling of the rotation speed in each axis direction.
     * @zh
     * 获取或设置旋转速度的因子，可以用来控制每个轴方向上的旋转速度的缩放。
     */
    @property({
        displayOrder: 7,
        tooltip: '旋转速度的因子，可以用来控制每个轴方向上的旋转速度的缩放',
    })
    public get angularFactor () {
        return this._angularFactor;
    }

    public set angularFactor (value: Vec3) {
        Vec3.copy(this._angularFactor, value);
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body.setAngularFactor(this._angularFactor);
        }
    }

    /**
     * @en
     * Gets whether it is the state of awake.
     * @zh
     * 获取是否是唤醒的状态。
     */
    public get isAwake (): boolean {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            return this._body.isAwake;
        }
        return false;
    }

    /**
     * @en
     * Gets whether you can enter a dormant state.
     * @zh
     * 获取是否是可进入休眠的状态。
     */
    public get isSleepy (): boolean {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            return this._body.isSleepy;
        }
        return false;
    }

    /**
     * @en
     * Gets whether the state is dormant.
     * @zh
     * 获取是否是正在休眠的状态。
     */
    public get isSleeping (): boolean {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            return this._body.isSleeping;
        }
        return false;
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    public get body () {
        return this._body;
    }

    private _body!: IRigidBody;

    /// PRIVATE PROPERTY ///

    // @property
    private _allowSleep: boolean = true;

    @property
    private _mass: number = 1;

    @property
    private _linearDamping: number = 0.1;

    @property
    private _angularDamping: number = 0.1;

    @property
    private _fixedRotation: boolean = false;

    @property
    private _isKinematic: boolean = false;

    @property
    private _useGravity: boolean = true;

    @property
    private _linearFactor: Vec3 = new Vec3(1, 1, 1);

    @property
    private _angularFactor: Vec3 = new Vec3(1, 1, 1);

    protected get _assertOnload (): boolean {
        const r = this._isOnLoadCalled == 0;
        if (r) { error('[Physics]: Please make sure that the node has been added to the scene'); }
        return !r;
    }

    constructor () {
        super();
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body = createRigidBody();
        }
    }

    /// COMPONENT LIFECYCLE ///

    protected __preload () {
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body.initialize(this);
        }
    }

    protected onEnable () {
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body.onEnable!();
        }
    }

    protected onDisable () {
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body.onDisable!();
        }
    }

    protected onDestroy () {
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this._body.onDestroy!();
        }
    }

    /// PUBLIC METHOD ///

    /**
     * @en
     * Apply force to a world point. This could, for example, be a point on the Body surface.
     * @zh
     * 在世界空间中，相对于刚体的质心的某点上对刚体施加作用力。
     * @param force - 作用力
     * @param relativePoint - 作用点，相对于刚体的质心
     */
    public applyForce (force: Vec3, relativePoint?: Vec3) {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.applyForce(force, relativePoint);
        }
    }

    /**
     * @en
     * Apply force to a local point. This could, for example, be a point on the Body surface.
     * @zh
     * 在本地空间中，相对于刚体的质心的某点上对刚体施加作用力。
     * @param force - 作用力
     * @param localPoint - 作用点
     */
    public applyLocalForce (force: Vec3, localPoint?: Vec3) {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.applyLocalForce(force, localPoint);
        }
    }

    /**
     * @en
     * In world space, impulse is applied to the rigid body at some point relative to the center of mass of the rigid body.
     * @zh
     * 在世界空间中，相对于刚体的质心的某点上对刚体施加冲量。
     * @param impulse - 冲量
     * @param relativePoint - 作用点，相对于刚体的中心点
     */
    public applyImpulse (impulse: Vec3, relativePoint?: Vec3) {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.applyImpulse(impulse, relativePoint);
        }
    }

    /**
     * @en
     * In local space, impulse is applied to the rigid body at some point relative to the center of mass of the rigid body.
     * @zh
     * 在本地空间中，相对于刚体的质心的某点上对刚体施加冲量。
     * @param impulse - 冲量
     * @param localPoint - 作用点
     */
    public applyLocalImpulse (impulse: Vec3, localPoint?: Vec3) {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.applyLocalImpulse(impulse, localPoint);
        }
    }

    /**
     * @en
     * In world space, torque is applied to the rigid body.
     * @zh
     * 在世界空间中，对刚体施加扭矩。
     * @param torque - 扭矩
     */
    public applyTorque (torque: Vec3) {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.applyTorque(torque);
        }
    }

    /**
     * @zh
     * 在本地空间中，对刚体施加扭矩。
     * @param torque - 扭矩
     */
    public applyLocalTorque (torque: Vec3) {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.applyLocalTorque(torque);
        }
    }

    /**
     * @en
     * Wake up the rigid body.
     * @zh
     * 唤醒刚体。
     */
    public wakeUp () {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.wakeUp();
        }
    }

    /**
     * @en
     * Dormancy of rigid body.
     * @zh
     * 休眠刚体。
     */
    public sleep () {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.sleep();
        }
    }

    /**
     * @en
     * Gets the linear velocity.
     * @zh
     * 获取线性速度。
     * @param out 速度 Vec3
     */
    public getLinearVelocity (out: Vec3) {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.getLinearVelocity(out);
        }
    }

    /**
     * @en
     * Sets the linear velocity.
     * @zh
     * 设置线性速度。
     * @param value 速度 Vec3
     */
    public setLinearVelocity (value: Vec3): void {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.setLinearVelocity(value);
        }
    }

    /**
     * @en
     * Gets the angular velocity.
     * @zh
     * 获取旋转速度。
     * @param out 速度 Vec3
     */
    public getAngularVelocity (out: Vec3) {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.getAngularVelocity(out);
        }
    }

    /**
     * @en
     * Sets the angular velocity.
     * @zh
     * 设置旋转速度。
     * @param value 速度 Vec3
     */
    public setAngularVelocity (value: Vec3): void {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.setAngularVelocity(value);
        }
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
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body!.setGroup(v);
        }
    }

    /**
     * @en
     * Gets the group value.
     * @zh
     * 获取分组值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getGroup (): number {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            return this._body.getGroup();
        }
        return 0;
    }

    /**
     * @en
     * Add a grouping value to fill in the group you want to join.
     * @zh
     * 添加分组值，可填要加入的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addGroup (v: number) {
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.addGroup(v);
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
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.removeGroup(v);
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
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            return this._body.getMask();
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
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.setMask(v);
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
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.addMask(v);
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
        if (!PHYSICS_BUILTIN && this._assertOnload) {
            this._body.removeMask(v);
        }
    }

}
