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

const v3_min = new Vec3();
const v3_max = new Vec3();
const v3_1 = new Vec3();
const v3_2 = new Vec3();
const m4_1 = new Mat4();
const ab_1 = new aabb();

interface IJointTransform {
    node: Node;
    local: Mat4;
    world: Mat4;
    stamp: number;
}

class JointTransformManager {
    public static getWorldMatrix (node: Node, root: Node, stamp: number) {
        const { pool, stack } = JointTransformManager;
        let joint: IJointTransform;
        let id: string;
        let i = 0;
        let res = Mat4.IDENTITY;
        while (node !== root) {
            id = node.uuid;
            if (pool.has(id)) {
                joint = pool.get(id)!;
            } else {
                joint = { node, local: new Mat4(), world: new Mat4(), stamp: -1 };
                pool.set(id, joint);
            }
            if (joint.stamp === stamp) {
                res = joint.world;
                break;
            }
            joint.stamp = stamp;
            stack[i++] = joint;
            node = node.parent!;
        }
        while (i > 0) {
            joint = stack[--i];
            node = joint.node;
            Mat4.fromRTS(joint.local, node.rotation, node.position, node.scale);
            res = Mat4.multiply(joint.world, res, joint.local);
        }
        return res;
    }

    private static stack: IJointTransform[] = [];
    private static pool: Map<string, IJointTransform> = new Map();
}

interface IJointInfo {
    index: number;
    bound: aabb;
    target: Node;
    bindpose: Mat4;
}

/**
 * 实时动画模式的蒙皮模型
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
        this._joints.length = 0;
        if (this._buffer) {
            this._buffer.destroy();
            this._buffer = null;
        }
    }

    public bindSkeleton (skeleton: Skeleton | null, skinningRoot: Node | null, mesh: Mesh | null) {
        this._joints.length = 0;
        if (!skeleton || !skinningRoot || !mesh) { return; }
        this._transform = skinningRoot;
        const dataPoolManager: DataPoolManager = cc.director.root.dataPoolManager;
        const boneSpaceBounds = dataPoolManager.animatedBoundsInfo.getBoneSpacePerJointBounds(mesh, skeleton);
        for (let index = 0; index < skeleton.joints.length; index++) {
            const bound = boneSpaceBounds[index];
            const target = skinningRoot.getChildByPath(skeleton.joints[index]);
            if (!bound || !target) { continue; }
            const bindpose = skeleton.bindposes[index];
            this._joints.push({ index, bound, target, bindpose });
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
        Vec3.set(v3_min,  Infinity,  Infinity,  Infinity);
        Vec3.set(v3_max, -Infinity, -Infinity, -Infinity);
        const root = this._transform!;
        const stamp = cc.director.getTotalFrames();
        for (let i = 0; i < this._joints.length; i++) {
            const { index, bound, target, bindpose } = this._joints[i];
            const worldMatrix = JointTransformManager.getWorldMatrix(target, root, stamp);
            // update bounds
            aabb.transform(ab_1, bound, worldMatrix);
            ab_1.getBoundary(v3_1, v3_2);
            Vec3.min(v3_min, v3_min, v3_1);
            Vec3.max(v3_max, v3_max, v3_2);
            // upload data
            Mat4.multiply(m4_1, worldMatrix, bindpose);
            uploadJointData(this._data, index * 12, m4_1, i === 0);
        }
        // @ts-ignore TS2445
        if (root.hasChangedFlags || root._dirtyFlags) {
            root.updateWorldTransform();
            this._transformUpdated = true;
        }
        if (this._modelBounds && this._worldBounds) {
            aabb.fromPoints(this._modelBounds, v3_min, v3_max);
            // @ts-ignore TS2445
            this._modelBounds.transform(root._mat, root._pos, root._rot, root._scale, this._worldBounds);
        }
    }

    public updateUBOs () {
        if (!super.updateUBOs() || !this._buffer) { return false; }
        this._buffer.update(this._data);
        return true;
    }

    protected createPipelineState (pass: Pass) {
        if (CC_EDITOR && pass.defines.ANIMATION_BAKED) {
            console.warn(`${this._node!.name}: for real-time animation, ANIMATION_BAKED should not be defined in material`);
        }
        const pso = super.createPipelineState(pass);
        const bindingLayout = pso.pipelineLayout.layouts[0];
        if (this._buffer) {
            bindingLayout.bindBuffer(UBOSkinningFlexible.BLOCK.binding, this._buffer);
        }
        return pso;
    }
}
