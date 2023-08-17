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
import { IDistanceJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { CCBoolean, CCFloat, Vec3, _decorator } from '../../../../core';
import { help, serializable, tooltip, type } from '../../../../core/data/decorators';

const { ccclass, menu, property } = _decorator;

@ccclass('cc.DistanceJoint2D')
@help('i18n:cc.Joint2D')
@menu('Physics2D/Joints/DistanceJoint2D')
export class DistanceJoint2D extends Joint2D {
    TYPE = EJoint2DType.DISTANCE;

    /**
     * @en
     * The max length.
     * @zh
     * 最大长度。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.maxLength')
    get maxLength (): number {
        if (this._autoCalcDistance) {
            if (this.connectedBody) {
                return Vec3.distance(this.node.worldPosition, this.connectedBody.node.worldPosition);
            } else { //if connected body is not set, use scene origin as connected body
                return Vec3.len(this.node.worldPosition);
            }
        }
        return this._maxLength;
    }
    set maxLength (v) {
        this._maxLength = v;
        if (this._joint) {
            (this._joint as IDistanceJoint).setMaxLength(v);
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
    private _maxLength = 5;

    @serializable
    private _autoCalcDistance = true;
}
