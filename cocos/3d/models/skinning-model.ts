/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

import { JSB } from 'internal:constants';
import { Material } from '../../core/assets/material';
import { RenderingSubMesh } from '../../core/assets/rendering-sub-mesh';
import { Mesh } from '../assets/mesh';
import { Skeleton } from '../assets/skeleton';
import { AABB } from '../../core/geometry';
import { BufferUsageBit, MemoryUsageBit, DescriptorSet, Buffer, BufferInfo, Attribute } from '../../core/gfx';
import { Mat4, Vec3 } from '../../core/math';
import { UBOSkinning } from '../../core/pipeline/define';
import { Node } from '../../core/scene-graph/node';
import { ModelType } from '../../core/renderer/scene/model';
import { uploadJointData } from '../skeletal-animation/skeletal-animation-utils';
import { MorphModel } from './morph-model';
import { deleteTransform, getTransform, getWorldMatrix, IJointTransform } from '../../core/animation/skeletal-animation-utils';
import { BatchingSchemes, IMacroPatch, Pass, NativeJointInfo, NativeJointTransform, NativeSkinningModel  } from '../../core/renderer';
import { warnID } from '../../core/platform/debug';

const myPatches: IMacroPatch[] = [
    { name: 'CC_USE_SKINNING', value: true },
];

function getRelevantBuffers (outIndices: number[], outBuffers: number[], jointMaps: number[][], targetJoint: number) {
    for (let i = 0; i < jointMaps.length; i++) {
        const idxMap = jointMaps[i];
        let index = -1;
        for (let j = 0; j < idxMap.length; j++) {
            if (idxMap[j] === targetJoint) { index = j; break; }
        }
        if (index >= 0) {
            outBuffers.push(i);
            outIndices.push(index);
        }
    }
}

interface IJointInfo {
    bound: AABB;
    target: Node;
    bindpose: Mat4;
    transform: IJointTransform;
    buffers: number[];
    indices: number[];
}

const v3_min = new Vec3();
const v3_max = new Vec3();
const v3_1 = new Vec3();
const v3_2 = new Vec3();
const m4_1 = new Mat4();
const ab_1 = new AABB();

/**
 * @en
 * The skinning model that is using real-time pose calculation.
 * @zh
 * 实时计算动画的蒙皮模型。
 */
export class SkinningModel extends MorphModel {
    private _buffers: Buffer[] = [];
    private _dataArray: Float32Array[] = [];
    private _joints: IJointInfo[] = [];
    private _bufferIndices: number[] | null = null;
    constructor () {
        super();
        this.type = ModelType.SKINNING;
    }

    protected _init () {
        if (JSB) {
            this._nativeObj = new NativeSkinningModel();
        }
    }

    public destroy () {
        this.bindSkeleton();
        if (this._buffers.length) {
            for (let i = 0; i < this._buffers.length; i++) {
                this._buffers[i].destroy();
            }
            this._buffers.length = 0;
        }
        super.destroy();
    }

    /**
     * @en Abstract function for [[BakedSkinningModel]], empty implementation.
     * @zh 由 [[BakedSkinningModel]] 继承的空函数。
     */
    public uploadAnimation () {}

    /**
     * @en Bind the skeleton with its skinning root node and the mesh data.
     * @zh 在模型中绑定一个骨骼，需要提供骨骼的蒙皮根节点和蒙皮网格数据。
     * @param skeleton @en The skeleton to be bound @zh 要绑定的骨骼
     * @param skinningRoot @en The skinning root of the skeleton @zh 骨骼的蒙皮根节点
     * @param mesh @en The mesh @zh 蒙皮网格
     * @returns void
     */
    public bindSkeleton (skeleton: Skeleton | null = null, skinningRoot: Node | null = null, mesh: Mesh | null = null) {
        for (let i = 0; i < this._joints.length; i++) {
            deleteTransform(this._joints[i].target);
        }
        this._bufferIndices = null; this._joints.length = 0;
        if (!skeleton || !skinningRoot || !mesh) { return; }
        this.transform = skinningRoot;
        const boneSpaceBounds = mesh.getBoneSpaceBounds(skeleton);
        const jointMaps = mesh.struct.jointMaps;
        this._ensureEnoughBuffers(jointMaps && jointMaps.length || 1);
        this._bufferIndices = mesh.jointBufferIndices;
        const nativeJoints: NativeJointInfo[] = [];
        for (let index = 0; index < skeleton.joints.length; index++) {
            const bound = boneSpaceBounds[index];
            const target = skinningRoot.getChildByPath(skeleton.joints[index]);
            if (!bound || !target) { continue; }
            const transform = getTransform(target, skinningRoot)!;
            const bindpose = skeleton.bindposes[index];
            const indices: number[] = [];
            const buffers: number[] = [];
            if (!jointMaps) { indices.push(index); buffers.push(0); } else { getRelevantBuffers(indices, buffers, jointMaps, index); }
            this._joints.push({ indices, buffers, bound, target, bindpose, transform });
            if (JSB) {
                let currParent: IJointTransform | null | undefined = transform.parent;
                const transParents: NativeJointTransform[] = [];
                while (currParent) {
                    transParents.push({ node: currParent.node.native, local: currParent.local, world: currParent.local, stamp: currParent.stamp });
                    currParent = currParent.parent;
                }
                nativeJoints.push({ indices,
                    buffers,
                    bound: bound.native,
                    target: target.native,
                    bindpose,
                    transform: { node: transform.node.native, local: transform.local, world: transform.world, stamp: transform.stamp },
                    parents: transParents,
                });
            }
        }
        if (JSB) {
            (this._nativeObj! as NativeSkinningModel).setIndicesAndJoints(this._bufferIndices, nativeJoints);
        }
    }

    /**
     * @en Update world transform and bounding boxes for the model
     * @zh 更新模型的世界矩阵和包围盒
     * @param stamp @en The update time stamp @zh 更新的时间戳
     */
    public updateTransform (stamp: number) {
        const root = this.transform;
        // @ts-expect-error TS2445
        if (root.hasChangedFlags || root._dirtyFlags) {
            root.updateWorldTransform();
            this._localDataUpdated = true;
        }
        // update bounds
        Vec3.set(v3_min,  Infinity,  Infinity,  Infinity);
        Vec3.set(v3_max, -Infinity, -Infinity, -Infinity);
        for (let i = 0; i < this._joints.length; i++) {
            const { bound, transform } = this._joints[i];
            const worldMatrix = getWorldMatrix(transform, stamp);
            AABB.transform(ab_1, bound, worldMatrix);
            ab_1.getBoundary(v3_1, v3_2);
            Vec3.min(v3_min, v3_min, v3_1);
            Vec3.max(v3_max, v3_max, v3_2);
        }
        const worldBounds = this._worldBounds;
        if (this._modelBounds && worldBounds) {
            AABB.fromPoints(this._modelBounds, v3_min, v3_max);
            // @ts-expect-error TS2445
            this._modelBounds.transform(root._mat, root._pos, root._rot, root._scale, this._worldBounds);
            this._updateNativeBounds();
        }
    }

    /**
     * @en Update uniform buffer objects for rendering.
     * @zh 更新用于渲染的 UBO
     * @param stamp @en The update time stamp @zh 更新的时间戳
     * @returns @en successful or not @zh 更新是否成功
     */
    public updateUBOs (stamp: number) {
        super.updateUBOs(stamp);
        for (let i = 0; i < this._joints.length; i++) {
            const { indices, buffers, transform, bindpose } = this._joints[i];
            Mat4.multiply(m4_1, transform.world, bindpose);
            for (let b = 0; b < buffers.length; b++) {
                uploadJointData(this._dataArray[buffers[b]], indices[b] * 12, m4_1, i === 0);
            }
        }
        for (let b = 0; b < this._buffers.length; b++) {
            this._buffers[b].update(this._dataArray[b]);
        }
        return true;
    }

    /**
     * @en Initialize sub model with the sub mesh data and the material
     * @zh 用子网格数据和材质初始化一个子模型
     * @param idx @en The index of the sub model to be initialized @zh 需要初始化的子模型序号
     * @param subMeshData @en The sub mesh data @zh 子网格数据
     * @param mat @en The material @zh 子模型材质
     */
    public initSubModel (idx: number, subMeshData: RenderingSubMesh, mat: Material) {
        const original = subMeshData.vertexBuffers;
        const iaInfo = subMeshData.iaInfo;
        iaInfo.vertexBuffers = subMeshData.jointMappedBuffers;
        super.initSubModel(idx, subMeshData, mat);
        iaInfo.vertexBuffers = original;
    }

    // override
    public getMacroPatches (subModelIndex: number): IMacroPatch[] | null {
        const superMacroPatches = super.getMacroPatches(subModelIndex);
        if (superMacroPatches) {
            return myPatches.concat(superMacroPatches);
        }
        return myPatches;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _updateLocalDescriptors (submodelIdx: number, descriptorSet: DescriptorSet) {
        super._updateLocalDescriptors(submodelIdx, descriptorSet);
        if (JSB) {
            (this._nativeObj! as NativeSkinningModel).updateLocalDescriptors(submodelIdx, descriptorSet);
            return;
        }
        const buffer = this._buffers[this._bufferIndices![submodelIdx]];
        if (buffer) { descriptorSet.bindBuffer(UBOSkinning.BINDING, buffer); }
    }

    protected _updateInstancedAttributes (attributes: Attribute[], pass: Pass) {
        if (pass.batchingScheme !== BatchingSchemes.NONE) {
            // TODO(holycanvas): #9203 better to print the complete path instead of only the current node
            warnID(3936, this.node.getPathInHierarchy());
        }
        super._updateInstancedAttributes(attributes, pass);
    }

    private _ensureEnoughBuffers (count: number) {
        for (let i = 0; i < count; i++) {
            if (!this._buffers[i]) {
                this._buffers[i] = this._device.createBuffer(new BufferInfo(
                    BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                    MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                    UBOSkinning.SIZE,
                    UBOSkinning.SIZE,
                ));
            }
            if (!this._dataArray[i]) {
                this._dataArray[i] = new Float32Array(UBOSkinning.COUNT);
            }
        }
        if (JSB) {
            (this._nativeObj! as NativeSkinningModel).setBuffers(this._buffers);
        }
    }
}
