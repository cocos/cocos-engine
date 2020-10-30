import CANNON from '@cocos/cannon';
import { CannonShape } from './cannon-shape';
import { TerrainCollider } from '../../framework';
import { Vec3, Quat } from '../../../core';
import { ITerrainShape } from '../../spec/i-physics-shape';
import { ITerrainAsset } from '../../spec/i-external';
import { commitShapeUpdates } from '../cannon-util';
import { IVec3Like } from '../../../core/math/type-define';

const CANNON_AABB_LOCAL = new CANNON.AABB();
const CANNON_AABB = new CANNON.AABB();
const CANNON_TRANSFORM = new CANNON.Transform();
CANNON.Heightfield.prototype.calculateWorldAABB = function (pos: CANNON.Vec3, quat: CANNON.Quaternion, min: CANNON.Vec3, max: CANNON.Vec3) {
    var frame = CANNON_TRANSFORM;
    var result = CANNON_AABB;
    Vec3.copy(frame.position, pos);
    Quat.copy(frame.quaternion, quat);
    var s = this.elementSize;
    var data = this.data;
    CANNON_AABB_LOCAL.lowerBound.set(0, 0, this.minValue);
    CANNON_AABB_LOCAL.upperBound.set((data.length - 1) * s, (data[0].length - 1) * s, this.maxValue);
    CANNON_AABB_LOCAL.toWorldFrame(frame, result);
    min.copy(result.lowerBound);
    max.copy(result.upperBound);
}

export class CannonTerrainShape extends CannonShape implements ITerrainShape {

    get collider () {
        return this._collider as TerrainCollider;
    }

    get impl () {
        return this._shape as CANNON.Heightfield;
    }

    setTerrain (v: ITerrainAsset | null): void {
        if (v) {
            if (this._terrainID != v._uuid) {
                const terrain = v;
                const sizeI = terrain.getVertexCountI();
                const sizeJ = terrain.getVertexCountJ();
                this._terrainID = terrain._uuid;
                this.DATA.length = sizeI - 1;
                for (let i = 0; i < sizeI; i++) {
                    if (this.DATA[i] == null) this.DATA[i] = [];
                    this.DATA[i].length = sizeJ - 1;
                    for (let j = 0; j < sizeJ; j++) {
                        this.DATA[i][j] = terrain.getHeight(i, sizeJ - 1 - j);
                    }
                }
                this.OPTIONS.elementSize = terrain.tileSize;
                this.updateProperties(this.DATA, this.OPTIONS.elementSize);
            }
        } else {
            if (this._terrainID != '') {
                this._terrainID = '';
                this.DATA.length = 1;
                this.DATA[0] = this.DATA[0] || [];
                this.DATA[0].length = 0;
                this.OPTIONS.elementSize = 0;
                this.updateProperties(this.DATA, this.OPTIONS.elementSize);
            }
        }
    }

    readonly DATA: number[][];
    readonly OPTIONS: CANNON.IHightfield;
    private _terrainID: string;

    constructor () {
        super();
        this.DATA = [[]];
        this.OPTIONS = { elementSize: 0 };
        this._terrainID = '';
    }

    protected onComponentSet () {
        const terrain = this.collider.terrain;
        if (terrain) {
            const sizeI = terrain.getVertexCountI();
            const sizeJ = terrain.getVertexCountJ();
            for (let i = 0; i < sizeI; i++) {
                if (this.DATA[i] == null) this.DATA[i] = [];
                for (let j = 0; j < sizeJ; j++) {
                    this.DATA[i][j] = terrain.getHeight(i, sizeJ - 1 - j);
                }
            }
            this.OPTIONS.elementSize = terrain.tileSize;
            this._terrainID = terrain._uuid;
        }

        this._shape = new CANNON.Heightfield(this.DATA, this.OPTIONS);
    }

    onLoad () {
        super.onLoad();
        this.setTerrain(this.collider.terrain);
    }

    updateProperties (data: number[][], elementSize: number) {
        const impl = this.impl;
        impl.data = data;
        impl.elementSize = elementSize;
        impl.updateMinValue();
        impl.updateMaxValue();
        impl.updateBoundingSphereRadius();
        impl.update();
        if (this._index >= 0) {
            commitShapeUpdates(this._body);
        }
    }

    // override
    protected _setCenter (v: IVec3Like) {
        const terrain = this.collider.terrain;
        if (terrain) {
            Quat.fromEuler(this._orient, -90, 0, 0);
            const lpos = this._offset as IVec3Like;
            Vec3.set(lpos, 0, 0, (terrain.getVertexCountJ() - 1) * terrain.tileSize);
            Vec3.add(lpos, lpos, v);
            // Vec3.multiply(lpos, lpos, this._collider.node.worldScale);
        }
    }
}
