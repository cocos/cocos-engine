/**
 * @category physics
 */

import {
    ccclass,
    help,
    executeInEditMode,
    menu,
    type,
    serializable,
} from 'cc.decorator';
import { Constraint } from './constraint';
import { Vec3, IVec3Like } from '../../../../core';
import { EConstraintType } from '../../physics-enum';
import { EDITOR } from 'internal:constants';
import { IPointToPointConstraint } from '../../../spec/i-physics-constraint';

@ccclass('cc.PointToPointConstraint')
@help('i18n:cc.PointToPointConstraint')
@menu('Physics/PointToPointConstraint(beta)')
export class PointToPointConstraint extends Constraint {

    @type(Vec3)
    get pivotA () {
        return this._pivotA;
    }

    set pivotA (v: IVec3Like) {
        Vec3.copy(this._pivotA, v);
        if (!EDITOR) {
            this.constraint.setPivotA(this._pivotA);
        }
    }

    @type(Vec3)
    get pivotB () {
        return this._pivotB;
    }

    set pivotB (v: IVec3Like) {
        Vec3.copy(this._pivotB, v);
        if (!EDITOR) {
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

