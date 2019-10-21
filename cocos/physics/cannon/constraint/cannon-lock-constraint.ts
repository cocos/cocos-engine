import CANNON from '@cocos/cannon';
import { DistanceConstraintBase, IDistanceConstraintOptions } from '../../api';
import { CannonRigidBody } from '../cannon-body';
import { CannonConstraint } from './cannon-constraint';

export class CannonDistanceConstraint extends CannonConstraint implements DistanceConstraintBase {
    constructor (first: CannonRigidBody, second: CannonRigidBody, distance?: number, options?: IDistanceConstraintOptions) {
        super(new CANNON.DistanceConstraint(
            first.impl,
            second.impl,
            distance!,
            options === undefined ? undefined : options.maxForce));
    }
}
