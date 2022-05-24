

import { EDITOR } from 'internal:constants';
import { Component, Vec2 } from '../../../../core';
import { property, type, ccclass } from '../../../../core/data/class-decorator';
import { RigidBody2D } from '../rigid-body-2d';
import { IJoint2D } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { createJoint } from '../../instance';

@ccclass('cc.Joint2D')
export class Joint2D extends Component {
    @property
    anchor = new Vec2();

    @property
    connectedAnchor = new Vec2();

    @property
    collideConnected = false;

    @type(RigidBody2D)
    connectedBody: RigidBody2D | null = null;

    _body: RigidBody2D | null = null
    get body () {
        return this._body;
    }

    get impl () {
        return this._joint;
    }

    protected _joint: IJoint2D | null = null;

    TYPE = EJoint2DType.None;

    protected onLoad () {
        if (!EDITOR) {
            this._joint = createJoint(this.TYPE);
            this._joint.initialize(this);

            this._body = this.getComponent(RigidBody2D);
        }
    }

    protected onEnable () {
        if (this._joint && this._joint.onEnable) {
            this._joint.onEnable();
        }
    }

    protected onDisable () {
        if (this._joint && this._joint.onDisable) {
            this._joint.onDisable();
        }
    }

    protected start () {
        if (this._joint && this._joint.start) {
            this._joint.start();
        }
    }

    protected onDestroy () {
        if (this._joint && this._joint.onDestroy) {
            this._joint.onDestroy();
        }
    }
}
