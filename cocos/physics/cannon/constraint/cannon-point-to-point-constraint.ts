import CANNON from '@cocos/cannon';
import { Vec3 } from '../../../core/math';
import { IPointToPointConstraintOptions, PointToPointConstraintBase } from '../../api';
import { CannonRigidBody } from '../cannon-body';
import { CannonConstraint } from './cannon-constraint';

export class CannonPointToPointConstraint extends CannonConstraint implements PointToPointConstraintBase {
    constructor (first: CannonRigidBody, firstPivot: Vec3, second: CannonRigidBody, secondPivot: Vec3, options?: IPointToPointConstraintOptions) {
        super(new CANNON.PointToPointConstraint(
            first.impl,
            Vec3.copy(new CANNON.Vec3(), firstPivot),
            second.impl,
            Vec3.copy(new CANNON.Vec3(), secondPivot),
            options === undefined ? undefined : options.maxForce));
    }
}
