/**
 * @hidden
 */

import { ILifecycle } from './i-lifecycle'
import { ConstraintComponent, RigidBodyComponent } from '../framework';
import { IVec3Like } from '../../core';

export interface IBaseConstraint extends ILifecycle {
    readonly impl: any;
    initialize (v: ConstraintComponent): void;
    setConnectedBody (v: RigidBodyComponent | null): void;
    setEnableCollision (v: boolean): void;
}

export interface IPointToPointConstraint extends IBaseConstraint {
    setPivotA (v: IVec3Like): void;
    setPivotB (v: IVec3Like): void;
}

export interface IHingeConstraint extends IBaseConstraint {

}

export interface IConeTwistConstraint extends IBaseConstraint {

}
