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

import { AnimationClip } from '../../animation/animation-clip';
import { SkelAnimDataHub } from '../../animation/skeletal-animation-data-hub';
import { Mesh } from '../../assets/mesh';
import { Skeleton } from '../../assets/skeleton';
import { aabb } from '../../geom-utils';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXAddress, GFXAttributeName, GFXBufferUsageBit, GFXFilter, GFXFormat, GFXFormatInfos, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXDevice, GFXFeature } from '../../gfx/device';
import { Mat4, Quat, Vec3 } from '../../math';
import { UBOSkinningAnimation } from '../../pipeline/define';
import { genSamplerHash } from '../core/sampler-lib';
import { ITextureBufferHandle, nearestPOT, TextureBufferPool } from '../core/texture-buffer-pool';

// change here and cc-skinning.chunk to use other skinning algorithms
const uploadJointData = uploadJointDataLBS;

export enum JointsMediumType {
    NONE, // for non-skinning models only
    RGBA8,
    RGBA32F,
}

export function selectJointsMediumType (device: GFXDevice) {
    if (device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
        return JointsMediumType.RGBA32F;
    } else {
        return JointsMediumType.RGBA8;
    }
}

const m4_1 = new Mat4();
const dq_0 = new Quat();
const dq_1 = new Quat();
const v3_1 = new Vec3();
const qt_1 = new Quat();
const v3_2 = new Vec3();

// negative zeros cannot be decoded correctly at GLSL 100 minimum highp float precision, 1/1024
// and it has a significant effect on the final transformation
function makeStable (n: number) { return n ? n : 0; }

// Linear Blending Skinning
function uploadJointDataLBS (out: Float32Array, base: number, mat: Mat4, firstBone: boolean) {
    out[base + 0] = makeStable(mat.m00);
    out[base + 1] = makeStable(mat.m01);
    out[base + 2] = makeStable(mat.m02);
    out[base + 3] = makeStable(mat.m12);
    out[base + 4] = makeStable(mat.m04);
    out[base + 5] = makeStable(mat.m05);
    out[base + 6] = makeStable(mat.m06);
    out[base + 7] = makeStable(mat.m13);
    out[base + 8] = makeStable(mat.m08);
    out[base + 9] = makeStable(mat.m09);
    out[base + 10] = makeStable(mat.m10);
    out[base + 11] = makeStable(mat.m14);
}

// Dual Quaternion Skinning
function uploadJointDataDQS (out: Float32Array, base: number, mat: Mat4, firstBone: boolean) {
    Mat4.toRTS(mat, qt_1, v3_1, v3_2);
    // sign consistency
    if (firstBone) { Quat.copy(dq_0, qt_1); }
    else if (Quat.dot(dq_0, qt_1) < 0) { Quat.multiplyScalar(qt_1, qt_1, -1); }
    // conversion
    Quat.set(dq_1, v3_1.x, v3_1.y, v3_1.z, 0);
    Quat.multiplyScalar(dq_1, Quat.multiply(dq_1, dq_1, qt_1), 0.5);
    // upload
    out[base + 0] = makeStable(qt_1.x);
    out[base + 1] = makeStable(qt_1.y);
    out[base + 2] = makeStable(qt_1.z);
    out[base + 3] = makeStable(qt_1.w);
    out[base + 4] = makeStable(dq_1.x);
    out[base + 5] = makeStable(dq_1.y);
    out[base + 6] = makeStable(dq_1.z);
    out[base + 7] = makeStable(dq_1.w);
    out[base + 8] = makeStable(v3_2.x);
    out[base + 9] = makeStable(v3_2.y);
    out[base + 10] = makeStable(v3_2.z);
}

function roundUpTextureSize (targetLength: number, formatSize: number) {
    const minSize = 480; // have to be multiples of 12
    const formatScale = 4 / Math.sqrt(formatSize);
    return Math.ceil(Math.max(minSize * formatScale, targetLength) / 12) * 12;
}

const _jointsFormat = {
    [JointsMediumType.RGBA8]: GFXFormat.RGBA8,
    [JointsMediumType.RGBA32F]: GFXFormat.RGBA32F,
};

export const jointsTextureSamplerHash = genSamplerHash([
    GFXFilter.POINT,
    GFXFilter.POINT,
    GFXFilter.NONE,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
]);

export interface IJointsTextureHandle {
    pixelOffset: number;
    refCount: number;
    clipHash: number;
    skeletonHash: number;
    readyToBeDeleted: boolean;
    handle: ITextureBufferHandle;
}

export class JointsTexturePool {

    private _device: GFXDevice;
    private _pool: TextureBufferPool;
    private _textureBuffers: Map<number, IJointsTextureHandle> = new Map(); // per skeleton per clip
    private _identityBuffer: IJointsTextureHandle | null;
    private _maxIdentityJoints = 64;
    private _formatSize = 0;

    constructor (device: GFXDevice, maxChunks = 8) {
        this._device = device;
        this._pool = new TextureBufferPool(device);
        const format = _jointsFormat[selectJointsMediumType(this._device)];
        this._formatSize = GFXFormatInfos[format].size;
        const scale = 16 / this._formatSize;
        this._pool.initialize({
            format,
            maxChunks: maxChunks * scale,
            roundUpFn: roundUpTextureSize,
        });
        this._identityBuffer = this._allocIdentityBuffer();
    }

    public clear () {
        this._pool.destroy();
        this._textureBuffers.clear();
        this._identityBuffer = null;
    }

    /**
     * 获取默认骨骼贴图
     */
    public getDefaultJointsTexture (skeleton?: Skeleton) {
        const len = skeleton && skeleton.joints.length || 1;
        if (len > this._maxIdentityJoints) {
            if (this._identityBuffer) {
                this._identityBuffer.readyToBeDeleted = true;
                this.releaseHandle(this._identityBuffer, false);
            }
            this._maxIdentityJoints = nearestPOT(len);
            this._identityBuffer = this._allocIdentityBuffer();
        }
        if (!this._identityBuffer) { return null; }
        this._identityBuffer.refCount++;
        return this._identityBuffer;
    }

    /**
     * 获取指定动画片段的骨骼贴图
     */
    public getJointsTextureWithAnimation (skeleton: Skeleton, clip: AnimationClip) {
        const hash = skeleton.hash ^ clip.hash;
        let texture: IJointsTextureHandle | null = this._textureBuffers.get(hash) || null;
        if (texture) { texture.refCount++; return texture; }
        const clipData = SkelAnimDataHub.getOrExtract(clip);
        const frames = clipData.info.frames;
        const bufSize = skeleton.joints.length * 12 * frames;
        const handle = this._pool.alloc(bufSize * Float32Array.BYTES_PER_ELEMENT);
        if (!handle) { return null; }
        texture = { pixelOffset: handle.start / this._formatSize, refCount: 1,
            skeletonHash: skeleton.hash, clipHash: clip.hash, readyToBeDeleted: false, handle };
        const textureBuffer = new Float32Array(bufSize);
        for (let i = 0; i < skeleton.joints.length; i++) {
            const nodeData = clipData.data[skeleton.joints[i]];
            if (!nodeData) { continue; }
            const bindpose = skeleton.bindposes[i];
            const matrix = nodeData.worldMatrix.values as Mat4[];
            for (let frame = 0; frame < frames; frame++) {
                const m = matrix[frame];
                Mat4.multiply(m4_1, m, bindpose);
                uploadJointData(textureBuffer, 12 * (frames * i + frame), m4_1, i === 0);
            }
        }
        this._pool.update(handle, textureBuffer.buffer);
        this._textureBuffers.set(hash, texture);
        return texture;
    }

    public releaseHandle (handle: IJointsTextureHandle, decr = true) {
        if (decr && handle.refCount > 0) { handle.refCount--; }
        if (!handle.refCount && handle.readyToBeDeleted) {
            this._pool.free(handle.handle);
            this._textureBuffers.delete(handle.skeletonHash ^ handle.clipHash);
        }
    }

    public releaseSkeleton (skeleton: Skeleton) {
        const it = this._textureBuffers.values();
        let res = it.next();
        while (!res.done) {
            if (res.value.skeletonHash === skeleton.hash) {
                res.value.readyToBeDeleted = true;
                this.releaseHandle(res.value, false);
                // delete handle refs immediately so new allocations with the same asset could work
                this._textureBuffers.delete(res.value.skeletonHash ^ res.value.clipHash);
            }
            res = it.next();
        }
    }

    public releaseAnimationClip (clip: AnimationClip) {
        const it = this._textureBuffers.values();
        let res = it.next();
        while (!res.done) {
            if (res.value.clipHash === clip.hash) {
                res.value.readyToBeDeleted = true;
                this.releaseHandle(res.value, false);
                // delete handle refs immediately so new allocations with the same asset could work
                this._textureBuffers.delete(res.value.skeletonHash ^ res.value.clipHash);
            }
            res = it.next();
        }
    }

    private _allocIdentityBuffer (len = this._maxIdentityJoints) {
        const handle = this._pool.alloc(len * 12 * Float32Array.BYTES_PER_ELEMENT);
        if (!handle) { return null; }
        const textureBuffer = new Float32Array(len * 12);
        for (let i = 0; i < len; i++) {
            uploadJointData(textureBuffer, 12 * i, Mat4.IDENTITY, i === 0);
        }
        this._pool.update(handle, textureBuffer.buffer);
        return { pixelOffset: handle.start / this._formatSize, refCount: 0,
            skeletonHash: len, clipHash: 0, readyToBeDeleted: false, handle };
    }
}

export interface IAnimInfo {
    buffer: GFXBuffer;
    data: Float32Array;
    dirty: boolean;
}

export class JointsAnimationInfo {
    private _pool = new Map<string, IAnimInfo>(); // per node
    private _device: GFXDevice;

    constructor (device: GFXDevice) {
        this._device = device;
    }

    public create (nodeID: string) {
        const res = this._pool.get(nodeID);
        if (res) { return res; }
        const buffer = this._device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: UBOSkinningAnimation.SIZE,
            stride: UBOSkinningAnimation.SIZE,
        });
        const data = new Float32Array([1, 0, 0, 0]);
        buffer.update(data);
        const info = { buffer, data, dirty: false };
        this._pool.set(nodeID, info);
        return info;
    }

    public destroy (nodeID: string) {
        const info = this._pool.get(nodeID);
        if (!info) { return; }
        info.buffer.destroy();
        this._pool.delete(nodeID);
    }

    public get (nodeID = '-1') {
        return this._pool.get(nodeID) || this.create('-1');
    }

    public switchClip (info: IAnimInfo, clip: AnimationClip | null) {
        info.data[0] = clip ? SkelAnimDataHub.getOrExtract(clip).info.frames : 1;
        info.data[1] = 0;
        info.buffer.update(info.data);
        info.dirty = false;
        return info;
    }

    public clear () {
        for (const info of this._pool.values()) {
            info.buffer.destroy();
        }
        this._pool.clear();
    }
}

const v3_3 = new Vec3();
const v3_4 = new Vec3();
const ab_1 = new aabb();

export class AnimatedBoundsInfo {
    private _perJointBoundsPool = new Map<number, Map<number, Array<aabb | null>>>(); // per Mesh per Skeleton
    private _fullClipBoundsPool = new Map<number, Map<number, aabb[]>>(); // per Skeleton per AnimationClip

    public get (mesh: Mesh, skeleton: Skeleton, clip: AnimationClip) {
        const list: aabb[] = this._getFullClipBounds(skeleton, clip) || [];
        if (list.length) { return list; }
        let perJointBounds = this._getPerJointBounds(mesh, skeleton);
        if (!perJointBounds) {
            perJointBounds = this.getBoneSpacePerJointBounds(mesh, skeleton);
            this._setPerJointBounds(mesh, skeleton, perJointBounds);
        }
        const clipData = SkelAnimDataHub.getOrExtract(clip);
        const frames = clipData.info.frames;
        for (let fid = 0; fid < frames; fid++) {
            list.push(new aabb(Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity));
        }
        const joints = skeleton.joints;
        // per frame bounding box
        for (let i = 0; i < joints.length; i++) {
            const nodeData = clipData.data[joints[i]];
            const bound = perJointBounds[i];
            if (!bound || !nodeData) { continue; }
            const matrix = nodeData.worldMatrix.values as Mat4[];
            for (let fid = 0; fid < frames; fid++) {
                const m = matrix[fid];
                const info = list[fid];
                aabb.transform(ab_1, bound, m);
                ab_1.getBoundary(v3_3, v3_4);
                Vec3.min(info.center, info.center, v3_3);
                Vec3.max(info.halfExtents, info.halfExtents, v3_4);
            }
        }
        for (let fid = 0; fid < frames; fid++) {
            const { center, halfExtents } = list[fid];
            aabb.fromPoints(list[fid], center, halfExtents);
        }
        this._setFullClipBounds(skeleton, clip, list);
        return list;
    }

    public getBoneSpacePerJointBounds (mesh: Mesh, skeleton: Skeleton) {
        const bounds: Array<aabb | null> = [];
        const valid: boolean[] = [];
        const bindposes = skeleton.bindposes;
        for (let i = 0; i < bindposes.length; i++) {
            bounds.push(new aabb(Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity));
            valid.push(false);
        }
        for (let p = 0; p < mesh.struct.primitives.length; p++) {
            const joints = mesh.readAttribute(p, GFXAttributeName.ATTR_JOINTS);
            const weights = mesh.readAttribute(p, GFXAttributeName.ATTR_WEIGHTS);
            const positions = mesh.readAttribute(p, GFXAttributeName.ATTR_POSITION);
            if (!joints || !weights || !positions) { continue; }
            const vertCount = Math.min(joints.length / 4, weights.length / 4, positions.length / 3);
            for (let i = 0; i < vertCount; i++) {
                Vec3.set(v3_3, positions[3 * i + 0], positions[3 * i + 1], positions[3 * i + 2]);
                for (let j = 0; j < 4; ++j) {
                    const idx = 4 * i + j;
                    const joint = joints[idx];
                    if (weights[idx] === 0 || joint >= bindposes.length) { continue; }
                    Vec3.transformMat4(v3_4, v3_3, bindposes[joint]);
                    valid[joint] = true;
                    const b = bounds[joint]!;
                    Vec3.min(b.center, b.center, v3_4);
                    Vec3.max(b.halfExtents, b.halfExtents, v3_4);
                }
            }
        }
        for (let i = 0; i < bindposes.length; i++) {
            const b = bounds[i]!;
            if (!valid[i]) { bounds[i] = null; }
            else { aabb.fromPoints(b, b.center, b.halfExtents); }
        }
        return bounds;
    }

    public clear () {
        this._perJointBoundsPool.clear();
        this._fullClipBoundsPool.clear();
    }

    public releaseMesh (mesh: Mesh) {
        this._perJointBoundsPool.delete(mesh.hash);
    }

    public releaseSkeleton (skeleton: Skeleton) {
        const it = this._perJointBoundsPool.values();
        let res = it.next();
        while (!res.done) {
            res.value.delete(skeleton.hash);
            res = it.next();
        }
        this._fullClipBoundsPool.delete(skeleton.hash);
    }

    public releaseAnimationClip (clip: AnimationClip) {
        const it = this._fullClipBoundsPool.values();
        let res = it.next();
        while (!res.done) {
            res.value.delete(clip.hash);
            res = it.next();
        }
    }

    private _getPerJointBounds (mesh: Mesh, skeleton: Skeleton) {
        const m = this._perJointBoundsPool.get(mesh.hash);
        return m && m.get(skeleton.hash);
    }

    private _getFullClipBounds (skeleton: Skeleton, clip: AnimationClip) {
        const m = this._fullClipBoundsPool.get(skeleton.hash);
        return m && m.get(clip.hash);
    }

    private _setPerJointBounds (mesh: Mesh, skeleton: Skeleton, bounds: Array<aabb | null>) {
        let m = this._perJointBoundsPool.get(mesh.hash);
        if (!m) { m = new Map<number, Array<aabb | null>>(); }
        m.set(skeleton.hash, bounds);
    }

    private _setFullClipBounds (skeleton: Skeleton, clip: AnimationClip, bounds: aabb[]) {
        let m = this._fullClipBoundsPool.get(skeleton.hash);
        if (!m) { m = new Map<number, aabb[]>(); }
        m.set(clip.hash, bounds);
    }
}
