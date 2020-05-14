/**
 * @category terrain
 */

import { builtinResMgr } from '../core/3d/builtin';
import { RenderableComponent } from '../core/3d/framework/renderable-component';
import { Texture2D } from '../core/assets';
import { Filter, PixelFormat, WrapMode } from '../core/assets/asset-enum';
import { Material } from '../core/assets/material';
import { RenderingSubMesh } from '../core/assets/mesh';
import { Component } from '../core/components';
import { ccclass, disallowMultiple, executeInEditMode, menu, property } from '../core/data/class-decorator';
import { director } from '../core/director';
import { GFXBuffer } from '../core/gfx/buffer';
import { GFXAttributeName, GFXBufferUsageBit, GFXFormat, GFXMemoryUsageBit, GFXPrimitiveMode } from '../core/gfx/define';
import { GFXDevice } from '../core/gfx/device';
import { IGFXAttribute } from '../core/gfx/input-assembler';
import { clamp, Rect, Size, Vec2, Vec3, Vec4 } from '../core/math';
import { IDefineMap } from '../core/renderer/core/pass-utils';
import { Model } from '../core/renderer/scene/model';
import { Root } from '../core/root';
import { PrivateNode } from '../core/scene-graph/private-node';
import { HeightField } from './height-field';
import { TerrainAsset, TerrainLayerInfo } from './terrain-asset';
import { legacyCC } from '../core/global-exports';

export const TERRAIN_MAX_LEVELS = 4;
export const TERRAIN_MAX_BLEND_LAYERS = 4;
export const TERRAIN_MAX_LAYER_COUNT = 256;
export const TERRAIN_BLOCK_TILE_COMPLEXITY = 32;
export const TERRAIN_BLOCK_VERTEX_COMPLEXITY = 33;
export const TERRAIN_BLOCK_VERTEX_SIZE = 8; // position + normal + uv
export const TERRAIN_HEIGHT_BASE = 32768;
export const TERRAIN_HEIGHT_FACTORY = 1.0 / 512.0;
export const TERRAIN_NORTH_INDEX = 0;
export const TERRAIN_SOUTH_INDEX = 1;
export const TERRAIN_WEST_INDEX = 2;
export const TERRAIN_EAST_INDEX = 3;

/**
 * 地形信息。
 */
@ccclass('cc.TerrainInfo')
export class TerrainInfo {
    @property({
        tooltip: '地形Tile的大小',
    })
    public tileSize: number = 1;
    @property
    public blockCount: number[] = [1, 1];
    @property
    public weightMapSize: number = 128;
    @property
    public lightMapSize: number = 128;

    public get size () {
        const sz = new Size(0, 0);
        sz.width = this.blockCount[0] * TERRAIN_BLOCK_TILE_COMPLEXITY * this.tileSize;
        sz.height = this.blockCount[1] * TERRAIN_BLOCK_TILE_COMPLEXITY * this.tileSize;

        return sz;
    }

    public get tileCount () {
        const _tileCount = [0, 0];
        _tileCount[0] = this.blockCount[0] * TERRAIN_BLOCK_TILE_COMPLEXITY;
        _tileCount[1] = this.blockCount[1] * TERRAIN_BLOCK_TILE_COMPLEXITY;

        return _tileCount;
    }

    public get vertexCount () {
        const _vertexCount = this.tileCount;
        _vertexCount[0] += 1;
        _vertexCount[1] += 1;

        return _vertexCount;
    }
}

@ccclass('cc.TerrainLayer')
export class TerrainLayer {
    @property({
        tooltip: '当前Layer的纹理',
    })
    public detailMap: Texture2D|null = null;
    @property({
        tooltip: '纹理的平铺大小，值越小会在同样大小的区域内进行更多次的平铺',
    })
    public tileSize: number = 1;
}

export class TerrainVertex {
    public position: Vec3 = new Vec3(0, 0, 0);
    public normal: Vec3 = new Vec3(0, 1, 0);
    public uv: Vec2 = new Vec2(0, 0);
}

export class TerrainRenderable extends RenderableComponent {
    public _model: Model | null = null;
    public _meshData: RenderingSubMesh | null = null;

    public _brushMaterial: Material | null = null;
    public _currentMaterial: Material | null = null;
    public _currentMaterialLayers: number = 0;

    public destroy () {
        this._invalidMaterial();
        if (this._model != null) {
            legacyCC.director.root.destroyModel(this._model);
            this._model = null;
        }

        super.destroy();
    }

    public _invalidMaterial () {
        if (this._currentMaterial == null) {
            return;
        }

        this._clearMaterials();

        this._currentMaterial = null;
        if (this._model != null) {
            this._model.enabled = false;
        }
    }

    public _updateMaterial (block: TerrainBlock, init: boolean) {
        if (this._meshData == null || this._model == null) {
            return;
        }

        const nlayers = block.getMaxLayer();
        if (this._currentMaterial == null || nlayers !== this._currentMaterialLayers) {
            this._currentMaterial = new Material();

            this._currentMaterial.initialize({
                effectAsset: legacyCC.EffectAsset.get('builtin-terrain'),
                defines: block._getMaterialDefines(nlayers),
            });

            if (this._brushMaterial !== null) {
                const passes = this._currentMaterial.passes;

                passes.push(this._brushMaterial.passes[0]);
            }

            if (init) {
                this._model.initSubModel(0, this._meshData, this._currentMaterial);
            }

            this.setMaterial(this._currentMaterial, 0);
            this._currentMaterialLayers = nlayers;
            this._model.enabled = true;
        }
    }

    public _onMaterialModified (idx: number, mtl: Material|null) {
        if (this._model == null) {
            return;
        }
        this._onRebuildPSO(idx, mtl || this._getBuiltinMaterial());
    }

    protected _onRebuildPSO (idx: number, material: Material) {
        if (this._model) {
            this._model.setSubModelMaterial(idx, material);
        }
    }

    protected _clearMaterials () {
        if (this._model == null) {
            return;
        }

        this._onMaterialModified(0, null);
    }

    private _getBuiltinMaterial () {
        return builtinResMgr.get<Material>('missing-material');
    }
}

@ccclass('cc.TerrainBlockInfo')
export class TerrainBlockInfo {
    @property
    public layers: number[] = [-1, -1, -1, -1];
}

@ccclass('cc.TerrainBlockLightmapInfo')
export class TerrainBlockLightmapInfo {
    @property
    public texture: Texture2D|null = null;
    @property
    public UOff: number = 0;
    @property
    public VOff: number = 0;
    @property
    public UScale: number = 0;
    @property
    public VScale: number = 0;
}

export class TerrainBlock {
    private _terrain: Terrain;
    private _info: TerrainBlockInfo;
    private _node: PrivateNode;
    private _renderable: TerrainRenderable;
    private _index: number[] = [1, 1];
    // private _neighbor: TerrainBlock|null[] = [null, null, null, null];
    private _weightMap: Texture2D|null = null;
    private _lightmapInfo: TerrainBlockLightmapInfo|null = null;

    constructor (t: Terrain, i: number, j: number) {
        this._terrain = t;
        this._info = t.getBlockInfo(i, j);
        this._index[0] = i;
        this._index[1] = j;
        this._lightmapInfo = t._getLightmapInfo(i, j);

        this._node = new PrivateNode('');
        // @ts-ignore
        this._node.setParent(this._terrain.node);
        // @ts-ignore
        this._node._objFlags |= legacyCC.Object.Flags.DontSave;

        this._renderable =  this._node.addComponent(TerrainRenderable) as TerrainRenderable;
    }

    public build () {
        const gfxDevice = director.root!.device as GFXDevice;

        // vertex buffer
        const vertexData = new Float32Array(TERRAIN_BLOCK_VERTEX_SIZE * TERRAIN_BLOCK_VERTEX_COMPLEXITY * TERRAIN_BLOCK_VERTEX_COMPLEXITY);
        let index = 0;
        for (let j = 0; j < TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++j) {
            for (let i = 0; i < TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++i) {
                const x = this._index[0] * TERRAIN_BLOCK_TILE_COMPLEXITY + i;
                const y = this._index[1] * TERRAIN_BLOCK_TILE_COMPLEXITY + j;
                const position = this._terrain.getPosition(x, y);
                const normal = this._terrain.getNormal(x, y);
                const uv = new Vec2(i / TERRAIN_BLOCK_TILE_COMPLEXITY, j / TERRAIN_BLOCK_TILE_COMPLEXITY);
                vertexData[index++] = position.x;
                vertexData[index++] = position.y;
                vertexData[index++] = position.z;
                vertexData[index++] = normal.x;
                vertexData[index++] = normal.y;
                vertexData[index++] = normal.z;
                vertexData[index++] = uv.x;
                vertexData[index++] = uv.y;
            }
        }

        const vertexBuffer = gfxDevice.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: TERRAIN_BLOCK_VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT * TERRAIN_BLOCK_VERTEX_COMPLEXITY * TERRAIN_BLOCK_VERTEX_COMPLEXITY,
            stride: TERRAIN_BLOCK_VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT,
        });
        vertexBuffer.update(vertexData);

        // initialize renderable
        const gfxAttributes: IGFXAttribute[] = [
            { name: GFXAttributeName.ATTR_POSITION, format: GFXFormat.RGB32F },
            { name: GFXAttributeName.ATTR_NORMAL, format: GFXFormat.RGB32F },
            { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RG32F},
        ];

        const subMesh = this._renderable._meshData = new RenderingSubMesh([vertexBuffer], gfxAttributes, GFXPrimitiveMode.TRIANGLE_LIST);
        subMesh.indexBuffer = this._terrain.getSharedIndexBuffer() || undefined;

        this._renderable._model = (legacyCC.director.root as Root).createModel(Model);
        this._renderable._model.initialize(this._node);
        this._renderable._getRenderScene().addModel(this._renderable._model);

        // reset weightmap
        this._updateWeightMap();

        // reset material
        this._updateMaterial(true);
    }

    public rebuild () {
        this._updateHeight();
        this._updateWeightMap();

        this._renderable._invalidMaterial();
        this._updateMaterial(false);
    }

    public destroy () {
        if (this._renderable != null) {
            this._renderable.destroy();
        }
        if (this._node != null) {
            this._node.destroy();
        }
        if (this._weightMap != null) {
            this._weightMap.destroy();
        }
    }

    public update () {
        this._updateMaterial(false);

        const mtl = this._renderable._currentMaterial;
        if (mtl != null) {
            const nlayers = this.getMaxLayer();
            const uvScale = new Vec4(1, 1, 1, 1);

            if (nlayers === 0) {
                if (this.layers[0] !== -1) {
                    const l0 = this._terrain.getLayer(this.layers[0]);

                    if (l0 != null) {
                        uvScale.x = 1.0 / l0.tileSize;
                    }

                    mtl.setProperty('detailMap0', l0 != null ? l0.detailMap : null);
                }
                else {
                    mtl.setProperty('detailMap0', legacyCC.builtinResMgr.get('default-texture'));
                }
            }
            else if (nlayers === 1) {
                const l0 = this._terrain.getLayer(this.layers[0]);
                const l1 = this._terrain.getLayer(this.layers[1]);

                if (l0 != null) {
                    uvScale.x = 1.0 / l0.tileSize;
                }
                if (l1 != null) {
                    uvScale.y = 1.0 / l1.tileSize;
                }

                mtl.setProperty('weightMap', this._weightMap);
                mtl.setProperty('detailMap0', l0 != null ? l0.detailMap : null);
                mtl.setProperty('detailMap1', l1 != null ? l1.detailMap : null);
            }
            else if (nlayers === 2) {
                const l0 = this._terrain.getLayer(this.layers[0]);
                const l1 = this._terrain.getLayer(this.layers[1]);
                const l2 = this._terrain.getLayer(this.layers[2]);

                if (l0 != null) {
                    uvScale.x = 1.0 / l0.tileSize;
                }
                if (l1 != null) {
                    uvScale.y = 1.0 / l1.tileSize;
                }
                if (l2 != null) {
                    uvScale.z = 1.0 / l2.tileSize;
                }

                mtl.setProperty('weightMap', this._weightMap);
                mtl.setProperty('detailMap0', l0 != null ? l0.detailMap : null);
                mtl.setProperty('detailMap1', l1 != null ? l1.detailMap : null);
                mtl.setProperty('detailMap2', l2 != null ? l2.detailMap : null);
            }
            else if (nlayers === 3) {
                const l0 = this._terrain.getLayer(this.layers[0]);
                const l1 = this._terrain.getLayer(this.layers[1]);
                const l2 = this._terrain.getLayer(this.layers[2]);
                const l3 = this._terrain.getLayer(this.layers[3]);

                if (l0 != null) {
                    uvScale.x = 1.0 / l0.tileSize;
                }
                if (l1 != null) {
                    uvScale.y = 1.0 / l1.tileSize;
                }
                if (l2 != null) {
                    uvScale.z = 1.0 / l2.tileSize;
                }
                if (l3 != null) {
                    uvScale.z = 1.0 / l3.tileSize;
                }

                mtl.setProperty('weightMap', this._weightMap);
                mtl.setProperty('detailMap0', l0 != null ? l0.detailMap : null);
                mtl.setProperty('detailMap1', l1 != null ? l1.detailMap : null);
                mtl.setProperty('detailMap2', l2 != null ? l2.detailMap : null);
                mtl.setProperty('detailMap3', l3 != null ? l3.detailMap : null);
            }

            mtl.setProperty('UVScale', uvScale);

            if (this.lightmap != null) {
                mtl.setProperty('lightMap', this.lightmap);
                mtl.setProperty('lightMapUVParam', this.lightmapUVParam);
            }
        }
    }

    public setBrushMaterial (mtl: Material|null) {
        if (this._renderable._brushMaterial !== mtl) {
            this._renderable._brushMaterial = mtl;
            this._renderable._invalidMaterial();
        }
    }

    get layers () {
        return this._info.layers;
    }

    get lightmap () {
        return this._lightmapInfo ? this._lightmapInfo.texture : null;
    }

    get lightmapUVParam () {
        if (this._lightmapInfo != null) {
            return new Vec4(this._lightmapInfo.UOff, this._lightmapInfo.VOff, this._lightmapInfo.UScale, this._lightmapInfo.VScale);
        }
        else {
            return new Vec4(0, 0, 0, 0);
        }
    }

    public getTerrain () {
        return this._terrain;
    }

    public getIndex () {
        return this._index;
    }

    public getRect () {
        const rect = new Rect();
        rect.x = this._index[0] * TERRAIN_BLOCK_TILE_COMPLEXITY;
        rect.y = this._index[1] * TERRAIN_BLOCK_TILE_COMPLEXITY;
        rect.width = TERRAIN_BLOCK_TILE_COMPLEXITY;
        rect.height = TERRAIN_BLOCK_TILE_COMPLEXITY;

        return rect;
    }

    public setLayer (index: number, layerId: number) {
        if (this.layers[index] !== layerId) {
            this.layers[index] = layerId;
            this._renderable._invalidMaterial();
            this._updateMaterial(false);
        }
    }

    public getLayer (index: number) {
        return this.layers[index];
    }

    public getMaxLayer () {
        if (this.layers[3] >= 0) {
            return 3;
        }
        else if (this.layers[2] >= 0) {
            return 2;
        }
        else if (this.layers[1] >= 0) {
            return 1;
        }
        else {
            return 0;
        }
    }

    public _getMaterialDefines (nlayers: number): IDefineMap {
        if (this.lightmap != null) {
            if (nlayers === 0) {
                return { LAYERS: 1, LIGHT_MAP: 1};
            }
            else if (nlayers === 1) {
                return { LAYERS: 2, LIGHT_MAP: 1 };
            }
            else if (nlayers === 2) {
                return { LAYERS: 3, LIGHT_MAP: 1 };
            }
            else if (nlayers === 3) {
                return { LAYERS: 4, LIGHT_MAP: 1 };
            }
        }
        else {
            if (nlayers === 0) {
                return { LAYERS: 1 };
            }
            else if (nlayers === 1) {
                return { LAYERS: 2 };
            }
            else if (nlayers === 2) {
                return { LAYERS: 3 };
            }
            else if (nlayers === 3) {
                return { LAYERS: 4 };
            }
        }

        return { LAYERS: 0 };
    }

    public _invalidMaterial () {
        this._renderable._invalidMaterial();
    }

    public _updateMaterial (init: boolean) {
        this._renderable._updateMaterial(this, init);
    }

    public _updateHeight () {
        if (this._renderable._meshData == null) {
            return ;
        }

        const vertexData = new Float32Array(TERRAIN_BLOCK_VERTEX_SIZE * TERRAIN_BLOCK_VERTEX_COMPLEXITY * TERRAIN_BLOCK_VERTEX_COMPLEXITY);

        let index = 0;
        for (let j = 0; j < TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++j) {
            for (let i = 0; i < TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++i) {
                const x = this._index[0] * TERRAIN_BLOCK_TILE_COMPLEXITY + i;
                const y = this._index[1] * TERRAIN_BLOCK_TILE_COMPLEXITY + j;

                const position = this._terrain.getPosition(x, y);
                const normal = this._terrain.getNormal(x, y);
                const uv = new Vec2(i / TERRAIN_BLOCK_VERTEX_COMPLEXITY, j / TERRAIN_BLOCK_VERTEX_COMPLEXITY);

                vertexData[index++] = position.x;
                vertexData[index++] = position.y;
                vertexData[index++] = position.z;
                vertexData[index++] = normal.x;
                vertexData[index++] = normal.y;
                vertexData[index++] = normal.z;
                vertexData[index++] = uv.x;
                vertexData[index++] = uv.y;
            }
        }

        this._renderable._meshData.vertexBuffers[0].update(vertexData);
    }

    public _updateWeightMap () {
        const nlayers = this.getMaxLayer();

        if (nlayers === 0) {
            if (this._weightMap != null) {
                this._weightMap.destroy();
                this._weightMap = null;
            }

            return;
        }
        else {
            if (this._weightMap == null) {
                this._weightMap = new Texture2D();
                this._weightMap.create(this._terrain.weightMapSize, this._terrain.weightMapSize, PixelFormat.RGBA8888);
                this._weightMap.setFilters(Filter.LINEAR, Filter.LINEAR);
                this._weightMap.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
            }
        }

        const weightData = new Uint8Array(this._terrain.weightMapSize * this._terrain.weightMapSize * 4);
        let weightIndex = 0;
        for (let j = 0; j < this._terrain.weightMapSize; ++j) {
            for (let i = 0; i < this._terrain.weightMapSize; ++i) {
                const x = this._index[0] * this._terrain.weightMapSize + i;
                const y = this._index[1] * this._terrain.weightMapSize + j;
                const w = this._terrain.getWeight(x, y);

                weightData[weightIndex * 4 + 0] = Math.floor(w.x * 255);
                weightData[weightIndex * 4 + 1] = Math.floor(w.y * 255);
                weightData[weightIndex * 4 + 2] = Math.floor(w.z * 255);
                weightData[weightIndex * 4 + 3] = Math.floor(w.w * 255);

                weightIndex += 1;
            }
        }
        this._weightMap.uploadData(weightData);
    }

    public _updateLightmap (info: TerrainBlockLightmapInfo) {
        this._lightmapInfo = info;
        this._invalidMaterial();
    }
}

@ccclass('cc.Terrain')
// @menu('Components/Terrain')
@executeInEditMode
@disallowMultiple
export class Terrain extends Component {
    @property({
        type: TerrainAsset,
        visible: false,
        animatable: false,
    })
    protected __asset: TerrainAsset|null = null;

    @property({
        type: TerrainLayer,
        visible: true,
        animatable: false,
    })
    protected _layers: Array<TerrainLayer|null> = [];

    @property({
        visible: false,
        animatable: false,
    })
    protected _blockInfos: TerrainBlockInfo[] = [];

    @property({
        visible: false,
        animatable: false,
    })
    protected _lightmapInfos: TerrainBlockLightmapInfo[] = [];

    protected _tileSize: number = 1;
    protected _blockCount: number[] = [1, 1];
    protected _weightMapSize: number = 128;
    protected _lightMapSize: number = 128;
    protected _heights: Uint16Array = new Uint16Array();
    protected _weights: Uint8Array = new Uint8Array();
    protected _normals: number[] = [];
    protected _blocks: TerrainBlock[] = [];
    protected _sharedIndexBuffer: GFXBuffer|null = null;

    constructor () {
        super();

        // initialize layers
        for (let i = 0; i < TERRAIN_MAX_LAYER_COUNT; ++i) {
            this._layers.push(null);
        }
    }

    @property({
        type: TerrainAsset,
        visible: true,
    })
    public set _asset (value: TerrainAsset|null) {
        if (this.__asset !== value) {
            this.__asset = value;
            if (this.__asset != null && this.valid) {
                // rebuild
                for (const block of this._blocks) {
                    block.destroy();
                }
                this._blocks = [];
                this._blockInfos = [];
                this._buildImp();
            }
        }
    }

    public get _asset () {
        return  this.__asset;
    }

    public get size () {
        const sz = new Size(0, 0);
        sz.width = this.blockCount[0] * TERRAIN_BLOCK_TILE_COMPLEXITY * this.tileSize;
        sz.height = this.blockCount[1] * TERRAIN_BLOCK_TILE_COMPLEXITY * this.tileSize;
        return sz;
    }

    get tileSize () {
        return this._tileSize;
    }

    public get tileCount () {
        return [this.blockCount[0] * TERRAIN_BLOCK_TILE_COMPLEXITY, this.blockCount[1] * TERRAIN_BLOCK_TILE_COMPLEXITY];
    }

    public get vertexCount () {
        const _vertexCount = this.tileCount;
        _vertexCount[0] += 1;
        _vertexCount[1] += 1;

        return _vertexCount;
    }

    get blockCount () {
        return this._blockCount;
    }

    get lightMapSize () {
        return this._lightMapSize;
    }

    get weightMapSize () {
        return this._weightMapSize;
    }

    get heights () {
        return this._heights;
    }

    get weights () {
        return this._weights;
    }

    get valid () {
        return this._blocks.length > 0;
    }

    @property({
        type: TerrainInfo,
        visible: true,
    })
    public get info () {
        const ti = new TerrainInfo();
        ti.tileSize = this.tileSize;
        ti.blockCount[0] = this.blockCount[0];
        ti.blockCount[1] = this.blockCount[1];
        ti.weightMapSize = this.weightMapSize;
        ti.lightMapSize = this.lightMapSize;

        return ti;
    }

    public build (info: TerrainInfo) {
        this._tileSize = info.tileSize;
        this._blockCount[0] = info.blockCount[0];
        this._blockCount[1] = info.blockCount[1];
        this._weightMapSize = info.weightMapSize;
        this._lightMapSize = info.lightMapSize;

        return this._buildImp();
    }

    public rebuild (info: TerrainInfo) {
        // build block info
        const blockInfos: TerrainBlockInfo[] = [];
        for (let i = 0; i < info.blockCount[0] * info.blockCount[1]; ++i) {
            blockInfos.push(new TerrainBlockInfo());
        }

        const w = Math.min(this._blockCount[0], info.blockCount[0]);
        const h = Math.min(this._blockCount[1], info.blockCount[1]);
        for (let j = 0; j < h; ++j) {
            for (let i = 0; i < w; ++i) {
                const index0 = j * info.blockCount[0] + i;
                const index1 = j * this.blockCount[0] + i;

                blockInfos[index0] = this._blockInfos[index1];
            }
        }

        this._blockInfos = blockInfos;

        for (const block of this._blocks) {
            block.destroy();
        }
        this._blocks = [];

        // build heights
        this._rebuildHeights(info);

        // build weights
        this._rebuildWeights(info);

        // update info
        this._tileSize = info.tileSize;
        this._blockCount[0] = info.blockCount[0];
        this._blockCount[1] = info.blockCount[1];
        this._weightMapSize = info.weightMapSize;
        this._lightMapSize = info.lightMapSize;

        // build blocks
        this._buildNormals();

        for (let j = 0; j < this._blockCount[1]; ++j) {
            for (let i = 0; i < this._blockCount[0]; ++i) {
                this._blocks.push(new TerrainBlock(this, i, j));
            }
        }

        for (const i of this._blocks) {
            i.build();
        }
    }

    public importHeightField (hf: HeightField, heightScale: number) {
        let index = 0;
        for (let j = 0; j < this.vertexCount[1]; ++j) {
            for (let i = 0; i < this.vertexCount[0]; ++i) {
                const u = i / this.tileCount[0];
                const v = j / this.tileCount[1];

                const h = hf.getAt(u * hf.w, v * hf.h) * heightScale;

                this._heights[index++] = h;
            }
        }

        this._buildNormals();

        // rebuild all blocks
        for (const i of this._blocks) {
            i._updateHeight();
        }
    }

    public exportHeightField (hf: HeightField, heightScale: number) {
        let index = 0;
        for (let j = 0; j < hf.h; ++j) {
            for (let i = 0; i < hf.w; ++i) {
                const u = i / (hf.w - 1);
                const v = j / (hf.h - 1);

                const x = u * this.size.width;
                const y = v * this.size.height;

                const h = this.getHeightAt(x, y);
                if (h != null) {
                    hf.data[index++] = h * heightScale;
                }
            }
        }
    }

    public exportAsset () {
        const asset = new TerrainAsset();

        asset.tileSize = this.tileSize;
        asset.blockCount = this.blockCount;
        asset.lightMapSize = this.lightMapSize;
        asset.weightMapSize = this.weightMapSize;
        asset.heights = this.heights;
        asset.weights = this.weights;

        asset.layerBuffer = new Array<number>(this._blocks.length * 4);
        for (let i = 0; i < this._blocks.length; ++i) {
            asset.layerBuffer[i * 4 + 0] = this._blocks[i].layers[0];
            asset.layerBuffer[i * 4 + 1] = this._blocks[i].layers[1];
            asset.layerBuffer[i * 4 + 2] = this._blocks[i].layers[2];
            asset.layerBuffer[i * 4 + 3] = this._blocks[i].layers[3];
        }

        for (let i = 0; i < this._layers.length; ++i) {
            const tlayer = this._layers[i];
            if (tlayer != null && tlayer.detailMap != null) {
                const ilayer = new TerrainLayerInfo();
                ilayer.slot = i;
                ilayer.tileSize = tlayer.tileSize;
                ilayer.detailMap = tlayer.detailMap._uuid;
                asset.layerInfos.push(ilayer);
            }
        }

        return asset;
    }

    public onLoad () {
        const gfxDevice = legacyCC.director.root.device as GFXDevice;

        // initialize shared index buffer
        const indexData = new Uint16Array(TERRAIN_BLOCK_TILE_COMPLEXITY * TERRAIN_BLOCK_TILE_COMPLEXITY * 6);

        let index = 0;
        for (let j = 0; j < TERRAIN_BLOCK_TILE_COMPLEXITY; ++j) {
            for (let i = 0; i < TERRAIN_BLOCK_TILE_COMPLEXITY; ++i) {
                const a = j * TERRAIN_BLOCK_VERTEX_COMPLEXITY + i;
                const b = j * TERRAIN_BLOCK_VERTEX_COMPLEXITY + i + 1;
                const c = (j + 1) * TERRAIN_BLOCK_VERTEX_COMPLEXITY + i;
                const d = (j + 1) * TERRAIN_BLOCK_VERTEX_COMPLEXITY + i + 1;

                // face 1
                indexData[index++] = a;
                indexData[index++] = c;
                indexData[index++] = b;

                // face 2
                indexData[index++] = b;
                indexData[index++] = c;
                indexData[index++] = d;
            }
        }

        this._sharedIndexBuffer = gfxDevice.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: Uint16Array.BYTES_PER_ELEMENT * TERRAIN_BLOCK_TILE_COMPLEXITY * TERRAIN_BLOCK_TILE_COMPLEXITY * 6,
            stride: Uint16Array.BYTES_PER_ELEMENT,
        });
        this._sharedIndexBuffer.update(indexData);
    }

    public onEnable () {
        if (this._blocks.length === 0) {
            this._buildImp();
        }
    }

    public onDisable () {
        for (const i of this._blocks) {
            i.destroy();
        }
        this._blocks = [];
    }

    public onDestroy () {
        for (let i = 0; i < this._layers.length; ++i) {
            this._layers[i] = null;
        }

        if (this._sharedIndexBuffer != null) {
            this._sharedIndexBuffer.destroy();
        }
    }

    public onRestore () {
        this.onDisable();
        this.onLoad();
        this._buildImp(true);
    }

    public update (dtime: number) {
        for (const i of this._blocks) {
            i.update();
        }
    }

    public addLayer (layer: TerrainLayer) {
        for (let i = 0; i < this._layers.length; ++i) {
            if (this._layers[i] == null) {
                this._layers[i] = layer;
                return i;
            }
        }

        return -1;
    }

    public setLayer (i: number, layer: TerrainLayer) {
        this._layers[i] = layer;
    }

    public removeLayer (id: number) {
        this._layers[id] = null;
    }

    public getLayer (id: number) {
        if (id === -1) {
            return null;
        }

        return this._layers[id];

    }

    public getPosition (i: number, j: number) {
        const x = i * this._tileSize;
        const z = j * this._tileSize;
        const y = this.getHeight(i, j);

        return new Vec3(x, y, z);
    }

    public getHeightField () {
        return this._heights;
    }

    public setHeight (i: number, j: number, h: number) {
        this._heights[j * this.vertexCount[0] + i] = TERRAIN_HEIGHT_BASE + h / TERRAIN_HEIGHT_FACTORY;
    }

    public getHeight (i: number, j: number) {
        return (this._heights[j * this.vertexCount[0] + i] - TERRAIN_HEIGHT_BASE) * TERRAIN_HEIGHT_FACTORY;
    }

    public getHeightClamp (i: number, j: number) {
        i = clamp(i, 0, this.vertexCount[0] - 1);
        j = clamp(j, 0, this.vertexCount[1] - 1);

        return this.getHeight(i, j);
    }

    public getHeightAt (x: number, y: number) {
        const fx = x / this.tileSize;
        const fy = y / this.tileSize;

        let ix0 = Math.floor(fx);
        let iz0 = Math.floor(fy);
        let ix1 = ix0 + 1;
        let iz1 = iz0 + 1;
        const dx = fx - ix0;
        const dz = fy - iz0;

        if (ix0 < 0 || ix0 > this.vertexCount[0] - 1 || iz0 < 0 || iz0 > this.vertexCount[1] - 1) {
            return null;
        }

        ix0 = clamp(ix0, 0, this.vertexCount[0]  - 1);
        iz0 = clamp(iz0, 0, this.vertexCount[1]  - 1);
        ix1 = clamp(ix1, 0, this.vertexCount[0]  - 1);
        iz1 = clamp(iz1, 0, this.vertexCount[1]  - 1);

        let a = this.getHeight(ix0, iz0);
        const b = this.getHeight(ix1, iz0);
        const c = this.getHeight(ix0, iz1);
        let d = this.getHeight(ix1, iz1);
        const m = (b + c) * 0.5;

        if (dx + dz <= 1.0) {
            d = m + (m - a);
        }
        else {
            a = m + (m - d);
        }

        const h1 = a * (1.0 - dx) + b * dx;
        const h2 = c * (1.0 - dx) + d * dx;

        const h = h1 * (1.0 - dz) + h2 * dz;

        return h;
    }

    public _setNormal (i: number, j: number, n: Vec3) {
        const index = j * this.vertexCount[0] + i;

        this._normals[index * 3 + 0] =  n.x;
        this._normals[index * 3 + 1] =  n.y;
        this._normals[index * 3 + 2] =  n.z;
    }

    public getNormal (i: number, j: number) {
        const index = j * this.vertexCount[0] + i;

        const n = new Vec3();
        n.x = this._normals[index * 3 + 0];
        n.y = this._normals[index * 3 + 1];
        n.z = this._normals[index * 3 + 2];

        return n;
    }

    public getNormalAt (x: number, y: number) {
        const fx = x / this.tileSize;
        const fy = y / this.tileSize;

        let ix0 = Math.floor(fx);
        let iz0 = Math.floor(fy);
        let ix1 = ix0 + 1;
        let iz1 = iz0 + 1;
        const dx = fx - ix0;
        const dz = fy - iz0;

        if (ix0 < 0 || ix0 > this.vertexCount[0] - 1 || iz0 < 0 || iz0 > this.vertexCount[1] - 1) {
            return null;
        }

        ix0 = clamp(ix0, 0, this.vertexCount[0]  - 1);
        iz0 = clamp(iz0, 0, this.vertexCount[1]  - 1);
        ix1 = clamp(ix1, 0, this.vertexCount[0]  - 1);
        iz1 = clamp(iz1, 0, this.vertexCount[1]  - 1);

        const a = this.getNormal(ix0, iz0);
        const b = this.getNormal(ix1, iz0);
        const c = this.getNormal(ix0, iz1);
        const d = this.getNormal(ix1, iz1);
        const m = new Vec3();
        Vec3.add(m, b, c).multiplyScalar(0.5);

        if (dx + dz <= 1.0) {
            // d = m + (m - a);
            d.set(m);
            d.subtract(a);
            d.add(m);
        }
        else {
            // a = m + (m - d);
            a.set(m);
            a.subtract(d);
            a.add(m);
        }

        const n1 = new Vec3();
        const n2 = new Vec3();
        const n = new Vec3();
        Vec3.lerp(n1, a, b, dx);
        Vec3.lerp(n2, c, d, dx);
        Vec3.lerp(n, n1, n2, dz);

        return n;
    }

    public setWeight (i: number, j: number, w: Vec4) {
        const index = j * this._weightMapSize * this._blockCount[0] + i;

        this._weights[index * 4 + 0] = w.x * 255;
        this._weights[index * 4 + 1] = w.y * 255;
        this._weights[index * 4 + 2] = w.z * 255;
        this._weights[index * 4 + 3] = w.w * 255;
    }

    public getWeight (i: number, j: number) {
        const index = j * this._weightMapSize * this._blockCount[0] + i;

        const w = new Vec4();
        w.x = this._weights[index * 4 + 0] / 255.0;
        w.y = this._weights[index * 4 + 1] / 255.0;
        w.z = this._weights[index * 4 + 2] / 255.0;
        w.w = this._weights[index * 4 + 3] / 255.0;

        return w;
    }

    public getWeightAt (x: number, y: number) {
        const fx = x / this.tileSize;
        const fy = y / this.tileSize;

        let ix0 = Math.floor(fx);
        let iz0 = Math.floor(fy);
        let ix1 = ix0 + 1;
        let iz1 = iz0 + 1;
        const dx = fx - ix0;
        const dz = fy - iz0;

        if (ix0 < 0 || ix0 > this.vertexCount[0] - 1 || iz0 < 0 || iz0 > this.vertexCount[1] - 1) {
            return null;
        }

        ix0 = clamp(ix0, 0, this.vertexCount[0]  - 1);
        iz0 = clamp(iz0, 0, this.vertexCount[1]  - 1);
        ix1 = clamp(ix1, 0, this.vertexCount[0]  - 1);
        iz1 = clamp(iz1, 0, this.vertexCount[1]  - 1);

        let a = this.getWeight(ix0, iz0);
        const b = this.getWeight(ix1, iz0);
        const c = this.getWeight(ix0, iz1);
        let d = this.getWeight(ix1, iz1);
        const m = new Vec4();
        Vec4.add(m, b, c).multiplyScalar(0.5);

        if (dx + dz <= 1.0) {
            d = new Vec4();
            Vec4.subtract(d, m, a).add(m);
        }
        else {
            a = new Vec4();
            Vec4.subtract(a, m, d).add(m);
        }

        const n1 = new Vec4();
        const n2 = new Vec4();
        const n = new Vec4();
        Vec4.lerp(n1, a, b, dx);
        Vec4.lerp(n2, c, d, dx);
        Vec4.lerp(n, n1, n2, dz);

        return n;
    }

    public getBlockInfo (i: number, j: number) {
        return this._blockInfos[j * this._blockCount[0] + i];
    }

    public getBlock (i: number, j: number) {
        return this._blocks[j * this._blockCount[0] + i];
    }

    public getBlocks () {
        return this._blocks;
    }

    public getSharedIndexBuffer () {
        return this._sharedIndexBuffer;
    }

    public _resetLightmap (enble: boolean) {
        this._lightmapInfos.length = 0;
        if (enble) {
            for (let i = 0; i < this._blockCount[0] * this._blockCount[1]; ++i) {
                this._lightmapInfos.push(new TerrainBlockLightmapInfo());
            }
        }
    }

    public _updateLightmap (blockId: number, tex: Texture2D|null, uoff: number, voff: number, uscale: number, vscale: number) {
        this._lightmapInfos[blockId].texture = tex;
        this._lightmapInfos[blockId].UOff = uoff;
        this._lightmapInfos[blockId].VOff = voff;
        this._lightmapInfos[blockId].UScale = uscale;
        this._lightmapInfos[blockId].VScale = vscale;
        this._blocks[blockId]._updateLightmap(this._lightmapInfos[blockId]);
    }

    public _getLightmapInfo (i: number, j: number) {
        const index = j * this._blockCount[0] + i;
        return index < this._lightmapInfos.length ? this._lightmapInfos[index] : null;
    }

    public rayCheck (start: Vec3, dir: Vec3, step: number, worldspace: boolean = true) {
        const MAX_COUNT = 2000;

        const trace = start;
        if (worldspace) {
            Vec3.subtract(trace, start, this.node.getWorldPosition());
        }

        const dstep = new Vec3();
        dstep.set(dir);
        dstep.multiplyScalar(step);

        let position: Vec3|null = null;

        if (dir.equals(new Vec3(0, 1, 0))) {
            const y = this.getHeightAt(trace.x, trace.z);
            if (y != null && trace.y <= y) {
                position = new Vec3(trace.x, y, trace.z);
            }
        }
        else if (dir.equals(new Vec3(0, -1, 0))) {
            const y = this.getHeightAt(trace.x, trace.z);
            if (y != null && trace.y >= y) {
                position = new Vec3(trace.x, y, trace.z);
            }
        }
        else {
            let i = 0;

            // 优先大步进查找
            while (i++ < MAX_COUNT) {
                const y = this.getHeightAt(trace.x, trace.z);
                if (y != null && trace.y <= y) {
                    break;
                }

                trace.add(dir);
            }

            // 穷举法
            while (i++ < MAX_COUNT) {
                const y = this.getHeightAt(trace.x, trace.z);
                if (y != null && trace.y <= y) {
                    position = new Vec3(trace.x, y, trace.z);
                    break;
                }

                trace.add(dstep);
            }
        }

        return position;
    }

    public _calcuNormal (x: number, z: number) {
        let flip = 1;
        const here = this.getPosition(x, z);
        let right: Vec3;
        let up: Vec3;

        if (x < this.vertexCount[0] - 1) {
            right = this.getPosition(x + 1, z);
        }
        else {
            flip *= -1;
            right = this.getPosition(x - 1, z);
        }

        if (z < this.vertexCount[1] - 1) {
            up = this.getPosition(x, z + 1);
        }
        else {
            flip *= -1;
            up = this.getPosition(x, z - 1);
        }

        right.subtract(here);
        up.subtract(here);

        const normal = new Vec3();
        normal.set(up);
        normal.cross(right);
        normal.multiplyScalar(flip);
        normal.normalize();

        return normal;
    }

    public _buildNormals () {
        let index = 0;
        for (let y = 0; y < this.vertexCount[1]; ++y) {
            for (let x = 0; x < this.vertexCount[0]; ++x) {
                const n = this._calcuNormal(x, y);

                this._normals[index * 3 + 0] = n.x;
                this._normals[index * 3 + 1] = n.y;
                this._normals[index * 3 + 2] = n.z;
                index += 1;
            }
        }
    }

    private _buildImp (restore: boolean = false) {
        if (this.valid) {
            return true;
        }

        if (!restore && this.__asset != null) {
            this._tileSize = this.__asset.tileSize;
            this._blockCount = this.__asset.blockCount;
            this._weightMapSize = this.__asset.weightMapSize;
            this._lightMapSize = this.__asset.lightMapSize;
            this._heights = this.__asset.heights;
            this._weights = this.__asset.weights;

            // build layers
            let initial = true;
            for (let i = 0; i < this._layers.length; ++i) {
                if (this._layers[i] != null) {
                    initial = false;
                }
            }

            if (initial && this._asset != null) {
                for (const i of this._asset.layerInfos) {
                    const layer = new TerrainLayer();
                    layer.tileSize = i.tileSize;
                    legacyCC.loader.loadRes(i.detailMap, Texture2D, (err, asset) => {
                        layer.detailMap = asset;
                    });

                    this._layers[i.slot] = layer;
                }
            }
        }

        if (this._blockCount[0] === 0 || this._blockCount[1] === 0) {
            return false;
        }

        // build heights & normals
        const vcount = this.vertexCount[0] * this.vertexCount[1];
        if (this._heights === null || this._heights.length !== vcount) {
            this._heights = new Uint16Array(vcount);
            this._normals = new Array<number>(vcount * 3);

            for (let i = 0; i < vcount; ++i) {
                this._heights[i] = TERRAIN_HEIGHT_BASE;
                this._normals[i * 3 + 0] = 0;
                this._normals[i * 3 + 1] = 1;
                this._normals[i * 3 + 2] = 0;
            }
        }
        else {
            this._normals = new Array<number>(vcount * 3);
            this._buildNormals();
        }

        // build weights
        const weightMapComplexityU = this._weightMapSize * this._blockCount[0];
        const weightMapComplexityV = this._weightMapSize * this._blockCount[1];
        if (this._weights.length !== weightMapComplexityU * weightMapComplexityV * 4) {
            this._weights = new Uint8Array(weightMapComplexityU * weightMapComplexityV * 4);
            for (let i = 0; i < weightMapComplexityU * weightMapComplexityV; ++i) {
                this._weights[i * 4 + 0] = 255;
                this._weights[i * 4 + 1] = 0;
                this._weights[i * 4 + 2] = 0;
                this._weights[i * 4 + 3] = 0;
            }
        }

        // build blocks
        if (this._blockInfos.length !== this._blockCount[0] * this._blockCount[1]) {
            this._blockInfos = [];
            for (let j = 0; j < this._blockCount[1]; ++j) {
                for (let i = 0; i < this._blockCount[0]; ++i) {
                    const info = new TerrainBlockInfo();
                    if (this._asset != null) {
                        info.layers[0] = this._asset.getLayer(i, j, 0);

                        info.layers[1] = this._asset.getLayer(i, j, 1);
                        if (info.layers[1] === info.layers[0]) {
                            info.layers[1] = -1;
                        }

                        info.layers[2] = this._asset.getLayer(i, j, 2);
                        if (info.layers[2] === info.layers[0]) {
                            info.layers[2] = -1;
                        }

                        info.layers[3] = this._asset.getLayer(i, j, 3);
                        if (info.layers[3] === info.layers[0]) {
                            info.layers[3] = -1;
                        }
                    }

                    this._blockInfos.push(info);
                }
            }
        }

        for (let j = 0; j < this._blockCount[1]; ++j) {
            for (let i = 0; i < this._blockCount[0]; ++i) {
                this._blocks.push(new TerrainBlock(this, i, j));
            }
        }

        for (const i of this._blocks) {
            i.build();
        }
    }

    private _rebuildHeights (info: TerrainInfo) {
        if (this.vertexCount[0] === info.vertexCount[0] &&
            this.vertexCount[1] === info.vertexCount[1]) {
            return false;
        }

        const heights = new Uint16Array(info.vertexCount[0] * info.vertexCount[1]);
        for (let i = 0; i < heights.length; ++i) {
            heights[i] = TERRAIN_HEIGHT_BASE;
        }

        const w = Math.min(this.vertexCount[0], info.vertexCount[0]);
        const h = Math.min(this.vertexCount[1], info.vertexCount[1]);

        for (let j = 0; j < h; ++j) {
            for (let i = 0; i < w; ++i) {
                const index0 = j * info.vertexCount[0] + i;
                const index1 = j * this.vertexCount[0] + i;

                heights[index0] = this._heights[index1];
            }
        }

        this._heights = heights;

        return true;
    }

    private _rebuildWeights (info: TerrainInfo) {
        const oldWeightMapSize = this._weightMapSize;
        const oldWeightMapComplexityU = this._weightMapSize * this._blockCount[0];
        const oldWeightMapComplexityV = this._weightMapSize * this._blockCount[1];

        const weightMapComplexityU = info.weightMapSize * info.blockCount[0];
        const weightMapComplexityV = info.weightMapSize * info.blockCount[1];

        if (weightMapComplexityU === oldWeightMapComplexityU &&
            weightMapComplexityV === oldWeightMapComplexityV) {
            return false;
        }

        const weights = new Uint8Array(weightMapComplexityU * weightMapComplexityV * 4);

        for (let i = 0; i < weightMapComplexityU * weightMapComplexityV; ++i) {
            weights[i * 4 + 0] = 255;
            weights[i * 4 + 1] = 0;
            weights[i * 4 + 2] = 0;
            weights[i * 4 + 3] = 0;
        }

        const w = Math.min(info.blockCount[0], this._blockCount[0]);
        const h = Math.min(info.blockCount[1], this._blockCount[1]);

        // get weight
        const getOldWeight = (_i: number, _j: number, _weights: Uint8Array) => {
            const index = _j * oldWeightMapComplexityU  + _i;

            const weight = new Vec4();
            weight.x = _weights[index * 4 + 0] / 255.0;
            weight.y = _weights[index * 4 + 1] / 255.0;
            weight.z = _weights[index * 4 + 2] / 255.0;
            weight.w = _weights[index * 4 + 3] / 255.0;

            return weight;
        };

        // sample weight
        const sampleOldWeight = (_x: number, _y: number, _xoff: number, _yoff: number, _weights: Uint8Array) => {
            const ix0 = Math.floor(_x);
            const iz0 = Math.floor(_y);
            const ix1 = ix0 + 1;
            const iz1 = iz0 + 1;
            const dx = _x - ix0;
            const dz = _y - iz0;

            const a = getOldWeight(ix0 + _xoff, iz0 + _yoff, this._weights);
            const b = getOldWeight(ix1 + _xoff, iz0 + _yoff, this._weights);
            const c = getOldWeight(ix0 + _xoff, iz1 + _yoff, this._weights);
            const d = getOldWeight(ix1 + _xoff, iz1 + _yoff, this._weights);
            const m = new Vec4();
            Vec4.add(m, b, c).multiplyScalar(0.5);

            if (dx + dz <= 1.0) {
                d.set(m);
                d.subtract(a);
                d.add(m);
            }
            else {
                a.set(m);
                a.subtract(d);
                a.add(m);
            }

            const n1 = new Vec4();
            const n2 = new Vec4();
            const n = new Vec4();
            Vec4.lerp(n1, a, b, dx);
            Vec4.lerp(n2, c, d, dx);
            Vec4.lerp(n, n1, n2, dz);

            return n;
        };

        // fill new weights
        for (let j = 0; j < h; ++j) {
            for (let i = 0; i < w; ++i) {
                const uoff = i * oldWeightMapSize;
                const voff = j * oldWeightMapSize;

                for (let v = 0; v < info.weightMapSize; ++v) {
                    for (let u = 0; u < info.weightMapSize; ++u) {
                        // tslint:disable-next-line: no-shadowed-variable
                        let w: Vec4;
                        if (info.weightMapSize === oldWeightMapSize) {
                            w = getOldWeight(u + uoff, v + voff, this._weights);
                        }
                        else {
                            const x = u / (info.weightMapSize - 1) * (oldWeightMapSize - 1);
                            const y = v / (info.weightMapSize - 1) * (oldWeightMapSize - 1);
                            w = sampleOldWeight(x, y, uoff, voff, this._weights);
                        }

                        const du = i * info.weightMapSize + u;
                        const dv = j * info.weightMapSize + v;
                        const index = dv * weightMapComplexityU + du;

                        weights[index * 4 + 0] = w.x * 255;
                        weights[index * 4 + 1] = w.y * 255;
                        weights[index * 4 + 2] = w.z * 255;
                        weights[index * 4 + 3] = w.w * 255;
                    }
                }
            }
        }

        this._weights = weights;

        return true;
    }
}
