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

import {
    ccclass,
    disallowMultiple,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../../platform/CCClassDecorator';
import { Vec3 } from '../../../../value-types';
import { IRigidBody } from '../../spec/I-rigid-body';
import { createRigidBody } from '../instance';

/**
 * !#en
 * Rigid body assembly.
 * !#zh
 * 刚体组件。
 */
@ccclass('cc.RigidBodyComponent')
@executionOrder(99)
@menu('i18n:MAIN_MENU.component.physics/Rigid Body 3D')
@executeInEditMode
@disallowMultiple
export class RigidBodyComponent extends cc.Component {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * !#en
     * Gets or sets whether sleep is allowed
     * !#zh
     * 获取或设置是否允许休眠
     */
    public get allowSleep (): boolean {
        return this._allowSleep;
    }

    public set allowSleep (v: boolean) {
        this._allowSleep = v;
        if (!CC_EDITOR) {
            this._body.allowSleep = v;
        }
    }

    /**
     * !#en
     * Gets or sets the mass of the rigid body.
     * !#zh
     * 获取或设置刚体的质量。
     */
    @property({
        displayOrder: 0
    })
    public get mass () {
        return this._mass;
    }

    public set mass (value) {
        this._mass = value;
        if (!CC_EDITOR) {
            this._body.mass = value;
        }
    }

    /**
     * !#en
     * Gets or sets linear damping.
     * !#zh
     * 获取或设置线性阻尼。
     */
    @property({
        displayOrder: 1
    })
    public get linearDamping () {
        return this._linearDamping;
    }

    public set linearDamping (value) {
        this._linearDamping = value;
        if (!CC_EDITOR) {
            this._body.linearDamping = value;
        }
    }

    /**
     * !#en
     * Gets or sets rotational damping.
     * !#zh
     * 获取或设置旋转阻尼。
     */
    @property({
        displayOrder: 2
    })
    public get angularDamping () {
        return this._angularDamping;
    }

    public set angularDamping (value) {
        this._angularDamping = value;
        if (!CC_EDITOR) {
            this._body.angularDamping = value;
        }
    }

    /**
     * !#en
     * Gets or sets whether the rigid body is controlled by a physical system.
     * !#zh
     * 获取或设置刚体是否由物理系统控制运动。
     */
    @property({
        displayOrder: 3
    })
    public get isKinematic () {
        return this._isKinematic;
    }

    public set isKinematic (value) {
        this._isKinematic = value;
        if (!CC_EDITOR) {
            this._body.isKinematic = value;
        }
    }

    /**
     * !#en
     * Gets or sets whether the rigid body uses gravity.
     * !#zh
     * 获取或设置刚体是否使用重力。
     */
    @property({
        displayOrder: 4
    })
    public get useGravity () {
        return this._useGravity;
    }

    public set useGravity (value) {
        this._useGravity = value;
        if (!CC_EDITOR) {
            this._body.useGravity = value;
        }
    }

    /**
     * !#en
     * Gets or sets whether the rigid body is fixed for rotation.
     * !#zh
     * 获取或设置刚体是否固定旋转。
     */
    @property({
        displayOrder: 5
    })
    public get fixedRotation () {
        return this._fixedRotation;
    }

    public set fixedRotation (value) {
        this._fixedRotation = value;
        if (!CC_EDITOR) {
            this._body.fixedRotation = value;
        }
    }

    /**
     * !#en
     * Gets or sets a factor of linear velocity that can be used to control the scaling of velocity in each axis direction.
     * !#zh
     * 获取或设置线性速度的因子，可以用来控制每个轴方向上的速度的缩放。
     */
    @property({
        displayOrder: 6
    })
    public get linearFactor () {
        return this._linearFactor;
    }

    public set linearFactor (value: Vec3) {
        Vec3.copy(this._linearFactor, value);
        if (!CC_EDITOR) {
            this._body.linearFactor = this._linearFactor;
        }
    }

    /**
     * !#en
     * Gets or sets the rotation speed factor that can be used to control the rotation speed scaling in each axis direction.
     * !#zh
     * 获取或设置旋转速度的因子，可以用来控制每个轴方向上的旋转速度的缩放。
     */
    @property({
        displayOrder: 7
    })
    public get angularFactor () {
        return this._angularFactor;
    }

    public set angularFactor (value: Vec3) {
        Vec3.copy(this._angularFactor, value);
        if (!CC_EDITOR) {
            this._body.angularFactor = this._angularFactor;
        }
    }

    /**
     * !#en
     * Gets whether the state is awakened.
     * !#zh
     * 获取是否是唤醒的状态。
     */
    public get isAwake (): boolean {
        if (this._assertOnload) {
            return this._body.isAwake;
        }
        return false;
    }

    /**
     * !#en
     * Gets whether or not a dormant state can be entered.
     * !#zh
     * 获取是否是可进入休眠的状态。
     */
    public get isSleepy (): boolean {
        if (this._assertOnload) {
            return this._body.isSleepy;
        }
        return false;
    }

    /**
     * !#en
     * Gets whether the state is dormant.
     * !#zh
     * 获取是否是正在休眠的状态。
     */
    public get isSleeping (): boolean {
        if (this._assertOnload) {
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
        if (r) { cc.error('Physics Error: Please make sure that the node has been added to the scene'); }
        return !r;
    }

    constructor () {
        super();
        if (!CC_EDITOR ) {
            this._body = createRigidBody();
        }
    }

    /// COMPONENT LIFECYCLE ///

    protected __preload () {
        if (!CC_EDITOR) {
            this._body.__preload!(this);
        }
    }

    protected onEnable () {
        if (!CC_EDITOR) {
            this._body.onEnable!();
        }
    }

    protected onDisable () {
        if (!CC_EDITOR) {
            this._body.onDisable!();
        }
    }

    protected onDestroy () {
        if (!CC_EDITOR) {
            this._body.onDestroy!();
        }
    }

    /// PUBLIC METHOD ///

    /**
     * !#en
     * A force is applied to a rigid body at a point in world space.
     * !#zh
     * 在世界空间中的某点上对刚体施加一个作用力。
     * @param force
     * @param relativePoint The point of action, relative to the center of the rigid body
     */
    public applyForce (force: Vec3, relativePoint?: Vec3) {
        if (this._assertOnload) {
            this._body.applyForce(force, relativePoint);
        }
    }

    /**
     * !#en
     * Apply a force on the rigid body at a point in local space.
     * !#zh
     * 在本地空间中的某点上对刚体施加一个作用力。
     * @param force 
     * @param localPoint Point of application
     */
    public applyLocalForce (force: Vec3, localPoint?: Vec3) {
        if (this._assertOnload) {
            this._body.applyLocalForce(force, localPoint);
        }
    }

    /**
     * !#en
     * Apply an impulse to a rigid body at a point in world space.
     * !#zh
     * 在世界空间的某点上对刚体施加一个冲量。
     * @param impulse
     * @param relativePoint The point of action, relative to the center of the rigid body
     */
    public applyImpulse (impulse: Vec3, relativePoint?: Vec3) {
        if (this._assertOnload) {
            this._body.applyImpulse(impulse, relativePoint);
        }
    }

    /**
     * !#en
     * Apply an impulse to the rigid body at a point in local space.
     * !#zh
     * 在本地空间的某点上对刚体施加一个冲量。
     * @param impulse
     * @param localPoint Point of application
     */
    public applyLocalImpulse (impulse: Vec3, localPoint?: Vec3) {
        if (this._assertOnload) {
            this._body.applyLocalImpulse(impulse, localPoint);
        }
    }

    public applyTorque (torque: Vec3) {
        if (this._assertOnload) {
            this._body.applyTorque(torque);
        }
    }

    public applyLocalTorque (torque: Vec3) {
        if (this._assertOnload) {
            this._body.applyLocalTorque(torque);
        }
    }

    /**
     * !#en
     * Awaken the rigid body.
     * !#zh
     * 唤醒刚体。
     */
    public wakeUp () {
        if (this._assertOnload) {
            this._body.wakeUp();
        }
    }

    /**
     * !#en
     * Dormant rigid body.
     * !#zh
     * 休眠刚体。
     */
    public sleep () {
        if (this._assertOnload) {
            this._body.sleep();
        }
    }

    /**
     * !#en
     * Get linear velocity.
     * !#zh
     * 获取线性速度。
     * @param out Vec3
     */
    public getLinearVelocity (out: Vec3) {
        if (this._assertOnload) {
            this._body.getLinearVelocity(out);
        }
    }

    /**
     * !#en
     * Set linear speed.
     * !#zh
     * 设置线性速度。
     * @param value Vec3
     */
    public setLinearVelocity (value: Vec3): void {
        if (this._assertOnload) {
            this._body.setLinearVelocity(value);
        }
    }

    /**
     * !#en
     * Gets the rotation speed.
     * !#zh
     * 获取旋转速度。
     * @param out Vec3
     */
    public getAngularVelocity (out: Vec3) {
        if (this._assertOnload) {
            this._body.getAngularVelocity(out);
        }
    }

    /**
     * !#en
     * Set rotation speed.
     * !#zh
     * 设置旋转速度。
     * @param value Vec3
     */
    public setAngularVelocity (value: Vec3): void {
        if (this._assertOnload) {
            this._body.setAngularVelocity(value);
        }
    }
}
