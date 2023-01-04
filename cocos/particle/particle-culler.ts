/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { Node } from '../core/scene-graph/node';
import { TransformBit } from '../core/scene-graph/node-enum';
import { RenderMode, Space } from './enum';
import { approx, EPSILON, Mat4, pseudoRandom, Quat, randomRangeInt, Vec3, Vec4 } from '../core';
import { INT_MAX } from '../core/math/bits';
import { particleEmitZAxis } from './particle-general-function';
import { Mesh } from '../3d';
import { AABB } from '../core/geometry';
import type { ParticleSystem } from './particle-system';

const _node_mat = new Mat4();
const _node_parent_inv = new Mat4();
const _node_rol = new Quat();
const _node_scale = new Vec3();

const _anim_module = [
    '_colorOverLifetimeModule',
    '_sizeOvertimeModule',
    '_velocityOvertimeModule',
    '_forceOvertimeModule',
    '_limitVelocityOvertimeModule',
    '_rotationOvertimeModule',
    '_textureAnimationModule',
];

export class ParticleCuller {
    private _particleSystem: ParticleSystem;

    public minPos: Vec3 = new Vec3();
    public maxPos: Vec3 = new Vec3();

    private _nodePos: Vec3 = new Vec3();
    private _nodeSize: Vec3 = new Vec3();

    constructor (ps) {
        this._particleSystem = ps;
    }

    private _updateBoundingNode () {
        this._nodeSize.set(this.maxPos.x - this.minPos.x, this.maxPos.y - this.minPos.y, this.maxPos.z - this.minPos.z);
        this._nodePos.set(this.minPos.x + this._nodeSize.x * 0.5, this.minPos.y + this._nodeSize.y * 0.5, this.minPos.z + this._nodeSize.z * 0.5);
    }

    public setBoundingBoxSize (halfExt: Vec3) {
        this.maxPos.x = this._nodePos.x + halfExt.x;
        this.maxPos.y = this._nodePos.y + halfExt.y;
        this.maxPos.z = this._nodePos.z + halfExt.z;
        this.minPos.x = this._nodePos.x - halfExt.x;
        this.minPos.y = this._nodePos.y - halfExt.y;
        this.minPos.z = this._nodePos.z - halfExt.z;
        this._updateBoundingNode();
    }

    public setBoundingBoxCenter (px: number, py: number, pz: number) {
        this.maxPos.x = px + this._nodeSize.x * 0.5;
        this.maxPos.y = py + this._nodeSize.y * 0.5;
        this.maxPos.z = pz + this._nodeSize.z * 0.5;
        this.minPos.x = px - this._nodeSize.x * 0.5;
        this.minPos.y = py - this._nodeSize.y * 0.5;
        this.minPos.z = pz - this._nodeSize.z * 0.5;
        this._updateBoundingNode();
    }

    private _calculateBounding (isInit: boolean) {
        const size: Vec3 = new Vec3();
        const position: Vec3 = new Vec3();
        const subPos: Vec3 = new Vec3();
        const addPos: Vec3 = new Vec3();

        const meshSize: Vec3 = new Vec3(1.0, 1.0, 1.0);
        // if (this._processor.getInfo()!.renderMode === RenderMode.Mesh) {
        //     const mesh: Mesh | null = this._processor.getInfo().mesh;
        //     if (mesh && mesh.struct.minPosition && mesh.struct.maxPosition) {
        //         const meshAABB: AABB = new AABB();
        //         AABB.fromPoints(meshAABB, mesh.struct.minPosition, mesh.struct.maxPosition);
        //         const meshMax = Math.max(meshAABB.halfExtents.x, meshAABB.halfExtents.y, meshAABB.halfExtents.z);
        //         meshSize.set(meshMax, meshMax, meshMax);
        //     }
        // }

        // const worldMat = this._particleSystem.node.worldMatrix;
        // for (let i = 0; i < this._particlesAll.length; ++i) {
        //     const p: Particle = this._particlesAll[i];
        //     Vec3.multiply(size, _node_scale, p.size);
        //     Vec3.multiply(size, size, meshSize);
        //     position.set(p.position);
        //     if (this._particleSystem.simulationSpace !== Space.World) {
        //         Vec3.transformMat4(position, position, worldMat);
        //     }
        //     if (isInit && i === 0) {
        //         Vec3.subtract(this.minPos, position, size);
        //         Vec3.add(this.maxPos, position, size);
        //     } else {
        //         Vec3.subtract(subPos, position, size);
        //         Vec3.add(addPos, position, size);
        //         Vec3.min(this.minPos, this.minPos, subPos);
        //         Vec3.max(this.maxPos, this.maxPos, addPos);
        //     }
        // }
    }

    public calculatePositions () {
        const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
        this._calculateBounding(true);
        this._calculateBounding(false);
        this._updateBoundingNode();
    }

    public clear () {
    }

    public destroy () {

    }
}
