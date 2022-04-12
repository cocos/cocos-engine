import { legacyCC } from '../../core/global-exports';

interface IPhysicsWrapperObject {
    PhysicsWorld: any,
    RigidBody?: any,

    BoxShape: any,
    CircleShape: any,
    PolygonShape?: any,

    DistanceJoint: any,
    FixedJoint: any,
    MouseJoint: any,
    SpringJoint: any,
    RelativeJoint: any,
    SliderJoint: any,
    WheelJoint: any,
    HingeJoint: any,
}

type IPhysicsEngineId = 'builtin' | 'box2d' | string | undefined;

export let WRAPPER: IPhysicsWrapperObject;

export let physicsEngineId: IPhysicsEngineId;

export function select (id: IPhysicsEngineId, wrapper: IPhysicsWrapperObject) {
    physicsEngineId = id;
    legacyCC._global.CC_PHYSICS_2D_BUILTIN = id == 'builtin';
    legacyCC._global.CC_PHYSICS_2D_BOX2D = id == 'box2d';

    WRAPPER = wrapper;
}
