import b2 from '@cocos/box2d';
import { IJoint2D } from '../../spec/i-physics-joint';
import { Joint2D, PhysicsSystem2D, RigidBody2D } from '../../framework';
import { b2PhysicsWorld } from '../physics-world';

export class b2Joint implements IJoint2D {
    get impl () {
        return this._b2joint;
    }
    get comp () {
        return this._jointComp;
    }
    get body () {
        return this._body;
    }

    protected _b2joint: b2.Joint | null = null;
    protected _jointComp: Joint2D | null = null;
    protected _body: RigidBody2D | null = null;

    private _inited = false;

    initialize (comp: Joint2D) {
        this._jointComp = comp;
    }

    onEnable () {
        PhysicsSystem2D.instance._callAfterStep(this, this._init);
    }

    onDisable () {
        PhysicsSystem2D.instance._callAfterStep(this, this._destroy);
    }

    // need init after body and connected body init
    start () {
        PhysicsSystem2D.instance._callAfterStep(this, this._init);
    }

    _init () {
        if (this._inited) return;

        const comp = this._jointComp!;
        if (!comp.isValid) {
            return;
        }

        this._body = comp.getComponent(RigidBody2D);

        const def = this._createJointDef();
        if (!def) {
            return;
        }

        const connectedBody = comp.connectedBody;
        if (!connectedBody || !connectedBody.enabledInHierarchy) {
            return;
        }

        def.bodyA = this._body!.impl!.impl;
        def.bodyB = connectedBody.impl!.impl;
        def.collideConnected = comp.collideConnected;

        this._b2joint = (PhysicsSystem2D.instance.physicsWorld as b2PhysicsWorld).impl.CreateJoint(def);

        this._inited = true;
    }

    _destroy () {
        if (!this._inited) return;

        (PhysicsSystem2D.instance.physicsWorld as b2PhysicsWorld).impl.DestroyJoint(this._b2joint!);

        this._b2joint = null;
        this._inited = false;
    }

    _createJointDef (): b2.JointDef | null {
        return null;
    }

    isValid () {
        return this._b2joint && this._body && this._body.impl
            && this._jointComp && this._jointComp.connectedBody && this._jointComp.connectedBody.impl;
    }
}
