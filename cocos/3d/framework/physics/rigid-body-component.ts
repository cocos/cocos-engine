/**
 * 物理模块
 * @category physics
 */

import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
} from '../../../core/data/class-decorator';
import { Quat, Vec3 } from '../../../core/value-types';
import { PhysicsBasedComponent } from './detail/physics-based-component';

const NonRigidBodyProperties = {
    mass: 10,
    linearDamping: 0,
    angularDamping: 0,
};

/**
 * @zh
 * 刚体组件。
 */
@ccclass('cc.RigidBodyComponent')
@executionOrder(99)
@menu('Components/RigidBodyComponent')
@executeInEditMode
export class RigidBodyComponent extends PhysicsBasedComponent {

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
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this.sharedBody.body.setAllowSleep(v);
        }
    }

    /**
     * @zh
     * 获取或设置刚体的质量。
     */
    @property({
        displayOrder: 0,
    })
    public get mass () {
        return this._mass;
    }

    public set mass (value) {
        this._mass = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setMass(value);
        }
    }

    /**
     * @zh
     * 获取或设置线性阻尼。
     */
    @property({
        displayOrder: 1,
    })
    public get linearDamping () {
        return this._linearDamping;
    }

    public set linearDamping (value) {
        this._linearDamping = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setLinearDamping(value);
        }
    }

    /**
     * @zh
     * 获取或设置旋转阻尼。
     */
    @property({
        displayOrder: 2,
    })
    public get angularDamping () {
        return this._angularDamping;
    }

    public set angularDamping (value) {
        this._angularDamping = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setAngularDamping(value);
        }
    }

    /**
     * @zh
     * 获取或设置刚体是否由物理系统控制运动。
     */
    @property({
        displayOrder: 3,
    })
    public get isKinematic () {
        return this._isKinematic;
    }

    public set isKinematic (value) {
        this._isKinematic = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setIsKinematic(value);
        }
    }

    /**
     * @zh
     * 获取或设置刚体是否使用重力。
     */
    @property({
        displayOrder: 4,
    })
    public get useGravity () {
        return this._useGravity;
    }

    public set useGravity (value) {
        this._useGravity = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setUseGravity(value);
        }
    }

    /**
     * @zh
     * 获取或设置刚体是否固定旋转。
     */
    @property({
        displayOrder: 5,
    })
    public get fixedRotation () {
        return this._fixedRotation;
    }

    public set fixedRotation (value) {
        this._fixedRotation = value;
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setFreezeRotation(value);
        }
    }

    /**
     * @zh
     * 获取或设置线性速度的因子，可以用来控制每个轴方向上的速度的缩放。
     */
    @property({
        displayOrder: 6,
    })
    public get linearFactor () {
        if (CC_EDITOR) {
            return this._linearFactor;
        }
        return this._body.getLinearFactor(this._linearFactor);

    }

    public set linearFactor (value: Vec3) {
        Vec3.copy(this._linearFactor, value);
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setLinearFactor(this._linearFactor);
        }
    }

    /**
     * @zh
     * 获取或设置旋转速度的因子，可以用来控制每个轴方向上的旋转速度的缩放。
     */
    @property({
        displayOrder: 7,
    })
    public get angularFactor () {
        if (CC_EDITOR) {
            return this._angularFactor;
        }
        return this._body.getAngularFactor(this._angularFactor);
    }

    public set angularFactor (value: Vec3) {
        Vec3.copy(this._angularFactor, value);
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            this._body.setAngularFactor(this._angularFactor);
        }
    }

    /**
     * @zh
     * 获取是否是唤醒的状态。
     */
    public get isAwake (): boolean {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            return this._body.isAwake();
        }
        return false;
    }

    /**
     * @zh
     * 获取是否是可进入休眠的状态。
     */
    public get isSleepy (): boolean {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            return this._body.isSleepy();
        }
        return false;
    }

    /**
     * @zh
     * 获取是否是正在休眠的状态。
     */
    public get isSleeping (): boolean {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            return this._body.isSleeping();
        }
        return false;
    }

    /// PRIVATE PROPERTY ///

    // @property
    private _allowSleep: boolean = true;

    @property
    private _mass: number = NonRigidBodyProperties.mass;

    @property
    private _linearDamping: number = NonRigidBodyProperties.linearDamping;

    @property
    private _angularDamping: number = NonRigidBodyProperties.angularDamping;

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

    constructor () {
        super();
    }

    /// PUBLIC METHOD ///

    /**
     * @zh
     * 在世界空间中的某点上对刚体施加一个作用力。
     * @param force - 作用力
     * @param relativePoint - 作用点，相对于刚体的中心点
     */
    public applyForce (force: Vec3, relativePoint?: Vec3) {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body!.applyForce(force, relativePoint);
        }
    }

    /**
     * @zh
     * 在本地空间中的某点上对刚体施加一个作用力。
     * @param force - 作用力
     * @param localPoint - 作用点
     */
    public applyLocalForce (force: Vec3, localPoint?: Vec3) {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body!.applyLocalForce(force, localPoint);
        }
    }

    /**
     * @zh
     * 在世界空间的某点上对刚体施加一个冲量。
     * @param impulse - 冲量
     * @param relativePoint - 作用点，相对于刚体的中心点
     */
    public applyImpulse (impulse: Vec3, relativePoint?: Vec3) {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body!.applyImpulse(impulse, relativePoint);
        }
    }

    /**
     * @zh
     * 在本地空间的某点上对刚体施加一个冲量。
     * @param impulse - 冲量
     * @param localPoint - 作用点
     */
    public applyLocalImpulse (impulse: Vec3, localPoint?: Vec3) {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body!.applyLocalImpulse(impulse, localPoint);
        }
    }

    /**
     * @zh
     * 唤醒刚体。
     */
    public wakeUp () {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body!.wakeUp();
        }
    }

    /**
     * @zh
     * 休眠刚体。
     */
    public sleep () {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body!.sleep();
        }
    }

    /**
     * @zh
     * 获取线性速度。
     * @param out 速度 Vec3
     */
    public getLinearVelocity (out: Vec3) {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body.getLinearVelocity(out);
        }
    }

    /**
     * @zh
     * 设置线性速度。
     * @param value 速度 Vec3
     */
    public setLinearVelocity (value: Vec3): void {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body.setLinearVelocity(value);
        }
    }

    /**
     * @zh
     * 获取旋转速度。
     * @param out 速度 Vec3
     */
    public getAngularVelocity (out: Vec3) {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body.getAngularVelocity(out);
        }
    }

    /**
     * @zh
     * 设置旋转速度。
     * @param value 速度 Vec3
     */
    public setAngularVelocity (value: Vec3): void {
        if (!CC_PHYSICS_BUILT_IN && this._assertPreload) {
            this._body.setAngularVelocity(value);
        }
    }

    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        if (!CC_PHYSICS_BUILT_IN) {
            /**
             * 此处设置刚体属性是因为__preload不受executionOrder的顺序影响，
             * 从而导致ColliderComponent后添加会导致刚体的某些属性被重写
             */
            if (this.sharedBody) {
                this.allowSleep = this._allowSleep;
                this.mass = this._mass;
                this.linearDamping = this._linearDamping;
                this.angularDamping = this._angularDamping;
                this.useGravity = this._useGravity;
                this.isKinematic = this._isKinematic;
                this.fixedRotation = this._fixedRotation;
                this.linearFactor = this._linearFactor;
                this.angularFactor = this._angularFactor;
            }
        }
    }
}
