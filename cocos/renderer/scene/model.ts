// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { Material } from '../../3d/assets/material';
import { IRenderingSubmesh } from '../../3d/assets/mesh';
import { aabb } from '../../3d/geom-utils';
import { Vec3 } from '../../core/value-types';
import { mat4 } from '../../core/vmath';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXBufferUsageBit, GFXCommandBufferType, GFXMemoryUsageBit } from '../../gfx/define';
import { UBOLocal } from '../../pipeline/render-pipeline';
import { Node } from '../../scene-graph';
import { Effect } from '../core/effect';
import { Pass } from '../core/pass';
import { RenderScene } from './render-scene';
import { GFXDevice } from '../../gfx/device';

const _temp_floatx16 = new Float32Array(16);
const _temp_mat4 = mat4.create();

/**
 * A representation of a model
 */
export class Model {

    protected _device: GFXDevice;
    protected _type: string;
    protected _subMeshObject: IRenderingSubmesh | null;
    private _scene: RenderScene | null;
    private _id: number;
    private _poolID: number;
    private _isEnable: boolean;
    private _node: Node;
    private _effect: Effect | null;
    private _defines: Object;
    private _dependencies: Object;
    private _viewID: number;
    private _cameraID: number;
    private _userKey: number;
    private _castShadow: boolean;
    private _worldBounds: aabb;
    private _modelBounds: aabb;
    private _material: Material | null;
    private _cmdBuffers: GFXCommandBuffer[];
    private _uboLocal: UBOLocal;
    private _localUBO: GFXBuffer | null;
    /**
     * Setup a default empty model
     */
    constructor () {
        this._scene = null;
        this._id = 0;

        this._type = 'default';
        this._poolID = -1;
        this._isEnable = true;
        this._node = null;
        this._subMeshObject = null;
        this._effect = null;
        this._defines = {};
        this._dependencies = {};
        this._viewID = -1;
        this._cameraID = -1;
        this._userKey = -1;
        this._castShadow = false;
        this._material = null;
        this._cmdBuffers = new Array<GFXCommandBuffer>();
        this._uboLocal = new UBOLocal();
        this._localUBO = null;
        this._device = cc.director.root.device;
    }

    public initialize () {
        this._localUBO = this._device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST,
            size: UBOLocal.SIZE,
            stride: UBOLocal.SIZE,
        });
        if (this._localUBO) {
            this._localUBO.update(this._uboLocal.view);
        }
    }

    set scene (scene: RenderScene | null) {
        this._scene = scene;

        if (this._scene) {
            this._id = this._scene.generateModelId();
        }
    }

    get scene (): RenderScene | null {
        return this._scene;
    }

    get id (): number {
        return this._id;
    }

    public _updateTransform () {
        if (!this._node._hasChanged || !this._worldBounds) { return; }
        this._node.updateWorldTransformFull();
        this._modelBounds.transform(this._node._mat, this._node._pos,
            this._node._rot, this._node._scale, this._worldBounds);
    }

    public updateUBOs () {
        mat4.array(_temp_floatx16, this._node._mat);
        this._node._mat.invert(_temp_mat4);
        this._uboLocal.view.set(_temp_floatx16, UBOLocal.MAT_WORLD_OFFSET);
        mat4.array(_temp_floatx16, _temp_mat4);
        this._uboLocal.view.set(_temp_floatx16, UBOLocal.MAT_WORLD_IT_OFFSET);

        this._localUBO!.update(this._uboLocal.view);
    }

    /**
     * Create the bounding shape of this model
     * @param {vec3} minPos the min position of the model
     * @param {vec3} maxPos the max position of the model
     */
    public createBoundingShape (minPos: Vec3, maxPos: Vec3) {
        if (!minPos || !maxPos) { return; }
        this._modelBounds = aabb.fromPoints(aabb.create(), minPos, maxPos);
        this._worldBounds = aabb.clone(this._modelBounds);
    }

    public enable (isEnable: boolean) {
        this._isEnable = isEnable;
    }

    public isEnable (): boolean {
        return this._isEnable;
    }

    /**
     * Get the hosting node of this camera
     * @returns {Node} the hosting node
     */
    get node (): Node {
        return this._node;
    }

    /**
     * Set the hosting node of this model
     * @param {Node} node the hosting node
     */
    set node (node: Node) {
        this._node = node;
    }

    /**
     * Set the input assembler
     * @param {InputAssembler} ia
     */
    set subMeshData (sm: IRenderingSubmesh | null) {
        this._subMeshObject = sm;
    }

    get subMeshData () {
        return this._subMeshObject;
    }

    get worldBounds (): aabb {
        return this._worldBounds;
    }
    get modelBounds (): aabb {
        return this._modelBounds;
    }

    get viewID (): number {
        return this._viewID;
    }

    /**
     * Set the model effect
     * @param {?Effect} effect the effect to use
     */
    public setEffect (effect: Effect) {
        if (effect) {
            this._effect = effect;
            // this._defines = effect.extractDefines(Object.create(null));
            // this._dependencies = effect.extractDependencies(Object.create(null));
        } else {
            this._effect = null;
            this._defines = Object.create(null);
            this._dependencies = Object.create(null);
        }
    }

    set material (material: Material) {
        this._material = material;
        for (let i = 0; i < this._material.passes.length; i++) {
            if (this._material.passes[i].primitive !== this._subMeshObject!.primitiveMode) {
                cc.error('the model(%d)\'s primitive type doesn\'t match its pass\'s');
            }
            this.recordCommandBuffer(i);
        }
        for (let i = this._cmdBuffers.length - 1; i >= this._material.passes.length; i--) {
            const cmdBuff = this._cmdBuffers.pop();
            if (cmdBuff) {
                cmdBuff.destroy();
            }
        }
    }

    private recordCommandBuffer (index: number) {
        const pass = this._material!.passes[index];
        if (this._cmdBuffers[index] == null) {
            const cmdBufferInfo = {
                allocator: this._device.commandAllocator,
                type: GFXCommandBufferType.SECONDARY,
            };
            this._cmdBuffers[index] = this._device.createCommandBuffer(cmdBufferInfo);
        }

        const localUBO = this._localUBO as GFXBuffer;
        const subMesh = this._subMeshObject as IRenderingSubmesh;

        pass.bindingLayout.bindBuffer(UBOLocal.BLOCK.binding, localUBO);

        const cmdBuff = this._cmdBuffers[index];
        cmdBuff.begin();
        cmdBuff.bindPipelineState(pass.pipelineState);
        cmdBuff.bindBindingLayout(pass.bindingLayout);
        cmdBuff.bindInputAssembler(subMesh.inputAssembler);
        cmdBuff.draw(subMesh.inputAssembler);
        cmdBuff.end();
    }

    /**
     * Set the user key
     * @param {number} key
     */
    set userKey (key: number) {
        this._userKey = key;
    }

    get passes (): Pass[] {
        return this._material!.passes;
    }

    get commandBuffers (): GFXCommandBuffer[] {
        return this._cmdBuffers;
    }

    get uboLocal (): UBOLocal {
        return this._uboLocal;
    }

    get localUBO (): GFXBuffer {
        return this._localUBO!;
    }
}
