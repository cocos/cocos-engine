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
} from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Constraint } from './constraint';
import { CCFloat, IVec3Like, Vec3 } from '../../../../core';
import { EConstraintType } from '../../physics-enum';
import { IFixedConstraint } from '../../../spec/i-physics-constraint';
import { legacyCC } from '../../../../core/global-exports';

@ccclass('cc.FixedConstraint')
@help('i18n:cc.FixedConstraint')
@menu('Physics/FixedConstraint(beta)')
export class FixedConstraint extends Constraint {
    /**
     * @en
     * The break force threshold of the constraint.
     * @zh
     * 约束的断裂力阈值。
     */
    @type(CCFloat)
    get breakForce (): number {
        return this._breakForce;
    }

    set breakForce (v: number) {
        this._breakForce = v;
        if (!EDITOR || legacyCC.GAME_VIEW) {
            this.constraint.setBreakForce(v);
        }
    }

    /**
     * @en
     * The break torque threshold of the constraint.
     * @zh
     * 约束的断裂扭矩阈值。
     */
    @type(CCFloat)
    get breakTorque (): number {
        return this._breakTorque;
    }

    set breakTorque (v: number) {
        this._breakTorque = v;
        if (!EDITOR || legacyCC.GAME_VIEW) {
            this.constraint.setBreakTorque(v);
        }
    }

    get constraint (): IFixedConstraint {
        return this._constraint as IFixedConstraint;
    }

    @serializable
    @formerlySerializedAs('breakForce')
    private _breakForce = 1e8;

    @serializable
    @formerlySerializedAs('breakTorque')
    private _breakTorque = 1e8;

    constructor () {
        super(EConstraintType.FIXED);
    }
}
