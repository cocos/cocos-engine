import CANNON from 'cannon';
import { Vec3 } from '../../../../core/value-types';
import { IPointToPointConstraintOptions, PointToPointConstraintBase } from '../../api';
import { CannonRigidBody } from '../cannon-body';
import { toCannonVec3 } from '../cannon-util';
import { CannonConstraint } from './cannon-constraint';

export class CannonPointToPointConstraint extends CannonConstraint implements PointToPointConstraintBase {
    constructor (first: CannonRigidBody, firstPivot: Vec3, second: CannonRigidBody, secondPivot: Vec3, options?: IPointToPointConstraintOptions) {
        super(new CANNON.PointToPointConstraint(
            first.impl,
            toCannonVec3(firstPivot),
            second.impl,
            toCannonVec3(secondPivot),
            options === undefined ? undefined : options.maxForce));
    }
}
