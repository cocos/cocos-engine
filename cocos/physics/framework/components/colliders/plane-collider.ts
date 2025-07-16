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
    tooltip,
    type,
    editable,
    serializable,
} from 'cc.decorator';
import { Vec3, warnID } from '../../../../core';
import { Collider } from './collider';
import { IPlaneShape } from '../../../spec/i-physics-shape';
import { EColliderType, ERigidBodyType } from '../../physics-enum';
import { RigidBody } from '../rigid-body';

/**
 * @en
 * Plane collider component.
 * @zh
 * 静态平面碰撞器。
 */
@ccclass('cc.PlaneCollider')
@help('i18n:cc.PlaneCollider')
@menu('Physics/PlaneCollider')
@executeInEditMode
export class PlaneCollider extends Collider {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the normal of the plane, in local space.
     * @zh
     * 获取或设置平面在本地坐标系下的法线。
     */
    @type(Vec3)
    @tooltip('i18n:physics3d.collider.plane_normal')
    public get normal (): Vec3 {
        return this._normal;
    }

    public set normal (value) {
        if (Vec3.strictEquals(this._normal, value)) return;
        Vec3.copy(this._normal, value);
        if (this._shape) {
            this.shape.setNormal(this._normal);
        }
    }

    /**
     * @en
     * Gets or sets the value of the plane moving along the normal, in local space.
     * @zh
     * 获取或设置平面在本地坐标系下沿着法线移动的数值。
     */
    @editable
    @tooltip('i18n:physics3d.collider.plane_constant')
    public get constant (): number {
        return this._constant;
    }

    public set constant (v: number) {
        if (this._constant === v) return;
        this._constant = v;
        if (this._shape) {
            this.shape.setConstant(this._constant);
        }
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    public get shape (): IPlaneShape {
        return this._shape as IPlaneShape;
    }

    protected onEnable (): void {
        super.onEnable();

        if (this.node) {
            const body = this.node.getComponent(RigidBody);
            if (body && body.isValid && (body.type === ERigidBodyType.DYNAMIC)) {
                warnID(9630, this.node.name);
            }
        }
    }

    /// PRIVATE PROPERTY ///

    @serializable
    private _normal = new Vec3(0, 1, 0);

    @serializable
    private _constant = 0;

    constructor () {
        super(EColliderType.PLANE);
    }
}
