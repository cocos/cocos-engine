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

import { Skeleton } from '../../3d/assets/skeleton';
import { SkeletalAnimationClip } from '../../animation';
import { Mat4, Quat, Vec3 } from '../../core/math';
import { GFXAddress, GFXFilter, GFXFormat, GFXFormatInfos } from '../../gfx/define';
import { GFXDevice, GFXFeature } from '../../gfx/device';
import { GFXSampler } from '../../gfx/sampler';
import { samplerLib } from '../core/sampler-lib';
import { genSamplerHash } from '../core/sampler-lib';
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

const dq_0 = new Quat();
const dq_1 = new Quat();
const m4_1 = new Mat4();

// Linear Blending Skinning
function uploadJointDataLBS (out: Float32Array, base: number, pos: Vec3, rot: Quat, scale: Vec3, firstBone: boolean) {
    Mat4.fromRTS(m4_1, rot, pos, scale);
    out[base + 0] = m4_1.m00;
    out[base + 1] = m4_1.m01;
    out[base + 2] = m4_1.m02;
    out[base + 3] = m4_1.m12;
    out[base + 4] = m4_1.m04;
    out[base + 5] = m4_1.m05;
    out[base + 6] = m4_1.m06;
    out[base + 7] = m4_1.m13;
    out[base + 8] = m4_1.m08;
    out[base + 9] = m4_1.m09;
    out[base + 10] = m4_1.m10;
    out[base + 11] = m4_1.m14;
}

// Dual Quaternion Skinning
function uploadJointDataDQS (out: Float32Array, base: number, pos: Vec3, rot: Quat, scale: Vec3, firstBone: boolean) {
    // sign consistency
    if (firstBone) { Quat.copy(dq_0, rot); }
    else if (Quat.dot(dq_0, rot) < 0) { Quat.multiplyScalar(rot, rot, -1); }
    // conversion
    Quat.set(dq_1, pos.x, pos.y, pos.z, 0);
    Quat.multiplyScalar(dq_1, Quat.multiply(dq_1, dq_1, rot), 0.5);
    // upload
    out[base + 0] = rot.x;
    out[base + 1] = rot.y;
    out[base + 2] = rot.z;
    out[base + 3] = rot.w;
    out[base + 4] = dq_1.x;
    out[base + 5] = dq_1.y;
    out[base + 6] = dq_1.z;
    out[base + 7] = dq_1.w;
    out[base + 8] = scale.x;
    out[base + 9] = scale.y;
    out[base + 10] = scale.z;
}

function roundUpTextureSize (targetLength: number) {
    return Math.max(180, Math.ceil(targetLength / 12) * 12);
}

const _jointsFormat = {
    [JointsMediumType.RGBA8]: GFXFormat.RGBA8,
    [JointsMediumType.RGBA32F]: GFXFormat.RGBA32F,
};

const v3_1 = new Vec3();
const qt_1 = new Quat();
const v3_2 = new Vec3();

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
        let len: number = skeleton && skeleton.joints.length || 1;
        let texture: IJointsTextureHandle | null = this._textureBuffers.get(len) || null;
        if (texture) { texture.refCount++; return texture; }
        const handle = this._pool.alloc(len * 12 * Float32Array.BYTES_PER_ELEMENT);
        if (!handle) { return null; }
        texture = { pixelOffset: handle.start / this._formatSize, refCount: 1, hash: len, handle };
        Vec3.set(v3_1, 0, 0, 0);
        Quat.set(qt_1, 0, 0, 0, 1);
        Vec3.set(v3_2, 1, 1, 1);
        const textureBuffer = new Float32Array(len * 12);
        for (let i = 0; i < len; i++) {
            uploadJointData(textureBuffer, 12 * i, v3_1, qt_1, v3_2, i === 0);
        }
        this._pool.update(handle, textureBuffer.buffer);
        this._textureBuffers.set(len, texture);
        return texture;
    }

    /**
     * 获取指定动画片段的骨骼贴图
     */
    public getJointsTextureWithAnimation (skeleton: Skeleton, clip: SkeletalAnimationClip) {
        const hash = skeleton.hash ^ clip.hash;
        let texture: IJointsTextureHandle | null = this._textureBuffers.get(hash) || null;
        if (texture) { texture.refCount++; return texture; }
        const frames = clip.keys[0].length;
        const bufSize = skeleton.joints.length * 12 * frames;
        const handle = this._pool.alloc(bufSize * Float32Array.BYTES_PER_ELEMENT);
        if (!handle) { return null; }
        texture = { pixelOffset: handle.start / this._formatSize, refCount: 1, hash, handle };
        const textureBuffer = new Float32Array(bufSize);
        const data = clip.convertedData;
        for (let i = 0; i < skeleton.joints.length; i++) {
            const nodeData = data[skeleton.joints[i]];
            if (!nodeData || !nodeData.props) { continue; }
            const bindpose = skeleton.bindTRS[i];
            const position = nodeData.props.position.values;
            const rotation = nodeData.props.rotation.values;
            const scale = nodeData.props.scale.values;
            for (let frame = 0; frame < frames; frame++) {
                const T = position[frame];
                const R = rotation[frame];
                const S = scale[frame];
                Vec3.multiply(v3_1, bindpose.position, S);
                Vec3.transformQuat(v3_1, v3_1, R);
                Vec3.add(v3_1, v3_1, T);
                Quat.multiply(qt_1, R, bindpose.rotation);
                Vec3.multiply(v3_2, S, bindpose.scale);
                uploadJointData(textureBuffer, 12 * (frames * i + frame), v3_1, qt_1, v3_2, i === 0);
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

const jointsTextureSamplerHash = genSamplerHash([
    GFXFilter.POINT,
    GFXFilter.POINT,
    GFXFilter.NONE,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
]);
let jointsTextureSampler: GFXSampler | null = null;
export function getJointsTextureSampler (device: GFXDevice) {
    if (jointsTextureSampler) { return jointsTextureSampler; }
    jointsTextureSampler = samplerLib.getSampler(device, jointsTextureSamplerHash);
    return jointsTextureSampler;
}
