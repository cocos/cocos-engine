/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

// Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.
import { JSB } from 'internal:constants';
import { builtinResMgr } from '../../builtin/builtin-res-mgr';
import { Material } from '../../assets/material';
import { RenderingSubMesh } from '../../assets/rendering-sub-mesh';
import { AABB } from '../../geometry';
import { Pool } from '../../memop';
import { Node } from '../../scene-graph';
import { Layers } from '../../scene-graph/layers';
import { RenderScene } from './render-scene';
import { Texture2D } from '../../assets/texture-2d';
import { SubModel } from './submodel';
import { Pass, IMacroPatch, BatchingSchemes } from '../core/pass';
import { legacyCC } from '../../global-exports';
import { InstancedBuffer } from '../../pipeline/instanced-buffer';

import { Mat4, Vec3, Vec4 } from '../../math';
import { genSamplerHash, samplerLib } from '../core/sampler-lib';
import { ShaderPool, SubModelPool, SubModelView, ModelHandle, SubModelArrayPool, ModelPool,
    ModelView, AABBHandle, AABBPool, AABBView, NULL_HANDLE, AttributeArrayPool,
    RawBufferPool, freeHandleArray, ObjectPool, PoolType } from '../core/memory-pools';
import { Attribute, DescriptorSet, Device, Buffer, BufferInfo, getTypedArrayConstructor,
    BufferUsageBit, FormatInfos, MemoryUsageBit, Filter, Address, Feature } from '../../gfx';
import { INST_MAT_WORLD, UBOLocal, UNIFORM_LIGHTMAP_TEXTURE_BINDING } from '../../pipeline/define';

const AttrPool = new ObjectPool(PoolType.ATTRIBUTE, (_: never[], obj?: Attribute) => obj || new Attribute());

const m4_1 = new Mat4();

const _subModelPool = new Pool(() => new SubModel(), 32);

const shadowMapPatches: IMacroPatch[] = [
    { name: 'CC_RECEIVE_SHADOW', value: true },
];

export interface IInstancedAttributeBlock {
    buffer: Uint8Array;
    views: TypedArray[];
    attributes: Attribute[];
}

export enum ModelType {
    DEFAULT,
    SKINNING,
    BAKED_SKINNING,
    BATCH_2D,
    PARTICLE_BATCH,
    LINE,
}

function uploadMat4AsVec4x3 (mat: Mat4, v1: ArrayBufferView, v2: ArrayBufferView, v3: ArrayBufferView) {
    v1[0] = mat.m00; v1[1] = mat.m01; v1[2] = mat.m02; v1[3] = mat.m12;
    v2[0] = mat.m04; v2[1] = mat.m05; v2[2] = mat.m06; v2[3] = mat.m13;
    v3[0] = mat.m08; v3[1] = mat.m09; v3[2] = mat.m10; v3[3] = mat.m14;
}

const lightmapSamplerHash = genSamplerHash([
    Filter.LINEAR,
    Filter.LINEAR,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
]);

const lightmapSamplerWithMipHash = genSamplerHash([
    Filter.LINEAR,
    Filter.LINEAR,
    Filter.LINEAR,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
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
        return this._worldBounds!;
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

    get receiveShadow () {
        return this._receiveShadow;
    }

    set receiveShadow (val) {
        this._setReceiveShadow(val);
        this.onMacroPatchesStateChanged();
    }

    get castShadow () {
        return this._castShadow;
    }

    set castShadow (val) {
        this._castShadow = val;
        if (JSB) {
            ModelPool.set(this._handle, ModelView.CAST_SHADOW, val ? 1 : 0);
        }
    }

    get handle () {
        return this._handle;
    }

    get node () : Node {
        return this._node;
    }

    set node (n: Node) {
        this._node = n;
        ModelPool.set(this._handle, ModelView.NODE, n.handle);
    }

    get transform () : Node {
        return this._transform;
    }

    set transform (n: Node) {
        this._transform = n;
        ModelPool.set(this._handle, ModelView.TRANSFORM, n.handle);
    }

    get visFlags () : number {
        return this._visFlags;
    }

    set visFlags (val: number) {
        this._visFlags = val;
        if (JSB) {
            ModelPool.set(this._handle, ModelView.VIS_FLAGS, val);
        }
    }

    get enabled () : boolean {
        return this._enabled;
    }

    set enabled (val: boolean) {
        this._enabled = val;
        if (JSB) {
            ModelPool.set(this._handle, ModelView.ENABLED, val ? 1 : 0);
        }
    }

    public type = ModelType.DEFAULT;
    public scene: RenderScene | null = null;
    public isDynamicBatching = false;
    public instancedAttributes: IInstancedAttributeBlock = { buffer: null!, views: [], attributes: [] };

    protected _worldBounds: AABB | null = null;
    protected _modelBounds: AABB | null = null;
    protected _subModels: SubModel[] = [];
    protected _node: Node = null!;
    protected _transform: Node = null!;

    protected _device: Device;
    protected _inited = false;
    protected _descriptorSetCount = 1;
    protected _updateStamp = -1;
    protected _transformUpdated = true;
    protected _handle: ModelHandle = NULL_HANDLE;
    protected _hWorldBounds: AABBHandle = NULL_HANDLE;

    protected _localData = new Float32Array(UBOLocal.COUNT);
    protected _localBuffer: Buffer | null = null;
    private _instMatWorldIdx = -1;
    private _lightmap: Texture2D | null = null;
    private _lightmapUVParam: Vec4 = new Vec4();

    protected _receiveShadow = false;
    protected _castShadow = false;
    protected _enabled = true;
    protected _visFlags = Layers.Enum.NONE;

    /**
     * Setup a default empty model
     */
    constructor () {
        this._device = legacyCC.director.root.device;
    }

    private _setReceiveShadow (val: boolean) {
        this._receiveShadow = val;
        if (JSB) {
            ModelPool.set(this._handle, ModelView.RECEIVE_SHADOW, val ? 1 : 0);
        }
    }

    private _init () {
        this._handle = ModelPool.alloc();
        const hSubModelArray = SubModelArrayPool.alloc();
        const hInstancedAttrArray = AttributeArrayPool.alloc();
        ModelPool.set(this._handle, ModelView.INSTANCED_ATTR_ARRAY, hInstancedAttrArray);
        ModelPool.set(this._handle, ModelView.SUB_MODEL_ARRAY, hSubModelArray);
    }

    public initialize () {
        if (this._inited) {
            return;
        }
        this._init();
        this._setReceiveShadow(true);
        this.castShadow = false;
        this.enabled = true;
        this.visFlags = Layers.Enum.NONE;
        this._inited = true;
    }

    private _destroySubmodel (subModel: SubModel) {
        subModel.destroy();
        if (JSB) {
            _subModelPool.free(subModel);
        }
    }

    private _destroy () {
        if (JSB) {
            if (this._handle) {
                const hSubModelArray = ModelPool.get(this._handle, ModelView.SUB_MODEL_ARRAY);
                // don't free submodel handles here since they are just references
                if (hSubModelArray) SubModelArrayPool.free(hSubModelArray);

                const hOldBuffer = ModelPool.get(this._handle, ModelView.INSTANCED_BUFFER);
                if (hOldBuffer) RawBufferPool.free(hOldBuffer);
                const hAttrArray = ModelPool.get(this._handle, ModelView.INSTANCED_ATTR_ARRAY);
                if (hAttrArray) freeHandleArray(hAttrArray, AttributeArrayPool, AttrPool);

                ModelPool.free(this._handle);
                this._handle = NULL_HANDLE;
            }

            if (this._hWorldBounds) {
                AABBPool.free(this._hWorldBounds);
                this._hWorldBounds = NULL_HANDLE;
            }
        }
    }

    public destroy () {
        const subModels = this._subModels;
        for (let i = 0; i < subModels.length; i++) {
            const subModel = this._subModels[i];
            this._destroySubmodel(subModel);
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
        this._transform = null!;
        this._node = null!;
        this.isDynamicBatching = false;

        this._destroy();
    }

    public attachToScene (scene: RenderScene) {
        this.scene = scene;
    }

    public detachFromScene () {
        this.scene = null;
    }

    public updateTransform (stamp: number) {
        const node = this.transform;
        // @ts-expect-error TS2445
        if (node.hasChangedFlags || node._dirtyFlags) {
            node.updateWorldTransform();
            this._transformUpdated = true;
            const worldBounds = this._worldBounds;
            if (this._modelBounds && worldBounds) {
                // @ts-expect-error TS2445
                this._modelBounds.transform(node._mat, node._pos, node._rot, node._scale, worldBounds);
                this._updateNativeWorldBounds();
            }
        }
    }

    public updateWorldBound () {
        const node = this.transform;
        if (node !== null) {
            node.updateWorldTransform();
            this._transformUpdated = true;
            const worldBounds = this._worldBounds;
            if (this._modelBounds && worldBounds) {
                // @ts-expect-error TS2445
                this._modelBounds.transform(node._mat, node._pos, node._rot, node._scale, worldBounds);
                this._updateNativeWorldBounds();
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

        // @ts-expect-error using private members here for efficiency
        const worldMatrix = this.transform._mat;
        const idx = this._instMatWorldIdx;
        if (idx >= 0) {
            const attrs = this.instancedAttributes.views;
            uploadMat4AsVec4x3(worldMatrix, attrs[idx], attrs[idx + 1], attrs[idx + 2]);
        } else if (this._localBuffer) {
            Mat4.toArray(this._localData, worldMatrix, UBOLocal.MAT_WORLD_OFFSET);
            Mat4.inverseTranspose(m4_1, worldMatrix);
            if (!JSB) {
                // fix precision lost of webGL on android device
                // scale worldIT mat to around 1.0 by product its sqrt of determinant.
                const det = Mat4.determinant(m4_1);
                const factor = 1.0 / Math.sqrt(det);
                Mat4.multiplyScalar(m4_1, m4_1, factor);
            }
            Mat4.toArray(this._localData, m4_1, UBOLocal.MAT_WORLD_IT_OFFSET);
            this._localBuffer.update(this._localData);
        }
    }

    private _updateNativeWorldBounds () {
        if (JSB) {
            if (this._hWorldBounds === NULL_HANDLE) {
                this._hWorldBounds = AABBPool.alloc();
                ModelPool.set(this._handle, ModelView.WORLD_BOUNDS, this._hWorldBounds);
            }
            AABBPool.setVec3(this._hWorldBounds, AABBView.CENTER, this._worldBounds!.center);
            AABBPool.setVec3(this._hWorldBounds, AABBView.HALF_EXTENSION, this._worldBounds!.halfExtents);
        }
    }

    /**
     * Create the bounding shape of this model
     * @param minPos the min position of the model
     * @param maxPos the max position of the model
     */
    public createBoundingShape (minPos?: Vec3, maxPos?: Vec3) {
        if (!minPos || !maxPos) { return; }
        this._modelBounds = AABB.fromPoints(AABB.create(), minPos, maxPos);
        this._worldBounds = AABB.clone(this._modelBounds);
        this._updateNativeWorldBounds();
    }

    private _createSubModel () {
        if (JSB) {
            return _subModelPool.alloc();
        }
        return new SubModel();
    }

    public initSubModel (idx: number, subMeshData: RenderingSubMesh, mat: Material) {
        this.initialize();

        let isNewSubModel = false;
        if (this._subModels[idx] == null) {
            this._subModels[idx] = this._createSubModel();
            isNewSubModel = true;
        } else {
            this._subModels[idx].destroy();
        }
        this._subModels[idx].initialize(subMeshData, mat.passes, this.getMacroPatches(idx));

        // This is a temporary solution
        // It should not be written in a fixed way, or modified by the user
        this._subModels[idx].initPlanarShadowShader();
        this._subModels[idx].initPlanarShadowInstanceShader();

        this._updateAttributesAndBinding(idx);
        if (isNewSubModel && JSB) {
            const hSubModelArray = ModelPool.get(this._handle, ModelView.SUB_MODEL_ARRAY);
            SubModelArrayPool.assign(hSubModelArray, idx, this._subModels[idx].handle);
        }
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

    public onMacroPatchesStateChanged () {
        const subModels = this._subModels;
        for (let i = 0; i < subModels.length; i++) {
            subModels[i].onMacroPatchesStateChanged(this.getMacroPatches(i));
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
        if (gfxTexture) {
            const sampler = samplerLib.getSampler(this._device, texture.mipmaps.length > 1 ? lightmapSamplerWithMipHash : lightmapSamplerHash);
            const subModels = this._subModels;
            for (let i = 0; i < subModels.length; i++) {
                const { descriptorSet } = subModels[i];
                // TODO: should manage lightmap macro switches automatically
                // USE_LIGHTMAP -> CC_USE_LIGHTMAP
                descriptorSet.bindTexture(UNIFORM_LIGHTMAP_TEXTURE_BINDING, gfxTexture);
                descriptorSet.bindSampler(UNIFORM_LIGHTMAP_TEXTURE_BINDING, sampler);
                descriptorSet.update();
            }
        }
    }

    public getMacroPatches (subModelIndex: number): IMacroPatch[] | null {
        return this.receiveShadow ? shadowMapPatches : null;
    }

    protected _updateAttributesAndBinding (subModelIndex: number) {
        const subModel = this._subModels[subModelIndex];
        if (!subModel) { return; }

        this._initLocalDescriptors(subModelIndex);
        this._updateLocalDescriptors(subModelIndex, subModel.descriptorSet);

        const shader = ShaderPool.get(SubModelPool.get(subModel.handle, SubModelView.SHADER_0));
        this._updateInstancedAttributes(shader.attributes, subModel.passes[0]);
    }

    protected _getInstancedAttributeIndex (name: string) {
        const { attributes } = this.instancedAttributes;
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].name === name) { return i; }
        }
        return -1;
    }

    // sub-classes can override the following functions if needed

    // for now no submodel level instancing attributes
    protected _updateInstancedAttributes (attributes: Attribute[], pass: Pass) {
        if (!pass.device.hasFeature(Feature.INSTANCED_ARRAYS)) { return; }
        // free old data
        const hOldBuffer = ModelPool.get(this._handle, ModelView.INSTANCED_BUFFER);
        if (hOldBuffer) RawBufferPool.free(hOldBuffer);
        const hAttrArray = ModelPool.get(this._handle, ModelView.INSTANCED_ATTR_ARRAY);
        if (hAttrArray) freeHandleArray(hAttrArray, AttributeArrayPool, AttrPool, false);

        let size = 0;
        for (let j = 0; j < attributes.length; j++) {
            const attribute = attributes[j];
            if (!attribute.isInstanced) { continue; }
            size += FormatInfos[attribute.format].size;
        }
        const hBuffer = RawBufferPool.alloc(size);
        const buffer = RawBufferPool.getBuffer(hBuffer);
        ModelPool.set(this._handle, ModelView.INSTANCED_BUFFER, hBuffer);

        const attrs = this.instancedAttributes;
        attrs.buffer = new Uint8Array(buffer);
        attrs.views.length = attrs.attributes.length = 0;
        let offset = 0;
        for (let j = 0; j < attributes.length; j++) {
            const attribute = attributes[j];
            if (!attribute.isInstanced) { continue; }
            const hAttr = AttrPool.alloc();
            const attr = AttrPool.get(hAttr);
            attr.format = attribute.format;
            attr.name = attribute.name;
            attr.isNormalized = attribute.isNormalized;
            attr.location = attribute.location;
            attrs.attributes.push(attr);
            AttributeArrayPool.push(hAttrArray, hAttr);

            const info = FormatInfos[attribute.format];
            attrs.views.push(new (getTypedArrayConstructor(info))(buffer, offset, info.count));
            offset += info.size;
        }
        if (pass.batchingScheme === BatchingSchemes.INSTANCING) { InstancedBuffer.get(pass).destroy(); } // instancing IA changed
        this._instMatWorldIdx = this._getInstancedAttributeIndex(INST_MAT_WORLD);
        this._transformUpdated = true;
    }

    protected _initLocalDescriptors (subModelIndex: number) {
        if (!this._localBuffer) {
            this._localBuffer = this._device.createBuffer(new BufferInfo(
                BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                UBOLocal.SIZE,
                UBOLocal.SIZE,
            ));
        }
    }

    protected _updateLocalDescriptors (subModelIndex: number, descriptorSet: DescriptorSet) {
        if (this._localBuffer) descriptorSet.bindBuffer(UBOLocal.BINDING, this._localBuffer);
    }
}
