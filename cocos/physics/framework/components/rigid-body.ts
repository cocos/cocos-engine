/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable func-names */
/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
 */

/**
 * @packageDocumentation
 * @module physics
 */

import {
    ccclass,
    help,
    disallowMultiple,
    executeInEditMode,
    menu,
    executionOrder,
    tooltip,
    displayOrder,
    visible,
    type,
    serializable,
} from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { Vec3 } from '../../../core/math';
import { Component, error, warn } from '../../../core';
import { IRigidBody } from '../../spec/i-rigid-body';
import { selector, createRigidBody } from '../physics-selector';
import { ERigidBodyType } from '../physics-enum';
import { PhysicsSystem } from '../physics-system';

/**
 * @en
 * Rigid body component.
 * @zh
 * 刚体组件。
 */
@ccclass('cc.RigidBody')
@help('i18n:cc.RigidBody')
@menu('Physics/RigidBody')
@executeInEditMode
@disallowMultiple
@executionOrder(-1)
export class RigidBody extends Component {
    /**
     * @en
     * Enumeration of rigid body types.
     * @zh
     * 刚体类型的枚举。
     */
    static readonly Type = ERigidBodyType;

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the group of the rigid body.
     * @zh
     * 获取或设置分组。
     */
    @type(PhysicsSystem.PhysicsGroup)
    @displayOrder(-2)
    @tooltip('i18n:physics3d.rigidbody.group')
    public get group (): number {
        return this._group;
    }

    public set group (v: number) {
        if (DEBUG && !Number.isInteger(Math.log2(v >>> 0))) warn('[Physics]: The group should only have one bit.');
        this._group = v;
        if (this._body) {
            // The judgment is added here because the data exists in two places
            if (this._body.getGroup() !== v) this._body.setGroup(v);
        }
    }

    /**
     * @en
     * Gets or sets the type of rigid body.
     * @zh
     * 获取或设置刚体类型。
     */
    @type(ERigidBodyType)
    @displayOrder(-1)
    @tooltip('i18n:physics3d.rigidbody.type')
    public get type (): ERigidBodyType {
        return this._type;
    }

    public set type (v: ERigidBodyType) {
        if (this._type === v) return;
        this._type = v;
        if (this._body) this._body.setType(v);
    }

    /**
     * @en
     * Gets or sets the mass of the rigid body.
     * @zh
     * 获取或设置刚体的质量。
     */
    @visible(isDynamicBody)
    @displayOrder(0)
    @tooltip('i18n:physics3d.rigidbody.mass')
    public get mass () {
        return this._mass;
    }

    public set mass (value) {
        if (DEBUG && value <= 0) warn('[Physics]: The mass should be greater than zero.');
        if (this._mass === value) return;
        value = value <= 0 ? 0.0001 : value;
        this._mass = value;
        if (this._body) this._body.setMass(value);
    }

    /**
     * @en
     * Gets or sets whether hibernation is allowed.
     * @zh
     * 获取或设置是否允许休眠。
     */
    @visible(isDynamicBody)
    @displayOrder(0.5)
    @tooltip('i18n:physics3d.rigidbody.allowSleep')
    public get allowSleep (): boolean {
        return this._allowSleep;
    }

    public set allowSleep (v: boolean) {
        this._allowSleep = v;
        if (this._body) this._body.setAllowSleep(v);
    }

    /**
     * @en
     * Gets or sets linear damping.
     * @zh
     * 获取或设置线性阻尼。
     */
    @visible(isDynamicBody)
    @displayOrder(1)
    @tooltip('i18n:physics3d.rigidbody.linearDamping')
    public get linearDamping () {
        return this._linearDamping;
    }

    public set linearDamping (value) {
        if (DEBUG && (value < 0 || value > 1)) warn('[Physics]: The damping should be between zero to one.');
        this._linearDamping = value;
        if (this._body) this._body.setLinearDamping(value);
    }

    /**
     * @en
     * Gets or sets the rotation damping.
     * @zh
     * 获取或设置旋转阻尼。
     */
    @visible(isDynamicBody)
    @displayOrder(2)
    @tooltip('i18n:physics3d.rigidbody.angularDamping')
    public get angularDamping () {
        return this._angularDamping;
    }

    public set angularDamping (value) {
        if (DEBUG && (value < 0 || value > 1)) warn('[Physics]: The damping should be between zero to one.');
        this._angularDamping = value;
        if (this._body) this._body.setAngularDamping(value);
    }

    /**
     * @en
     * Gets or sets whether a rigid body uses gravity.
     * @zh
     * 获取或设置刚体是否使用重力。
     */
    @visible(isDynamicBody)
    @displayOrder(4)
    @tooltip('i18n:physics3d.rigidbody.useGravity')
    public get useGravity () {
        return this._useGravity;
    }

    public set useGravity (value) {
        this._useGravity = value;
        if (this._body) this._body.useGravity(value);
    }

    /**
     * @en
     * Gets or sets the linear velocity factor that can be used to control the scaling of the velocity in each axis direction.
     * @zh
     * 获取或设置线性速度的因子，可以用来控制每个轴方向上的速度的缩放。
     */
    @visible(isDynamicBody)
    @displayOrder(6)
    @tooltip('i18n:physics3d.rigidbody.linearFactor')
    public get linearFactor () {
        return this._linearFactor;
    }

    public set linearFactor (value: Vec3) {
        Vec3.copy(this._linearFactor, value);
        if (this._body) {
            this._body.setLinearFactor(this._linearFactor);
        }
    }

    /**
     * @en
     * Gets or sets the rotation speed factor that can be used to control the scaling of the rotation speed in each axis direction.
     * @zh
     * 获取或设置旋转速度的因子，可以用来控制每个轴方向上的旋转速度的缩放。
     */
    @visible(isDynamicBody)
    @displayOrder(7)
    @tooltip('i18n:physics3d.rigidbody.angularFactor')
    public get angularFactor () {
        return this._angularFactor;
    }

    public set angularFactor (value: Vec3) {
        Vec3.copy(this._angularFactor, value);
        if (this._body) {
            this._body.setAngularFactor(this._angularFactor);
        }
    }

    /**
     * @en
     * Gets or sets the speed threshold for going to sleep.
     * @zh
     * 获取或设置进入休眠的速度临界值。
     */
    public get sleepThreshold (): number {
        if (this._isInitialized) {
            return this._body!.getSleepThreshold();
        }
        return 0.1;
    }

    public set sleepThreshold (v: number) {
        if (this._isInitialized) {
            this._body!.setSleepThreshold(v);
        }
    }

    /**
     * @en
     * Turning on or off continuous collision detection.
     * @zh
     * 开启或关闭连续碰撞检测。
     */
    public get useCCD (): boolean {
        if (this._isInitialized) {
            return this._body!.isUseCCD();
        }
        return false;
    }

    public set useCCD (v: boolean) {
        if (this._isInitialized) {
            this._body!.useCCD(v);
        }
    }

    /**
     * @en
     * Gets whether it is the state of awake.
     * @zh
     * 获取是否是唤醒的状态。
     */
    public get isAwake (): boolean {
        if (this._isInitialized) return this._body!.isAwake;
        return false;
    }

    /**
     * @en
     * Gets whether you can enter a dormant state.
     * @zh
     * 获取是否是可进入休眠的状态。
     */
    public get isSleepy (): boolean {
        if (this._isInitialized) return this._body!.isSleepy;
        return false;
    }

    /**
     * @en
     * Gets whether the state is dormant.
     * @zh
     * 获取是否是正在休眠的状态。
     */
    public get isSleeping (): boolean {
        if (this._isInitialized) return this._body!.isSleeping;
        return false;
    }

    /**
     * @en
     * Gets or sets whether the rigid body is static.
     * @zh
     * 获取或设置刚体是否是静态类型的（静止不动的）。
     */
    public get isStatic (): boolean {
        return this._type === ERigidBodyType.STATIC;
    }

    public set isStatic (v: boolean) {
        if ((v && this.isStatic) || (!v && !this.isStatic)) return;
        this.type = v ? ERigidBodyType.STATIC : ERigidBodyType.DYNAMIC;
    }

    /**
     * @en
     * Gets or sets whether the rigid body moves through physical dynamics.
     * @zh
     * 获取或设置刚体是否是动力学态类型的（将根据物理动力学控制运动）。
     */
    public get isDynamic (): boolean {
        return this._type === ERigidBodyType.DYNAMIC;
    }

    public set isDynamic (v: boolean) {
        if ((v && this.isDynamic) || (!v && !this.isDynamic)) return;
        this.type = v ? ERigidBodyType.DYNAMIC : ERigidBodyType.KINEMATIC;
    }

    /**
     * @en
     * Gets or sets whether a rigid body is controlled by users.
     * @zh
     * 获取或设置刚体是否是运动态类型的（将由用户来控制运动）。
     */
    public get isKinematic () {
        return this._type === ERigidBodyType.KINEMATIC;
    }

    public set isKinematic (v: boolean) {
        if ((v && this.isKinematic) || (!v && !this.isKinematic)) return;
        this.type = v ? ERigidBodyType.KINEMATIC : ERigidBodyType.DYNAMIC;
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

    private _body: IRigidBody | null = null;

    /// PRIVATE PROPERTY ///

    @serializable
    private _group: number = PhysicsSystem.PhysicsGroup.DEFAULT;

    @serializable
    private _type: ERigidBodyType = ERigidBodyType.DYNAMIC;

    @serializable
    private _mass = 1;

    @serializable
    private _allowSleep = true;

    @serializable
    private _linearDamping = 0.1;

    @serializable
    private _angularDamping = 0.1;

    @serializable
    private _useGravity = true;

    @serializable
    private _linearFactor: Vec3 = new Vec3(1, 1, 1);

    @serializable
    private _angularFactor: Vec3 = new Vec3(1, 1, 1);

    protected get _isInitialized (): boolean {
        const r = this._body === null;
        if (r) { error('[Physics]: This component has not been call onLoad yet, please make sure the node has been added to the scene.'); }
        return !r;
    }

    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        if (!selector.runInEditor) return;
        this._body = createRigidBody();
        this._body.initialize(this);
    }

    protected onEnable () {
        if (this._body) this._body.onEnable!();
    }

    protected onDisable () {
        if (this._body) this._body.onDisable!();
    }

    protected onDestroy () {
        if (this._body) this._body.onDestroy!();
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
        if (this._isInitialized) this._body!.applyForce(force, relativePoint);
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
        if (this._isInitialized) this._body!.applyLocalForce(force, localPoint);
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
        if (this._isInitialized) this._body!.applyImpulse(impulse, relativePoint);
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
        if (this._isInitialized) this._body!.applyLocalImpulse(impulse, localPoint);
    }

    /**
     * @en
     * In world space, torque is applied to the rigid body.
     * @zh
     * 在世界空间中，对刚体施加扭矩。
     * @param torque - 扭矩
     */
    public applyTorque (torque: Vec3) {
        if (this._isInitialized) this._body!.applyTorque(torque);
    }

    /**
     * @zh
     * 在本地空间中，对刚体施加扭矩。
     * @param torque - 扭矩
     */
    public applyLocalTorque (torque: Vec3) {
        if (this._isInitialized) this._body!.applyLocalTorque(torque);
    }

    /**
     * @en
     * Wake up the rigid body.
     * @zh
     * 唤醒刚体。
     */
    public wakeUp () {
        if (this._isInitialized) this._body!.wakeUp();
    }

    /**
     * @en
     * Dormancy of rigid body.
     * @zh
     * 休眠刚体。
     */
    public sleep () {
        if (this._isInitialized) this._body!.sleep();
    }

    /**
     * @en
     * Clear the forces and velocity of the rigid body.
     * @zh
     * 清除刚体受到的力和速度。
     */
    public clearState () {
        if (this._isInitialized) this._body!.clearState();
    }

    /**
     * @en
     * Clear the forces of the rigid body.
     * @zh
     * 清除刚体受到的力。
     */
    public clearForces () {
        if (this._isInitialized) this._body!.clearForces();
    }

    /**
     * @en
     * Clear velocity of the rigid body.
     * @zh
     * 清除刚体的速度。
     */
    public clearVelocity () {
        if (this._isInitialized) this._body!.clearVelocity();
    }

    /**
     * @en
     * Gets the linear velocity.
     * @zh
     * 获取线性速度。
     * @param out 速度 Vec3
     */
    public getLinearVelocity (out: Vec3) {
        if (this._isInitialized) this._body!.getLinearVelocity(out);
    }

    /**
     * @en
     * Sets the linear velocity.
     * @zh
     * 设置线性速度。
     * @param value 速度 Vec3
     */
    public setLinearVelocity (value: Vec3): void {
        if (this._isInitialized) this._body!.setLinearVelocity(value);
    }

    /**
     * @en
     * Gets the angular velocity.
     * @zh
     * 获取旋转速度。
     * @param out 速度 Vec3
     */
    public getAngularVelocity (out: Vec3) {
        if (this._isInitialized) this._body!.getAngularVelocity(out);
    }

    /**
     * @en
     * Sets the angular velocity.
     * @zh
     * 设置旋转速度。
     * @param value 速度 Vec3
     */
    public setAngularVelocity (value: Vec3): void {
        if (this._isInitialized) this._body!.setAngularVelocity(value);
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
        if (this._isInitialized) return this._body!.getGroup();
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
        if (this._isInitialized) this._body!.setGroup(v);
    }

    /**
     * @en
     * Add a grouping value to fill in the group you want to join.
     * @zh
     * 添加分组值，可填要加入的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addGroup (v: number) {
        if (this._isInitialized) this._body!.addGroup(v);
    }

    /**
     * @en
     * Subtract the grouping value to fill in the group to be removed.
     * @zh
     * 减去分组值，可填要移除的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public removeGroup (v: number) {
        if (this._isInitialized) this._body!.removeGroup(v);
    }

    /**
     * @en
     * Gets the mask value.
     * @zh
     * 获取掩码值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getMask (): number {
        if (this._isInitialized) return this._body!.getMask();
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
        if (this._isInitialized) this._body!.setMask(v);
    }

    /**
     * @en
     * Add mask values to fill in groups that need to be checked.
     * @zh
     * 添加掩码值，可填入需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addMask (v: number) {
        if (this._isInitialized) this._body!.addMask(v);
    }

    /**
     * @en
     * Subtract the mask value to fill in the group that does not need to be checked.
     * @zh
     * 减去掩码值，可填入不需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public removeMask (v: number) {
        if (this._isInitialized) this._body!.removeMask(v);
    }
}

function isDynamicBody (this: RigidBody) { return this.isDynamic; }

export namespace RigidBody {
    export type Type = EnumAlias<typeof ERigidBodyType>;
}
