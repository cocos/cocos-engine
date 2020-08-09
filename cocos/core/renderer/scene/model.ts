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
import { INST_MAT_WORLD, UBOLocal, UniformLightingMapSampler } from '../../pipeline/define';
import { Node } from '../../scene-graph';
import { Layers } from '../../scene-graph/layers';
import { RenderScene } from './render-scene';
import { Texture2D } from '../../assets/texture-2d';
import { genSamplerHash, samplerLib } from '../../renderer/core/sampler-lib';
import { IGFXAttribute, GFXDescriptorSet } from '../../gfx';
import { SubModel } from './submodel';
import { Pass, IMacroPatch } from '../core/pass';
import { legacyCC } from '../../global-exports';
import { InstancedBuffer } from '../../pipeline/instanced-buffer';
import { BatchingSchemes } from '../core/pass';
import { ShaderPool, SubModelPool, SubModelView } from '../core/memory-pools';

const m4_1 = new Mat4();

const _subModelPool = new Pool(() => new SubModel(), 32);

const shadowMapPatches: IMacroPatch[] = [
    { name: 'CC_SHADOW', value: true },
];

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
    public receiveShadow = true;
    public isDynamicBatching = false;
    public instancedAttributes: IInstancedAttributeBlock = { buffer: null!, list: [] };

    protected _worldBounds: aabb | null = null;
    protected _modelBounds: aabb | null = null;
    protected _subModels: SubModel[] = [];

    protected _device: GFXDevice;
    protected _inited = false;
    protected _descriptorSetCount = 1;
    protected _updateStamp = -1;
    protected _transformUpdated = true;

    private _localData = new Float32Array(UBOLocal.COUNT);
    private _localBuffer: GFXBuffer | null = null;
    private _instMatWorldIdx = -1;
    private _lightmap: Texture2D | null = null;
    private _lightmapUVParam: Vec4 = new Vec4();

    /**
     * Setup a default empty model
     */
    constructor () {
        this._device = legacyCC.director.root.device;
    }

    public initialize (node: Node) {
        this.transform = this.node = node;
    }

    public destroy () {
        const subModels = this._subModels;
        for (let i = 0; i < subModels.length; i++) {
            const subModel = this._subModels[i];
            subModel.destroy();
            _subModelPool.free(subModel);
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

    public updateUBOs (stamp: number) {
        const subModels = this._subModels;
        for (let i = 0; i < subModels.length; i++) {
            subModels[i].update();
        }
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
        if (this._subModels[idx] == null) {
            this._subModels[idx] = _subModelPool.alloc();
        } else {
            this._subModels[idx].destroy();
        }
        this._subModels[idx].initialize(subMeshData, mat.passes, this.getMacroPatches(idx));
        this._updateAttributesAndBinding(idx);
        this._inited = true;
    }

    public setSubModelMesh (idx: number, subMesh: RenderingSubMesh) {
        if (!this._subModels[idx]) { return; }
        this._subModels[idx].subMesh = subMesh;
    }

    public setSubModelMaterial (idx: number, mat: Material) {
        if (!this._subModels[idx]) { return; }
        this._subModels[idx].passes = mat.passes;
        this._updateAttributesAndBinding(idx);
    }

    public onGlobalPipelineStateChanged () {
        const subModels = this._subModels;
        for (let i = 0; i < subModels.length; i++) {
            subModels[i].onPipelineStateChanged();
        }
    }

    public updateLightingmap (texture: Texture2D | null, uvParam: Vec4) {
        Vec4.toArray(this._localData, uvParam, UBOLocal.LIGHTINGMAP_UVPARAM);

        this._lightmap = texture;
        this._lightmapUVParam = uvParam;

        if (texture === null) {
            texture = builtinResMgr.get<Texture2D>('empty-texture');
        }

        const gfxTexture = texture.getGFXTexture();
        if (gfxTexture !== null) {
            const sampler = samplerLib.getSampler(this._device, texture.mipmaps.length > 1 ? lightmapSamplerWithMipHash : lightmapSamplerHash);
            const subModels = this._subModels;
            for (let i = 0; i < subModels.length; i++) {
                const descriptorSet = subModels[i].descriptorSet;
                descriptorSet.bindTexture(UniformLightingMapSampler.binding, gfxTexture);
                descriptorSet.bindSampler(UniformLightingMapSampler.binding, sampler);
                descriptorSet.update();
            }
        }
    }

    public getMacroPatches (subModelIndex: number) {
        return this.receiveShadow ? shadowMapPatches : null;
    }

    protected _updateAttributesAndBinding (subModelIndex: number) {
        const subModel = this._subModels[subModelIndex];
        if (!subModel) { return; }

        this._initLocalDescriptors(subModelIndex);
        const subModels = this._subModels;
        for (let i = 0; i < subModels.length; i++) {
            const ds = subModels[i].descriptorSet;
            this._updateLocalDescriptors(i, ds);
        }

        const shader = ShaderPool.get(SubModelPool.get(subModel.handle, SubModelView.SHADER_0));
        this._updateInstancedAttributes(shader.attributes, subModel.passes[0]);
    }

    protected _updateLocalDescriptors (submodelIdx: number, descriptorSet: GFXDescriptorSet) {
        descriptorSet.bindBuffer(UBOLocal.BLOCK.binding, this._localBuffer!);
    }

    // for now no submodel level instancing attributes
    protected _updateInstancedAttributes (attributes: IGFXAttribute[], pass: Pass) {
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
        if (pass.batchingScheme === BatchingSchemes.INSTANCING) { InstancedBuffer.get(pass).destroy(); } // instancing IA changed
        this._instMatWorldIdx = this._getInstancedAttributeIndex(INST_MAT_WORLD);
        this._transformUpdated = true;
    }

    protected _getInstancedAttributeIndex (name: string) {
        const list = this.instancedAttributes.list;
        for (let i = 0; i < list.length; i++) {
            if (list[i].name === name) { return i; }
        }
        return -1;
    }

    protected _initLocalDescriptors (subModelIndex: number) {
        if (!this._localBuffer) {
            this._localBuffer = this._device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: UBOLocal.SIZE,
                stride: UBOLocal.SIZE,
            });
        }
    }
}
