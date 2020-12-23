import { IVec3Like } from "../../../core";
import { aabb, sphere } from "../../../core/geometry";
import { Collider, RigidBody, PhysicMaterial, BoxCollider } from "../../framework";
import { VEC3_0 } from "../../utils/util";
import { IBoxShape } from "../../spec/i-physics-shape";
import { PX } from "../export-physx";
import { EPhysXShapeType, PhysXShape } from "./physx-shape";

export class PhysXBoxShape extends PhysXShape implements IBoxShape {

    static BOX_GEOMETRY;

    constructor () {
        super(EPhysXShapeType.BOX);
        if (!PhysXBoxShape.BOX_GEOMETRY) PhysXBoxShape.BOX_GEOMETRY = new PX.PxBoxGeometry(0.5, 0.5, 0.5);
    }

    setSize (v: IVec3Like): void {
        this.updateScale();
    }

    get collider () {
        return this._collider as BoxCollider;
    }

    onComponentSet () {        
        this.updateGeometry();
        const physics = this._sharedBody.wrappedWorld.physics;
        const pxmat = this.getSharedMaterial(this._collider.sharedMaterial!);
        this._impl = physics.createShape(PhysXBoxShape.BOX_GEOMETRY, pxmat, true, this._flags);
    }

    updateScale () {
        this.updateGeometry();
        this._impl.setGeometry(PhysXBoxShape.BOX_GEOMETRY);
    }

    updateGeometry () {
        const co = this.collider;
        const ws = co.node.worldScale;
        VEC3_0.set(co.size);
        VEC3_0.multiplyScalar(0.5);
        VEC3_0.multiply3f(Math.abs(ws.x), Math.abs(ws.y), Math.abs(ws.z));
        PhysXBoxShape.BOX_GEOMETRY.halfExtents = VEC3_0;
    }
}
