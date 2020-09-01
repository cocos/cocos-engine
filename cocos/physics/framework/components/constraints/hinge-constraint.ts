/**
 * @category physics
 */

import {
    ccclass,
    help,
    menu,
    editable,
    serializable,
} from 'cc.decorator';
import { Constraint } from './constraint';
import { IVec3Like, Vec3 } from '../../../../core';
import { EConstraintType } from '../../physics-enum';

@ccclass('cc.HingeConstraint')
@help('i18n:cc.HingeConstraint')
@menu('Physics/HingeConstraint(beta)')
export class HingeConstraint extends Constraint {

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
