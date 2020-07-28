/**
 * @hidden
 */
interface IPhysicsWrapperObject {
    PhysicsWorld: any,
    RigidBody?: any,

    BoxShape: any,
    SphereShape: any,
    CapsuleShape?: any,
    TrimeshShape?: any,
    CylinderShape?: any,
    ConeShape?: any,
    TerrainShape?: any,
    SimplexShape?: any,
    PlaneShape?: any,

    PointToPointConstraint?: any,
    HingeConstraint?: any,
    ConeTwistConstraint?: any,
}

export let WRAPPER: IPhysicsWrapperObject;
type WrapperCallBack = () => IPhysicsWrapperObject | null;
let callback: WrapperCallBack[] = [];
export function registerSelectorCB (cb: WrapperCallBack) {
    const index = callback.indexOf(cb);
    if (index < 0) {
        callback.push(cb);
    }
}

export function initPhysicsSelector () {
    for (let i = 0; i < callback.length; i++) {
        const obj = callback[i]();
        if (obj) {
            WRAPPER = obj;
            return;
        }
    }
}
