import CANNON from '@cocos/cannon';
import { IDistanceConstraintOptions } from '../../api';
import { CannonConstraint } from './cannon-constraint';

export class CannonDistanceConstraint extends CannonConstraint {
    constructor (first: any, second: any, distance?: number, options?: IDistanceConstraintOptions) {
        super(new CANNON.DistanceConstraint(
            first.impl,
            second.impl,
            distance!,
            options === undefined ? undefined : options.maxForce));
    }
}
