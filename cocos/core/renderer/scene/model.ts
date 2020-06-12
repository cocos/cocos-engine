// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { builtinResMgr } from '../../3d/builtin/init';
import { Material } from '../../assets/material';
import { RenderingSubMesh } from '../../assets/mesh';
import { aabb } from '../../geometry';
import { GFXBuffer } from '../../gfx/buffer';
import { getTypedArrayConstructor, GFXBufferUsageBit, GFXFormat, GFXFormatInfos, GFXMemoryUsageBit, GFXFilter, GFXAddress } from '../../gfx/define';
import { GFXDevice, GFXFeature } from '../../gfx/device';
import { Mat4, Vec3, Vec4 } from '../../math';
import { Pool } from '../../memop';
import { UBOLocal, UniformLightingMapSampler, INST_MAT_WORLD } from '../../pipeline/define';
import { Node } from '../../scene-graph';
import { Layers } from '../../scene-graph/layers';
import { RenderScene } from './render-scene';
import { Texture2D } from '../..';
import { genSamplerHash, samplerLib } from '../../renderer/core/sampler-lib';
import { IGFXAttribute } from '../../gfx';
import { SubModel, IPSOCreateInfo } from './submodel';
import { Pass, IMacroPatch } from '../core/pass';
import { legacyCC } from '../../global-exports';

const m4_1 = new Mat4();

const _subMeshPool = new Pool(() => {
    return new SubModel();
}, 32);

export interface IInstancedAttribute {
    name: string;
    format: GFXFormat;
    isNormalized?: boolean;
    view: ArrayBufferView;
}
export interface IInstancedAttributeBlock {
    buffer: Uint8Array;
    list: IInstancedAttribute[];
}

export enum ModelType {
    DEFAULT,
    SKINNING,
    BAKED_SKINNING,
    UI_BATCH,
    PARTICLE_BATCH,
    LINE,
}

function uploadMat4AsVec4x3 (mat: Mat4, v1: ArrayBufferView, v2: ArrayBufferView, v3: ArrayBufferView) {
    v1[0] = mat.m00; v1[1] = mat.m01; v1[2] = mat.m02; v1[3] = mat.m12;
    v2[0] = mat.m04; v2[1] = mat.m05; v2[2] = mat.m06; v2[3] = mat.m13;
    v3[0] = mat.m08; v3[1] = mat.m09; v3[2] = mat.m10; v3[3] = mat.m14;
}

const lightmapSamplerHash = genSamplerHash([
    GFXFilter.LINEAR,
    GFXFilter.LINEAR,
    GFXFilter.NONE,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
]);

const lightmapSamplerWithMipHash = genSamplerHash([
    GFXFilter.LINEAR,
    GFXFilter.LINEAR,
    GFXFilter.LINEAR,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
]);

/**
 * A representation of a model
 */
export class Model {

    get subModels () {
        return this._subModels;
    }

    get subModelNum () {
        return this._subModels.length;
    }

    get inited (): boolean {
        return this._inited;
    }

    get worldBounds () {
        return this._worldBounds;
    }

    get modelBounds () {
        return this._modelBounds;
    }

    get localBuffer () {
        return this._localBuffer;
    }

    get updateStamp () {
        return this._updateStamp;
    }

    get isInstancingEnabled () {
        return this._instMatWorldIdx >= 0;
    }

    public type = ModelType.DEFAULT;
    public scene: RenderScene | null = null;
    public node: Node = null!;
    public transform: Node = null!;
    public enabled: boolean = true;
    public visFlags = Layers.Enum.NONE;
    public castShadow = false;
    public isDynamicBatching = false;
    public instancedAttributes: IInstancedAttributeBlock = { buffer: null!, list: [] };

    protected _device: GFXDevice;
    protected _worldBounds: aabb | null = null;
    protected _modelBounds: aabb | null = null;
    protected _subModels: SubModel[] = [];
    protected _implantPSOCIs: IPSOCreateInfo[] = [];
    protected _localData = new Float32Array(UBOLocal.COUNT);
    protected _localBuffer: GFXBuffer | null = null;
    protected _inited = false;
    protected _updateStamp = -1;
    protected _transformUpdated = true;

    private _instMatWorldIdx = -1;

    /**
     * Setup a default empty model
     */
    constructor () {
        this._device = legacyCC.director.root!.device;
    }

    public initialize (node: Node) {
        this.transform = this.node = node;
    }

    public destroy () {
        for (const subModel of this._subModels) {
            subModel.destroy();
            _subMeshPool.free(subModel);
        }
        if (this._localBuffer) {
            this._localBuffer.destroy();
            this._localBuffer = null;
        }
        this._worldBounds = null;
        this._modelBounds = null;
        this._subModels.length = 0;
        this._inited = false;
        this._transformUpdated = true;
        this.isDynamicBatching = false;
    }

    public attachToScene (scene: RenderScene) {
        this.scene = scene;
    }

    public detachFromScene () {
        this.scene = null;
    }

    public getSubModel (idx: number) {
        return this._subModels[idx];
    }

    public updateTransform (stamp: number) {
        const node = this.transform!;
        // @ts-ignore TS2445
        if (node.hasChangedFlags || node._dirtyFlags) {
            node.updateWorldTransform();
            this._transformUpdated = true;
            if (this._modelBounds && this._worldBounds) {
                // @ts-ignore TS2445
                this._modelBounds.transform(node._mat, node._pos, node._rot, node._scale, this._worldBounds);
            }
        }
    }

    public updateLightingmap (texture: Texture2D | null, uvParam: Vec4) {
        Vec4.toArray(this._localData, uvParam, UBOLocal.LIGHTINGMAP_UVPARAM);

        if (texture === null) {
            texture = builtinResMgr.get<Texture2D>('empty-texture');
        }

        const gfxTexture = texture.getGFXTexture();
        if (gfxTexture !== null) {
            const sampler = samplerLib.getSampler(this._device, texture.mipmaps.length > 1 ? lightmapSamplerWithMipHash : lightmapSamplerHash);
            for (const sub of this._subModels) {
                for (let i = 0; i < sub.psoInfos.length; i++) {
                    sub.psoInfos[i].bindingLayout.bindTexture(UniformLightingMapSampler.binding, gfxTexture);
                    sub.psoInfos[i].bindingLayout.bindSampler(UniformLightingMapSampler.binding, sampler);
                    sub.psoInfos[i].bindingLayout.update();
                }
            }
        }
    }

    public updateUBOs (stamp: number) {
        this._subModels.forEach(this._updatePass, this);
        this._updateStamp = stamp;
        if (!this._transformUpdated) { return; }
        this._transformUpdated = false;
        // @ts-ignore
        const worldMatrix = this.transform._mat;
        const idx = this._instMatWorldIdx;
        if (idx >= 0) {
            const attrs = this.instancedAttributes!.list;
            uploadMat4AsVec4x3(worldMatrix, attrs[idx].view, attrs[idx + 1].view, attrs[idx + 2].view);
        } else {
            Mat4.toArray(this._localData, worldMatrix, UBOLocal.MAT_WORLD_OFFSET);
            Mat4.inverseTranspose(m4_1, worldMatrix);
            Mat4.toArray(this._localData, m4_1, UBOLocal.MAT_WORLD_IT_OFFSET);
            this._localBuffer!.update(this._localData);
        }
    }

    /**
     * Create the bounding shape of this model
     * @param minPos the min position of the model
     * @param maxPos the max position of the model
     */
    public createBoundingShape (minPos?: Vec3, maxPos?: Vec3) {
        if (!minPos || !maxPos) { return; }
        this._modelBounds = aabb.fromPoints(aabb.create(), minPos, maxPos);
        this._worldBounds = aabb.clone(this._modelBounds);
    }

    public initSubModel (idx: number, subMeshData: RenderingSubMesh, mat: Material) {
        this.initLocalBindings(mat);
        if (this._subModels[idx] == null) {
            this._subModels[idx] = _subMeshPool.alloc();
        } else {
            this._subModels[idx].destroy();
        }
        this._subModels[idx].initialize(subMeshData, mat, this.getMacroPatches(idx));
        this.updateAttributesAndBinding(idx);
        this._inited = true;
    }

    public setSubModelMesh (idx: number, subMeshData: RenderingSubMesh) {
        if (this._subModels[idx] == null) {
            this._subModels[idx] = _subMeshPool.alloc();
        }
        this._subModels[idx].subMeshData = subMeshData;
    }

    public setSubModelMaterial (idx: number, mat: Material | null) {
        this.initLocalBindings(mat);
        if (!this._subModels[idx]) { return; }
        this._subModels[idx].material = mat;

        if (mat) {
            this.updateAttributesAndBinding(idx);
        }
    }

    public onGlobalPipelineStateChanged () {
        const subModels = this._subModels;

        for (let i = 0; i < subModels.length; ++i) {
            subModels[i].onPipelineStateChanged();
            this.updateAttributesAndBinding(i);
        }
    }

    public insertImplantPSOCI (psoci: IPSOCreateInfo, submodelIdx: number) {
        this.updateLocalBindings(psoci, submodelIdx);
        this._implantPSOCIs.push(psoci);
    }

    public removeImplantPSOCI (psoci: IPSOCreateInfo) {
        const idx = this._implantPSOCIs.indexOf(psoci);
        if (idx >= 0) { this._implantPSOCIs.splice(idx, 1); }
    }

    public updateLocalBindings (psoci: IPSOCreateInfo, submodelIdx: number) {
        if (this._localBuffer) {
            psoci.bindingLayout.bindBuffer(UBOLocal.BLOCK.binding, this._localBuffer);
        }
    }

    protected updateAttributesAndBinding (subModelIndex: number) {
        const subModel = this._subModels[subModelIndex];
        if (!subModel) {
            return;
        }

        const psoCreateInfos = subModel.psoInfos;
        for (let i = 0; i < psoCreateInfos.length; ++i) {
            this.updateLocalBindings(psoCreateInfos[i], subModelIndex);
        }

        this.updateInstancedAttributeList(psoCreateInfos[0].shader.attributes, subModel.passes[0]);
    }

    public getMacroPatches (subModelIndex: number) : IMacroPatch[] | undefined {
        return undefined;
    }

    // for now no submodel level instancing attributes
    protected updateInstancedAttributeList (attributes: IGFXAttribute[], pass: Pass) {
        if (!pass.device.hasFeature(GFXFeature.INSTANCED_ARRAYS)) { return; }
        let size = 0;
        for (let j = 0; j < attributes.length; j++) {
            const attribute = attributes[j];
            if (!attribute.isInstanced) { continue; }
            size += GFXFormatInfos[attribute.format].size;
        }
        const attrs = this.instancedAttributes;
        attrs.buffer = new Uint8Array(size); attrs.list.length = 0;
        let offset = 0; const buffer = attrs.buffer.buffer;
        for (let j = 0; j < attributes.length; j++) {
            const attribute = attributes[j];
            if (!attribute.isInstanced) { continue; }
            const format = attribute.format;
            const info = GFXFormatInfos[format];
            const view = new (getTypedArrayConstructor(info))(buffer, offset, info.count);
            const isNormalized = attribute.isNormalized;
            offset += info.size; attrs.list.push({ name: attribute.name, format, isNormalized, view });
        }
        if (pass.instancedBuffer) { pass.instancedBuffer.destroy(); } // instancing IA changed
        this._instMatWorldIdx = this.getInstancedAttributeIndex(INST_MAT_WORLD);
        this._transformUpdated = true;
    }

    protected getInstancedAttributeIndex (name: string) {
        const list = this.instancedAttributes.list;
        for (let i = 0; i < list.length; i++) {
            if (list[i].name === name) { return i; }
        }
        return -1;
    }

    protected initLocalBindings (mat: Material | null) {
        if (!this._localBuffer) {
            this._localBuffer = this._device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: UBOLocal.SIZE,
                stride: UBOLocal.SIZE,
            });
        }
    }

    private _updatePass (subModel: SubModel) {
        subModel.update();
    }
}
