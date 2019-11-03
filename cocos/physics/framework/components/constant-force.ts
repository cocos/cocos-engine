/**
 * @category physics
 */

import {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
    requireComponent,
    disallowMultiple,
} from '../../../core/data/class-decorator';
import { Component } from '../../../core/components/component';
import { RigidBodyComponent } from './rigid-body-component';
import { Vec3 } from '../../../core/math/vec3';

/**
 * @zh
 * 在每帧对一个刚体施加持续的力，依赖 RigidBodyComponent 组件
 */
@ccclass('cc.ConstantForce')
@executionOrder(98)
@requireComponent(RigidBodyComponent)
@menu('Components/ConstantForce')
@disallowMultiple
@executeInEditMode
export class ConstantForce extends Component {

    private _rigidbody: RigidBodyComponent | null = null;

    @property
    private readonly _force: Vec3 = new Vec3();

    @property
    private readonly _localForce: Vec3 = new Vec3();

    @property
    private readonly _torque: Vec3 = new Vec3();

    @property
    private readonly _localTorque: Vec3 = new Vec3();

    private _mask: number = 0;

    /**
     * @zh
     * 获取和设置世界朝向的力
     * @note
     * 设置时请用 this.force = otherVec3 的方式
     */
    @property({
        displayOrder: 0,
        tooltip:'世界朝向的力',
    })
    public get force () {
        return this._force;
    }

    public set force (value: Vec3) {
        Vec3.copy(this._force, value);
        this._maskUpdate(this._force, 1);
    }

    /**
     * @zh
     * 获取和设置本地朝向的力
     * @note
     * 设置时请用 this.localForce = otherVec3 的方式
     */
    @property({
        displayOrder: 1,
        tooltip:'本地朝向的力',
    })
    public get localForce () {
        return this._localForce;
    }

    public set localForce (value: Vec3) {
        Vec3.copy(this._localForce, value);
        this._maskUpdate(this.localForce, 2);
    }

    /**
     * @zh
     * 获取和设置世界朝向的扭转力
     * @note
     * 设置时请用 this.torque = otherVec3 的方式
     */
    @property({
        displayOrder: 2,
        tooltip:'世界朝向的扭转力',
    })
    public get torque () {
        return this._torque;
    }

    public set torque (value: Vec3) {
        Vec3.copy(this._torque, value);
        this._maskUpdate(this._torque, 4);
    }

    /**
     * @zh
     * 获取和设置本地朝向的扭转力
     * @note
     * 设置时请用 this.localTorque = otherVec3 的方式
     */
    @property({
        displayOrder: 3,
        tooltip:'本地朝向的扭转力',
    })
    public get localTorque () {
        return this._localTorque;
    }

    public set localTorque (value: Vec3) {
        Vec3.copy(this._localTorque, value);
        this._maskUpdate(this._localTorque, 8);
    }

    public onLoad () {
        if (!CC_PHYSICS_BUILTIN) {
            this._rigidbody = this.node.getComponent(RigidBodyComponent);
            this._maskUpdate(this._force, 1);
            this._maskUpdate(this._localForce, 2);
            this._maskUpdate(this._torque, 4);
            this._maskUpdate(this._localTorque, 8);
        }
    }

    public lateUpdate (dt: number) {
        if (!CC_PHYSICS_BUILTIN) {
            if (this._rigidbody != null && this._mask != 0) {

                if (this._mask & 1) {
                    this._rigidbody.applyForce(this._force);
                }

                if (this._mask & 2) {
                    this._rigidbody.applyLocalForce(this.localForce);
                }

                if (this._mask & 4) {
                    this._rigidbody.applyTorque(this._torque);
                }

                if (this._mask & 8) {
                    this._rigidbody.applyLocalTorque(this._localTorque);
                }

            }
        }
    }

    private _maskUpdate (t: Vec3, m: number) {
        if (t.strictEquals(Vec3.ZERO)) {
            this._mask &= ~m;
        } else {
            this._mask |= m;
        }
    }
}
