// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { IPassStates } from '../../assets/effect-asset';
import { IRenderingSubmesh } from '../../assets/mesh';
import { aabb } from '../../geom-utils';
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
import { IMaterial } from '../../utils/material-interface';
import { IPass } from '../../utils/pass-interface';
import { IDefineMap } from '../core/pass';
import { customizationManager } from './customization-manager';
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

let MODEL_ID = 0;

/**
 * A representation of a model
 */
export class Model {

    set scene (scene: RenderScene) {
        this._scene = scene;
    }

    get scene () {
        return this._scene!;
    }

    get id () {
        return this._id;
    }

    get subModels () {
        return this._subModels;
    }

    get subModelNum () {
        return this._subModels.length;
    }

    get inited (): boolean {
        return this._inited;
    }

    set enabled (val) {
        this._enabled = val;
    }

    get enabled () {
        return this._enabled;
    }

    get node () {
        return this._node!;
    }

    set node (node) {
        this._node = node;
    }

    get transform () {
        return this._transform!;
    }

    set transform (transform) {
        this._transform = transform;
    }

    get worldBounds () {
        return this._worldBounds;
    }
    get modelBounds () {
        return this._modelBounds;
    }

    get visFlags () {
        return this._visFlags;
    }

    set visFlags (id: number) {
        this._visFlags = id;
    }

    /**
     * Set the user key
     * @param {number} key
     */
    set userKey (key: number) {
        this._userKey = key;
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

    get castShadow (): boolean {
        return this._castShadow;
    }

    set castShadow (val: boolean) {
        this._castShadow = val;
    }

    get isDynamicBatching () {
        return this._isDynamicBatching;
    }

    set isDynamicBatching (val: boolean) {
        this._isDynamicBatching = val;
    }

    get UBOUpdated () {
        return this._uboUpdated;
    }

    protected _type: string = 'default';
    protected _device: GFXDevice;
    protected _scene: RenderScene | null = null;
    protected _node: Node | null = null;
    protected _transform: Node | null = null;
    protected _id: number = MODEL_ID++;
    protected _enabled: boolean = true;
    protected _visFlags = Layers.Enum.NONE;
    protected _cameraID = -1;
    protected _userKey = -1;
    protected _worldBounds: aabb | null = null;
    protected _modelBounds: aabb | null = null;
    protected _subModels: SubModel[] = [];
    protected _implantPSOs: GFXPipelineState[] = [];
    protected _matPSORecord = new Map<IMaterial, GFXPipelineState[]>();
    protected _matRefCount = new Map<IMaterial, number>();
    protected _uboLocal = new UBOLocal();
    protected _localUBO: GFXBuffer | null = null;
    protected _localBindings = new Map<string, IInternalBindingInst>();
    protected _inited = false;
    protected _uboUpdated = false;
    protected _castShadow = false;
    protected _isDynamicBatching = false;
    protected _transformUpdated = true;

    /**
     * Setup a default empty model
     */
    constructor () {
        this._device = cc.director.root!.device;
    }

    public initialize (node: Node) {
        this._transform = this._node = node;
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
        this._subModels.splice(0);
        this._matPSORecord.clear();
        this._matRefCount.clear();
        this._inited = false;
        this._transformUpdated = true;
    }

    public attachToScene (scene: RenderScene) {
        this._scene = scene;
    }

    public detachFromScene () {
        this._scene = null;
    }

    public getSubModel (idx: number) {
        return this._subModels[idx];
    }

    public updateTransform () {
        const node = this._transform;
        // @ts-ignore
        if (node.hasChangedFlags || node._dirtyFlags) {
            node!.updateWorldTransform();
            this._transformUpdated = true;
            if (this._modelBounds && this._worldBounds) {
                // @ts-ignore TS2339
                this._modelBounds.transform(node._mat, node._pos, node._rot, node._scale, this._worldBounds);
            }
        }
    }

    public _resetUBOUpdateFlag () {
        this._uboUpdated = false;
    }

    public updateUBOs () {
        if (this._uboUpdated) {
            return false;
        }
        this._uboUpdated = true;
        // @ts-ignore
        if (this._transformUpdated && !this._isDynamicBatching) {
            // @ts-ignore
            const worldMatrix = this._transform._mat;
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

    /**
     * Create the bounding shape of this model
     * @param {vec3} minPos the min position of the model
     * @param {vec3} maxPos the max position of the model
     */
    public createBoundingShape (minPos?: Vec3, maxPos?: Vec3) {
        if (!minPos || !maxPos) { return; }
        this._modelBounds = aabb.fromPoints(aabb.create(), minPos, maxPos);
        this._worldBounds = aabb.clone(this._modelBounds);
        this._transform!.updateWorldTransform();
        // @ts-ignore
        this._modelBounds.transform(this._transform._mat, this._transform._pos, this._transform._rot, this._transform._scale, this._worldBounds);
    }

    public initSubModel (idx: number, subMeshData: IRenderingSubmesh, mat: IMaterial) {
        this.initLocalBindings(mat);
        if (this._subModels[idx] == null) {
            this._subModels[idx] = _subMeshPool.alloc();
        } else {
            const oldMat = this._subModels[idx].material;
            this._subModels[idx].destroy();
            this.releasePSO(oldMat!);
        }
        this.allocatePSO(mat);
        this._subModels[idx].initialize(subMeshData, mat, this._matPSORecord.get(mat)!);
        this._inited = true;
    }

    public setSubModelMesh (idx: number, subMeshData: IRenderingSubmesh) {
        if (this._subModels[idx] == null) {
            this._subModels[idx] = _subMeshPool.alloc();
        }
        this._subModels[idx].subMeshData = subMeshData;
    }

    public setSubModelMaterial (idx: number, mat: IMaterial | null) {
        if (this._subModels[idx] == null) {
            return;
        }
        this.initLocalBindings(mat);
        if (this._subModels[idx].material === mat) {
            if (mat) {
                this.destroyPipelineStates(mat, this._matPSORecord.get(mat)!);
                this._matPSORecord.set(mat, this.createPipelineStates(mat));
            }
        } else {
            if (this._subModels[idx].material) {
                this.releasePSO(this._subModels[idx].material!);
            }
            if (mat) {
                this.allocatePSO(mat);
            }
        }
        this._subModels[idx].psos = (mat ? this._matPSORecord.get(mat) || null : null);
        this._subModels[idx].material = mat;
    }

    public onGlobalPipelineStateChanged () {
        for (const m of this._subModels) {
            const mat = m.material!;
            const psos = this._matPSORecord.get(mat)!;
            for (let i = 0; i < mat.passes.length; i++) {
                const pass = mat.passes[i];
                pass.beginChangeStatesSilently();
                pass.tryCompile(); // force update shaders
                pass.endChangeStatesSilently();
                pass.destroyPipelineState(psos[i]);
                psos[i] = this.createPipelineState(pass);
                psos[i].pipelineLayout.layouts[0].update();
            }
            m.updateCommandBuffer();
        }
    }

    public insertImplantPSO (pso: GFXPipelineState) {
        this._implantPSOs.push(pso);
    }

    public removeImplantPSO (pso: GFXPipelineState) {
        const idx = this._implantPSOs.indexOf(pso);
        if (idx >= 0) { this._implantPSOs.splice(idx, 1); }
    }

    protected createPipelineStates (mat: IMaterial): GFXPipelineState[] {
        const ret = new Array<GFXPipelineState>(mat.passes.length);
        for (let i = 0; i < ret.length; i++) {
            const pass = mat.passes[i];
            for (const cus of pass.customizations) { customizationManager.attach(cus, this); }
            ret[i] = this.createPipelineState(pass);
        }
        return ret;
    }

    protected destroyPipelineStates (mat: IMaterial, pso: GFXPipelineState[]) {
        for (let i = 0; i < mat.passes.length; i++) {
            const pass = mat.passes[i];
            pass.destroyPipelineState(pso[i]);
            for (const cus of pass.customizations) { customizationManager.detach(cus, this); }
        }
    }

    protected createPipelineState (pass: IPass, defineOverrides?: IDefineMap, stateOverrides?: IPassStates) {
        defineOverrides = defineOverrides || {};
        if (pass.blendState.targets[0].blend) {
            this._isDynamicBatching = false;
        }
        pass.beginChangeStatesSilently();
        // warning:this behavior is now forbidden.
        pass.tryCompile({ CC_USE_BATCHING: this._isDynamicBatching });
        pass.endChangeStatesSilently();
        const pso = pass.createPipelineState()!;
        pso.pipelineLayout.layouts[0].bindBuffer(UBOLocal.BLOCK.binding, this._localBindings.get(UBOLocal.BLOCK.name)!.buffer!);
        if (this._localBindings.has(UBOForwardLight.BLOCK.name)) {
            pso.pipelineLayout.layouts[0].bindBuffer(UBOForwardLight.BLOCK.binding, this._localBindings.get(UBOForwardLight.BLOCK.name)!.buffer!);
        }
        return pso;
    }

    protected onSetLocalBindings (mat: IMaterial) {
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

    protected initLocalBindings (mat: IMaterial | null) {
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

    private _updatePass (psos: GFXPipelineState[], mat: IMaterial) {
        for (let i = 0; i < mat.passes.length; i++) {
            mat.passes[i].update();
        }
        for (let i = 0; i < psos.length; i++) {
            psos[i].pipelineLayout.layouts[0].update();
        }
    }

    private allocatePSO (mat: IMaterial) {
        if (this._matRefCount.get(mat) == null) {
            this._matRefCount.set(mat, 1);
            this._matPSORecord.set(mat, this.createPipelineStates(mat));
        } else {
            this._matRefCount.set(mat, this._matRefCount.get(mat)! + 1);
        }
    }

    private releasePSO (mat: IMaterial) {
        this._matRefCount.set(mat, this._matRefCount.get(mat)! - 1);
        if (this._matRefCount.get(mat) === 0) {
            this.destroyPipelineStates(mat, this._matPSORecord.get(mat)!);
            this._matPSORecord.delete(mat);
            this._matRefCount.delete(mat);
        }
    }
}
