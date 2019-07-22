
import { Vec3, Vec4, Vec2, Rect } from '../../core/value-types';
import { clamp } from '../../core/vmath';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXDevice } from '../../gfx/device';
import { GFXInputAssembler, IGFXInputAssemblerInfo, IGFXAttribute } from '../../gfx/input-assembler';
import { GFXBufferUsageBit, GFXAttributeName, GFXFormat, GFXMemoryUsageBit, GFXPrimitiveMode } from '../../gfx/define';
import { IRenderingSubmesh } from '../../3d/assets/mesh';
import { Material } from '../../3d/assets/material';
import { Model } from '../../renderer/scene/model'
import { HeightField } from './height-field'
import { Node } from '../../scene-graph/node';
import { Scene } from '../../scene-graph/scene';
import { ModelComponent } from '../../3d/framework/model-component';
import { Texture2D } from '../../assets';
import { Filter, PixelFormat, WrapMode } from '../../assets/asset-enum';
import { EffectAsset } from '../../3d/assets/effect-asset';
import { IDefineMap } from '../core/pass';
import { Component } from '../../components';
import { ccclass, executeInEditMode, menu, property } from '../../core/data/class-decorator';
import { Effect } from '../../renderer/core/effect';
import { RenderableComponent } from '../../3d/framework/renderable-component';
import { builtinResMgr } from '../../3d/builtin';

export const TERRAIN_MAX_LEVELS = 4;
export const TERRAIN_MAX_BLEND_LAYERS = 4;
export const TERRAIN_MAX_LAYER_COUNT = 256;
export const TERRAIN_BLOCK_TILE_COMPLEXITY = 32;
export const TERRAIN_BLOCK_VERTEX_COMPLEXITY = 33;
export const TERRAIN_BLOCK_VERTEX_SIZE = 8; // position + normal + uv
export const TERRAIN_NORTH_INDEX = 0;
export const TERRAIN_SOUTH_INDEX = 1;
export const TERRAIN_WEST_INDEX = 2;
export const TERRAIN_EAST_INDEX = 3;

@ccclass('cc.TerrainInfo')
export class TerrainInfo
{
    @property({
        visible : false
    })
    tileSize: number = 1;

    @property({
        visible : false
    })
    blockCount: number[] = [1, 1];

    @property({
        visible : false
    })
    weightMapSize: number = 128;

    @property({
        visible : false
    })
    lightMapSize: number = 128;

    @property({
        visible : false
    })
    effect: EffectAsset|null = cc.EffectAsset.get('builtin-terrain');

    @property({
        visible : false
    })
    DefaultLayerTex: Texture2D|null = cc.builtinResMgr.get('default-texture');

    //
    protected _tileCount: number[] = [0, 0];
    protected _vertexCount: number[] = [0, 0];
    protected _size: number[] = [0, 0];
    protected _blockSize: number = 32;

    initialize() {
        this._tileCount[0] = this.blockCount[0] * TERRAIN_BLOCK_TILE_COMPLEXITY;
        this._tileCount[1] = this.blockCount[1] * TERRAIN_BLOCK_TILE_COMPLEXITY;
        this._vertexCount[0] = this._tileCount[0] + 1;
        this._vertexCount[1] = this._tileCount[1] + 1;
        this._blockSize[0] = this._tileCount[0] * this.tileSize;
        this._blockSize[1] = this._tileCount[1] * this.tileSize;
        this._size[0] = this._tileCount[0] * this.tileSize;
        this._size[1] = this._tileCount[1] * this.tileSize;
    }

    get tileCount() {
        return this._tileCount;
    }

    get vertexCount() {
        return this._vertexCount;
    }

    get size() {
        return this._size;
    }

    get blockSize() {
        return this._blockSize;
    }
}

@ccclass('cc.TerrainLayer')
export class TerrainLayer
{
    @property
    detailMap: Texture2D|null = null;
    @property
    tileSize: number = 1;
}

export class TerrainVertex
{
    position: Vec3 = new Vec3(0, 0, 0);
    normal: Vec3 = new Vec3(0, 1, 0);
    uv: Vec2 = new Vec2(0, 0);
}

export class TerrainRenderable extends RenderableComponent {
    _model: Model | null = null;
    _meshData: IRenderingSubmesh | null = null;

    _brushMaterial: Material | null = null;
    _currentMaterial: Material | null = null;
    _currentMaterialLayers: number = 0;

    public destroy () {
        this._invalidMaterial();
        if (this._model != null) {
            this._getRenderScene().destroyModel(this._model);
            this._model = null;
        }

        super.destroy();
    }

    private _getBuiltinMaterial () {
        return builtinResMgr.get<Material>('missing-material');
    }

    public _onMaterialModified (idx: number, mtl: Material | null) {
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

    _invalidMaterial() {
        if (this._currentMaterial == null) {
            return;
        }

        this._clearMaterials();

        this._currentMaterial = null;
        if (this._model != null) {
            this._model.enabled = false;
        }
    }

    _updateBrushMaterial() {
        if (this._currentMaterial == null || this._brushMaterial == null) {
            return;
        }

        let passes = this._currentMaterial.passes;

        passes.push(this._brushMaterial.passes[0]);

        //this._currentMaterial = this._brushMaterial;
    }

    _updateMaterial(block: TerrainBlock, init: boolean) {
        if (this._meshData == null || block._terrain.info.effect == null) {
            return;
        }

        let nlayers = block.getMaxLayer();
        if (this._currentMaterial == null || nlayers != this._currentMaterialLayers) {
            if (this._model != null) {
                this._currentMaterial = new Material;

                this._currentMaterial.initialize({
                    effectAsset: block._terrain.info.effect,
                    defines: block._getMaterialDefines(nlayers)
                });

                this._updateBrushMaterial();

                if (init) {
                    this._model.initSubModel(0, this._meshData, this._currentMaterial);
                }

                this.setMaterial(this._currentMaterial, 0);
                this._currentMaterialLayers = nlayers;
                this._model.enabled = true;
            }
        }
    }
}

export class TerrainBlock
{
    _terrain: Terrain;
    _node: Node;
    _renderable: TerrainRenderable;

    _index: number[] = [1, 1];
    _neighbor: TerrainBlock|null[] = [null, null, null, null];
    _layers: number[] = [-1, -1, -1, -1];
    _weightMap: Texture2D | null = null;
   
    constructor(t: Terrain, i: number, j: number) {
        this._terrain = t;
        this._index[0] = i;
        this._index[1] = j;

        this._node = new Node('');
        this._node.setParent(this._terrain.node);

        this._renderable =  this._node.addComponent(TerrainRenderable) as TerrainRenderable;
    }

    build() {
        const gfxDevice = cc.director.root.device as GFXDevice;

        // vertex buffer
        let vertexData = new Float32Array(TERRAIN_BLOCK_VERTEX_SIZE * TERRAIN_BLOCK_VERTEX_COMPLEXITY * TERRAIN_BLOCK_VERTEX_COMPLEXITY);
        
        let index = 0;
        for (let j = 0; j < TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++j) {
            for (let i = 0; i < TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++i) {
                let x = this._index[0] * TERRAIN_BLOCK_TILE_COMPLEXITY + i;
                let y = this._index[1] * TERRAIN_BLOCK_TILE_COMPLEXITY + j;

                let position = this._terrain.getPosition(x, y);
                let normal = this._terrain.getNormal(x, y);
                let uv = new Vec2(i / TERRAIN_BLOCK_VERTEX_COMPLEXITY, j / TERRAIN_BLOCK_VERTEX_COMPLEXITY);
                
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

        // index buffer
        const indexBuffer = this._terrain.getSharedIndexBuffer();

        //
        const gfxAttributes: IGFXAttribute[] = [
            { name: GFXAttributeName.ATTR_POSITION, format: GFXFormat.RGB32F },
            { name: GFXAttributeName.ATTR_NORMAL, format: GFXFormat.RGB32F },
            { name: GFXAttributeName.ATTR_TEX_COORD, format: GFXFormat.RG32F}
        ];

        this._renderable._meshData = {
            attributes: gfxAttributes,
            vertexBuffers: [vertexBuffer],
            indexBuffer : indexBuffer,
            primitiveMode: GFXPrimitiveMode.TRIANGLE_LIST,
        };

        this._renderable._model = this._renderable._getRenderScene().createModel(Model, this._node);

        // 
        this._updateWeightMap();

        //
        this._updateMaterial(true);
    }

    rebuild() {
        this._updateHeight();
        this._updateWeightMap();

        this._renderable._invalidMaterial();
        this._updateMaterial(false);
    }

    destroy() {
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

    update(dtime: number) {
        this._updateMaterial(false);

        let mtl = this._renderable._currentMaterial;
        if (mtl != null) {
            let nlayers = this.getMaxLayer();
            let uvScale = new Vec4(1, 1, 1, 1);

            if (nlayers == 0) {
                if (this._layers[0] != -1) {
                    let l0 = this._terrain.getLayer(this._layers[0]);

                    if (l0 != null) {
                        uvScale.x = 1.0 / l0.tileSize;
                    }
                    
                    mtl.setProperty('detailMap0', l0 != null ? l0.detailMap : null);
                }
                else {
                    mtl.setProperty('detailMap0', this._terrain.info.DefaultLayerTex);
                }
            }
            else if (nlayers == 1) {
                let l0 = this._terrain.getLayer(this._layers[0]);
                let l1 = this._terrain.getLayer(this._layers[1]);

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
            else if (nlayers == 2) {
                let l0 = this._terrain.getLayer(this._layers[0]);
                let l1 = this._terrain.getLayer(this._layers[1]);
                let l2 = this._terrain.getLayer(this._layers[2]);

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
            else if (nlayers == 3) {
                let l0 = this._terrain.getLayer(this._layers[0]);
                let l1 = this._terrain.getLayer(this._layers[1]);
                let l2 = this._terrain.getLayer(this._layers[2]);
                let l3 = this._terrain.getLayer(this._layers[3]);

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
        }
    }

    setBrushMaterial(mtl: Material|null) {
        if (this._renderable._brushMaterial != mtl) {
            this._renderable._brushMaterial = mtl;
            this._renderable._invalidMaterial();
        }
    }

    getIndex() {
        return this._index;
    }

    getRect() {
        let xtile = TERRAIN_BLOCK_TILE_COMPLEXITY;
		let ztile = TERRAIN_BLOCK_TILE_COMPLEXITY;

        let rect = new Rect;
        rect.x = this._index[0] * TERRAIN_BLOCK_TILE_COMPLEXITY;
        rect.y = this._index[1] * TERRAIN_BLOCK_TILE_COMPLEXITY;
        rect.width = TERRAIN_BLOCK_TILE_COMPLEXITY;
        rect.height = TERRAIN_BLOCK_TILE_COMPLEXITY;
        
        return rect;
    }

    setLayer(index: number, layerId: number) {
        if (this._layers[index] != layerId) {
            this._layers[index] = layerId;
            this._renderable._invalidMaterial();
        }
    }

    getLayer(index: number) {
        return this._layers[index];
    }

    getMaxLayer() {
        if (this._layers[3] >= 0) {
            return 3;
        }
        else if (this._layers[2] >= 0) {
            return 2;
        }
        else if (this._layers[1] >= 0) {
            return 1;
        }
        else {
            return 0;
        }
    }

    _getMaterialDefines(nlayers: number): IDefineMap {
        if (nlayers == 0) {
            return { LAYERS: 1 };
        }
        else if (nlayers == 1) {
            return { LAYERS: 2 };
        }
        else if (nlayers == 2) {
            return { LAYERS: 3 };
        }
        else if (nlayers == 3) {
            return { LAYERS: 4 };
        }

        return { LAYERS: 0 };
    }

    _updateMaterial(init: boolean) {
        this._renderable._updateMaterial(this, init);
    }

    _updateHeight() {
        let vertexData = new Float32Array(TERRAIN_BLOCK_VERTEX_SIZE * TERRAIN_BLOCK_VERTEX_COMPLEXITY * TERRAIN_BLOCK_VERTEX_COMPLEXITY);
        
        let index = 0;
        for (let j = 0; j < TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++j) {
            for (let i = 0; i < TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++i) {
                let x = this._index[0] * TERRAIN_BLOCK_TILE_COMPLEXITY + i;
                let y = this._index[1] * TERRAIN_BLOCK_TILE_COMPLEXITY + j;

                let position = this._terrain.getPosition(x, y);
                let normal = this._terrain.getNormal(x, y);
                let uv = new Vec2(i / TERRAIN_BLOCK_VERTEX_COMPLEXITY, j / TERRAIN_BLOCK_VERTEX_COMPLEXITY);
                
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

        this._renderable._meshData!.vertexBuffers[0].update(vertexData);
    }

    _updateWeightMap() {
        let nlayers = this.getMaxLayer();

        if (nlayers == 0) {
            if (this._weightMap != null) {
                this._weightMap.destroy();
                this._weightMap = null;
            }

            return;
        }
        else {
            if (this._weightMap == null) {
                this._weightMap = new Texture2D();
                this._weightMap.create(this._terrain.info.weightMapSize, this._terrain.info.weightMapSize, PixelFormat.RGBA8888);
                this._weightMap.setFilters(Filter.LINEAR, Filter.LINEAR);
                this._weightMap.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);   
            }
        }

        let weightData = new Uint8Array(this._terrain.info.weightMapSize * this._terrain.info.weightMapSize * 4);
        let weightIndex = 0;
        for (let j = 0; j < this._terrain.info.weightMapSize; ++j) {
            for (let i = 0; i < this._terrain.info.weightMapSize; ++i) {
                let x = this._index[0] * this._terrain.info.weightMapSize + i;
                let y = this._index[1] * this._terrain.info.weightMapSize + j;
                let w =  this._terrain.getWeight(x, y);
                
                weightData[weightIndex * 4 + 0] = Math.floor(w.x * 255);
                weightData[weightIndex * 4 + 1] = Math.floor(w.y * 255);
                weightData[weightIndex * 4 + 2] = Math.floor(w.z * 255);
                weightData[weightIndex * 4 + 3] = Math.floor(w.w * 255);

                weightIndex += 1;
            }
        }
        this._weightMap.directUpdate(weightData.buffer);
    }
}

@ccclass('cc.Terrain')
@menu('Components/Terrain')
@executeInEditMode
export class Terrain extends Component
{
    @property({
        visible: false,
    })
    protected _info: TerrainInfo = new TerrainInfo;

    @property({
        visible: false,
    })
    protected _layers: Array<TerrainLayer|null> = [];
    
    @property({
        visible: false,
    })
    protected _heights: Array<number> = [];
    
    @property({
        visible: false,
    })
    protected _normals: Array<number> = [];

    @property({
        visible: false,
    })
    protected _weights: Uint8Array = new Uint8Array();

    protected _blocks: Array<TerrainBlock> = [];
    protected _sharedIndexBuffer: GFXBuffer;

    constructor() {
        super();

        const gfxDevice = cc.director.root.device as GFXDevice;

        // initialize shared index buffer
        let indexData = new Uint16Array(TERRAIN_BLOCK_TILE_COMPLEXITY * TERRAIN_BLOCK_TILE_COMPLEXITY * 6);

        let index = 0;
        for (let j = 0; j < TERRAIN_BLOCK_TILE_COMPLEXITY; ++j) {
            for (let i = 0; i < TERRAIN_BLOCK_TILE_COMPLEXITY; ++i) {
                let a = j * TERRAIN_BLOCK_VERTEX_COMPLEXITY + i;
                let b = j * TERRAIN_BLOCK_VERTEX_COMPLEXITY + i + 1;
                let c = (j + 1) * TERRAIN_BLOCK_VERTEX_COMPLEXITY + i;
                let d = (j + 1) * TERRAIN_BLOCK_VERTEX_COMPLEXITY + i + 1;

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

        // initialize layers
        for (let i = 0; i < TERRAIN_MAX_LAYER_COUNT; ++i) {
            this._layers.push(null);
        }
    }

    get info() {
        return this._info;
    }

    build(info: TerrainInfo) {
        this._info.tileSize = info.tileSize;
        this._info.blockCount[0] = info.blockCount[0];
        this._info.blockCount[1] = info.blockCount[1];
        this._info.weightMapSize = info.weightMapSize;
        this._info.lightMapSize = info.lightMapSize;
        this._info.initialize();

        return this._buildImp();
    }

    _rebuildHeights(info: TerrainInfo) {
        if (this.info.vertexCount[0] == info.vertexCount[0] &&
            this.info.vertexCount[1] == info.vertexCount[1]) {
            return false;
        }

        let heights = new Array<number>(info.vertexCount[0] * info.vertexCount[1]);
        for (let i = 0; i < heights.length; ++i) {
            heights[i] = 0;
        }

        let w = Math.min(this.info.vertexCount[0], info.vertexCount[0]);
        let h = Math.min(this.info.vertexCount[1], info.vertexCount[1]);

        for (let j = 0; j < h; ++j) {
            for (let i = 0; i < w; ++i) {
                let index0 = j * this.info.vertexCount[1] + i;
                let index1 = j * this.info.vertexCount[0] + i;

                heights[index0] = this._heights[index1];
            }
        }

        this._heights = heights;

        return true;
    }

    _rebuildWeights(info: TerrainInfo) {
        let oldWeightMapSize = this.info.weightMapSize;
        let oldWeightMapComplexityU = this.info.weightMapSize * this.info.blockCount[0];
        let oldWeightMapComplexityV = this.info.weightMapSize * this.info.blockCount[1];

        let weightMapComplexityU = info.weightMapSize * info.blockCount[0];
        let weightMapComplexityV = info.weightMapSize * info.blockCount[1];

        if (weightMapComplexityU == oldWeightMapComplexityU &&
            weightMapComplexityV == oldWeightMapComplexityV) {
            return false;
        }

        let weights = new Uint8Array(weightMapComplexityU * weightMapComplexityV * 4);

        for (let i = 0; i < weightMapComplexityU * weightMapComplexityV; ++i) {
            weights[i * 4 + 0] = 255;
            weights[i * 4 + 1] = 0;
            weights[i * 4 + 2] = 0;
            weights[i * 4 + 3] = 0;
        }

        let w = Math.min(info.blockCount[0], this.info.blockCount[0]);
        let h = Math.min(info.blockCount[1], this.info.blockCount[1]);

        for (let j = 0; j < h; ++j) {
            for (let i = 0; i < w; ++i) {
                let xoff = i * oldWeightMapSize;
                let yoff = j * oldWeightMapSize;

                // sample weight
                let getWeight = (_j: number, _i: number, _weights: Uint8Array)=> {
                    let index = _j * oldWeightMapComplexityU  + _i;
        
                    let w = new Vec4();
                    w.x = _weights[index * 4 + 0] / 255.0;
                    w.y = _weights[index * 4 + 1] / 255.0;
                    w.z = _weights[index * 4 + 2] / 255.0;
                    w.w = _weights[index * 4 + 3] / 255.0;

                    return w;
                };

                for (let v = 0; v < this.info.weightMapSize; ++v) {
                    for (let u = 0; u < this.info.weightMapSize; ++u) {
                        let fx = u / (this.info.weightMapSize - 1) * (oldWeightMapSize - 1);
                        let fy = v / (this.info.weightMapSize - 1) * (oldWeightMapSize - 1);

                        let ix0 = Math.floor(fx);
                        let iz0 = Math.floor(fy);
                        let ix1 = ix0 + 1;
                        let iz1 = iz0 + 1;
                        let dx = fx - ix0;
                        let dz = fy - iz0;

                        ix0 = clamp(ix0, 0, oldWeightMapSize - 1);
                        iz0 = clamp(iz0, 0, oldWeightMapSize - 1);
                        ix1 = clamp(ix1, 0, oldWeightMapSize - 1);
                        iz1 = clamp(iz1, 0, oldWeightMapSize - 1);

                        let a = getWeight(ix0 + xoff, iz0 + yoff, this._weights);
                        let b = getWeight(ix1 + xoff, iz0 + yoff, this._weights);
                        let c = getWeight(ix0 + xoff, iz1 + yoff, this._weights);
                        let d = getWeight(ix1 + xoff, iz1 + yoff, this._weights);
                        let m = b.add(c).mul(0.5);

                        if (dx + dz <= 1.0) {
                            d = m.add(m.sub(a));
                        }
                        else {
                            a = m.add(m.sub(d));
                        }

                        let w1 = a.mul(1.0 - dx).add(b.mul(dx));
                        let w2 = c.mul(1.0 - dx).add(d.mul(dx));
                        let w = w1.mul(1.0 - dz).add(w2.mul(dz));

                        let du = i * this.info.weightMapSize + u;
                        let dv = j * this.info.weightMapSize + v;
                        let index = du * weightMapComplexityU + dv;

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

    rebuild(info: TerrainInfo) {
        info.initialize();

        let oldBlockCountU = this.info.blockCount[0];
        let oldBlockCountV = this.info.blockCount[1];
        let oldBlocks: Array<TerrainBlock|null> = [];
        for (let i = 0; i < this._blocks.length; ++i) {
            oldBlocks.push(this._blocks[i]);
        }
        this._blocks = [];
        
        // build heights
        this._rebuildHeights(info);
        
        // build weights
        this._rebuildWeights(info);
        
        // update info
        this._info.tileSize = info.tileSize;
        this._info.blockCount[0] = info.blockCount[0];
        this._info.blockCount[1] = info.blockCount[1];
        this._info.weightMapSize = info.weightMapSize;
        this._info.lightMapSize = info.lightMapSize;
        this._info.effect = info.effect;
        this._info.DefaultLayerTex = info.DefaultLayerTex;
        this._info.initialize();

        // build blocks
        this._buildNormals();

        for (let j = 0; j < this._info.blockCount[1]; ++j) {
            for (let i = 0; i < this._info.blockCount[0]; ++i) {
                let block: TerrainBlock;
                if (i < oldBlockCountU && j < oldBlockCountV) {
                    block = oldBlocks[j * oldBlockCountU + i] as TerrainBlock;
                    oldBlocks[j * oldBlockCountU + i] = null;
                }
                else {
                    block = new TerrainBlock(this, i, j);
                }

                this._blocks.push(block);
            }
        }

        for (let i = 0; i < oldBlocks.length; ++i) {
            let block = oldBlocks[i];
            if (block != null) {
                block.destroy();
            }
        }

        for (let j = 0; j < this._info.blockCount[1]; ++j) {
            for (let i = 0; i < this._info.blockCount[0]; ++i) {
                let index = j * this._info.blockCount[0] + i;
                if (i < oldBlockCountU && j < oldBlockCountV) {
                    this._blocks[index].rebuild();
                }
                else {
                    this._blocks[index].build();
                }
            }
        }
    }

    _buildImp() {
        if (this._blocks.length > 0) {
            return true;
        }

        this._info.initialize();

        if (this._info.blockCount[0] == 0 || this._info.blockCount[1] == 0) {
            return false;
        }

        // build heights & normals
        let vcount = this._info.vertexCount[0] * this._info.vertexCount[1];
        this._heights = new Array<number>(vcount);
        this._normals = new Array<number>(vcount * 3);

        for (let i = 0; i < vcount; ++i) {
            this._heights[i] = 0;
            this._normals[i * 3 + 0] = 0;
            this._normals[i * 3 + 1] = 1;
            this._normals[i * 3 + 2] = 0;
        }

        // initialize weights
        let weightMapComplexityU = this.info.weightMapSize * this.info.blockCount[0];
        let weightMapComplexityV = this.info.weightMapSize * this.info.blockCount[1];
        this._weights = new Uint8Array(weightMapComplexityU * weightMapComplexityV * 4);
        for (let i = 0; i < weightMapComplexityU * weightMapComplexityV; ++i) {
            this._weights[i * 4 + 0] = 255;
            this._weights[i * 4 + 1] = 0;
            this._weights[i * 4 + 2] = 0;
            this._weights[i * 4 + 3] = 0;
        }

        // build blocks
        for (let j = 0; j < this._info.blockCount[1]; ++j) {
            for (let i = 0; i < this._info.blockCount[0]; ++i) {
                this._blocks.push(new TerrainBlock(this, i, j));
            }
        }

        for (let i = 0; i < this._blocks.length; ++i) {
            this._blocks[i].build();
        }
    }

    destroy() {
        for (let i = 0; i < this._layers.length; ++i) {
            let layer = this._layers[i];
            if (layer != null) {
                if (layer.detailMap != null) {
                    layer.detailMap.destroy();
                }
            }

            this._layers[i] = null;
        }

        for (let i = 0; i < this._blocks.length; ++i) {
            let block = this._blocks[i];
            block.destroy();
        }
        this._blocks = [];

        this._sharedIndexBuffer.destroy();

        super.destroy();
    }

    Import(hf: HeightField, heightScale: number) {
        let index = 0;
        for (let j = 0; j < this._info.vertexCount[1]; ++j) {
            for (let i = 0; i < this._info.vertexCount[0]; ++i) {
                let u = i / this._info.tileCount[0];
                let v = j / this._info.tileCount[1];

                let h = hf.getAt(u * hf.w, v * hf.h) * heightScale;

                this._heights[index++] = h;
            }
        }

        this._buildNormals();

        // rebuild all blocks
        for (let i = 0; i < this._blocks.length; ++i) {
            this._blocks[i]._updateHeight();
        }
    }

    Export(hf: HeightField, heightScale: number) {
        let index = 0;
        for (let j = 0; j < hf.h; ++j) {
            for (let i = 0; i < hf.w; ++i) {
                let u = i / (hf.w - 1);
                let v = j / (hf.h - 1);

                let x = u * this._info.size[0];
                let y = v * this._info.size[1];

                let h = this.getHeightAt(x, y);
                if (h != null) {
                    hf.data[index++] = h * heightScale;
                }
            }
        }
    }

    start() {
        if (this._blocks.length == 0) {
            this._buildImp();
        }
    }

    update(dtime: number) {
        for (let i = 0; i < this._blocks.length; ++i) {
            this._blocks[i].update(dtime);
        }
    }

    addLayer(layer: TerrainLayer) {
        for (let i = 0; i < this._layers.length; ++i) {
            if (this._layers[i] == null) {
                this._layers[i] = layer;
                return i;
            }
        }

        return -1;
    }

    setLayer(i: number, layer: TerrainLayer) {
        this._layers[i] = layer;
    }

    removeLayer(id: number) {
        this._layers[id] = null;
    }

    getLayer(id: number) {
        return this._layers[id];
    }

    getPosition(i: number, j: number) {
        let x = i * this._info.tileSize;
        let z = j * this._info.tileSize;
        let y = this.getHeight(i, j);

        return new Vec3(x, y, z);
    }

    setHeight(i: number, j: number, h: number) {
        this._heights[j * this._info.vertexCount[0] + i] = h;
    }

    getHeight(i: number, j: number) {
        return this._heights[j * this._info.vertexCount[0] + i];
    }

    getHeightClamp(i: number, j: number) {
        i = clamp(i, 0, this._info.vertexCount[0] - 1);
        j = clamp(j, 0, this._info.vertexCount[1] - 1);

        return this.getHeight(i, j);
    }

    getHeightAt(x: number, y: number) {
        let fx = x / this._info.vertexCount[0];
        let fy = y / this._info.vertexCount[1];

        let ix0 = Math.floor(fx);
        let iz0 = Math.floor(fy);
        let ix1 = ix0 + 1;
        let iz1 = iz0 + 1;
        let dx = fx - ix0;
        let dz = fy - iz0;

        if (ix0 < 0 || ix0 > this._info.vertexCount[0] - 1 ||
			iz0 < 0 || iz0 > this._info.vertexCount[1] - 1) {
            return null;
        }

        ix0 = clamp(ix0, 0, this._info.vertexCount[0]  - 1);
        iz0 = clamp(iz0, 0, this._info.vertexCount[1]  - 1);
        ix1 = clamp(ix1, 0, this._info.vertexCount[0]  - 1);
        iz1 = clamp(iz1, 0, this._info.vertexCount[1]  - 1);

        let a = this.getHeight(ix0, iz0);
		let b = this.getHeight(ix1, iz0);
		let c = this.getHeight(ix0, iz1);
		let d = this.getHeight(ix1, iz1);
		let m = (b + c) * 0.5;

		if (dx + dz <= 1.0) {
			d = m + (m - a);
		}
		else {
			a = m + (m - d);
		}

		let h1 = a * (1.0 - dx) + b * dx;
		let h2 = c * (1.0 - dx) + d * dx;

        let h = h1 * (1.0 - dz) + h2 * dz;
        
        return h;
    }

    _setNormal(i: number, j: number, n: Vec3) {
        let index = j * this._info.vertexCount[0] + i;
        
        this._normals[index * 3 + 0] =  n.x;
        this._normals[index * 3 + 1] =  n.y;
        this._normals[index * 3 + 2] =  n.z;
    }

    getNormal(i: number, j: number) {
        let index = j * this._info.vertexCount[0] + i

        let n = new Vec3();
        n.x = this._normals[index * 3 + 0];
        n.y = this._normals[index * 3 + 1];
        n.z = this._normals[index * 3 + 2];

        return n;
    }

    getNormalAt(x: number, y: number) {
        let fx = x / this._info.vertexCount[0];
        let fy = y / this._info.vertexCount[1];

        let ix0 = Math.floor(fx);
        let iz0 = Math.floor(fy);
        let ix1 = ix0 + 1;
        let iz1 = iz0 + 1;
        let dx = fx - ix0;
        let dz = fy - iz0;

        if (ix0 < 0 || ix0 > this._info.vertexCount[0] - 1 ||
			iz0 < 0 || iz0 > this._info.vertexCount[1] - 1) {
            return null;
        }

        ix0 = clamp(ix0, 0, this._info.vertexCount[0]  - 1);
        iz0 = clamp(iz0, 0, this._info.vertexCount[1]  - 1);
        ix1 = clamp(ix1, 0, this._info.vertexCount[0]  - 1);
        iz1 = clamp(iz1, 0, this._info.vertexCount[1]  - 1);

        let a = this.getNormal(ix0, iz0);
		let b = this.getNormal(ix1, iz0);
		let c = this.getNormal(ix0, iz1);
		let d = this.getNormal(ix1, iz1);
		let m = b.add(c).mul(0.5);

		if (dx + dz <= 1.0) {
			d = m.add(m.sub(a));
		}
		else {
			a = m.add(m.sub(d));
		}

		let n1 = a.mul(1.0 - dx).add(b.mul(dx));
		let n2 = c.mul(1.0 - dx).add(d.mul(dx));

        let n = n1.mul(1.0 - dz).add(n2.mul(dz));
        
        return n;
    }

    setWeight(i: number, j: number, w: Vec4) {
        let index = j * this.info.weightMapSize * this.info.blockCount[0] + i;
        
        this._weights[index * 4 + 0] = w.x * 255;
        this._weights[index * 4 + 1] = w.y * 255;
        this._weights[index * 4 + 2] = w.z * 255;
        this._weights[index * 4 + 3] = w.w * 255;
    }

    getWeight(i: number, j: number) {
        let index = j * this.info.weightMapSize * this.info.blockCount[0] + i;
        
        let w = new Vec4();
        w.x = this._weights[index * 4 + 0] / 255.0;
        w.y = this._weights[index * 4 + 1] / 255.0;
        w.z = this._weights[index * 4 + 2] / 255.0;
        w.w = this._weights[index * 4 + 3] / 255.0;

        return w;
    }

    getWeightAt(x: number, y: number) {
        let fx = x / this._info.vertexCount[0];
        let fy = y / this._info.vertexCount[1];

        let ix0 = Math.floor(fx);
        let iz0 = Math.floor(fy);
        let ix1 = ix0 + 1;
        let iz1 = iz0 + 1;
        let dx = fx - ix0;
        let dz = fy - iz0;

        if (ix0 < 0 || ix0 > this._info.vertexCount[0] - 1 ||
			iz0 < 0 || iz0 > this._info.vertexCount[1] - 1) {
            return null;
        }

        ix0 = clamp(ix0, 0, this._info.vertexCount[0]  - 1);
        iz0 = clamp(iz0, 0, this._info.vertexCount[1]  - 1);
        ix1 = clamp(ix1, 0, this._info.vertexCount[0]  - 1);
        iz1 = clamp(iz1, 0, this._info.vertexCount[1]  - 1);

        let a = this.getWeight(ix0, iz0);
		let b = this.getWeight(ix1, iz0);
		let c = this.getWeight(ix0, iz1);
		let d = this.getWeight(ix1, iz1);
		let m = b.add(c).mul(0.5);

		if (dx + dz <= 1.0) {
			d = m.add(m.sub(a));
		}
		else {
			a = m.add(m.sub(d));
		}

		let w1 = a.mul(1.0 - dx).add(b.mul(dx));
		let w2 = c.mul(1.0 - dx).add(d.mul(dx));

        let w = w1.mul(1.0 - dz).add(w2.mul(dz));
        
        return w;
    }

    getBlock(i: number, j: number) {
        return this._blocks[j * this._info.blockCount[0] + i];
    }

    getBlocks() {
        return this._blocks;
    }

    getSharedIndexBuffer() {
        return this._sharedIndexBuffer;
    }

    rayCheck(start: Vec3, dir: Vec3, step: number) {
        const MAX_COUNT = 2000;

		let i = 0;
        let trace = start;
		let position: Vec3|null = null;

		if (dir.equals(new Vec3(0, 1, 0))) {
			let y = this.getHeightAt(trace.x, trace.z);
			if (y != null && trace.y <= y) {
				position = new Vec3(trace.x, y, trace.z);
			}
		}
		else if (dir.equals(new Vec3(0, -1, 0))) {
			let y = this.getHeightAt(trace.x, trace.z);
			if (y != null && trace.y >= y) {
				position = new Vec3(trace.x, y, trace.z);
			}
		}
		else {
            // 穷举法
			while (i++ < MAX_COUNT) {
				let y = this.getHeightAt(trace.x, trace.z);
				if (y != null && trace.y <= y) {
					position = new Vec3(trace.x, y, trace.z);
					break;
				}

				trace = trace.add(dir.mul(step));
			}
		}
		
		return position;
    }

    _calcuNormal(x: number, z: number) {
        let flip = 1;
		let here = this.getPosition(x, z);
		let right: Vec3, up: Vec3;

		if (x < this._info.vertexCount[0] - 1) {
			right = this.getPosition(x + 1, z);
		}
		else {
			flip *= -1;
			right = this.getPosition(x - 1, z);
		}

		if (z < this._info.vertexCount[1] - 1) {
			up = this.getPosition(x, z + 1);
		}
		else {
			flip *= -1;
			up = this.getPosition(x, z - 1);
		}

		right = right.sub(here);
		up = up.sub(here);

		let normal = up.cross(right).mul(flip);
		normal.normalizeSelf();
        return normal;
    }

    _buildNormals() {
        let index = 0;
        for (let y = 0; y < this._info.vertexCount[1]; ++y) {
            for (let x = 0; x < this._info.vertexCount[0]; ++x) {
                let n = this._calcuNormal(x, y);

                this._normals[index * 3 + 0] = n.x;
                this._normals[index * 3 + 1] = n.y;
                this._normals[index * 3 + 2] = n.z;
                index += 1;
            }
        }
    }
}