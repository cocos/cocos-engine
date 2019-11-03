/**
 * 物理模块
 * @category physics
 */

import {
    ccclass,
    disallowMultiple,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../core/data/class-decorator';
import { Vec3 } from '../../../core/math';
import { Component, error } from '../../../core';
import { IRigidBody } from '../../spec/I-rigid-body';
import { createRigidBody } from '../instance';


/**
 * @zh
 * 刚体组件。
 */
@ccclass('cc.RigidBodyComponent')
@executionOrder(99)
@menu('Components/RigidBody')
@executeInEditMode
@disallowMultiple
export class RigidBodyComponent extends Component {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @zh
     * 获取或设置是否允许休眠
     */
    // @property({
    //     displayOrder: -1,
    // })
    public get allowSleep (): boolean {
        return this._allowSleep;
    }

    public set allowSleep (v: boolean) {
        this._allowSleep = v;
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.allowSleep = v;
        }
    }

    /**
     * @zh
     * 获取或设置刚体的质量。
     */
    @property({
        displayOrder: 0,
        tooltip:'刚体的质量',
    })
    public get mass () {
        return this._mass;
    }

    public set mass (value) {
        this._mass = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.mass = value;
        }
    }

    /**
     * @zh
     * 获取或设置线性阻尼。
     */
    @property({
        displayOrder: 1,
        tooltip:'线性阻尼',
    })
    public get linearDamping () {
        return this._linearDamping;
    }

    public set linearDamping (value) {
        this._linearDamping = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.linearDamping = value;
        }
    }

    /**
     * @zh
     * 获取或设置旋转阻尼。
     */
    @property({
        displayOrder: 2,
        tooltip:'旋转阻尼',
    })
    public get angularDamping () {
        return this._angularDamping;
    }

    public set angularDamping (value) {
        this._angularDamping = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.angularDamping = value;
        }
    }

    /**
     * @zh
     * 获取或设置刚体是否由物理系统控制运动。
     */
    @property({
        displayOrder: 3,
        tooltip:'刚体是否由物理系统控制运动',
    })
    public get isKinematic () {
        return this._isKinematic;
    }

    public set isKinematic (value) {
        this._isKinematic = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.isKinematic = value;
        }
    }

    /**
     * @zh
     * 获取或设置刚体是否使用重力。
     */
    @property({
        displayOrder: 4,
        tooltip:'刚体是否使用重力',
    })
    public get useGravity () {
        return this._useGravity;
    }

    public set useGravity (value) {
        this._useGravity = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.useGravity = value;
        }
    }

    /**
     * @zh
     * 获取或设置刚体是否固定旋转。
     */
    @property({
        displayOrder: 5,
        tooltip:'刚体是否固定旋转',
    })
    public get fixedRotation () {
        return this._fixedRotation;
    }

    public set fixedRotation (value) {
        this._fixedRotation = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.fixedRotation = value;
        }
    }

    /**
     * @zh
     * 获取或设置线性速度的因子，可以用来控制每个轴方向上的速度的缩放。
     */
    @property({
        displayOrder: 6,
        tooltip:'线性速度的因子，可以用来控制每个轴方向上的速度的缩放',
    })
    public get linearFactor () {
        return this._linearFactor;
    }

    public set linearFactor (value: Vec3) {
        Vec3.copy(this._linearFactor, value);
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.linearFactor = this._linearFactor;
        }
    }

    /**
     * @zh
     * 获取或设置旋转速度的因子，可以用来控制每个轴方向上的旋转速度的缩放。
     */
    @property({
        displayOrder: 7,
        tooltip:'旋转速度的因子，可以用来控制每个轴方向上的旋转速度的缩放',
    })
    public get angularFactor () {
        return this._angularFactor;
    }

    public set angularFactor (value: Vec3) {
        Vec3.copy(this._angularFactor, value);
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.angularFactor = this._angularFactor;
        }
    }

    /**
     * @zh
     * 获取是否是唤醒的状态。
     */
    public get isAwake (): boolean {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            return this._body.isAwake;
        }
        return false;
    }

    /**
     * @zh
     * 获取是否是可进入休眠的状态。
     */
    public get isSleepy (): boolean {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            return this._body.isSleepy;
        }
        return false;
    }

    /**
     * @zh
     * 获取是否是正在休眠的状态。
     */
    public get isSleeping (): boolean {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            return this._body.isSleeping;
        }
        return false;
    }

    public get rigidBody () {
        return this._body;
    }

    private _body!: IRigidBody;

    /// PRIVATE PROPERTY ///

    // @property
    private _allowSleep: boolean = true;

    @property
    private _mass: number = 10;

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
        if (r) { error('Physics Error: Please make sure that the node has been added to the scene'); }
        return !r;
    }

    constructor () {
        super();
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body = createRigidBody();
        }
    }

    /// COMPONENT LIFECYCLE ///

    protected __preload () {
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.__preload!(this);
        }
    }

    protected onEnable () {
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.onEnable!();
        }
    }

    protected onDisable () {
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.onDisable!();
        }
    }

    protected onDestroy () {
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.onDestroy!();
        }
    }

    /// PUBLIC METHOD ///

    /**
     * @zh
     * 在世界空间中的某点上对刚体施加一个作用力。
     * @param force - 作用力
     * @param relativePoint - 作用点，相对于刚体的中心点
     */
    public applyForce (force: Vec3, relativePoint?: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.applyForce(force, relativePoint);
        }
    }

    /**
     * @zh
     * 在本地空间中的某点上对刚体施加一个作用力。
     * @param force - 作用力
     * @param localPoint - 作用点
     */
    public applyLocalForce (force: Vec3, localPoint?: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.applyLocalForce(force, localPoint);
        }
    }

    /**
     * @zh
     * 在世界空间的某点上对刚体施加一个冲量。
     * @param impulse - 冲量
     * @param relativePoint - 作用点，相对于刚体的中心点
     */
    public applyImpulse (impulse: Vec3, relativePoint?: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.applyImpulse(impulse, relativePoint);
        }
    }

    /**
     * @zh
     * 在本地空间的某点上对刚体施加一个冲量。
     * @param impulse - 冲量
     * @param localPoint - 作用点
     */
    public applyLocalImpulse (impulse: Vec3, localPoint?: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.applyLocalImpulse(impulse, localPoint);
        }
    }

    public applyTorque (torque: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.applyTorque(torque);
        }
    }

    public applyLocalTorque (torque: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.applyLocalTorque(torque);
        }
    }

    /**
     * @zh
     * 唤醒刚体。
     */
    public wakeUp () {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.wakeUp();
        }
    }

    /**
     * @zh
     * 休眠刚体。
     */
    public sleep () {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.sleep();
        }
    }

    /**
     * @zh
     * 获取线性速度。
     * @param out 速度 Vec3
     */
    public getLinearVelocity (out: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.getLinearVelocity(out);
        }
    }

    /**
     * @zh
     * 设置线性速度。
     * @param value 速度 Vec3
     */
    public setLinearVelocity (value: Vec3): void {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.setLinearVelocity(value);
        }
    }

    /**
     * @zh
     * 获取旋转速度。
     * @param out 速度 Vec3
     */
    public getAngularVelocity (out: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.getAngularVelocity(out);
        }
    }

    /**
     * @zh
     * 设置旋转速度。
     * @param value 速度 Vec3
     */
    public setAngularVelocity (value: Vec3): void {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.setAngularVelocity(value);
        }
    }

    /// GROUP MASK ///

    /**
     * @zh
     * 设置分组值。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public setGroup (v: number): void {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body!.setGroup(v);
        }
    }

    /**
     * @zh
     * 获取分组值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getGroup (): number {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            return this._body.getGroup();
        }
        return 0;
    }

    /**
     * @zh
     * 添加分组值，可填要加入的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addGroup (v: number) {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.addGroup(v);
        }
    }

    /**
     * @zh
     * 减去分组值，可填要移除的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public removeGroup (v: number) {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.removeGroup(v);
        }
    }

    /**
     * @zh
     * 获取掩码值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getMask (): number {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            return this._body.getMask();
        }
        return 0;
    }

    /**
     * @zh
     * 设置掩码值。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public setMask (v: number) {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.setMask(v);
        }
    }

    /**
     * @zh
     * 添加掩码值，可填入需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addMask (v: number) {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.addMask(v);
        }
    }

    /**
     * @zh
     * 减去掩码值，可填入不需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public removeMask (v: number) {
        if (!CC_PHYSICS_BUILTIN && this._assertOnload) {
            this._body.removeMask(v);
        }
    }
}
