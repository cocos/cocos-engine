// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { Material } from '../../3d/assets/material';
import { IRenderingSubmesh } from '../../3d/assets/mesh';
import { aabb } from '../../3d/geom-utils';
import Pool from '../../3d/memop/pool';
import { Mat4, Vec3 } from '../../core/math';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBindingType, GFXBufferUsageBit, GFXGetTypeSize, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { GFXUniformBlock } from '../../gfx/shader';
import { IInternalBindingInst, UBOForwardLight, UBOLocal } from '../../pipeline/define';
import { Pass } from '../core/pass';
import { customizationManager } from './customization-manager';
import { RenderScene } from './render-scene';
import { SubModel } from './submodel';
import { INode } from '../../core/utils/interfaces';

const f32_1 = new Float32Array(16);
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

/**
 * A representation of a model
 */
export class Model {

    set scene (scene: RenderScene) {
        this._scene = scene;
        this._id = this._scene.generateModelId();
    }

    get scene () {
        return this._scene;
    }

    get id () {
        return this._id;
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

    /**
     * Get the hosting node of this camera
     * @returns the hosting node
     */
    get node () {
        return this._node;
    }

    /**
     * Set the hosting node of this model
     * @param {Node} node the hosting node
     */
    set node (node: INode) {
        this._node = node;
    }

    get transform () {
        return this._transform;
    }

    set transform (transform: INode) {
        this._transform = transform;
    }

    get worldBounds () {
        return this._worldBounds;
    }
    get modelBounds () {
        return this._modelBounds;
    }

    get viewID () {
        return this._viewID;
    }

    set viewID (id: number) {
        this._viewID = id;
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

    get UBOUpdated () {
        return this._uboUpdated;
    }

    protected _type: string = 'default';
    protected _device: GFXDevice;
    protected _scene: RenderScene;
    protected _node: INode;
    protected _transform: INode;
    protected _id: number;
    protected _enabled: boolean = false;
    protected _viewID: number = 1;
    protected _cameraID: number = -1;
    protected _userKey: number = -1;
    protected _worldBounds: aabb | null = null;
    protected _modelBounds: aabb | null = null;
    protected _subModels: SubModel[] = [];
    protected _matPSORecord: Map<Material, GFXPipelineState[]>;
    protected _matRefCount: Map<Material, number>;
    protected _uboLocal: UBOLocal;
    protected _localUBO: GFXBuffer | null = null;
    protected _localBindings: Map<string, IInternalBindingInst> = new Map<string, IInternalBindingInst>();
    protected _inited: boolean = false;
    protected _uboUpdated: boolean = false;
    protected _castShadow: boolean = false;
    private _transformUpdated: boolean = true;

    /**
     * Setup a default empty model
     */
    constructor (scene: RenderScene, node: INode) {
        this._device = cc.director.root.device;
        this._scene = scene;
        this._id = this._scene.generateModelId();
        this._transform = this._node = node;

        this._matPSORecord = new Map<Material, GFXPipelineState[]>();
        this._matRefCount = new Map<Material, number>();
        this._uboLocal = new UBOLocal();
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
    }

    public getSubModel (idx: number) {
        return this._subModels[idx];
    }

    public updateTransform () {
        const node = this._transform;
        // @ts-ignore
        if (!node.hasChanged && !node._dirty) { return; }
        node.updateWorldTransform();
        this._transformUpdated = this._transformUpdated || this.node.hasChanged;
        if (!this._modelBounds || !this._worldBounds) { return; }
        // @ts-ignore
        this._modelBounds.transform(node._mat, node._pos, node._rot, node._scale, this._worldBounds);
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
        if (this._transformUpdated) {
            // @ts-ignore
            const worldMatrix = this._transform._mat; const rot = this._transform._rot;
            Mat4.array(this._uboLocal.view, worldMatrix, UBOLocal.MAT_WORLD_OFFSET);
            Mat4.fromQuat(m4_1, rot);
            Mat4.array(this._uboLocal.view, m4_1, UBOLocal.MAT_WORLD_IT_OFFSET);

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
        this._transform.updateWorldTransform();
        // @ts-ignore
        this._modelBounds.transform(this._transform._mat, this._transform._pos, this._transform._rot, this._transform._scale, this._worldBounds);
    }

    public initSubModel (idx: number, subMeshData: IRenderingSubmesh, mat: Material) {
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

    public setSubModelMaterial (idx: number, mat: Material | null) {
        if (this._subModels[idx] == null) {
            return;
        }
        this.initLocalBindings(mat);
        if (this._subModels[idx].material === mat) {
            if (mat) {
                this.destroyPipelineState(mat, this._matPSORecord.get(mat)!);
                this._matPSORecord.set(mat, this.createPipelineState(mat));
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

    public onPipelineChange () {
        for (const m of this._subModels) {
            const mat = m.material!;
            const psos = this._matPSORecord.get(mat)!;
            for (let i = 0; i < mat.passes.length; i++) {
                const pass = mat.passes[i];
                pass.tryCompile(); // force update shaders
                pass.destroyPipelineState(psos[i]);
                psos[i] = this._doCreatePSO(pass);
                psos[i].pipelineLayout.layouts[0].update();
            }
            m.updateCommandBuffer();
        }
    }

    protected createPipelineState (mat: Material): GFXPipelineState[] {
        const ret = new Array<GFXPipelineState>(mat.passes.length);
        for (let i = 0; i < ret.length; i++) {
            const pass = mat.passes[i];
            for (const cus of pass.customizations) { customizationManager.attach(cus, this); }
            ret[i] = this._doCreatePSO(pass);
        }
        return ret;
    }

    protected destroyPipelineState (mat: Material, pso: GFXPipelineState[]) {
        for (let i = 0; i < mat.passes.length; i++) {
            const pass = mat.passes[i];
            pass.destroyPipelineState(pso[i]);
            for (const cus of pass.customizations) { customizationManager.detach(cus, this); }
        }
    }

    protected _doCreatePSO (pass: Pass) {
        const pso = pass.createPipelineState()!;
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
        if (hasForwardLight && cc.director.root.pipeline.name === 'ForwardPipeline') {
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
            mat.passes[i].update();
        }
        for (let i = 0; i < psos.length; i++) {
            psos[i].pipelineLayout.layouts[0].update();
        }
    }

    private allocatePSO (mat: Material) {
        if (this._matRefCount.get(mat) == null) {
            this._matRefCount.set(mat, 1);
            this._matPSORecord.set(mat, this.createPipelineState(mat));
        } else {
            this._matRefCount.set(mat, this._matRefCount.get(mat)! + 1);
        }
    }

    private releasePSO (mat: Material) {
        this._matRefCount.set(mat, this._matRefCount.get(mat)! - 1);
        if (this._matRefCount.get(mat) === 0) {
            this.destroyPipelineState(mat, this._matPSORecord.get(mat)!);
            this._matPSORecord.delete(mat);
            this._matRefCount.delete(mat);
        }
    }
}
