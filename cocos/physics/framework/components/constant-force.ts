/**
 * @category physics
 */

import {
    ccclass,
    help,
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
import { PHYSICS_BUILTIN } from 'internal:constants';

/**
 * @en
 * A tool component to help apply force to the rigid body at each frame.
 * @zh
 * 在每帧对一个刚体施加持续的力，依赖 RigidBodyComponent 组件。
 */
@ccclass('cc.ConstantForce')
@help('i18n:cc.ConstantForce')
@executionOrder(98)
@requireComponent(RigidBodyComponent)
@menu('Physics/ConstantForce')
@disallowMultiple
@executeInEditMode
export class ConstantForce extends Component {

    private _rigidBody: RigidBodyComponent | null = null;

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
     * @en
     * Gets or sets forces in world coordinates.
     * @zh
     * 获取或设置世界坐标系下的力。
     */
    @property({
        displayOrder: 0,
        tooltip:'世界坐标系下的力',
    })
    public get force () {
        return this._force;
    }

    public set force (value: Vec3) {
        Vec3.copy(this._force, value);
        this._maskUpdate(this._force, 1);
    }

    /**
     * @en
     * Gets or sets the forces in the local coordinate system.
     * @zh
     * 获取或设置本地坐标系下的力。
     */
    @property({
        displayOrder: 1,
        tooltip:'本地坐标系下的力',
    })
    public get localForce () {
        return this._localForce;
    }

    public set localForce (value: Vec3) {
        Vec3.copy(this._localForce, value);
        this._maskUpdate(this.localForce, 2);
    }

    /**
     * @en
     * Gets or sets the torsional force in world coordinates.
     * @zh
     * 获取或设置世界坐标系下的扭转力。
     */
    @property({
        displayOrder: 2,
        tooltip:'世界坐标系下的扭转力',
    })
    public get torque () {
        return this._torque;
    }

    public set torque (value: Vec3) {
        Vec3.copy(this._torque, value);
        this._maskUpdate(this._torque, 4);
    }

    /**
     * @en
     * Gets or sets the torsional force in the local coordinate system.
     * @zh
     * 获取或设置本地坐标系下的扭转力。
     */
    @property({
        displayOrder: 3,
        tooltip:'本地坐标系下的扭转力',
    })
    public get localTorque () {
        return this._localTorque;
    }

    public set localTorque (value: Vec3) {
        Vec3.copy(this._localTorque, value);
        this._maskUpdate(this._localTorque, 8);
    }

    public onLoad () {
        if (!PHYSICS_BUILTIN) {
            this._rigidBody = this.node.getComponent(RigidBodyComponent);
            this._maskUpdate(this._force, 1);
            this._maskUpdate(this._localForce, 2);
            this._maskUpdate(this._torque, 4);
            this._maskUpdate(this._localTorque, 8);
        }
    }

    public lateUpdate (dt: number) {
        if (!PHYSICS_BUILTIN) {
            if (this._rigidBody != null && this._mask != 0) {

                if (this._mask & 1) {
                    this._rigidBody.applyForce(this._force);
                }

                if (this._mask & 2) {
                    this._rigidBody.applyLocalForce(this.localForce);
                }

                if (this._mask & 4) {
                    this._rigidBody.applyTorque(this._torque);
                }

                if (this._mask & 8) {
                    this._rigidBody.applyLocalTorque(this._localTorque);
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
