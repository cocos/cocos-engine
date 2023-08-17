/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import {
    ccclass,
    help,
    executeInEditMode,
    menu,
    requireComponent,
    disallowMultiple,
    tooltip,
    displayOrder,
    serializable,
} from 'cc.decorator';
import { EDITOR_NOT_IN_PREVIEW } from 'internal:constants';
import { Component } from '../../../scene-graph/component';
import { RigidBody } from './rigid-body';
import { Vec3 } from '../../../core';

/**
 * @en
 * A tool component to help apply force to the rigid body at each frame.
 * @zh
 * 在每帧对一个刚体施加持续的力，依赖 RigidBody 组件。
 */
@ccclass('cc.ConstantForce')
@help('i18n:cc.ConstantForce')
@requireComponent(RigidBody)
@menu('Physics/ConstantForce')
@disallowMultiple
@executeInEditMode
export class ConstantForce extends Component {
    private _rigidBody: RigidBody | null = null;

    @serializable
    private readonly _force: Vec3 = new Vec3();

    @serializable
    private readonly _localForce: Vec3 = new Vec3();

    @serializable
    private readonly _torque: Vec3 = new Vec3();

    @serializable
    private readonly _localTorque: Vec3 = new Vec3();

    private _mask = 0;

    /**
     * @en
     * Gets or sets forces in world coordinates.
     * @zh
     * 获取或设置世界坐标系下的力。
     */
    @displayOrder(0)
    @tooltip('i18n:physics3d.constant_force.force')
    public get force (): Vec3 {
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
    @displayOrder(1)
    @tooltip('i18n:physics3d.constant_force.localForce')
    public get localForce (): Vec3 {
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
    @displayOrder(2)
    @tooltip('i18n:physics3d.constant_force.torque')
    public get torque (): Vec3 {
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
    @displayOrder(3)
    @tooltip('i18n:physics3d.constant_force.localTorque')
    public get localTorque (): Vec3 {
        return this._localTorque;
    }

    public set localTorque (value: Vec3) {
        Vec3.copy(this._localTorque, value);
        this._maskUpdate(this._localTorque, 8);
    }

    public onLoad (): void {
        this._rigidBody = this.node.getComponent(RigidBody);
        this._maskUpdate(this._force, 1);
        this._maskUpdate(this._localForce, 2);
        this._maskUpdate(this._torque, 4);
        this._maskUpdate(this._localTorque, 8);
    }

    public lateUpdate (dt: number): void {
        if (!EDITOR_NOT_IN_PREVIEW) {
            if (this._rigidBody != null && this._mask !== 0) {
                if (this._mask & 1) this._rigidBody.applyForce(this._force);
                if (this._mask & 2) this._rigidBody.applyLocalForce(this.localForce);
                if (this._mask & 4) this._rigidBody.applyTorque(this._torque);
                if (this._mask & 8) this._rigidBody.applyLocalTorque(this._localTorque);
            }
        }
    }

    private _maskUpdate (t: Vec3, m: number): void {
        if (t.strictEquals(Vec3.ZERO)) {
            this._mask &= ~m;
        } else {
            this._mask |= m;
        }
    }
}
