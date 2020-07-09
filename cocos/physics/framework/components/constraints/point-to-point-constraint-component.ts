/**
 * @category physics
 */

import {
    ccclass,
    help,
    executeInEditMode,
    menu,
    property,
} from '../../../../core/data/class-decorator';
import { ConstraintComponent } from './constraint-component';
import { Vec3, IVec3Like } from '../../../../core';
import { EConstraintType } from '../../physics-enum';
import { EDITOR } from 'internal:constants';
import { IPointToPointConstraint } from '../../../spec/i-physics-constraint';

@ccclass('cc.PointToPointConstraintComponent')
@help('i18n:cc.PointToPointConstraintComponent')
@menu('Physics/PointToPointConstraint(beta)')
export class PointToPointConstraintComponent extends ConstraintComponent {

    @property({
        type: Vec3,
    })
    get pivotA () {
        return this._pivotA;
    }

    set pivotA (v: IVec3Like) {
        Vec3.copy(this._pivotA, v);
        if (!EDITOR) {
            this.constraint.setPivotA(this._pivotA);
        }
    }

    @property({
        type: Vec3,
    })
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

    @property
    private readonly _pivotA: Vec3 = new Vec3();

    @property
    private readonly _pivotB: Vec3 = new Vec3();

    constructor () {
        super(EConstraintType.POINT_TO_POINT);
    }
}

