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
import { AnimationClip } from '../../animation/animation-clip';
import { SkelAnimDataHub } from '../../animation/skeletal-animation-data-hub';
import { getWorldTransformUntilRoot } from '../../animation/transform-utils';
import { Mesh } from '../../assets/mesh';
import { Skeleton } from '../../assets/skeleton';
import { aabb } from '../../geometry';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXAddress, GFXBufferUsageBit, GFXFilter, GFXFormat, GFXFormatInfos, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXDevice, GFXFeature } from '../../gfx/device';
import { Mat4, Quat, Vec3 } from '../../math';
import { UBOSkinningAnimation } from '../../pipeline/define';
import { Node } from '../../scene-graph';
import { genSamplerHash } from '../core/sampler-lib';
import { ITextureBufferHandle, TextureBufferPool } from '../core/texture-buffer-pool';

// change here and cc-skinning.chunk to use other skinning algorithms
export const uploadJointData = uploadJointDataLBS;
export const MINIMUM_JOINT_TEXTURE_SIZE = EDITOR ? 2040 : 480; // have to be multiples of 12

export function selectJointsMediumFormat (device: GFXDevice): GFXFormat {
    if (device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
        return GFXFormat.RGBA32F;
    } else {
        return GFXFormat.RGBA8;
    }
}

// negative zeros cannot be decoded correctly at GLSL 100 minimum highp float precision, 1/1024
// and it has a significant impact on the final transformation
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

const dq_0 = new Quat();
const dq_1 = new Quat();
const v3_1 = new Vec3();
const qt_1 = new Quat();
const v3_2 = new Vec3();

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
    const formatScale = 4 / Math.sqrt(formatSize);
    return Math.ceil(Math.max(MINIMUM_JOINT_TEXTURE_SIZE * formatScale, targetLength) / 12) * 12;
}

export const jointTextureSamplerHash = genSamplerHash([
    GFXFilter.POINT,
    GFXFilter.POINT,
    GFXFilter.NONE,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
]);

interface IInternalJointAnimInfo {
    downstream?: Mat4; // downstream default pose, if present
    curveData?: Mat4[]; // the nearest animation curve, if present
    bindposeIdx: number; // index of the actual bindpose to use
    bindposeCorrection?: Mat4; // correction factor from the original bindpose
}

export interface IJointTextureHandle {
    pixelOffset: number;
    refCount: number;
    clipHash: number;
    skeletonHash: number;
    readyToBeDeleted: boolean;
    handle: ITextureBufferHandle;
    bounds: Map<number, aabb[]>;
    animInfos?: IInternalJointAnimInfo[];
}

const v3_3 = new Vec3();
const v3_4 = new Vec3();
const v3_min = new Vec3();
const v3_max = new Vec3();
const m4_1 = new Mat4();
const m4_2 = new Mat4();
const ab_1 = new aabb();

export interface IChunkContent {
    skeleton: number;
    clips: number[];
}
export interface ICustomJointTextureLayout {
    textureLength: number;
    contents: IChunkContent[];
}

// Have to use some big number to replace the actual 'Infinity'.
// For (Infinity - Infinity) evaluates to NaN
const Inf = Number.MAX_SAFE_INTEGER;

export class JointTexturePool {

    private _device: GFXDevice;
    private _pool: TextureBufferPool;
    private _textureBuffers = new Map<number, IJointTextureHandle>(); // per skeleton per clip
    private _formatSize: number;
    private _pixelsPerJoint: number;

    private _customPool: TextureBufferPool;
    private _chunkIdxMap = new Map<number, number>(); // hash -> chunkIdx

    get pixelsPerJoint () {
        return this._pixelsPerJoint;
    }

    constructor (device: GFXDevice) {
        this._device = device;
        const format = selectJointsMediumFormat(this._device);
        this._formatSize = GFXFormatInfos[format].size;
        this._pixelsPerJoint = 48 / this._formatSize;
        this._pool = new TextureBufferPool(device);
        this._pool.initialize({ format, roundUpFn: roundUpTextureSize });
        this._customPool = new TextureBufferPool(device);
        this._customPool.initialize({ format, roundUpFn: roundUpTextureSize });
    }

    public clear () {
        this._pool.destroy();
        this._textureBuffers.clear();
    }

    public registerCustomTextureLayouts (layouts: ICustomJointTextureLayout[]) {
        for (let i = 0; i < layouts.length; i++) {
            const layout = layouts[i];
            const chunkIdx = this._customPool.createChunk(layout.textureLength);
            for (let j = 0; j < layout.contents.length; j++) {
                const content = layout.contents[j];
                const skeleton = content.skeleton;
                this._chunkIdxMap.set(skeleton, chunkIdx); // include default pose too
                for (let k = 0; k < content.clips.length; k++) {
                    const clip = content.clips[k];
                    this._chunkIdxMap.set(skeleton ^ clip, chunkIdx);
                }
            }
        }
    }

    /**
     * @en
     * Get joint texture for the default pose.
     * @zh
     * 获取默认姿势的骨骼贴图。
     */
    public getDefaultPoseTexture (skeleton: Skeleton, mesh: Mesh, skinningRoot: Node) {
        const hash = skeleton.hash ^ 0; // may not equal to skeleton.hash
        let texture: IJointTextureHandle | null = this._textureBuffers.get(hash) || null;
        if (texture && texture.bounds.has(mesh.hash)) { texture.refCount++; return texture; }
        const { joints, bindposes } = skeleton;
        let textureBuffer: Float32Array = null!; let buildTexture = false;
        const jointCount = joints.length;
        if (!texture) {
            const bufSize = jointCount * 12;
            const customChunkIdx = this._chunkIdxMap.get(hash);
            const handle = customChunkIdx !== undefined ?
                this._customPool.alloc(bufSize * Float32Array.BYTES_PER_ELEMENT, customChunkIdx) :
                this._pool.alloc(bufSize * Float32Array.BYTES_PER_ELEMENT);
            if (!handle) { return texture; }
            texture = { pixelOffset: handle.start / this._formatSize, refCount: 1, bounds: new Map(),
                skeletonHash: skeleton.hash, clipHash: 0, readyToBeDeleted: false, handle };
            textureBuffer = new Float32Array(bufSize); buildTexture = true;
        } else { texture.refCount++; }
        Vec3.set(v3_min,  Inf,  Inf,  Inf);
        Vec3.set(v3_max, -Inf, -Inf, -Inf);
        const boneSpaceBounds = mesh.getBoneSpaceBounds(skeleton);
        for (let j = 0, offset = 0; j < jointCount; j++, offset += 12) {
            const node = skinningRoot.getChildByPath(joints[j]);
            const mat = node ? getWorldTransformUntilRoot(node, skinningRoot, m4_1) : skeleton.inverseBindposes[j];
            const bound = boneSpaceBounds[j];
            if (bound) {
                aabb.transform(ab_1, bound, mat);
                ab_1.getBoundary(v3_3, v3_4);
                Vec3.min(v3_min, v3_min, v3_3);
                Vec3.max(v3_max, v3_max, v3_4);
            }
            if (buildTexture) {
                if (node) { Mat4.multiply(mat, mat, bindposes[j]); }
                uploadJointData(textureBuffer, offset, node ? mat : Mat4.IDENTITY, j === 0);
            }
        }
        const bounds = [new aabb()]; texture.bounds.set(mesh.hash, bounds);
        aabb.fromPoints(bounds[0], v3_min, v3_max);
        if (buildTexture) {
            this._pool.update(texture.handle, textureBuffer.buffer);
            this._textureBuffers.set(hash, texture);
        }
        return texture;
    }

    /**
     * @en
     * Get joint texture for the specified animation clip.
     * @zh
     * 获取指定动画片段的骨骼贴图。
     */
    public getSequencePoseTexture (skeleton: Skeleton, clip: AnimationClip, mesh: Mesh, skinningRoot: Node) {
        const hash = skeleton.hash ^ clip.hash;
        let texture: IJointTextureHandle | null = this._textureBuffers.get(hash) || null;
        if (texture && texture.bounds.has(mesh.hash)) { texture.refCount++; return texture; }
        const { joints, bindposes } = skeleton;
        const clipData = SkelAnimDataHub.getOrExtract(clip);
        const frames = clipData.info.frames;
        let textureBuffer: Float32Array = null!; let buildTexture = false;
        const jointCount = joints.length;
        if (!texture) {
            const bufSize = jointCount * 12 * frames;
            const customChunkIdx = this._chunkIdxMap.get(hash);
            const handle = customChunkIdx !== undefined ?
                this._customPool.alloc(bufSize * Float32Array.BYTES_PER_ELEMENT, customChunkIdx) :
                this._pool.alloc(bufSize * Float32Array.BYTES_PER_ELEMENT);
            if (!handle) { return null; }
            const animInfos = this._createAnimInfos(skeleton, clip, skinningRoot);
            texture = { pixelOffset: handle.start / this._formatSize, refCount: 1, bounds: new Map(),
                skeletonHash: skeleton.hash, clipHash: clip.hash, readyToBeDeleted: false, handle, animInfos };
            textureBuffer = new Float32Array(bufSize); buildTexture = true;
        } else { texture.refCount++; }
        const boneSpaceBounds = mesh.getBoneSpaceBounds(skeleton);
        const bounds: aabb[] = []; texture.bounds.set(mesh.hash, bounds);
        for (let f = 0; f < frames; f++) {
            bounds.push(new aabb(Inf, Inf, Inf, -Inf, -Inf, -Inf));
        }
        for (let f = 0, offset = 0; f < frames; f++) {
            const bound = bounds[f];
            for (let j = 0; j < jointCount; j++, offset += 12) {
                const { curveData, downstream, bindposeIdx, bindposeCorrection } = texture.animInfos![j];
                let mat: Mat4; let transformValid = true;
                if (curveData && downstream) { // curve & static two-way combination
                    mat = Mat4.multiply(m4_1, curveData[f], downstream);
                } else if (curveData) { // there is a curve directly controlling the joint
                    mat = curveData[f];
                } else if (downstream) { // fallback to default pose if no animation curve can be found upstream
                    mat = downstream;
                } else { // bottom line: render the original mesh as-is
                    mat = skeleton.inverseBindposes[bindposeIdx];
                    transformValid = false;
                }
                const boneSpaceBound = boneSpaceBounds[j];
                if (boneSpaceBound) {
                    const transform = bindposeCorrection ? Mat4.multiply(m4_2, mat, bindposeCorrection) : mat;
                    aabb.transform(ab_1, boneSpaceBound, transform);
                    ab_1.getBoundary(v3_3, v3_4);
                    Vec3.min(bound.center, bound.center, v3_3);
                    Vec3.max(bound.halfExtents, bound.halfExtents, v3_4);
                }
                if (buildTexture) {
                    if (transformValid) { Mat4.multiply(m4_1, mat, bindposes[bindposeIdx]); }
                    uploadJointData(textureBuffer, offset, transformValid ? m4_1 : Mat4.IDENTITY, j === 0);
                }
            }
            aabb.fromPoints(bound, bound.center, bound.halfExtents);
        }
        if (buildTexture) {
            this._pool.update(texture.handle, textureBuffer.buffer);
            this._textureBuffers.set(hash, texture);
        }
        return texture;
    }

    public releaseHandle (handle: IJointTextureHandle) {
        if (handle.refCount > 0) { handle.refCount--; }
        if (!handle.refCount && handle.readyToBeDeleted) {
            const hash = handle.skeletonHash ^ handle.clipHash;
            const customChunkIdx = this._chunkIdxMap.get(hash);
            (customChunkIdx !== undefined ? this._customPool : this._pool).free(handle.handle);
            if (this._textureBuffers.get(hash) === handle) {
                this._textureBuffers.delete(hash);
            }
        }
    }

    public releaseSkeleton (skeleton: Skeleton) {
        const it = this._textureBuffers.values();
        let res = it.next();
        while (!res.done) {
            const handle = res.value;
            if (handle.skeletonHash === skeleton.hash) {
                handle.readyToBeDeleted = true;
                if (handle.refCount) {
                    // delete handle record immediately so new allocations with the same asset could work
                    this._textureBuffers.delete(handle.skeletonHash ^ handle.clipHash);
                } else {
                    this.releaseHandle(handle);
                }
            }
            res = it.next();
        }
    }

    public releaseAnimationClip (clip: AnimationClip) {
        const it = this._textureBuffers.values();
        let res = it.next();
        while (!res.done) {
            const handle = res.value;
            if (handle.clipHash === clip.hash) {
                handle.readyToBeDeleted = true;
                if (handle.refCount) {
                    // delete handle record immediately so new allocations with the same asset could work
                    this._textureBuffers.delete(handle.skeletonHash ^ handle.clipHash);
                } else {
                    this.releaseHandle(handle);
                }
            }
            res = it.next();
        }
    }

    private _createAnimInfos (skeleton: Skeleton, clip: AnimationClip, skinningRoot: Node) {
        const animInfos: IInternalJointAnimInfo[] = [];
        const { joints, bindposes } = skeleton;
        const jointCount = joints.length;
        const clipData = SkelAnimDataHub.getOrExtract(clip);
        for (let j = 0; j < jointCount; j++) {
            let animPath = joints[j];
            let source = clipData.data[animPath];
            let animNode = skinningRoot.getChildByPath(animPath);
            let downstream: Mat4 | undefined;
            let correctionPath: string | undefined;
            while (!source) {
                const idx = animPath.lastIndexOf('/');
                animPath = animPath.substring(0, idx);
                source = clipData.data[animPath];
                if (animNode) {
                    if (!downstream) { downstream = new Mat4(); }
                    Mat4.fromRTS(m4_1, animNode.rotation, animNode.position, animNode.scale);
                    Mat4.multiply(downstream, m4_1, downstream);
                    animNode = animNode.parent;
                } else { // record the nearest curve path if no downstream pose is present
                    correctionPath = animPath;
                }
                if (idx < 0) { break; }
            }
            // the default behavior, just use the bindpose for current joint directly
            let bindposeIdx = j;
            let bindposeCorrection: Mat4 | undefined;
            /**
             * It is regularly observed that developers may choose to delete the whole
             * skeleton node tree for skinning models that only use baked animations,
             * to reduce prefab file size.
             *
             * This becomes troublesome in some cases during baking though, e.g. when a
             * skeleton joint node is not directly controlled by any animation curve,
             * but its parent nodes are. Due to lack of proper downstream default pose,
             * the joint transform can not be calculated accurately.
             *
             * We address this issue by employing some pragmatic approximation.
             * Specifically, by multiplying the bindpose of the joint corresponding to
             * the nearest curve, instead of the actual target joint. This effectively
             * merges the skinning influence of the 'incomplete' joint into its nearest
             * parent with accurate transform data.
             * It gives more visually-plausible results compared to the naive approach
             * for most cases we've covered.
             */
            if (correctionPath !== undefined && source) {
                // just use the previous joint if the exact path is not found
                bindposeIdx = j - 1;
                for (let t = 0; t < jointCount; t++) {
                    if (joints[t] === correctionPath) {
                        bindposeIdx = t;
                        bindposeCorrection = new Mat4();
                        Mat4.multiply(bindposeCorrection, bindposes[t], skeleton.inverseBindposes[j]);
                        break;
                    }
                }
            }
            animInfos.push({ curveData: source && source.worldMatrix.values as Mat4[], downstream, bindposeIdx, bindposeCorrection });
        }
        return animInfos;
    }
}

export interface IAnimInfo {
    buffer: GFXBuffer;
    data: Float32Array;
    dirty: boolean;
}

export class JointAnimationInfo {
    private _pool = new Map<string, IAnimInfo>(); // per node
    private _device: GFXDevice;

    constructor (device: GFXDevice) {
        this._device = device;
    }

    public getData (nodeID = '-1') {
        const res = this._pool.get(nodeID);
        if (res) { return res; }
        const buffer = this._device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: UBOSkinningAnimation.SIZE,
            stride: UBOSkinningAnimation.SIZE,
        });
        const data = new Float32Array([0, 0, 0, 0]);
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

    public switchClip (info: IAnimInfo, clip: AnimationClip | null) {
        info.data[0] = 0;
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
