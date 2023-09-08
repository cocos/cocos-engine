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

import { RigidBody3D } from './rigid-body-component';

const {
    ccclass,
    executeInEditMode,
    executionOrder,
    menu,
    property,
    requireComponent,
    disallowMultiple,
    help,
} = cc._decorator;
const Vec3 = cc.Vec3;

/**
 * !#en
 * Each frame applies a constant force to a rigid body, depending on the RigidBody3D
 * !#zh
 * 在每帧对一个刚体施加持续的力，依赖 RigidBody3D 组件
 * @class ConstantForce
 * @extends Component
 */
@ccclass('cc.ConstantForce')
@executionOrder(98)
@requireComponent(RigidBody3D)
@menu('i18n:MAIN_MENU.component.physics/Constant Force 3D')
@help('i18n:COMPONENT.help_url.constantforce')
@disallowMultiple
@executeInEditMode
export class ConstantForce extends cc.Component {

    private _rigidbody: RigidBody3D | null = null;

    @property
    private readonly _force: cc.Vec3 = new Vec3();

    @property
    private readonly _localForce: cc.Vec3 = new Vec3();

    @property
    private readonly _torque: cc.Vec3 = new Vec3();

    @property
    private readonly _localTorque: cc.Vec3 = new Vec3();

    private _mask: number = 0;

    /**
     * !#en
     * Set the force used in the world coordinate system, use `this.force = otherVec3`.
     * !#zh
     * 设置世界坐标系中使用的力，设置时请用 `this.force = otherVec3` 的方式。
     * @property {Vec3} force
     */
    @property({
        displayOrder: 0
    })
    public get force () {
        return this._force;
    }

    public set force (value: cc.Vec3) {
        Vec3.copy(this._force, value);
        this._maskUpdate(this._force, 1);
    }

    /**
     * !#en
     * Set the force used in the local coordinate system, using `this.localforce = otherVec3`.
     * !#zh
     * 获取和设置本地坐标系中使用的力，设置时请用 `this.localForce = otherVec3` 的方式。
     * @property {Vec3} localForce
     */
    @property({
        displayOrder: 1
    })
    public get localForce () {
        return this._localForce;
    }

    public set localForce (value: cc.Vec3) {
        Vec3.copy(this._localForce, value);
        this._maskUpdate(this.localForce, 2);
    }

    /**
     * !#en
     * Torque applied to the world orientation
     * !#zh
     * 对世界朝向施加的扭矩
     * @note
     * 设置时请用 this.torque = otherVec3 的方式
     * @property {Vec3} torque
     */
    @property({
        displayOrder: 2
    })
    public get torque () {
        return this._torque;
    }

    public set torque (value: cc.Vec3) {
        Vec3.copy(this._torque, value);
        this._maskUpdate(this._torque, 4);
    }

    /**
     * !#en
     * Torque applied to local orientation, using `this.localtorque = otherVec3`.
     * !#zh
     * 对本地朝向施加的扭矩，设置时请用 `this.localTorque = otherVec3` 的方式。
     * @property {Vec3} localTorque
     */
    @property({
        displayOrder: 3
    })
    public get localTorque () {
        return this._localTorque;
    }

    public set localTorque (value: cc.Vec3) {
        Vec3.copy(this._localTorque, value);
        this._maskUpdate(this._localTorque, 8);
    }

    public onLoad () {
        if (!CC_PHYSICS_BUILTIN) {
            this._rigidbody = this.node.getComponent(RigidBody3D);
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

    private _maskUpdate (t: cc.Vec3, m: number) {
        if (Vec3.strictEquals(t, Vec3.ZERO)) {
            this._mask &= ~m;
        } else {
            this._mask |= m;
        }
    }
}
