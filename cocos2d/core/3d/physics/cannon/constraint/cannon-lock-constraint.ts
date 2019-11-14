import CANNON from '@cocos/cannon';
import { IDistanceConstraintOptions } from '../../api';
import { CannonConstraint } from './cannon-constraint';
import { CannonSharedBody } from '../cannon-shared-body';

export class CannonDistanceConstraint extends CannonConstraint {
    constructor (first: CannonSharedBody, second: CannonSharedBody, distance?: number, options?: IDistanceConstraintOptions) {
        super(new CANNON.DistanceConstraint(
            first.body,
            second.body,
            distance!,
            options === undefined ? undefined : options.maxForce));
    }
}
