import CANNON from '@cocos/cannon';
import { ConstraintBase } from '../../api';
import { getWrap, setWrap } from '../../util';
import { CannonRigidBody } from '../cannon-rigid-body';

export class CannonConstraint implements ConstraintBase {
    protected _constraint: CANNON.Constraint;

    /**
     * @param first The first body.
     * @param second The second body.
     * @param options Options.
     */
    protected constructor (constraint: CANNON.Constraint) {
        this._constraint = constraint;
        setWrap<CannonConstraint>(this._constraint, this);
    }

    get first () {
        return getWrap<CannonRigidBody>(this._constraint.bodyA);
    }

    get second () {
        return getWrap<CannonRigidBody>(this._constraint.bodyB);
    }

    public enable () {
        this._constraint.enable();
    }

    public disable () {
        this._constraint.disable();
    }

    public update () {
        this._constraint.update();
    }

    public get impl () {
        return this._constraint;
    }
}
