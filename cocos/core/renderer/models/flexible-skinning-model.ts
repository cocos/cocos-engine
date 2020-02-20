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

import { Mesh } from '../../assets/mesh';
import { Skeleton } from '../../assets/skeleton';
import { aabb } from '../../geom-utils';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { Mat4, Vec3 } from '../../math';
import { UBOSkinningFlexible } from '../../pipeline/define';
import { Node } from '../../scene-graph/node';
import { Pass } from '../core/pass';
import { DataPoolManager } from '../data-pool-manager';
import { Model } from '../scene/model';
import { uploadJointData } from './skeletal-animation-utils';

export interface IJointTransform {
    node: Node;
    local: Mat4;
    world: Mat4;
    stamp: number;
    parent: IJointTransform | null;
}

const stack: IJointTransform[] = [];
const pool: Map<string, IJointTransform> = new Map();

export function getWorldMatrix (transform: IJointTransform | null, stamp: number) {
    let i = 0;
    let res = Mat4.IDENTITY;
    while (transform) {
        if (transform.stamp === stamp || transform.stamp + 1 === stamp && !transform.node.hasChangedFlags) {
            res = transform.world;
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

interface IJointInfo {
    index: number;
    bound: aabb;
    target: Node;
    bindpose: Mat4;
    transform: IJointTransform;
}

const v3_min = new Vec3();
const v3_max = new Vec3();
const v3_1 = new Vec3();
const v3_2 = new Vec3();
const m4_1 = new Mat4();
const ab_1 = new aabb();

/**
 * @en
 * The skinning model that is using real-time animation calculation.
 * @zh
 * 实时计算动画的蒙皮模型。
 */
export class FlexibleSkinningModel extends Model {

    private _buffer: GFXBuffer | null = null;
    private _data: Float32Array = new Float32Array(UBOSkinningFlexible.COUNT);

    private _joints: IJointInfo[] = [];

    constructor () {
        super();
        this._type = 'flexible-skinning';
    }

    public destroy () {
        super.destroy();
        this.bindSkeleton();
        if (this._buffer) {
            this._buffer.destroy();
            this._buffer = null;
        }
    }

    public bindSkeleton (skeleton: Skeleton | null = null, skinningRoot: Node | null = null, mesh: Mesh | null = null) {
        for (let i = 0; i < this._joints.length; i++) {
            deleteTransform(this._joints[i].target);
        }
        this._joints.length = 0;
        if (!skeleton || !skinningRoot || !mesh) { return; }
        this._transform = skinningRoot;
        const dataPoolManager: DataPoolManager = cc.director.root.dataPoolManager;
        const boneSpaceBounds = dataPoolManager.boneSpaceBoundsInfo.get(mesh, skeleton);
        for (let index = 0; index < skeleton.joints.length; index++) {
            const bound = boneSpaceBounds[index];
            const target = skinningRoot.getChildByPath(skeleton.joints[index]);
            if (!bound || !target) { continue; }
            const transform = getTransform(target, skinningRoot)!;
            const bindpose = skeleton.bindposes[index];
            this._joints.push({ index, bound, target, bindpose, transform });
        }
        if (!this._buffer) { // create buffer here so re-init after destroy could work
            this._buffer = this._device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: UBOSkinningFlexible.SIZE,
                stride: UBOSkinningFlexible.SIZE,
            });
        }
    }

    public updateTransform () {
        const root = this._transform!;
        // @ts-ignore TS2445
        if (root.hasChangedFlags || root._dirtyFlags) {
            root.updateWorldTransform();
            this._transformUpdated = true;
        }
        // update bounds
        const stamp = cc.director.getTotalFrames();
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

    public updateUBOs () {
        if (!super.updateUBOs() || !this._buffer) { return false; }
        for (let i = 0; i < this._joints.length; i++) {
            const { index, transform, bindpose } = this._joints[i];
            Mat4.multiply(m4_1, transform.world, bindpose);
            uploadJointData(this._data, index * 12, m4_1, i === 0);
        }
        this._buffer.update(this._data);
        return true;
    }

    protected createPipelineState (pass: Pass) {
        const pso = super.createPipelineState(pass);
        const bindingLayout = pso.pipelineLayout.layouts[0];
        if (this._buffer) {
            bindingLayout.bindBuffer(UBOSkinningFlexible.BLOCK.binding, this._buffer);
        }
        return pso;
    }
}
