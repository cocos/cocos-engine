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
import { Skeleton } from '../../assets/skeleton';
import { GFXFormat, GFXFormatInfos } from '../../gfx/define';
import { GFXDevice, GFXFeature } from '../../gfx/device';
import { Mat4, Quat, Vec3 } from '../../math';
import { ITextureBufferHandle, TextureBufferPool } from '../core/texture-buffer-pool';

// change here and cc-skinning.inc to use other skinning algorithms
const uploadJointData = uploadJointDataDQS;

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

const id_m4 = Object.freeze(new Mat4());
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
    const minSize = 204;
    const formatScale = 4 / Math.sqrt(formatSize);
    return Math.ceil(Math.max(minSize * formatScale, targetLength) / 12) * 12;
}

const _jointsFormat = {
    [JointsMediumType.RGBA8]: GFXFormat.RGBA8,
    [JointsMediumType.RGBA32F]: GFXFormat.RGBA32F,
};

export interface IJointsTextureHandle {
    pixelOffset: number;
    refCount: number;
    hash: number;
    handle: ITextureBufferHandle;
}

export class JointsTexturePool {

    private _device: GFXDevice;
    private _pool: TextureBufferPool;
    private _textureBuffers: Map<number, IJointsTextureHandle> = new Map();
    private _formatSize = 0;

    constructor (device: GFXDevice) {
        this._device = device;
        this._pool = new TextureBufferPool(device);
    }

    public initialize (maxChunks: number = 8) {
        const format = _jointsFormat[selectJointsMediumType(this._device)];
        this._formatSize = GFXFormatInfos[format].size;
        const scale = 16 / this._formatSize;
        this._pool.initialize({
            format,
            maxChunks: maxChunks * scale,
            roundUpFn: roundUpTextureSize,
        });
    }

    public destroy () {
        this._pool.destroy();
    }

    /**
     * 获取默认骨骼贴图
     */
    public getDefaultJointsTexture (skeleton?: Skeleton) {
        const len = skeleton && skeleton.joints.length || 1;
        let texture: IJointsTextureHandle | null = this._textureBuffers.get(len) || null;
        if (texture) { texture.refCount++; return texture; }
        const handle = this._pool.alloc(len * 12 * Float32Array.BYTES_PER_ELEMENT);
        if (!handle) { return null; }
        texture = { pixelOffset: handle.start / this._formatSize, refCount: 1, hash: len, handle };
        const textureBuffer = new Float32Array(len * 12);
        for (let i = 0; i < len; i++) {
            uploadJointData(textureBuffer, 12 * i, id_m4, i === 0);
        }
        this._pool.update(handle, textureBuffer.buffer);
        this._textureBuffers.set(len, texture);
        return texture;
    }

    /**
     * 获取指定动画片段的骨骼贴图
     */
    public getJointsTextureWithAnimation (skeleton: Skeleton, clip: AnimationClip) {
        const hash = skeleton.hash ^ clip.hash;
        let texture: IJointsTextureHandle | null = this._textureBuffers.get(hash) || null;
        if (texture) { texture.refCount++; return texture; }
        const frames = clip.keys[0].length;
        const bufSize = skeleton.joints.length * 12 * frames;
        const handle = this._pool.alloc(bufSize * Float32Array.BYTES_PER_ELEMENT);
        if (!handle) { return null; }
        texture = { pixelOffset: handle.start / this._formatSize, refCount: 1, hash, handle };
        const textureBuffer = new Float32Array(bufSize);
        const data = SkelAnimDataHub.getOrExtract(clip);
        for (let i = 0; i < skeleton.joints.length; i++) {
            const nodeData = data[skeleton.joints[i]];
            if (!nodeData || !nodeData.props) { continue; }
            const bindpose = skeleton.bindposes[i];
            const matrix = nodeData.props.worldMatrix.values;
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

    public releaseTexture (texture: IJointsTextureHandle) {
        if (--texture.refCount === 0) {
            this._pool.free(texture.handle);
            this._textureBuffers.delete(texture.hash);
        }
    }
}
