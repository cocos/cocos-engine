// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { Material } from '../../3d/assets/material';
import { IRenderingSubmesh } from '../../3d/assets/mesh';
import { aabb } from '../../3d/geom-utils';
import { RecyclePool } from '../../3d/memop';
import { Vec3 } from '../../core/value-types';
import { mat4 } from '../../core/vmath';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { UBOLocal } from '../../pipeline/render-pipeline';
import { Node } from '../../scene-graph/node';
import { RenderScene } from './render-scene';
import { SubModel } from './submodel';

const _temp_floatx16 = new Float32Array(16);
const _temp_mat4 = mat4.create();

const _subMeshPool = new RecyclePool(() => {
    return new SubModel();
}, 32);

/**
 * A representation of a model
 */
export class Model {

    protected _type: string = 'default';
    protected _device: GFXDevice;
    private _scene: RenderScene;
    private _node: Node;
    private _id: number;
    private _isEnable: boolean = false;
    private _viewID: number = -1;
    private _cameraID: number = -1;
    private _userKey: number = -1;
    private _worldBounds: aabb | null = null;
    private _modelBounds: aabb | null = null;
    private _subModels: SubModel[] = [];
    private _matPSORecord: Map<Material, GFXPipelineState[]>;
    private _matRefCount: Map<Material, number>;
    private _uboLocal: UBOLocal;
    private _localUBO: GFXBuffer | null;

    /**
     * Setup a default empty model
     */
    constructor (scene: RenderScene, node: Node) {
        this._device = cc.director.root.device;
        this._scene = scene;
        this._node = node;
        this._id = this._scene.generateModelId();

        this._matPSORecord = new Map<Material, GFXPipelineState[]>();
        this._matRefCount = new Map<Material, number>();
        this._uboLocal = new UBOLocal();
        this._localUBO = null;
    }

    public destroy () {
        for (const subModel of this._subModels) {
            subModel.destroy();
            _subMeshPool.remove(subModel);
        }
        if (this._localUBO) {
            this._localUBO.destroy();
            this._localUBO = null;
        }
        this._worldBounds = null;
        this._modelBounds = null;
        this._subModels.splice(0);
        this._matPSORecord.clear();
        this._matRefCount.clear();
    }

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

    public getSubModel (idx: number) {
        return this._subModels[idx];
    }

    public _updateTransform () {
        if (this._node.hasChanged) {
            this._node.updateWorldTransformFull();
            if (this._modelBounds) {
                this._modelBounds.transform(
                    // @ts-ignore
                    this._node._mat, this._node._pos, this._node._rot, this._node._scale,
                    this._worldBounds);
            }
        }
    }

    public updateUBOs () {
        // @ts-ignore
        mat4.array(_temp_floatx16, this._node._mat);
        this._uboLocal.view.set(_temp_floatx16, UBOLocal.MAT_WORLD_OFFSET);
        // @ts-ignore
        mat4.normalMatrix(_temp_mat4, this._node._mat);
        mat4.array(_temp_floatx16, _temp_mat4);
        this._uboLocal.view.set(_temp_floatx16, UBOLocal.MAT_WORLD_IT_OFFSET);

        if (this._localUBO) {
            this._localUBO.update(this._uboLocal.view);
        }

        for (const mat of this._matPSORecord.keys()) {
            for (const pass of mat.passes) {
                pass.update();
            }
            for (const pso of this._matPSORecord.get(mat)!) {
                pso.pipelineLayout.layouts[0].update();
            }
        }
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
    }

    set enabled (isEnable) {
        this._isEnable = isEnable;
    }

    get enabled () {
        return this._isEnable;
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
    set node (node: Node) {
        this._node = node;
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

    public initSubModel (idx: number, subMeshData: IRenderingSubmesh, mat: Material) {
        if (this._subModels[idx] == null) {
            this._subModels[idx] = _subMeshPool.add();
        } else {
            const oldMat = this._subModels[idx].material;
            this._subModels[idx].destroy();
            this.releasePSO(oldMat);
        }
        this.allocatePSO(mat);
        this._subModels[idx].initialize(subMeshData, mat, this._matPSORecord.get(mat)!);
    }

    public setSubModelMesh (idx: number, subMeshData: IRenderingSubmesh) {
        if (this._subModels[idx] == null) {
            this._subModels[idx] = _subMeshPool.add();
        }
        this._subModels[idx].subMeshData = subMeshData;
    }

    public setSubModelMaterial (idx: number, mat: Material | null) {
        if (this._subModels[idx] == null) {
            return;
        }
        if (this._subModels[idx].material === mat) {
            if (mat) {
                this.destroyPipelineState(mat!, this._matPSORecord.get(mat!)!);
                this._matPSORecord.set(mat!, this.createPipelineState(mat!));
            }
        } else {
            if (this._subModels[idx].material) {
                this.releasePSO(this._subModels[idx].material!);
            }
            if (mat) {
                this.allocatePSO(mat);
            }
        }
        this._subModels[idx]._psos = mat ? this._matPSORecord.get(mat)! : null;
        this._subModels[idx].material = mat;
    }

    protected createPipelineState (mat: Material): GFXPipelineState[] {
        if (this._localUBO == null) {
            this._localUBO = this._device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST,
                size: UBOLocal.SIZE,
                stride: UBOLocal.SIZE,
            });
            this._localUBO.update(this._uboLocal.view);
        }
        const ret = new Array<GFXPipelineState>(mat.passes.length);
        for (let i = 0; i < ret.length; i++) {
            ret[i] = mat.passes[i].createPipelineState()!;
            this._onCreatePSO(ret[i]);
        }
        return ret;
    }

    protected destroyPipelineState (mat: Material, pso: GFXPipelineState[]) {
        for (let i = 0; i < mat.passes.length; i++) {
            mat.passes[i].destroyPipelineState(pso[i]);
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

    protected _onCreatePSO (pso: GFXPipelineState) {
        pso.pipelineLayout.layouts[0].bindBuffer(UBOLocal.BLOCK.binding, this.localUBO!);
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
}
