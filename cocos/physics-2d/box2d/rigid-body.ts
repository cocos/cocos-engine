/**
 * @packageDocumentation
 * @hidden
 */

import b2 from '@cocos/box2d';
import { IRigidBody2D } from '../spec/i-rigid-body';
import { RigidBody2D } from '../framework/components/rigid-body-2d';
import { PhysicsSystem2D } from '../framework/physics-system';
import { b2PhysicsWorld } from './physics-world';
import { Vec2, toRadian, Vec3, Quat, IVec2Like, toDegree, game } from '../../core';
import { PHYSICS_2D_PTM_RATIO, ERigidBody2DType } from '../framework/physics-types';

import { Node } from '../../core/scene-graph/node';
import { Collider2D } from '../framework';
import { NodeEventType } from '../../core/scene-graph/node-event';

const tempVec3 = new Vec3();

const tempVec2_1 = new b2.Vec2();

export class b2RigidBody2D implements IRigidBody2D {
    get impl () {
        return this._body;
    }
    set _imp (v: b2.Body | null) {
        this._body = v;
    }

    get rigidBody () {
        return this._rigidBody;
    }
    get isAwake () {
        return this._body!.IsAwake();
    }
    get isSleeping () {
        return !(this._body!.IsAwake());
    }

    _animatedPos = new Vec2();
    _animatedAngle = 0;

    private _body: b2.Body | null = null;
    private _rigidBody!: RigidBody2D;

    private _inited = false;

    initialize (com: RigidBody2D) {
        this._rigidBody = com;

        PhysicsSystem2D.instance._callAfterStep(this, this._init);
    }

    onDestroy () {
        PhysicsSystem2D.instance._callAfterStep(this, this._destroy);
    }

    onEnable () {
        this.setActive(true);
    }

    onDisable () {
        this.setActive(false);
    }

    _registerNodeEvents () {
        const node = this.rigidBody.node;
        node.on(NodeEventType.TRANSFORM_CHANGED, this._onNodeTransformChanged, this);
    }

    _unregisterNodeEvents () {
        const node = this.rigidBody.node;
        node.off(NodeEventType.TRANSFORM_CHANGED, this._onNodeTransformChanged, this);
    }

    _onNodeTransformChanged (type) {
        if (PhysicsSystem2D.instance.stepping) {
            return;
        }

        if (type & Node.TransformBit.SCALE) {
            const colliders = this.rigidBody.getComponents(Collider2D);
            for (let i = 0; i < colliders.length; i++) {
                colliders[i].apply();
            }
        } else {
            if (type & Node.TransformBit.POSITION) {
                this.syncPositionToPhysics(true);
            }
            if (type & Node.TransformBit.ROTATION) {
                this.syncRotationToPhysics(true);
            }
        }
    }

    _init () {
        if (this._inited) {
            return;
        }

        this._registerNodeEvents();

        (PhysicsSystem2D.instance.physicsWorld as b2PhysicsWorld).addBody(this);

        this._inited = true;
    }

    _destroy () {
        if (!this._inited) return;

        (PhysicsSystem2D.instance.physicsWorld as b2PhysicsWorld).removeBody(this);
        this._unregisterNodeEvents();

        this._inited = false;
    }

    animate (dt: number) {
        const b2body = this._body;
        if (!b2body) return;
        const b2Pos = b2body.GetPosition();

        b2body.SetAwake(true);

        const timeStep = 1 / dt;
        tempVec2_1.x = (this._animatedPos.x - b2Pos.x) * timeStep;
        tempVec2_1.y = (this._animatedPos.y - b2Pos.y) * timeStep;
        b2body.SetLinearVelocity(tempVec2_1);

        const b2Rotation = b2body.GetAngle();
        b2body.SetAngularVelocity((this._animatedAngle - b2Rotation) * timeStep);
    }

    syncPositionToPhysics (enableAnimated = false) {
        const b2body = this._body;
        if (!b2body) return;

        const pos = this._rigidBody.node.worldPosition;

        let temp;
        const bodyType = this._rigidBody.type;
        if (bodyType === ERigidBody2DType.Animated) {
            temp = b2body.GetLinearVelocity();
        } else {
            temp = b2body.GetPosition();
        }

        temp.x = pos.x / PHYSICS_2D_PTM_RATIO;
        temp.y = pos.y / PHYSICS_2D_PTM_RATIO;

        if (bodyType === ERigidBody2DType.Animated && enableAnimated) {
            this._animatedPos.set(temp.x, temp.y);
        } else {
            b2body.SetTransformVec(temp, b2body.GetAngle());
        }
    }

    syncRotationToPhysics (enableAnimated = false) {
        const b2body = this._body;
        if (!b2body) return;

        const rotation = toRadian(this._rigidBody.node.eulerAngles.z);
        const bodyType = this._rigidBody.type;
        if (bodyType === ERigidBody2DType.Animated && enableAnimated) {
            this._animatedAngle = rotation;
        } else {
            b2body.SetTransformVec(b2body.GetPosition(), rotation);
        }
    }

    resetVelocity () {
        const b2body = this._body;
        if (!b2body) return;

        const temp = b2body.GetLinearVelocity();
        temp.Set(0, 0);

        b2body.SetLinearVelocity(temp);
        b2body.SetAngularVelocity(0);
    }

    setType (v: ERigidBody2DType) {
        this._body!.SetType(v as number);
    }
    setLinearDamping (v: number) {
        this._body!.SetLinearDamping(v);
    }
    setAngularDamping (v: number) {
        this._body!.SetAngularDamping(v);
    }
    setGravityScale (v: number) {
        this._body!.SetGravityScale(v);
    }
    setFixedRotation (v: boolean) {
        this._body!.SetFixedRotation(v);
    }
    setAllowSleep (v: boolean) {
        this._body!.SetSleepingAllowed(v);
    }
    isActive () {
        return this._body!.IsActive();
    }
    setActive (v: boolean) {
        this._body!.SetActive(v);
    }
    wakeUp () {
        this._body!.SetAwake(true);
    }
    sleep () {
        this._body!.SetAwake(false);
    }
    getMass () {
        return this._body!.GetMass();
    }
    setLinearVelocity (v: IVec2Like) {
        this._body!.SetLinearVelocity(new b2.Vec2(v.x, v.y));
    }
    getLinearVelocity<Out extends IVec2Like> (out: Out): Out {
        const velocity = this._body!.GetLinearVelocity();
        out.x = velocity.x;
        out.y = velocity.y;
        return out;
    }
    getLinearVelocityFromWorldPoint<Out extends IVec2Like> (worldPoint: IVec2Like, out: Out): Out {
        tempVec2_1.Set(worldPoint.x / PHYSICS_2D_PTM_RATIO, worldPoint.y / PHYSICS_2D_PTM_RATIO);
        this._body!.GetLinearVelocityFromWorldPoint(tempVec2_1, out as any);
        out.x *= PHYSICS_2D_PTM_RATIO;
        out.y *= PHYSICS_2D_PTM_RATIO;
        return out;
    }
    setAngularVelocity (v: number) {
        this._body!.SetAngularVelocity(v);
    }
    getAngularVelocity () {
        return toDegree(this._body!.GetAngularVelocity());
    }

    getLocalVector<Out extends IVec2Like> (worldVector: IVec2Like, out: Out): Out {
        out = out || new Vec2();
        tempVec2_1.Set(worldVector.x / PHYSICS_2D_PTM_RATIO, worldVector.y / PHYSICS_2D_PTM_RATIO);
        const tmp = this._body!.GetLocalVector(tempVec2_1, out as any);
        out.x = tmp.x * PHYSICS_2D_PTM_RATIO;
        out.y = tmp.y * PHYSICS_2D_PTM_RATIO;
        return out;
    }
    
    getWorldVector<Out extends IVec2Like> (localVector: IVec2Like, out: Out): Out {
        tempVec2_1.Set(localVector.x / PHYSICS_2D_PTM_RATIO, localVector.y / PHYSICS_2D_PTM_RATIO);
        const tmp = this._body!.GetWorldVector(tempVec2_1, out as any);
        out.x = tmp.x * PHYSICS_2D_PTM_RATIO;
        out.y = tmp.y * PHYSICS_2D_PTM_RATIO;
        return out;
    }

    getLocalPoint<Out extends IVec2Like> (worldPoint: IVec2Like, out: Out): Out {
        out = out || new Vec2();
        tempVec2_1.Set(worldPoint.x / PHYSICS_2D_PTM_RATIO, worldPoint.y / PHYSICS_2D_PTM_RATIO);
        const tmp = this._body!.GetLocalPoint(tempVec2_1, out as any);
        out.x = tmp.x * PHYSICS_2D_PTM_RATIO;
        out.y = tmp.y * PHYSICS_2D_PTM_RATIO;
        return out;
    }

    getWorldPoint<Out extends IVec2Like> (localPoint: IVec2Like, out: Out): Out {
        out = out || new Vec2();
        tempVec2_1.Set(localPoint.x / PHYSICS_2D_PTM_RATIO, localPoint.y / PHYSICS_2D_PTM_RATIO);
        const tmp = this._body!.GetWorldPoint(tempVec2_1, out as any);
        out.x = tmp.x * PHYSICS_2D_PTM_RATIO;
        out.y = tmp.y * PHYSICS_2D_PTM_RATIO;
        return out;
    }

    getLocalCenter<Out extends IVec2Like> (out: Out): Out {
        out = out || new Vec2();
        const pos = this._body!.GetLocalCenter();
        out.x = pos.x * PHYSICS_2D_PTM_RATIO;
        out.y = pos.y * PHYSICS_2D_PTM_RATIO;
        return out;
    }
    getWorldCenter<Out extends IVec2Like> (out: Out): Out {
        out = out || new Vec2();
        const pos = this._body!.GetWorldCenter();
        out.x = pos.x * PHYSICS_2D_PTM_RATIO;
        out.y = pos.y * PHYSICS_2D_PTM_RATIO;
        return out;
    }

    getInertia () {
        return this._body!.GetInertia();
    }

    applyForce (force: IVec2Like, point: IVec2Like, wake: boolean) {
        if (this._body) {
            tempVec2_1.Set(point.x / PHYSICS_2D_PTM_RATIO, point.y / PHYSICS_2D_PTM_RATIO);
            this._body.ApplyForce(new b2.Vec2(force.x, force.y), tempVec2_1, wake);
        }
    }

    applyForceToCenter (force: IVec2Like, wake: boolean) {
        if (this._body) {
            this._body.ApplyForceToCenter(new b2.Vec2(force.x, force.y), wake);
        }
    }

    applyTorque (torque: number, wake: boolean) {
        if (this._body) {
            this._body.ApplyTorque(torque, wake);
        }
    }

    applyLinearImpulse (impulse: IVec2Like, point: IVec2Like, wake: boolean) {
        if (this._body) {
            tempVec2_1.Set(point.x / PHYSICS_2D_PTM_RATIO, point.y / PHYSICS_2D_PTM_RATIO);
            this._body.ApplyLinearImpulse(new b2.Vec2(impulse.x, impulse.y), tempVec2_1, wake);
        }
    }

    applyLinearImpulseToCenter (impulse: IVec2Like, wake: boolean) {
        if (this._body) {
            this._body.ApplyLinearImpulse(new b2.Vec2(impulse.x, impulse.y), this._body.GetPosition(), wake);
        }
    }

    applyAngularImpulse (impulse: number, wake: boolean) {
        if (this._body) {
            this._body.ApplyAngularImpulse(impulse, wake);
        }
    }
}
