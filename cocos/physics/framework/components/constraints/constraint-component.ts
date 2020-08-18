/**
 * @category physics
 */

import { ccclass, property, requireComponent, displayOrder, type, immutable } from '../../../../core/data/class-decorator';
import { Component } from '../../../../core';
import { RigidBodyComponent } from '../rigid-body-component';
import { Eventify } from '../../../../core/event';
import { IBaseConstraint } from '../../../spec/i-physics-constraint';
import { EDITOR } from 'internal:constants';
import { createConstraint } from '../../instance';
import { EConstraintType } from '../../physics-enum';

@ccclass('cc.ConstraintComponent')
@requireComponent(RigidBodyComponent)
export class ConstraintComponent extends Eventify(Component) {

    static readonly EConstraintType = EConstraintType;

    @type(RigidBodyComponent)
    @immutable(true)
    @displayOrder(-2)
    get attachedBody (): RigidBodyComponent | null {
        return this.getComponent(RigidBodyComponent);
    }

    @type(RigidBodyComponent)
    @displayOrder(-1)
    get connectedBody (): RigidBodyComponent | null {
        return this._connectedBody;
    }

    set connectedBody (v: RigidBodyComponent | null) {
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

    @property
    protected _enableCollision = true;

    @type(RigidBodyComponent)
    protected _connectedBody: RigidBodyComponent | null = null;

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

export namespace ConstraintComponent {
    export type EConstraintType = EnumAlias<typeof EConstraintType>;
}
