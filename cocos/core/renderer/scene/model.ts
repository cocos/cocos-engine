// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { builtinResMgr } from '../../3d/builtin/init';
import { Material } from '../../assets/material';
import { RenderingSubMesh } from '../../assets/mesh';
import { aabb } from '../../geometry';
import { GFXBuffer } from '../../gfx/buffer';
import { getTypedArrayConstructor, GFXBufferUsageBit, GFXFormat, GFXFormatInfos, GFXMemoryUsageBit, GFXFilter, GFXAddress } from '../../gfx/define';
import { GFXDevice, GFXFeature } from '../../gfx/device';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { Mat4, Vec3, Vec4} from '../../math';
import { Pool } from '../../memop';
import { INST_MAT_WORLD, UBOForwardLight, UBOLocal, UniformBinding, UniformLightingMapSampler } from '../../pipeline/define';
import { Node } from '../../scene-graph';
import { Layers } from '../../scene-graph/layers';
import { IMacroPatch, Pass } from '../core/pass';
import { RenderScene } from './render-scene';
import { SubModel } from './submodel';
import { Texture2D } from '../../assets/texture-2d';
import { genSamplerHash, samplerLib} from '../../renderer/core/sampler-lib';
import { GFXSampler } from '../../gfx';
import { programLib } from '../core/program-lib';

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

    get lightBuffer () {
        return this._lightBuffer;
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
    protected _implantPSOs: GFXPipelineState[] = [];
    protected _matPSORecord = new Map<Material, GFXPipelineState[]>();
    protected _matRefCount = new Map<Material, number>();
    protected _localData = new Float32Array(UBOLocal.COUNT);
    protected _localBuffer: GFXBuffer | null = null;
    protected _lightBuffer: GFXBuffer | null = null;
    protected _inited = false;
    protected _updateStamp = -1;
    protected _transformUpdated = true;

    private _instMatWorldIdx = -1;

    private _lightmap: Texture2D | null = null;
    private _lightmapUVParam: Vec4 = new Vec4();

    /**
     * Setup a default empty model
     */
    constructor () {
        this._device = cc.director.root!.device;
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
        if (this._lightBuffer) {
            this._lightBuffer.destroy();
            this._lightBuffer = null;
        }
        this._worldBounds = null;
        this._modelBounds = null;
        this._subModels.length = 0;
        this._matPSORecord.clear();
        this._matRefCount.clear();
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

    public updateLightingmap (tex: Texture2D|null, uvParam: Vec4) {
        Vec4.toArray(this._localData, uvParam, UBOLocal.LIGHTINGMAP_UVPARAM);

        this._lightmap = tex;
        this._lightmapUVParam = uvParam;

        if (tex === null) {
            tex = builtinResMgr.get<Texture2D>('empty-texture');
        }

        const texture = tex;
        const textureView = texture.getGFXTextureView();

        if (textureView !== null) {
            let sampler: GFXSampler;
            if (tex.mipmaps.length > 1) {
                const samplerHash = genSamplerHash([
                    GFXFilter.LINEAR,
                    GFXFilter.LINEAR,
                    GFXFilter.LINEAR,
                    GFXAddress.CLAMP,
                    GFXAddress.CLAMP,
                    GFXAddress.CLAMP,
                ]);
                sampler = samplerLib.getSampler(this._device, samplerHash);
            }
            else {
                const samplerHash = genSamplerHash([
                    GFXFilter.NONE,
                    GFXFilter.NONE,
                    GFXFilter.NONE,
                    GFXAddress.CLAMP,
                    GFXAddress.CLAMP,
                    GFXAddress.CLAMP,
                ]);
                sampler = samplerLib.getSampler(this._device, samplerHash);
            }

            for (const sub of this._subModels) {
                if (sub.psos === null) {
                    continue;
                }

                for (let i = 0; i < sub.psos.length; i++) {
                    sub.psos[i].pipelineLayout.layouts[0].bindTextureView(UniformLightingMapSampler.binding, textureView);
                    sub.psos[i].pipelineLayout.layouts[0].bindSampler(UniformLightingMapSampler.binding, sampler);
                    sub.psos[i].pipelineLayout.layouts[0].update();
                }
            }
        }
    }

    public updateUBOs (stamp: number) {
        this._matPSORecord.forEach(this._updatePass, this);
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
            const oldMat = this._subModels[idx].material;
            this._subModels[idx].destroy();
            this.releasePSO(oldMat!);
        }
        this.allocatePSO(mat, idx);
        this._subModels[idx].initialize(subMeshData, mat, this._matPSORecord.get(mat)!);
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
        if (this._subModels[idx].material === mat) {
            if (mat) {
                this.destroyPipelineStates(mat, this._matPSORecord.get(mat)!);
                this._matPSORecord.set(mat, this.createPipelineStates(mat, idx));
            }
        } else {
            if (this._subModels[idx].material) {
                this.releasePSO(this._subModels[idx].material!);
            }
            if (mat) {
                this.allocatePSO(mat, idx);
            }
        }
        this._subModels[idx].psos = (mat ? this._matPSORecord.get(mat) || null : null);
        this._subModels[idx].material = mat;
    }

    public onGlobalPipelineStateChanged () {
        const subModels = this._subModels;
        this._matPSORecord.forEach((psos, mat) => {
            let i = 0; for (; i < subModels.length; i++) {
                if (subModels[i].material === mat) { break; }
            }
            if (i >= subModels.length) { return; }
            for (let j = 0; j < mat.passes.length; j++) {
                const pass = mat.passes[j];
                pass.destroyPipelineState(psos[j]);
                pass.beginChangeStatesSilently();
                pass.tryCompile(); // force update shaders
                pass.endChangeStatesSilently();
            }
            const newPSOs = this.createPipelineStates(mat, i);
            psos.length = newPSOs.length;
            for (let j = 0; j < newPSOs.length; j++) {
                psos[j] = newPSOs[j];
            }
        });
        for (let i = 0; i < subModels.length; i++) {
            subModels[i].updateCommandBuffer();
        }

        this.updateLightingmap(this._lightmap, this._lightmapUVParam);
    }

    public insertImplantPSO (pso: GFXPipelineState) {
        this._implantPSOs.push(pso);
    }

    public removeImplantPSO (pso: GFXPipelineState) {
        const idx = this._implantPSOs.indexOf(pso);
        if (idx >= 0) { this._implantPSOs.splice(idx, 1); }
    }

    protected createPipelineStates (mat: Material, subModelIdx: number): GFXPipelineState[] {
        const ret: GFXPipelineState[] = [];
        for (let i = 0; i < mat.passes.length; i++) {
            const pass = mat.passes[i];
            ret[i] = this.createPipelineState(pass, subModelIdx);
        }
        if (ret[0]) { this.updateInstancedAttributeList(ret[0], mat.passes[0]); }
        return ret;
    }

    protected destroyPipelineStates (mat: Material, pso: GFXPipelineState[]) {
        for (let i = 0; i < mat.passes.length; i++) {
            const pass = mat.passes[i];
            pass.destroyPipelineState(pso[i]);
        }
    }

    protected createPipelineState (pass: Pass, subModelIdx: number, patches?: IMacroPatch[]) {
        const pso = pass.createPipelineState(patches)!;
        const bindingLayout = pso.pipelineLayout.layouts[0];
        if (this._localBuffer) { bindingLayout.bindBuffer(UBOLocal.BLOCK.binding, this._localBuffer); }
        if (this._lightBuffer) { bindingLayout.bindBuffer(UBOForwardLight.BLOCK.binding, this._lightBuffer); }
        return pso;
    }

    // for now no submodel level instancing attributes
    protected updateInstancedAttributeList (pso: GFXPipelineState, pass: Pass) {
        if (!pass.device.hasFeature(GFXFeature.INSTANCED_ARRAYS)) { return; }
        const attributes = pso.inputState.attributes;
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
        if (!mat) { return; }
        let hasForwardLight = false;
        for (const p of mat.passes) {
            const blocks = programLib.getTemplate(p.program).builtins.locals.blocks;
            if (blocks.find((b) => b.name === UBOForwardLight.BLOCK.name)) {
                hasForwardLight = true;
                break;
            }
        }
        if (hasForwardLight && !this._lightBuffer) {
            this._lightBuffer = this._device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: UBOForwardLight.SIZE,
                stride: UBOForwardLight.SIZE,
            });
        }
    }

    private _updatePass (psos: GFXPipelineState[], mat: Material) {
        for (let i = 0; i < mat.passes.length; i++) {
            mat.passes[i].update();
        }
        for (let i = 0; i < psos.length; i++) {
            psos[i].pipelineLayout.layouts[0].update();
        }
    }

    private allocatePSO (mat: Material, subModelIdx: number) {
        if (this._matRefCount.get(mat) == null) {
            this._matRefCount.set(mat, 1);
            this._matPSORecord.set(mat, this.createPipelineStates(mat, subModelIdx));
        } else {
            this._matRefCount.set(mat, this._matRefCount.get(mat)! + 1);
        }
    }

    private releasePSO (mat: Material) {
        this._matRefCount.set(mat, this._matRefCount.get(mat)! - 1);
        if (this._matRefCount.get(mat) === 0) {
            this.destroyPipelineStates(mat, this._matPSORecord.get(mat)!);
            this._matPSORecord.delete(mat);
            this._matRefCount.delete(mat);
        }
    }
}
