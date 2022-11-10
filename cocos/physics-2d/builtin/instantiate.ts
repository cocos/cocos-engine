import { selector } from '../framework/physics-selector';
import { BuiltinPhysicsWorld } from './builtin-world';
import { BuiltinBoxShape } from './shapes/box-shape-2d';
import { BuiltinCircleShape } from './shapes/circle-shape-2d';
import { BuiltinPolygonShape } from './shapes/polygon-shape-2d';

import { Game, game } from '../../game';

game.once(Game.EVENT_PRE_SUBSYSTEM_INIT, () => {
    selector.register('builtin', {
        PhysicsWorld: BuiltinPhysicsWorld,
        RigidBody: null,

        BoxShape: BuiltinBoxShape,
        CircleShape: BuiltinCircleShape,
        PolygonShape: BuiltinPolygonShape,

        MouseJoint: null,
        DistanceJoint: null,
        SpringJoint: null,
        RelativeJoint: null,
        SliderJoint: null,
        FixedJoint: null,
        WheelJoint: null,
        HingeJoint: null,
    });
});
