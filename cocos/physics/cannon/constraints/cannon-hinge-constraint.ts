
import CANNON from '@cocos/cannon';
import { CannonConstraint } from './cannon-constraint';
import { IPointToPointConstraint, IHingeConstraint } from '../../spec/i-physics-constraint';
import { IVec3Like, Vec3 } from '../../../core';

export class CannonHingeConstraint extends CannonConstraint implements IHingeConstraint {
    
}
