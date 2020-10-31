import Ammo from '../ammo-instantiated';
import { AmmoShape } from "./ammo-shape";
import { Vec3, warn } from "../../../core";
import { TerrainCollider } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ITerrainShape } from '../../spec/i-physics-shape';
import { ITerrainAsset } from '../../spec/i-external';
import { CC_V3_0, AmmoConstant } from '../ammo-const';
import { IVec3Like } from '../../../core/math/type-define';

export class AmmoTerrainShape extends AmmoShape implements ITerrainShape {

    public get collider () {
        return this._collider as TerrainCollider;
    }

    public get impl () {
        return this._btShape as Ammo.btHeightfieldTerrainShape;
    }

    setTerrain (v: ITerrainAsset | null): void {
        if (!this._isBinding) return;

        if (this._btShape != null && this._btShape != AmmoConstant.instance.EMPTY_SHAPE) {
            // TODO: change the terrain asset after initialization
            warn("[Physics] Ammo change the terrain asset after initialization is not support.");
        } else {
            const terrain = v;
            if (terrain) {
                this._terrainID = terrain._uuid;
                this._tileSize = terrain.tileSize;
                const sizeI = terrain.getVertexCountI();
                const sizeJ = terrain.getVertexCountJ();
                this._buffPtr = Ammo._malloc(4 * sizeI * sizeJ);
                let offset = 0;
                let maxHeight = Number.MIN_VALUE;
                let minHeight = Number.MAX_VALUE;
                for (let j = 0; j < sizeJ; j++) {
                    for (let i = 0; i < sizeI; i++) {
                        const v = terrain.getHeight(i, j);
                        Ammo.HEAPF32[this._buffPtr + offset >> 2] = v;
                        maxHeight = maxHeight < v ? v : maxHeight;
                        minHeight = minHeight > v ? v : minHeight;
                        offset += 4;
                    }
                }
                maxHeight += 0.1;
                minHeight -= 0.1;
                this._localOffset.set((sizeI - 1) / 2 * this._tileSize, (maxHeight + minHeight) / 2, (sizeJ - 1) / 2 * this._tileSize);
                const heightScale = 1;
                const hdt = "PHY_FLOAT";
                const upAxis = 1;
                const flipQuadEdges = false;
                this._btShape = new Ammo.btHeightfieldTerrainShape(
                    sizeI, sizeJ, this._buffPtr, heightScale,
                    minHeight, maxHeight, upAxis, hdt, flipQuadEdges
                );
                this.scale.setValue(this._tileSize, 1, this._tileSize);
                this._btShape.setLocalScaling(this.scale);
            } else {
                this._btShape = AmmoConstant.instance.EMPTY_SHAPE;
            }
        }
    }

    private _terrainID: string;
    private _buffPtr: number;
    private _tileSize: number;
    private _localOffset: Vec3;

    constructor () {
        super(AmmoBroadphaseNativeTypes.TERRAIN_SHAPE_PROXYTYPE);
        this._terrainID = '';
        this._buffPtr = 0;
        this._tileSize = 0;
        this._localOffset = new Vec3();
    }

    onComponentSet () {
        this.setTerrain(this.collider.terrain);
    }

    onDestroy () {
        if (this._buffPtr) Ammo['_free'](this._buffPtr);
        super.onDestroy();
    }

    setCompound (compound: Ammo.btCompoundShape | null) {
        super.setCompound(compound);
        this.impl.setUserIndex(this._index);
    }

    setCenter (v: IVec3Like) {
        Vec3.copy(CC_V3_0, v);
        CC_V3_0.add(this._localOffset);
        // CC_V3_0.multiply(this._collider.node.worldScale);
        cocos2AmmoVec3(this.transform.getOrigin(), CC_V3_0);
        this.updateCompoundTransform();
    }

    // setScale () {
    //     // TODO: handle scale
    // }

}
