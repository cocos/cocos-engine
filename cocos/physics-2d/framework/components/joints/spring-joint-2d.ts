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
import { ISpringJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { CCBoolean, CCFloat, Vec3, _decorator } from '../../../../core';
import { help, serializable, tooltip, type } from '../../../../core/data/decorators';

const { ccclass, property, menu } = _decorator;

@ccclass('cc.SpringJoint2D')
@help('i18n:cc.Joint2D')
@menu('Physics2D/Joints/SpringJoint2D')
export class SpringJoint2D extends Joint2D {
    TYPE = EJoint2DType.SPRING;

    /**
     * @en
     * The spring frequency.
     * @zh
     * 弹性系数。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.frequency')
    get frequency (): number {
        return this._frequency;
    }
    set frequency (v) {
        this._frequency = v;
        if (this._joint) {
            (this._joint as ISpringJoint).setFrequency(v);
        }
    }

    /**
     * @en
     * The damping ratio.
     * @zh
     * 阻尼，表示关节变形后，恢复到初始状态受到的阻力。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.dampingRatio')
    get dampingRatio (): number {
        return this._dampingRatio;
    }
    set dampingRatio (v) {
        this._dampingRatio = v;
        if (this._joint) {
            (this._joint as ISpringJoint).setDampingRatio(v);
        }
    }

    /**
     * @en
     * The distance separating the two ends of the joint.
     * @zh
     * 关节两端的距离。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.distance')
    get distance (): number {
        if (this._autoCalcDistance) {
            if (this.connectedBody) {
                return Vec3.distance(this.node.worldPosition, this.connectedBody.node.worldPosition);
            } else { //if connected body is not set, use scene origin as connected body
                return Vec3.len(this.node.worldPosition);
            }
        }
        return this._distance;
    }
    set distance (v) {
        this._distance = v;
        if (this._joint) {
            (this._joint as ISpringJoint).setDistance(v);
        }
    }

    /**
     * @en
     * Auto calculate the distance between the connected two rigid bodies.
     * @zh
     * 自动计算关节连接的两个刚体间的距离。
     */
    @type(CCBoolean)
    @tooltip('i18n:physics2d.joint.autoCalcDistance')
    get autoCalcDistance (): boolean {
        return this._autoCalcDistance;
    }
    set autoCalcDistance (v) {
        this._autoCalcDistance = v;
    }

    /// private properties

    @serializable
    private _frequency = 5;

    @serializable
    private _dampingRatio = 0.7;

    @serializable
    private _distance = 10;

    @serializable
    private _autoCalcDistance = true;
}
