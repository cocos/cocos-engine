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
    menu,
    type,
    serializable,
} from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Constraint } from './constraint';
import { Vec3, IVec3Like, cclegacy } from '../../../../core';
import { EConstraintType } from '../../physics-enum';
import { IPointToPointConstraint } from '../../../spec/i-physics-constraint';

@ccclass('cc.PointToPointConstraint')
@help('i18n:cc.PointToPointConstraint')
@menu('Physics/PointToPointConstraint(beta)')
export class PointToPointConstraint extends Constraint {
    /**
     * @en
     * The position of the own rigid body in local space with respect to the constraint axis.
     * @zh
     * 在本地空间中，自身刚体相对于约束关节的位置。
     */
    @type(Vec3)
    get pivotA () {
        return this._pivotA;
    }

    set pivotA (v: IVec3Like) {
        Vec3.copy(this._pivotA, v);
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setPivotA(this._pivotA);
        }
    }

    /**
     * @en
     * The position of the connected rigid body in the local space with respect to the constraint axis.
     * @zh
     * 在本地空间中，连接刚体相对于约束关节的位置。
     */
    @type(Vec3)
    get pivotB () {
        return this._pivotB;
    }

    set pivotB (v: IVec3Like) {
        Vec3.copy(this._pivotB, v);
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setPivotB(this._pivotB);
        }
    }

    get constraint (): IPointToPointConstraint {
        return this._constraint as IPointToPointConstraint;
    }

    @serializable
    private readonly _pivotA: Vec3 = new Vec3();

    @serializable
    private readonly _pivotB: Vec3 = new Vec3();

    constructor () {
        super(EConstraintType.POINT_TO_POINT);
    }
}
