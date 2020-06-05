/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

/**
 * @hidden
 */

import { EDITOR } from 'internal:constants';
import { Material } from '../../assets/material';
import { Mesh, RenderingSubMesh } from '../../assets/mesh';
import { Skeleton } from '../../assets/skeleton';
import { aabb } from '../../geometry';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { Mat4, Vec3 } from '../../math';
import { UBOSkinning } from '../../pipeline/define';
import { Node } from '../../scene-graph/node';
import { Pass, IMacroPatch } from '../core/pass';
import { ModelType } from '../scene/model';
import { uploadJointData } from './skeletal-animation-utils';
import { MorphModel } from './morph-model';
import { IPSOCreateInfo } from '../scene/submodel';

export interface IJointTransform {
    node: Node;
    local: Mat4;
    world: Mat4;
    stamp: number;
    parent: IJointTransform | null;
}

const stack: IJointTransform[] = [];
const pool: Map<string, IJointTransform> = new Map();

const myPatches = [
    { name: 'CC_USE_SKINNING', value: true },
];

export function getWorldMatrix (transform: IJointTransform | null, stamp: number) {
    let i = 0;
    let res = Mat4.IDENTITY;
    while (transform) {
        if (transform.stamp === stamp || transform.stamp + 1 === stamp && !transform.node.hasChangedFlags) {
            res = transform.world;
            transform.stamp = stamp;
            break;
        }
        transform.stamp = stamp;
        stack[i++] = transform;
        transform = transform.parent;
    }
    while (i > 0) {
        transform = stack[--i];
        const node = transform.node;
        Mat4.fromRTS(transform.local, node.rotation, node.position, node.scale);
        res = Mat4.multiply(transform.world, res, transform.local);
    }
    return res;
}

export function getTransform (node: Node, root: Node) {
    let joint: IJointTransform | null = null;
    let i = 0;
    while (node !== root) {
        const id = node.uuid;
        if (pool.has(id)) {
            joint = pool.get(id)!;
            break;
        } else { // TODO: object reuse
            joint = { node, local: new Mat4(), world: new Mat4(), stamp: -1, parent: null };
            pool.set(id, joint);
        }
        stack[i++] = joint;
        node = node.parent!;
        joint = null;
    }
    let child: IJointTransform;
    while (i > 0) {
        child = stack[--i];
        child.parent = joint;
        joint = child;
    }
    return joint;
}

export function deleteTransform (node: Node) {
    let transform = pool.get(node.uuid) || null;
    while (transform) {
        pool.delete(transform.node.uuid);
        transform = transform.parent;
    }
}

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
    bound: aabb;
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
const ab_1 = new aabb();

/**
 * @en
 * The skinning model that is using real-time pose calculation.
 * @zh
 * 实时计算动画的蒙皮模型。
 */
export class SkinningModel extends MorphModel {

    public uploadAnimation = null;

    private _buffers: GFXBuffer[] = [];
    private _dataArray: Float32Array[] = [];
    private _joints: IJointInfo[] = [];
    private _bufferIndices: number[] | null = null;

    constructor () {
        super();
        this.type = ModelType.SKINNING;
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
        for (let index = 0; index < skeleton.joints.length; index++) {
            const bound = boneSpaceBounds[index];
            const target = skinningRoot.getChildByPath(skeleton.joints[index]);
            if (!bound || !target) { continue; }
            const transform = getTransform(target, skinningRoot)!;
            const bindpose = skeleton.bindposes[index];
            const indices: number[] = [];
            const buffers: number[] = [];
            if (!jointMaps) { indices.push(index); buffers.push(0); }
            else { getRelevantBuffers(indices, buffers, jointMaps, index); }
            this._joints.push({ indices, buffers, bound, target, bindpose, transform });
        }
    }

    public updateTransform (stamp: number) {
        const root = this.transform!;
        // @ts-ignore TS2445
        if (root.hasChangedFlags || root._dirtyFlags) {
            root.updateWorldTransform();
            this._transformUpdated = true;
        }
        // update bounds
        Vec3.set(v3_min,  Infinity,  Infinity,  Infinity);
        Vec3.set(v3_max, -Infinity, -Infinity, -Infinity);
        for (let i = 0; i < this._joints.length; i++) {
            const { bound, transform } = this._joints[i];
            const worldMatrix = getWorldMatrix(transform, stamp);
            aabb.transform(ab_1, bound, worldMatrix);
            ab_1.getBoundary(v3_1, v3_2);
            Vec3.min(v3_min, v3_min, v3_1);
            Vec3.max(v3_max, v3_max, v3_2);
        }
        if (this._modelBounds && this._worldBounds) {
            aabb.fromPoints(this._modelBounds, v3_min, v3_max);
            // @ts-ignore TS2445
            this._modelBounds.transform(root._mat, root._pos, root._rot, root._scale, this._worldBounds);
        }
    }

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

    public initSubModel (idx: number, subMeshData: RenderingSubMesh, mat: Material) {
        const original = subMeshData.vertexBuffers;
        subMeshData.vertexBuffers = subMeshData.jointMappedBuffers;
        super.initSubModel(idx, subMeshData, mat);
        subMeshData.vertexBuffers = original;
    }

    public getMacroPatches (subModelIndex: number) : any {
        const superMacroPatches = super.getMacroPatches(subModelIndex);
        if (superMacroPatches) {
            return myPatches.concat(superMacroPatches);
        } else {
            return myPatches;
        }
    }

    public updateLocalBindings (psoci: IPSOCreateInfo, submodelIdx: number) {
        super.updateLocalBindings(psoci, submodelIdx);
        const bindingLayout = psoci.bindingLayout;
        const buffer = this._buffers[this._bufferIndices![submodelIdx]];
        if (buffer) { bindingLayout.bindBuffer(UBOSkinning.BLOCK.binding, buffer); }
    }

    private _ensureEnoughBuffers (count: number) {
        for (let i = 0; i < count; i++) {
            if (!this._buffers[i]) {
                this._buffers[i] = this._device.createBuffer({
                    usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                    memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                    size: UBOSkinning.SIZE,
                    stride: UBOSkinning.SIZE,
                });
            }
            if (!this._dataArray[i]) {
                this._dataArray[i] = new Float32Array(UBOSkinning.COUNT);
            }
        }
    }
}
