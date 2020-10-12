/**
 * @hidden
 */

import { IRigidBody2D } from '../spec/i-rigid-body';
import { WRAPPER } from './physics-selector';
import { IBoxShape, ICircleShape, IPolygonShape, IBaseShape } from '../spec/i-physics-shape';
import { IPhysicsWorld } from '../spec/i-physics-world';
import { errorID, warnID, warn } from '../../core';
import { EDITOR, DEBUG, TEST } from 'internal:constants';
import { ECollider2DType, EJoint2DType,  } from './physics-types';
import { legacyCC } from '../../core/global-exports';
import { IJoint2D, IDistanceJoint, ISpringJoint, IFixedJoint, IMouseJoint, IRelativeJoint, ISliderJoint, IWheelJoint, IHingeJoint } from '../spec/i-physics-joint';

export function checkPhysicsModule (obj: any) {
    if (DEBUG && !TEST && !EDITOR && obj == null) {
        errorID(9600);
        return true;
    }
    return false;
}

export function createPhysicsWorld (): IPhysicsWorld {
    if (DEBUG && checkPhysicsModule(WRAPPER.PhysicsWorld)) { return null as any; }
    return new WRAPPER.PhysicsWorld() as IPhysicsWorld;
}

export function createRigidBody (): IRigidBody2D {
    if (DEBUG && checkPhysicsModule(WRAPPER.RigidBody)) { return null as any; }
    return new WRAPPER.RigidBody() as IRigidBody2D;
}

const FUNC = (...v: any) => { return 0 as any; };

// shapes
const CREATE_COLLIDER_PROXY = { INITED: false };

interface IEntireShape extends IBoxShape, ICircleShape, IPolygonShape { }
const ENTIRE_SHAPE: IEntireShape = {
    impl: null,
    collider: null as unknown as any,
    worldAABB: null as unknown as any,
    worldPoints: null as unknown as any,
    worldPosition: null as unknown as any,
    worldRadius: null as unknown as any,

    initialize: FUNC,
    apply: FUNC,
    
    onLoad: FUNC,
    onEnable: FUNC,
    onDisable: FUNC,
    onDestroy: FUNC,
    onGroupChanged: FUNC,
}

export function createShape (type: ECollider2DType): IBaseShape {
    initColliderProxy();
    return CREATE_COLLIDER_PROXY[type]();
}

function initColliderProxy () {
    if (CREATE_COLLIDER_PROXY.INITED) return;
    CREATE_COLLIDER_PROXY.INITED = true;

    CREATE_COLLIDER_PROXY[ECollider2DType.BOX] = function createBoxShape (): IBoxShape {
        if (DEBUG && checkPhysicsModule(WRAPPER.BoxShape)) { return ENTIRE_SHAPE; }
        return new WRAPPER.BoxShape() as IBoxShape;
    }

    CREATE_COLLIDER_PROXY[ECollider2DType.CIRCLE] = function createCircleShape (): ICircleShape {
        if (DEBUG && checkPhysicsModule(WRAPPER.CircleShape)) { return ENTIRE_SHAPE; }
        return new WRAPPER.CircleShape() as ICircleShape;
    }

    CREATE_COLLIDER_PROXY[ECollider2DType.POLYGON] = function createPolygonShape (): IPolygonShape {
        if (DEBUG && checkPhysicsModule(WRAPPER.PolygonShape)) { return ENTIRE_SHAPE; }
        return new WRAPPER.PolygonShape() as IPolygonShape;
    }
}

// joints
const CREATE_JOINT_PROXY = { INITED: false };

interface IEntireJoint extends IDistanceJoint, IFixedJoint, IMouseJoint, ISpringJoint, IRelativeJoint, ISliderJoint, IWheelJoint, IHingeJoint { }
const ENTIRE_JOINT: IEntireJoint = {
    impl: null,

    initialize: FUNC,

    setDampingRatio: FUNC,
    setFrequency: FUNC,
    setMaxForce: FUNC,
    setTarget: FUNC,
    setDistance: FUNC,
    setAngularOffset: FUNC,
    setCorrectionFactor: FUNC,
    setLinearOffset: FUNC,
    setMaxLength: FUNC,
    setMaxTorque: FUNC,
    setLowerLimit: FUNC,
    setUpperLimit: FUNC,
    setMaxMotorForce: FUNC,
    setMaxMotorTorque: FUNC,
    setMotorSpeed: FUNC,
    enableLimit: FUNC,
    enableMotor: FUNC,
    setLowerAngle: FUNC,
    setUpperAngle: FUNC,
}

export function createJoint (type: EJoint2DType): IJoint2D {
    initJointProxy();
    return CREATE_JOINT_PROXY[type]();
}

function initJointProxy () {
    if (CREATE_JOINT_PROXY.INITED) return;
    CREATE_JOINT_PROXY.INITED = true;

    CREATE_JOINT_PROXY[EJoint2DType.SPRING] = function createSpringJoint (): ISpringJoint {
        if (DEBUG && checkPhysicsModule(WRAPPER.SpringJoint)) { return ENTIRE_JOINT; }
        return new WRAPPER.SpringJoint() as ISpringJoint;
    }

    CREATE_JOINT_PROXY[EJoint2DType.DISTANCE] = function createDistanceJoint (): IDistanceJoint {
        if (DEBUG && checkPhysicsModule(WRAPPER.DistanceJoint)) { return ENTIRE_JOINT; }
        return new WRAPPER.DistanceJoint() as IDistanceJoint;
    }

    CREATE_JOINT_PROXY[EJoint2DType.FIXED] = function createFixedJoint (): IFixedJoint {
        if (DEBUG && checkPhysicsModule(WRAPPER.FixedJoint)) { return ENTIRE_JOINT; }
        return new WRAPPER.FixedJoint() as IFixedJoint;
    }

    CREATE_JOINT_PROXY[EJoint2DType.MOUSE] = function createMouseJoint (): IMouseJoint {
        if (DEBUG && checkPhysicsModule(WRAPPER.MouseJoint)) { return ENTIRE_JOINT; }
        return new WRAPPER.MouseJoint() as IMouseJoint;
    }

    CREATE_JOINT_PROXY[EJoint2DType.RELATIVE] = function createRelativeJoint (): IRelativeJoint {
        if (DEBUG && checkPhysicsModule(WRAPPER.RelativeJoint)) { return ENTIRE_JOINT; }
        return new WRAPPER.RelativeJoint() as IRelativeJoint;
    }

    CREATE_JOINT_PROXY[EJoint2DType.SLIDER] = function createSliderJoint (): ISliderJoint {
        if (DEBUG && checkPhysicsModule(WRAPPER.SliderJoint)) { return ENTIRE_JOINT; }
        return new WRAPPER.SliderJoint() as ISliderJoint;
    }

    CREATE_JOINT_PROXY[EJoint2DType.WHEEL] = function createWheelJoint (): IWheelJoint {
        if (DEBUG && checkPhysicsModule(WRAPPER.WheelJoint)) { return ENTIRE_JOINT; }
        return new WRAPPER.WheelJoint() as IWheelJoint;
    }

    CREATE_JOINT_PROXY[EJoint2DType.HINGE] = function createHingeJoint (): IHingeJoint {
        if (DEBUG && checkPhysicsModule(WRAPPER.HingeJoint)) { return ENTIRE_JOINT; }
        return new WRAPPER.HingeJoint() as IHingeJoint;
    }
}
