/**
 * @packageDocumentation
 * @hidden
 */
import b2 from '@cocos/box2d';
import { IMouseJoint } from '../../spec/i-physics-joint';
import { b2Joint } from './joint-2d';
import { MouseJoint2D, PhysicsSystem2D, Joint2D } from '../../framework';
import { PHYSICS_2D_PTM_RATIO } from '../../framework/physics-types';
import { IVec2Like, Vec2, find } from '../../../core';
import { Touch } from '../../../input/types';
import { b2PhysicsWorld } from '../physics-world';
import { NodeEventType } from '../../../core/scene-graph/node-event';

const tempB2Vec2 = new b2.Vec2();

export class b2MouseJoint extends b2Joint implements IMouseJoint {
    _touchPoint = new Vec2();
    _isTouched = false;

    setTarget (v: IVec2Like) {
        if (this._b2joint) {
            tempB2Vec2.x = v.x / PHYSICS_2D_PTM_RATIO;
            tempB2Vec2.y = v.y / PHYSICS_2D_PTM_RATIO;
            (this._b2joint as b2.MouseJoint).SetTarget(tempB2Vec2);
        }
    }
    setDampingRatio (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.MouseJoint).SetDampingRatio(v);
        }
    }
    setFrequency (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.MouseJoint).SetFrequency(v);
        }
    }
    setMaxForce (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.MouseJoint).SetMaxForce(v);
        }
    }

    _createJointDef () {
        const def = new b2.MouseJointDef();
        const comp = this._jointComp as MouseJoint2D;
        def.target.Set(this._touchPoint.x / PHYSICS_2D_PTM_RATIO, this._touchPoint.y / PHYSICS_2D_PTM_RATIO);
        def.maxForce = comp.maxForce;
        def.dampingRatio = comp.dampingRatio;
        def.frequencyHz = comp.frequency;
        return def;
    }

    initialize (comp: Joint2D) {
        super.initialize(comp);

        const canvas = find('Canvas');
        if (canvas) {
            canvas.on(NodeEventType.TOUCH_START, this.onTouchBegan, this);
            canvas.on(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
            canvas.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
            canvas.on(NodeEventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
    }

    onEnable () {
    }

    start () {
    }

    onTouchBegan (event: Touch) {
        this._isTouched = true;

        const target = this._touchPoint.set(event.getUILocation());

        const world = (PhysicsSystem2D.instance.physicsWorld as b2PhysicsWorld);
        const colliders = world.testPoint(target);
        if (colliders.length <= 0) return;

        const body = colliders[0].body;
        body!.wakeUp();

        const comp = this._jointComp as MouseJoint2D;
        comp.connectedBody = body;

        this._init();

        this.setMaxForce(comp.maxForce * body!.getMass());
        this.setTarget(target);
    }

    onTouchMove (event: Touch) {
        this._touchPoint = event.getUILocation();
    }

    onTouchEnd (event: Touch) {
        this._destroy();
        this._isTouched = false;
    }

    update () {
        if (!this._isTouched || !this.isValid()) {
            return;
        }

        // let camera = cc.Camera.findCamera(this.node);
        // if (camera) {
        //     this.target = camera.getScreenToWorldPoint(this._touchPoint);
        // }
        // else {
        this.setTarget(this._touchPoint);
        // }
    }
}
