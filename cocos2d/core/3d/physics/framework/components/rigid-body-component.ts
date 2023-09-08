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

import { IRigidBody } from '../../spec/I-rigid-body';
import { createRigidBody } from '../instance';

const {
    ccclass,
    disallowMultiple,
    executeInEditMode,
    executionOrder,
    menu,
    property,
    help,
} = cc._decorator;
const Vec3 = cc.Vec3;

/**
 * !#en
 * RigidBody is the basic object that make up the physical world, and it can make a node physically affected and react.
 * !#zh
 * 刚体是组成物理世界的基本对象，可以让一个节点受到物理影响并产生反应。该组件在使用 Builtin 物理引擎时无效。
 * @class RigidBody3D
 * @extends Component
 */
@ccclass('cc.RigidBody3D')
@executionOrder(99)
@menu('i18n:MAIN_MENU.component.physics/Rigid Body 3D')
@help('i18n:COMPONENT.help_url.physics-rigidbody')
@executeInEditMode
@disallowMultiple
export class RigidBody3D extends cc.Component {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * !#en
     * Whether sleep is allowed.
     * !#zh
     * 是否允许休眠。
     * @property {boolean} allowSleep
     */
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
     * !#en
     * The mass of the rigidbody.
     * !#zh
     * 刚体的质量。
     * @property {number} mass
     */
    @property({
        displayOrder: 0
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
     * !#en
     * Used to reduce the linear rate of rigidbody. The larger the value, the slower the rigidbody moves.
     * !#zh
     * 线性阻尼，用于减小刚体的线性速率，值越大物体移动越慢。
     * @property {number} linearDamping
     */
    @property({
        displayOrder: 1
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
     * !#en
     * Used to reduce the rotation rate of rigidbody. The larger the value, the slower the rigidbody rotates.
     * !#zh
     * 角阻尼，用于减小刚体的旋转速率，值越大刚体旋转越慢。
     * @property {number} angularDamping
     */
    @property({
        displayOrder: 2
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
     * !#en
     * If enabled, the developer controls the displacement and rotation of the rigidbody, not the physics engine.
     * !#zh
     * 是否由开发者来控制刚体的位移和旋转，而不是受物理引擎的影响。
     * @property {boolean} isKinematic
     */
    @property({
        displayOrder: 3
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
     * !#en
     * If enabled, the rigidbody is affected by gravity.
     * !#zh
     * 如果开启，刚体会受到重力影响。
     * @property {boolean} useGravity
     */
    @property({
        displayOrder: 4
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
     * !#en
     * If enabled, the rigidbody will be fixed without rotation during a collision.
     * !#zh
     * 如果开启，发生碰撞时会固定刚体不产生旋转。
     * @property {boolean} fixedRotation
     */
    @property({
        displayOrder: 5
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
     * !#en
     * It can affect the linear velocity change of the rigidbody in each axis. The larger the value, the faster the rigidbody moves.
     * !#zh
     * 线性因子，可影响刚体在每个轴向的线性速度变化，值越大刚体移动越快。
     * @property {Vec3} linearFactor
     */
    @property({
        displayOrder: 6
    })
    public get linearFactor (): cc.Vec3 {
        return this._linearFactor;
    }

    public set linearFactor (value: cc.Vec3) {
        Vec3.copy(this._linearFactor, value);
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.linearFactor = this._linearFactor;
        }
    }

    /**
     * !#en
     * It can affect the rotation speed change of the rigidbody in each axis. The larger the value, the faster the rigidbody rotates.
     * !#zh
     * 旋转因子，可影响刚体在每个轴向的旋转速度变化，值越大刚体旋转越快。
     * @property {Vec3} angularFactor
     */
    @property({
        displayOrder: 7
    })
    public get angularFactor () {
        return this._angularFactor;
    }

    public set angularFactor (value: cc.Vec3) {
        Vec3.copy(this._angularFactor, value);
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.angularFactor = this._angularFactor;
        }
    }

    /**
     * !#en
     * The rigidbody is awake.
     * !#zh
     * 刚体是否为唤醒的状态。
     * @property {boolean} isAwake
     * @readonly
     */
    public get isAwake (): boolean {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            return this._body.isAwake;
        }
        return false;
    }

    /**
     * !#en
     * The rigidbody can enter hibernation.
     * !#zh
     * 刚体是否为可进入休眠的状态。
     * @property {boolean} isSleepy
     * @readonly
     */
    public get isSleepy (): boolean {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            return this._body.isSleepy;
        }
        return false;
    }

    /**
     * !#en
     * The rigidbody is sleeping.
     * !#zh
     * 刚体是否为正在休眠的状态。
     * @property {boolean} isSleeping
     * @readonly
     */
    public get isSleeping (): boolean {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            return this._body.isSleeping;
        }
        return false;
    }

    /**
     * !#en
     * Get the rigidbody object inside the physics engine.
     * !#zh
     * 获得物理引擎内部刚体对象。
     * @property {IRigidBody} rigidBody
     * @readonly
     */
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
    private _linearFactor: cc.Vec3 = new Vec3(1, 1, 1);

    @property
    private _angularFactor: cc.Vec3 = new Vec3(1, 1, 1);

    protected get _assertOnload (): boolean {
        const r = this._isOnLoadCalled == 0;
        if (r) { cc.error('Physics Error: Please make sure that the node has been added to the scene'); }
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
     * !#en
     * A force is applied to a rigid body at a point in world space.
     * !#zh
     * 在世界空间中的某点上对刚体施加一个作用力。
     * @method applyForce
     * @param {Vec3} force
     * @param {Vec3} relativePoint The point of action, relative to the center of the rigid body.
     */
    public applyForce (force: cc.Vec3, relativePoint?: cc.Vec3) {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.applyForce(force, relativePoint);
        }
    }

    /**
     * !#en
     * Apply a force on the rigid body at a point in local space.
     * !#zh
     * 在本地空间中的某点上对刚体施加一个作用力。
     * @method applyLocalForce
     * @param {Vec3} force 
     * @param {Vec3} localPoint Point of application
     */
    public applyLocalForce (force: cc.Vec3, localPoint?: cc.Vec3) {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.applyLocalForce(force, localPoint);
        }
    }

    /**
     * !#en
     * Apply an impulse to a rigid body at a point in world space.
     * !#zh
     * 在世界空间的某点上对刚体施加一个冲量。
     * @method applyImpulse
     * @param {Vec3} impulse
     * @param {Vec3} relativePoint The point of action, relative to the center of the rigid body.
     */
    public applyImpulse (impulse: cc.Vec3, relativePoint?: cc.Vec3) {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.applyImpulse(impulse, relativePoint);
        }
    }

    /**
     * !#en
     * Apply an impulse to the rigid body at a point in local space.
     * !#zh
     * 在本地空间的某点上对刚体施加一个冲量。
     * @method applyLocalImpulse
     * @param {Vec3} impulse
     * @param {Vec3} localPoint Point of application
     */
    public applyLocalImpulse (impulse: cc.Vec3, localPoint?: cc.Vec3) {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.applyLocalImpulse(impulse, localPoint);
        }
    }

    /**
     * !#en
     * Apply a torque to the rigid body.
     * !#zh
     * 对刚体施加扭转力。
     * @method applyTorque
     * @param {Vec3} torque
     */
    public applyTorque (torque: cc.Vec3) {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.applyTorque(torque);
        }
    }

    /**
     * !#en
     * Apply a local torque to the rigid body.
     * !#zh
     * 对刚体施加本地扭转力。
     * @method applyLocalTorque
     * @param {Vec3} torque
     */
    public applyLocalTorque (torque: cc.Vec3) {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.applyLocalTorque(torque);
        }
    }

    /**
     * !#en
     * Awaken the rigid body.
     * !#zh
     * 唤醒刚体。
     * @method wakeUp
     */
    public wakeUp () {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.wakeUp();
        }
    }

    /**
     * !#en
     * Dormant rigid body.
     * !#zh
     * 休眠刚体。
     * @method sleep
     */
    public sleep () {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.sleep();
        }
    }

    /**
     * !#en
     * Get linear velocity.
     * !#zh
     * 获取线性速度。
     * @method getLinearVelocity
     * @param {Vec3} out
     */
    public getLinearVelocity (out: cc.Vec3) {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.getLinearVelocity(out);
        }
    }

    /**
     * !#en
     * Set linear speed.
     * !#zh
     * 设置线性速度。
     * @method setLinearVelocity
     * @param {Vec3} value 
     */
    public setLinearVelocity (value: cc.Vec3): void {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.setLinearVelocity(value);
        }
    }

    /**
     * !#en
     * Gets the rotation speed.
     * !#zh
     * 获取旋转速度。
     * @method getAngularVelocity
     * @param {Vec3} out 
     */
    public getAngularVelocity (out: cc.Vec3) {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.getAngularVelocity(out);
        }
    }

    /**
     * !#en
     * Set rotation speed.
     * !#zh
     * 设置旋转速度。
     * @method setAngularVelocity
     * @param {Vec3} value 
     */
    public setAngularVelocity (value: cc.Vec3): void {
        if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this._body.setAngularVelocity(value);
        }
    }
}
