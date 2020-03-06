// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { Material } from '../../assets/material';
import { RenderingSubMesh } from '../../assets/mesh';
import { aabb } from '../../geometry';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBindingType, GFXBufferUsageBit, GFXGetTypeSize, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { GFXUniformBlock } from '../../gfx/shader';
import { Mat4, Vec3 } from '../../math';
import { Pool } from '../../memop';
import { IInternalBindingInst, UBOForwardLight, UBOLocal } from '../../pipeline/define';
import { Node } from '../../scene-graph';
import { Layers } from '../../scene-graph/layers';
import { IMacroPatch, Pass } from '../core/pass';
import { MaterialProperty, type2writer } from '../core/pass-utils';
import { RenderScene } from './render-scene';
import { SubModel } from './submodel';

const m4_1 = new Mat4();

const _subMeshPool = new Pool(() => {
    return new SubModel();
}, 32);

function getUniformBlockSize (block: GFXUniformBlock): number {
    let size = 0;
    for (const mem of block.members) {
        size += GFXGetTypeSize(mem.type) * mem.count;
    }
    return size;
}

export enum ModelType {
    DEFAULT,
    SKINNING,
    BAKED_SKINNING,
    UI_BATCH,
    PARTICLE_BATCH,
    LINE,
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

    get uboLocal () {
        return this._uboLocal;
    }

    get localUBO () {
        return this._localUBO;
    }

    get localBindings () {
        return this._localBindings;
    }

    get updateStamp () {
        return this._updateStamp;
    }

    public type = ModelType.DEFAULT;
    public scene: RenderScene | null = null;
    public node: Node = null!;
    public transform: Node = null!;
    public enabled: boolean = true;
    public visFlags = Layers.Enum.NONE;
    public castShadow = false;
    public isDynamicBatching = false;

    protected _device: GFXDevice;
    protected _worldBounds: aabb | null = null;
    protected _modelBounds: aabb | null = null;
    protected _subModels: SubModel[] = [];
    protected _implantPSOs: GFXPipelineState[] = [];
    protected _matPSORecord = new Map<Material, GFXPipelineState[]>();
    protected _matRefCount = new Map<Material, number>();
    protected _uboLocal = new UBOLocal();
    protected _localUBO: GFXBuffer | null = null;
    protected _localBindings = new Map<string, IInternalBindingInst>();
    protected _inited = false;
    protected _updateStamp = -1;
    protected _transformUpdated = true;
    protected _instancedProperties = new Float32Array(0);

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
        const lbIter = this._localBindings.values();
        let lbResult = lbIter.next();
        while (!lbResult.done) {
            const localBinding = lbResult.value;
            if (localBinding.buffer) {
                localBinding.buffer.destroy();
                localBinding.buffer = undefined;
            }
            lbResult = lbIter.next();
        }
        if (this._localBindings.has(UBOForwardLight.BLOCK.name)) {
            this._localBindings.delete(UBOForwardLight.BLOCK.name);
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

    public updateUBOs (stamp: number) {
        if (this._updateStamp === stamp) { return false; }
        this._updateStamp = stamp;
        if (this._transformUpdated && !this.isDynamicBatching) {
            // @ts-ignore
            const worldMatrix = this.transform._mat;
            Mat4.toArray(this._uboLocal.view, worldMatrix, UBOLocal.MAT_WORLD_OFFSET);
            Mat4.inverseTranspose(m4_1, worldMatrix);
            Mat4.toArray(this._uboLocal.view, m4_1, UBOLocal.MAT_WORLD_IT_OFFSET);

            const commonLocal = this._localBindings.get(UBOLocal.BLOCK.name);
            if (commonLocal && commonLocal.buffer) {
                commonLocal.buffer!.update(this._uboLocal.view);
            }
            this._transformUpdated = false;
        }

        this._matPSORecord.forEach(this._updatePass, this);
        return true;
    }

    public setInstancedProperties (name: string, val: MaterialProperty, subModelIdx?: number, passIdx?: number) {
        // type2writer[];
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
        if (this._subModels[idx] == null) {
            return;
        }
        this.initLocalBindings(mat);
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
                psos[j] = this.createPipelineState(pass, i);
                psos[j].pipelineLayout.layouts[0].update();
            }
            psos.length = mat.passes.length;
        });
        for (let i = 0; i < subModels.length; i++) {
            subModels[i].updateCommandBuffer();
        }
    }

    public insertImplantPSO (pso: GFXPipelineState) {
        this._implantPSOs.push(pso);
    }

    public removeImplantPSO (pso: GFXPipelineState) {
        const idx = this._implantPSOs.indexOf(pso);
        if (idx >= 0) { this._implantPSOs.splice(idx, 1); }
    }

    protected createPipelineStates (mat: Material, subModelIdx: number): GFXPipelineState[] {
        const ret = new Array<GFXPipelineState>(mat.passes.length);
        for (let i = 0; i < ret.length; i++) {
            const pass = mat.passes[i];
            ret[i] = this.createPipelineState(pass, subModelIdx);
        }
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
        pso.pipelineLayout.layouts[0].bindBuffer(UBOLocal.BLOCK.binding, this._localBindings.get(UBOLocal.BLOCK.name)!.buffer!);
        if (this._localBindings.has(UBOForwardLight.BLOCK.name)) {
            pso.pipelineLayout.layouts[0].bindBuffer(UBOForwardLight.BLOCK.binding, this._localBindings.get(UBOForwardLight.BLOCK.name)!.buffer!);
        }
        return pso;
    }

    protected onSetLocalBindings (mat: Material) {
        if (!this._localBindings.has(UBOLocal.BLOCK.name)) {
            this._localBindings.set(UBOLocal.BLOCK.name, {
                type: GFXBindingType.UNIFORM_BUFFER,
                blockInfo: UBOLocal.BLOCK,
            });
        }
        let hasForwardLight = false;
        for (const p of mat.passes) {
            if (p.bindings.find((b) => b.name === UBOForwardLight.BLOCK.name)) {
                hasForwardLight = true;
                break;
            }
        }
        if (hasForwardLight && cc.director.root!.pipeline.name === 'ForwardPipeline') {
            if (!this._localBindings.has(UBOForwardLight.BLOCK.name)) {
                this._localBindings.set(UBOForwardLight.BLOCK.name, {
                    type: GFXBindingType.UNIFORM_BUFFER,
                    blockInfo: UBOForwardLight.BLOCK,
                });
            }
        }
    }

    protected initLocalBindings (mat: Material | null) {
        if (mat) {
            this.onSetLocalBindings(mat);
            const lbIter = this._localBindings.values();
            let lbResult = lbIter.next();
            while (!lbResult.done) {
                const localBinding = lbResult.value;
                if (!localBinding.buffer) {
                    localBinding.buffer = this._device.createBuffer({
                        usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                        memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                        size: getUniformBlockSize(localBinding.blockInfo!),
                    });
                }
                lbResult = lbIter.next();
            }
        }
    }

    private _updatePass (psos: GFXPipelineState[], mat: Material) {
        for (let i = 0; i < mat.passes.length; i++) {
            mat.passes[i].update(this._updateStamp);
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
