import { select } from '../framework/physics-selector';
import { b2PhysicsWorld } from './physics-world';
import { b2RigidBody2D } from './rigid-body';
import { b2BoxShape } from './shapes/box-shape-2d';
import { b2CircleShape } from './shapes/circle-shape-2d';
import { b2PolygonShape } from './shapes/polygon-shape-2d';
import { b2MouseJoint } from './joints/mouse-joint';
import { b2DistanceJoint } from './joints/distance-joint';
import { b2SpringJoint } from './joints/spring-joint';
import { b2RelativeJoint } from './joints/relative-joint';
import { b2SliderJoint } from './joints/slider-joint';
import { b2FixedJoint } from './joints/fixed-joint';
import { b2WheelJoint } from './joints/wheel-joint';
import { b2HingeJoint } from './joints/hinge-joint';

select('box2d', {
    PhysicsWorld: b2PhysicsWorld,
    RigidBody: b2RigidBody2D,

    BoxShape: b2BoxShape,
    CircleShape: b2CircleShape,
    PolygonShape: b2PolygonShape,

    MouseJoint: b2MouseJoint,
    DistanceJoint: b2DistanceJoint,
    SpringJoint: b2SpringJoint,
    RelativeJoint: b2RelativeJoint,
    SliderJoint: b2SliderJoint,
    FixedJoint: b2FixedJoint,
    WheelJoint: b2WheelJoint,
    HingeJoint: b2HingeJoint,
});
