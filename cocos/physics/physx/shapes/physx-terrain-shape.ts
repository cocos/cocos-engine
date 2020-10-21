import { IVec3Like, Quat, Vec3 } from "../../../core";
import { aabb, sphere } from "../../../core/geometry";
import { TerrainCollider } from "../../framework";
import { ITerrainAsset } from "../../spec/i-external";
import { ITerrainShape } from "../../spec/i-physics-shape";
import { PX, _trans } from "../export-physx";
import { EPhysXShapeType, PhysXShape } from "./physx-shape";

export class PhysXTerrainShape extends PhysXShape implements ITerrainShape {

    static heightScale = 1 / 1000;

    constructor () {
        super(EPhysXShapeType.TERRAIN);
    }

    setTerrain (v: ITerrainAsset | null): void {
        if (v && this._impl == null) {
            const wrappedWorld = this._sharedBody.wrappedWorld;
            const physics = wrappedWorld.physics;
            const collider = this.collider;
            if (PX.TERRAIN_STATIC[v._uuid] == null) {
                const cooking = wrappedWorld.cooking;
                const terrain = v;
                const sizeI = terrain.getVertexCountI();
                const sizeJ = terrain.getVertexCountJ();
                const samples = new PX.PxHeightFieldSampleVector();
                for (let j = 0; j < sizeJ; j++) {
                    for (let i = 0; i < sizeI; i++) {
                        const s = new PX.PxHeightFieldSample();
                        s.height = terrain.getHeight(i, j) / PhysXTerrainShape.heightScale;
                        samples.push_back(s);
                    }
                }
                PX.TERRAIN_STATIC[v._uuid] = cooking.createHeightFieldExt(sizeI, sizeJ, samples, physics);
            }
            const hf = PX.TERRAIN_STATIC[v._uuid];
            const geometry = new PX.PxHeightFieldGeometry(
                hf, new PX.PxMeshGeometryFlags(1),
                PhysXTerrainShape.heightScale,
                v.tileSize,
                v.tileSize
            );
            const pxmat = this.getSharedMaterial(collider.sharedMaterial!);
            this._impl = physics.createShape(geometry, pxmat, true, this._flags);
        }
    }

    get collider () {
        return this._collider as TerrainCollider;
    }

    onComponentSet () {
        this.setTerrain(this.collider.terrain);
    }

    updateScale () {
        this.setCenter(this._collider.center);
    }
}
