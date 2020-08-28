/**
 * @category physics
 */

import {
    ccclass,
    help,
    executeInEditMode,
    menu,
    editable,
    serializable,
} from 'cc.decorator';
import { ConstraintComponent } from './constraint-component';
import { IVec3Like, Vec3 } from '../../../../core';
import { EConstraintType } from '../../physics-enum';

@ccclass('cc.HingeConstraintComponent')
@help('i18n:cc.HingeConstraintComponent')
@menu('Physics/HingeConstraint(beta)')
export class HingeConstraintComponent extends ConstraintComponent {

    @serializable
    @editable
    axisA: IVec3Like = new Vec3();

    @serializable
    @editable
    axisB: IVec3Like = new Vec3();

    @serializable
    @editable
    pivotA: IVec3Like = new Vec3();

    @serializable
    @editable
    pivotB: IVec3Like = new Vec3();

    constructor () {
        super(EConstraintType.HINGE);
    }
}
