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
import { IVec3Like, Vec3 } from '../../../../core';
import { EConstraintType } from '../../physics-enum';

@ccclass('cc.PointToPointConstraintComponent')
@help('i18n:cc.PointToPointConstraintComponent')
@menu('Physics/PointToPointConstraint(beta)')
export class PointToPointConstraintComponent extends ConstraintComponent {

    @property
    pivotA: IVec3Like = new Vec3();

    @property
    pivotB: IVec3Like = new Vec3();

    constructor () {
        super(EConstraintType.POINT_TO_POINT);
    }
}

