import CANNON from '@cocos/cannon';
import { Vec3 } from '../../../core/math';
import { CannonConstraint } from './cannon-constraint';
import { CannonSharedBody } from '../cannon-shared-body';

export class CannonPointToPointConstraint extends CannonConstraint {
    constructor (first: CannonSharedBody, firstPivot: Vec3, second: CannonSharedBody, secondPivot: Vec3, options?: any) {
        super(new CANNON.PointToPointConstraint(
            first.body,
            Vec3.copy(new CANNON.Vec3(), firstPivot),
            second.body,
            Vec3.copy(new CANNON.Vec3(), secondPivot),
            options === undefined ? undefined : options.maxForce));
    }
}
