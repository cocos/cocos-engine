import { IVec3Like, Quat, Vec3 } from "../../../core";
import { aabb, sphere } from "../../../core/geometry";
import { TerrainCollider } from "../../framework";
import { ITerrainAsset } from "../../spec/i-external";
import { ITerrainShape } from "../../spec/i-physics-shape";
import { PX, USE_BYTEDANCE, _pxtrans, _trans } from "../export-physx";
import { EPhysXShapeType, PhysXShape } from "./physx-shape";

export class PhysXTerrainShape extends PhysXShape implements ITerrainShape {

    static heightScale = 1 / 5000;

    constructor () {
        super(EPhysXShapeType.TERRAIN);
    }

    setTerrain (v: ITerrainAsset | null): void {
        if (v && this._impl == null) {
            const wrappedWorld = this._sharedBody.wrappedWorld;
            const physics = wrappedWorld.physics as any;
            const collider = this.collider;
            if (PX.TERRAIN_STATIC[v._uuid] == null) {
                const cooking = wrappedWorld.cooking;
                const terrain = v;
                const sizeI = terrain.getVertexCountI();
                const sizeJ = terrain.getVertexCountJ();
                if (USE_BYTEDANCE) {
                    const samples = new PX.HeightFieldSamples(sizeI * sizeJ);
                    console.log("size", sizeI, sizeJ);
                    for (let i = 0; i < sizeI; i++) {
                        for (let j = 0; j < sizeJ; j++) {
                            // const s = new PX.HeightFieldSample();
                            // s.height = terrain.getHeight(i, j) / PhysXTerrainShape.heightScale;
                            const s = terrain.getHeight(i, j) / PhysXTerrainShape.heightScale;
                            if (isNaN(s)) console.error("nan ", s);
                            const index = j + i * sizeJ;
                            samples.setHeightAtIndex(index, s);
                            // samples.setMaterialIndex0AtIndex(index, 0);
                            // samples.setMaterialIndex1AtIndex(index, 0);
                        }
                    }
                    const hfdesc = new PX.HeightFieldDesc();
                    hfdesc.setNbRows(sizeJ);
                    hfdesc.setNbColumns(sizeI);
                    hfdesc.setSamples(samples);
                    PX.TERRAIN_STATIC[v._uuid] = cooking.createHeightField(hfdesc);
                } else {
                    const samples = new PX.PxHeightFieldSampleVector();
                    for (let i = 0; i < sizeI; i++) {
                        for (let j = 0; j < sizeJ; j++) {
                            const s = new PX.PxHeightFieldSample();
                            s.height = terrain.getHeight(i, j) / PhysXTerrainShape.heightScale;
                            samples.push_back(s);
                        }
                    }
                    PX.TERRAIN_STATIC[v._uuid] = cooking.createHeightFieldExt(sizeI, sizeJ, samples, physics);
                }
            }
            const hf = PX.TERRAIN_STATIC[v._uuid];
            const pxmat = this.getSharedMaterial(collider.sharedMaterial!);
            if (USE_BYTEDANCE) {
                const geometry = new PX.HeightFieldGeometry(hf, PhysXTerrainShape.heightScale, v.tileSize, v.tileSize);
                this._impl = physics.createShape(geometry, pxmat);
                const isT = this._collider.isTrigger;
                if (isT) {
                    this._impl.setFlag(PX.ShapeFlag.eSIMULATION_SHAPE, !isT)
                    this._impl.setFlag(PX.ShapeFlag.eTRIGGER_SHAPE, !!isT);
                } else {
                    this._impl.setFlag(PX.ShapeFlag.eTRIGGER_SHAPE, !!isT);
                    this._impl.setFlag(PX.ShapeFlag.eSIMULATION_SHAPE, !isT)
                }
            } else {
                const geometry = new PX.PxHeightFieldGeometry(
                    hf, new PX.PxMeshGeometryFlags(1),
                    PhysXTerrainShape.heightScale,
                    v.tileSize, v.tileSize
                );
                this._impl = physics.createShape(geometry, pxmat, true, this._flags);
            }
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

    //overwrite
    setCenter (v: IVec3Like): void {
        const pos = _trans.translation;
        const rot = _trans.rotation;
        Vec3.copy(pos, v);
        Quat.copy(rot, this._rotation);
        if (USE_BYTEDANCE) {
            _pxtrans.setPosition(pos);
            _pxtrans.setQuaternion(rot);
            this._impl.setLocalPose(_pxtrans);
        } else {
            this._impl.setLocalPose(_trans);
        }
    }
}
