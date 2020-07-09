/**
 * @category physics
 */

import { ccclass, property, requireComponent } from '../../../../core/data/class-decorator';
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

    @property({
        type: RigidBodyComponent,
        displayOrder: -2,
        readonly: true,
    })
    get attachedBody (): RigidBodyComponent | null {
        return this.getComponent(RigidBodyComponent);
    }

    @property({
        type: RigidBodyComponent,
        displayOrder: -1,
    })
    get connectedBody (): RigidBodyComponent | null {
        return this._connectedBody;
    }

    set connectedBody (v: RigidBodyComponent | null) {
        this._connectedBody = v;
    }

    @property({
        displayOrder: 0,
    })
    get collideConnected () {
        return this._collideConnected;
    }

    set collideConnected (v) {
        this._collideConnected = v;
    }

    readonly TYPE: EConstraintType;

    /// PROTECTED PROPERTY ///

    @property
    protected _collideConnected = true;

    @property({ type: RigidBodyComponent })
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
