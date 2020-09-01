/**
 * @category physics
 */

import { ccclass, requireComponent, displayOrder, type, readOnly, serializable } from 'cc.decorator';
import { Component } from '../../../../core';
import { RigidBody } from '../rigid-body';
import { Eventify } from '../../../../core/event';
import { IBaseConstraint } from '../../../spec/i-physics-constraint';
import { EDITOR } from 'internal:constants';
import { createConstraint } from '../../instance';
import { EConstraintType } from '../../physics-enum';

@ccclass('cc.Constraint')
@requireComponent(RigidBody)
export class Constraint extends Eventify(Component) {

    static readonly EConstraintType = EConstraintType;

    @type(RigidBody)
    @readOnly
    @displayOrder(-2)
    get attachedBody (): RigidBody | null {
        return this.getComponent(RigidBody);
    }

    @type(RigidBody)
    @displayOrder(-1)
    get connectedBody (): RigidBody | null {
        return this._connectedBody;
    }

    set connectedBody (v: RigidBody | null) {
        this._connectedBody = v;
        if (!EDITOR) {
            if (this._constraint) this._constraint.setConnectedBody(v);
        }
    }

    @displayOrder(0)
    get enableCollision () {
        return this._enableCollision;
    }

    set enableCollision (v) {
        this._enableCollision = v;
        if (!EDITOR) {
            if (this._constraint) this._constraint.setEnableCollision(v);
        }
    }

    readonly TYPE: EConstraintType;

    /// PROTECTED PROPERTY ///

    @serializable
    protected _enableCollision = true;

    @type(RigidBody)
    protected _connectedBody: RigidBody | null = null;

    protected _constraint: IBaseConstraint | null = null;

    constructor (type: EConstraintType) {
        super();
        this.TYPE = type;
    }

    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        if (!EDITOR) {
            this._constraint = createConstraint(this.TYPE);
            this._constraint.initialize(this);
            this._constraint.onLoad!();
        }
    }

    protected onEnable () {
        if (this._constraint) {
            this._constraint.onEnable!();
        }
    }

    protected onDisable () {
        if (this._constraint) {
            this._constraint.onDisable!();
        }
    }

    protected onDestroy () {
        if (this._constraint) {
            this._constraint.onDestroy!();
        }
    }
}

export namespace Constraint {
    export type EConstraintType = EnumAlias<typeof EConstraintType>;
}
