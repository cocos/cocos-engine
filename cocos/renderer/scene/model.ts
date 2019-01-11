// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { Material } from '../../3d/assets/material';
import { IRenderingSubmesh } from '../../3d/assets/mesh';
import { aabb } from '../../3d/geom-utils';
import { Vec3 } from '../../core/value-types';
import { mat4, vec3 } from '../../core/vmath';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXBufferUsageBit, GFXCommandBufferType, GFXFormat, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXInputAssembler, IGFXInputAttribute } from '../../gfx/input-assembler';
import { UBOLocal } from '../../pipeline/render-pipeline';
import { Node } from '../../scene-graph';
import { Effect } from '../core/effect';
import { Pass } from '../core/pass';
import { RenderScene } from './render-scene';

const _temp_floatx16 = new Float32Array(16);
const _temp_mat4 = mat4.create();

/**
 * A representation of a model
 */
export default class Model {

    private _scene: RenderScene | null;
    private _id: number;
    private _type: string;
    private _poolID: number;
    private _isEnable: boolean;
    private _node: Node;
    private _subMeshObject: IRenderingSubmesh | null;
    private _effect: Effect | null;
    private _defines: Object;
    private _dependencies: Object;
    private _viewID: number;
    private _cameraID: number;
    private _userKey: number;
    private _castShadow: boolean;
    private _boundingShape: aabb;
    private _bsModelSpace: aabb;
    private _material: Material | null;
    private _cmdBuffers: GFXCommandBuffer[];
    private _localUniforms: UBOLocal | null;
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
        this._boundingShape = aabb.create(0, 0, 0, 50, 50, 50);
        this._material = null;
        this._cmdBuffers = new Array<GFXCommandBuffer>();
        this._localUniforms = null;
        this._localUBO = null;
    }

    public initialize () {
        this._localUniforms = new UBOLocal();
        this._localUBO = cc.director.root.device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST,
            size: UBOLocal.SIZE,
            stride: UBOLocal.SIZE,
        });
        if (this._localUBO) {
            this._localUBO.update(this._localUniforms.view);
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
        if (!this._node._hasChanged || !this._boundingShape) { return; }
        this._node.updateWorldTransformFull();
        this._bsModelSpace.transform(this._node._mat, this._node._pos,
            this._node._rot, this._node._scale, this._boundingShape);
    }

    public updateRenderData () {
        mat4.array(_temp_floatx16, this._node._mat);
        this._node._mat.invert(_temp_mat4);
        if (this._localUniforms) {
            this._localUniforms.view.set(_temp_floatx16, UBOLocal.MAT_WORLD_OFFSET);
        }
        mat4.array(_temp_floatx16, _temp_mat4);
        if (this._localUniforms) {
            this._localUniforms.view.set(_temp_floatx16, UBOLocal.MAT_WORLD_IT_OFFSET);
        }

        /*
        if (this._localUBO) {
            this._localUBO.update(this._localUniforms.view);
        }
        */
    }

    /**
     * Create the bounding shape of this model
     * @param {vec3} minPos the min position of the model
     * @param {vec3} maxPos the max position of the model
     */
    public createBoundingShape (minPos: Vec3, maxPos: Vec3) {
        if (!minPos || !maxPos) { return; }
        this._bsModelSpace = aabb.fromPoints(aabb.create(), minPos, maxPos);
        this._boundingShape = aabb.clone(this._bsModelSpace);
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
    set subMeshData (sm: IRenderingSubmesh) {
        this._subMeshObject = sm;
    }

    get boundingShape (): aabb {
        return this._boundingShape;
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
            if (this._material.passes[i].primitive !== (this._subMeshObject as IRenderingSubmesh).primitiveMode) {
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

    public recordCommandBuffer (index: number) {
        const pass = (this._material as Material).passes[index];
        const cmdBufferInfo = {
            allocator: cc.director.root.device.commandAllocator,
            type: GFXCommandBufferType.SECONDARY,
        };
        if (this._cmdBuffers[index] == null) {
            this._cmdBuffers[index] = cc.director.root.device.createCommandBuffer(cmdBufferInfo);
        }
        if (this._localUBO) {
            pass.bindingLayout.bindBuffer(UBOLocal.BLOCK.binding, this._localUBO);
        }
        pass.bindingLayout.update();
        this._cmdBuffers[index].begin();
        this._cmdBuffers[index].bindPipelineState(pass.pipelineState);
        this._cmdBuffers[index].bindBindingLayout(pass.bindingLayout);
        this._cmdBuffers[index].bindInputAssembler((this._subMeshObject as IRenderingSubmesh).inputAssembler);
        this._cmdBuffers[index].draw((this._subMeshObject as IRenderingSubmesh).inputAssembler);
        this._cmdBuffers[index].end();
    }

    /**
     * Set the user key
     * @param {number} key
     */
    set userKey (key: number) {
        this._userKey = key;
    }

    get passes (): Pass[] {
        return (this._material as Material).passes;
    }

    get commandBuffers (): GFXCommandBuffer[] {
        return this._cmdBuffers;
    }

    get localUniforms (): UBOLocal {
        return this._localUniforms as UBOLocal;
    }

    get localUBO (): GFXBuffer {
        return this._localUBO as GFXBuffer;
    }
}
