/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { Joint2D } from './joint-2d';
import { IRelativeJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { Vec3, Vec2, IVec2Like, Quat, _decorator, CCFloat, CCBoolean } from '../../../../core';
import { help, serializable, tooltip, type } from '../../../../core/data/decorators';

const tempVec3_1 = new Vec3();
const tempVec3_2 = new Vec3();

const { ccclass, menu, property } = _decorator;

@ccclass('cc.RelativeJoint2D')
@help('i18n:cc.Joint2D')
@menu('Physics2D/Joints/RelativeJoint2D')
export class RelativeJoint2D extends Joint2D {
    TYPE = EJoint2DType.RELATIVE;

    /**
     * @en
     * The maximum force can be applied to rigidbody.
     * @zh
     * 可以应用于刚体的最大的力值。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.maxForce')
    get maxForce (): number {
        return this._maxForce;
    }
    set maxForce (v: number) {
        this._maxForce = v;
        if (this._joint) {
            (this._joint as IRelativeJoint).setMaxForce(v);
        }
    }

    /**
     * @en
     * The maximum torque can be applied to rigidbody.
     * @zh
     * 可以应用于刚体的最大扭矩值。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.maxTorque')
    get maxTorque (): number {
        return this._maxTorque;
    }
    set maxTorque (v: number) {
        this._maxTorque = v;
        if (this._joint) {
            (this._joint as IRelativeJoint).setMaxTorque(v);
        }
    }

    /**
     * @en
     * The position correction factor in the range [0,1].
     * @zh
     * 位置矫正系数，范围为 [0, 1]。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.correctionFactor')
    get correctionFactor (): number {
        return this._correctionFactor;
    }
    set correctionFactor (v: number) {
        this._correctionFactor = v;
        if (this._joint) {
            (this._joint as IRelativeJoint).setCorrectionFactor(v);
        }
    }

    /**
     * @en
     * The linear offset from connected rigidbody to rigidbody.
     * @zh
     * 关节另一端的刚体相对于起始端刚体的位置偏移量。
     */
    @type(Vec2)
    @tooltip('i18n:physics2d.joint.linearOffset')
    get linearOffset (): Vec2 {
        if (this._autoCalcOffset) {
            if (this.connectedBody) {
                return Vec2.subtract(this._linearOffset, this.connectedBody.node.worldPosition as IVec2Like,
                    this.node.worldPosition as IVec2Like) as Vec2;
            } else { //if connected body is not set, use scene origin as connected body
                return Vec2.subtract(this._linearOffset, new Vec2(0, 0),
                    this.node.worldPosition as IVec2Like) as Vec2;
            }
        }
        return this._linearOffset;
    }
    set linearOffset (v: Vec2) {
        this._linearOffset.set(v);
        if (this._joint) {
            (this._joint as IRelativeJoint).setLinearOffset(v);
        }
    }

    /**
     * @en
     * The angular offset from connected rigidbody to rigidbody.
     * @zh
     * 关节另一端的刚体相对于起始端刚体的角度偏移量。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.angularOffset')
    get angularOffset (): number {
        if (this._autoCalcOffset) {
            Quat.toEuler(tempVec3_1, this.node.worldRotation);
            if (this.connectedBody) {
                Quat.toEuler(tempVec3_2, this.connectedBody.node.worldRotation);
            } else { //if connected body is not set, use scene origin as connected body
                Quat.toEuler(tempVec3_2, new Quat());//?
            }
            this._angularOffset = tempVec3_2.z - tempVec3_1.z;
        }
        return this._angularOffset;
    }
    set angularOffset (v: number) {
        this._angularOffset = v;
        if (this._joint) {
            (this._joint as IRelativeJoint).setAngularOffset(v);
        }
    }

    /**
     * @en
     * Auto calculate the angularOffset and linearOffset between the connected two rigid bodies.
     * @zh
     * 自动计算关节连接的两个刚体间的 angularOffset 和 linearOffset。
     */
    @type(CCBoolean)
    @tooltip('i18n:physics2d.joint.autoCalcOffset')
    get autoCalcOffset (): boolean {
        return this._autoCalcOffset;
    }
    set autoCalcOffset (v: boolean) {
        this._autoCalcOffset = v;
    }

    /// private properties

    @serializable
    private _maxForce = 5;

    @serializable
    private _maxTorque = 0.7;

    @serializable
    private _correctionFactor = 0.3;

    @serializable
    private _angularOffset = 0;

    @serializable
    private _linearOffset = new Vec2();

    @serializable
    private _autoCalcOffset = true;
}
