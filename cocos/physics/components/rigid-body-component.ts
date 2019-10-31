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
} from '../../core/data/class-decorator';
import { Vec3 } from '../../core/math';
import { PhysicsBasedComponent } from './detail/physics-based-component';
import { Component, error } from '../../core';
import { IRigidBody } from '../spec/IRigidBody';
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

    protected get _assertPreload (): boolean {
        const r = this._isOnLoadCalled == 0;
        if (r) { error('Physic Error: Please make sure that the node has been added to the scene'); }
        return r;
    }

    /// PUBLIC PROPERTY GETTER\SETTER ///

    public get impl () {
        return this.body;
    }

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
            this.body.allowSleep = v;
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
            this.body.mass = value;
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
            this.body.linearDamping = value;
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
            this.body.angularDamping = value;
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
            this.body.isKinematic = value;
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
            this.body.useGravity = value;
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
            this.body.fixedRotation = value;
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
            this.body.linearFactor = this._linearFactor;
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
            this.body.angularFactor = this._angularFactor;
        }
    }

    /**
     * @zh
     * 获取是否是唤醒的状态。
     */
    public get isAwake (): boolean {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            return this.body.isAwake;
        }
        return false;
    }

    /**
     * @zh
     * 获取是否是可进入休眠的状态。
     */
    public get isSleepy (): boolean {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            return this.body.isSleepy;
        }
        return false;
    }

    /**
     * @zh
     * 获取是否是正在休眠的状态。
     */
    public get isSleeping (): boolean {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            return this.body.isSleeping;
        }
        return false;
    }

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

    private body!: IRigidBody;

    constructor () {
        super();
        if (!CC_EDITOR) {
            this.body = createRigidBody();
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
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            this.body!.applyForce(force, relativePoint);
        }
    }

    /**
     * @zh
     * 在本地空间中的某点上对刚体施加一个作用力。
     * @param force - 作用力
     * @param localPoint - 作用点
     */
    public applyLocalForce (force: Vec3, localPoint?: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            this.body!.applyLocalForce(force, localPoint);
        }
    }

    /**
     * @zh
     * 在世界空间的某点上对刚体施加一个冲量。
     * @param impulse - 冲量
     * @param relativePoint - 作用点，相对于刚体的中心点
     */
    public applyImpulse (impulse: Vec3, relativePoint?: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            this.body!.applyImpulse(impulse, relativePoint);
        }
    }

    /**
     * @zh
     * 在本地空间的某点上对刚体施加一个冲量。
     * @param impulse - 冲量
     * @param localPoint - 作用点
     */
    public applyLocalImpulse (impulse: Vec3, localPoint?: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            this.body!.applyLocalImpulse(impulse, localPoint);
        }
    }

    public applyTorque (torque: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            this.body!.applyTorque(torque);
        }
    }

    public applyLocalTorque (torque: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            this.body!.applyLocalTorque(torque);
        }
    }

    /**
     * @zh
     * 唤醒刚体。
     */
    public wakeUp () {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            this.body!.wakeUp();
        }
    }

    /**
     * @zh
     * 休眠刚体。
     */
    public sleep () {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            this.body!.sleep();
        }
    }

    /**
     * @zh
     * 获取线性速度。
     * @param out 速度 Vec3
     */
    public getLinearVelocity (out: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            this.body.getLinearVelocity(out);
        }
    }

    /**
     * @zh
     * 设置线性速度。
     * @param value 速度 Vec3
     */
    public setLinearVelocity (value: Vec3): void {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            this.body.setLinearVelocity(value);
        }
    }

    /**
     * @zh
     * 获取旋转速度。
     * @param out 速度 Vec3
     */
    public getAngularVelocity (out: Vec3) {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            this.body.getAngularVelocity(out);
        }
    }

    /**
     * @zh
     * 设置旋转速度。
     * @param value 速度 Vec3
     */
    public setAngularVelocity (value: Vec3): void {
        if (!CC_PHYSICS_BUILTIN && this._assertPreload) {
            this.body.setAngularVelocity(value);
        }
    }

    /// COMPONENT LIFECYCLE ///

    protected onEnable () {
        // super.onEnable();
        // if (!CC_PHYSICS_BUILTIN) {
        //     /**
        //      * 此处设置刚体属性是因为__preload不受executionOrder的顺序影响，
        //      * 从而导致ColliderComponent后添加会导致刚体的某些属性被重写
        //      */
        //     if (this.sharedBody) {
        //         this.allowSleep = this._allowSleep;
        //         this.mass = this._mass;
        //         this.linearDamping = this._linearDamping;
        //         this.angularDamping = this._angularDamping;
        //         this.useGravity = this._useGravity;
        //         this.isKinematic = this._isKinematic;
        //         this.fixedRotation = this._fixedRotation;
        //         this.linearFactor = this._linearFactor;
        //         this.angularFactor = this._angularFactor;
        //         this.sharedBody.isShapeOnly = false;
        //     }
        // }

        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this.body.onEnable!();
        }
    }

    protected onDisable () {
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this.body.onDisable!();
        }
    }
}
