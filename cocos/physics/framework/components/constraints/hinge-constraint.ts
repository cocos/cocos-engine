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
    serializable,
    formerlySerializedAs,
    type,
    tooltip,
} from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Constraint } from './constraint';
import { Vec3, cclegacy } from '../../../../core';
import { EConstraintType } from '../../physics-enum';
import { IHingeConstraint } from '../../../spec/i-physics-constraint';

@ccclass('cc.HingeConstraint')
@help('i18n:cc.HingeConstraint')
@menu('Physics/HingeConstraint(beta)')
export class HingeConstraint extends Constraint {
    /**
     * @en
     * The pivot point of the constraint in the local coordinate system of the attached rigid body.
     * @zh
     * 约束关节在连接刚体的本地坐标系中的锚点。
     */
    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.pivotA')
    get pivotA (): Vec3 {
        return this._pivotA;
    }

    set pivotA (v: Vec3) {
        Vec3.copy(this._pivotA, v);
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setPivotA(this._pivotA);
        }
    }

    /**
     * @en
     * The pivot point of the constraint in the local coordinate system of the connected rigid body.
     * @zh
     * 约束关节在连接刚体的本地坐标系中的锚点。
     */
    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.pivotB')
    get pivotB (): Vec3 {
        return this._pivotB;
    }

    set pivotB (v: Vec3) {
        Vec3.copy(this._pivotB, v);
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setPivotB(this._pivotB);
        }
    }

    /**
     * @en
     * The axis of the constraint in the local coordinate system of the attached rigid body.
     * @zh
     * 约束关节在连接刚体的本地坐标系中的轴。
     */
    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.axis')
    get axis (): Vec3 {
        return this._axis;
    }

    set axis (v: Vec3) {
        Vec3.copy(this._axis, v);
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setAxis(this._axis);
        }
    }

    @serializable
    @formerlySerializedAs('axisA')
    private readonly _axis: Vec3 = new Vec3();

    @serializable
    @formerlySerializedAs('pivotA')
    private readonly _pivotA: Vec3 = new Vec3();

    @serializable
    @formerlySerializedAs('pivotB')
    private readonly _pivotB: Vec3 = new Vec3();

    get constraint (): IHingeConstraint {
        return this._constraint as IHingeConstraint;
    }

    constructor () {
        super(EConstraintType.HINGE);
    }
}
