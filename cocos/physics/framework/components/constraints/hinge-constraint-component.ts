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

@ccclass('cc.HingeConstraintComponent')
@help('i18n:cc.HingeConstraintComponent')
@menu('Physics/HingeConstraint(beta)')
export class HingeConstraintComponent extends ConstraintComponent {

    @property
    axisA: IVec3Like = new Vec3();

    @property
    axisB: IVec3Like = new Vec3();

    @property
    pivotA: IVec3Like = new Vec3();

    @property
    pivotB: IVec3Like = new Vec3();

    constructor () {
        super(EConstraintType.HINGE);
    }
}
