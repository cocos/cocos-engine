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
 * @category asset
 */

import { SkeletalAnimationClip } from '../../animation/skeletal-animation-clip';
import { Asset } from '../../assets/asset';
import { Filter, PixelFormat, WrapMode } from '../../assets/asset-enum';
import { Texture2D } from '../../assets/texture-2d';
import { ccclass, property } from '../../core/data/class-decorator';
import { CCString } from '../../core/data/utils/attribute';
import { Mat4, Quat, Vec3 } from '../../core/value-types';
import { mat4, quat, vec3 } from '../../core/vmath';
import { GFXFormatInfos } from '../../gfx/define';
import { GFXDevice, GFXFeature } from '../../gfx/device';

export function selectJointsMediumType (device: GFXDevice): JointsMediumType {
    if (device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
        return JointsMediumType.RGBA32F;
    } else {
        return JointsMediumType.RGBA8;
    }
}

export interface IBindTRS {
    position: Vec3;
    rotation: Quat;
    scale: Vec3;
}

export enum JointsMediumType {
    NONE, // for non-skinning models only
    RGBA8,
    RGBA32F,
}

const dq_0 = new Quat();
const dq_1 = new Quat();
const m4_1 = new Mat4();

// Linear Blending Skinning
function uploadJointDataLBS (out: Float32Array, base: number, pos: Vec3, rot: Quat, scale: Vec3, firstBone: boolean) {
    mat4.fromRTS(m4_1, rot, pos, scale);
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
    if (firstBone) { quat.copy(dq_0, rot); }
    else if (quat.dot(dq_0, rot) < 0) { quat.scale(rot, rot, -1); }
    // conversion
    quat.set(dq_1, pos.x, pos.y, pos.z, 0);
    quat.scale(dq_1, quat.multiply(dq_1, dq_1, rot), 0.5);
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

const _jointsFormat = {
    [JointsMediumType.RGBA8]: PixelFormat.RGBA8888,
    [JointsMediumType.RGBA32F]: PixelFormat.RGBA32F,
};

const v3_1 = new Vec3();
const qt_1 = new Quat();
const v3_2 = new Vec3();

// change here and cc-skinning.inc to use other skinning algorithms
const uploadJointData = uploadJointDataDQS;
let defaultJointsTexture: Texture2D | null = null;

/**
 * 骨骼资源。
 * 骨骼资源记录了每个关节（相对于`SkinningModelComponent.skinningRoot`）的路径以及它的绑定姿势矩阵。
 */
@ccclass('cc.Skeleton')
export class Skeleton extends Asset {

    /**
     * 获取默认骨骼贴图
     */
    public static getDefaultJointsTexture (device: GFXDevice) {
        if (defaultJointsTexture) { return defaultJointsTexture; }
        defaultJointsTexture = new Texture2D();
        defaultJointsTexture.setFilters(Filter.NEAREST, Filter.NEAREST);
        defaultJointsTexture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
        const type = selectJointsMediumType(device);
        const format = _jointsFormat[type];
        const width = Math.ceil(12 * 4 / GFXFormatInfos[format].size);
        defaultJointsTexture.reset({ width, height: 1, format });
        vec3.set(v3_1, 0, 0, 0);
        quat.set(qt_1, 0, 0, 0, 1);
        vec3.set(v3_2, 1, 1, 1);
        const textureBuffer = new Float32Array(width * 4);
        uploadJointData(textureBuffer, 0, v3_1, qt_1, v3_2, true);
        defaultJointsTexture.uploadData(textureBuffer.buffer);
        return defaultJointsTexture;
    }

    @property([CCString])
    private _joints: string[] = [];

    @property([Mat4])
    private _bindposes: Mat4[] = [];

    private _bindTRS: IBindTRS[] = [];
    private _jointsTextures = new Map<SkeletalAnimationClip | null, Texture2D>();

    /**
     * 所有关节的绑定姿势矩阵。该数组的长度始终与 `this.joints` 的长度相同。
     */
    get bindposes () {
        return this._bindposes;
    }

    set bindposes (value) {
        this._bindposes = value;
        this._bindTRS = value.map((m) => {
            const position = new Vec3();
            const rotation = new Quat();
            const scale = new Vec3();
            mat4.toRTS(m, rotation, position, scale);
            return { position, rotation, scale };
        });
    }

    get bindTRS () {
        return this._bindTRS;
    }

    /**
     * 所有关节的路径。该数组的长度始终与 `this.bindposes` 的长度相同。
     */
    get joints () {
        return this._joints;
    }

    set joints (value) {
        this._joints = value;
    }

    public onLoaded () {
        this.bindposes = this._bindposes;
    }

    public destroy () {
        const it = this._jointsTextures.values();
        for (let res = it.next(); !res.done; res = it.next()) {
            res.value.destroy();
        }
        this._jointsTextures.clear();
        return super.destroy();
    }

    /**
     * 获取指定动画片段的骨骼贴图
     */
    public getJointsTextureWithClip (device: GFXDevice, clip: SkeletalAnimationClip) {
        let texture = this._jointsTextures.get(clip);
        if (texture) { return texture; }
        texture = new Texture2D();
        texture.setFilters(Filter.NEAREST, Filter.NEAREST);
        texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
        const frames = Math.ceil(clip.duration * clip.sample);
        const type = selectJointsMediumType(device);
        const format = _jointsFormat[type];
        const width = Math.ceil(12 * 4 / GFXFormatInfos[format].size) * frames;
        const height = this.joints.length;
        texture.reset({ width, height, format });
        const textureBuffer = new Float32Array(width * height * 4);
        const data = clip.convertedData;
        for (let i = 0; i < this.joints.length; i++) {
            const nodeData = data[this.joints[i]];
            if (!nodeData || !nodeData.props) { continue; }
            const bindpose = this.bindTRS[i];
            const position = nodeData.props.position.values;
            const rotation = nodeData.props.rotation.values;
            const scale = nodeData.props.scale.values;
            for (let frame = 0; frame < position.length; frame++) {
                const T = position[frame];
                const R = rotation[frame];
                const S = scale[frame];
                vec3.multiply(v3_1, bindpose.position, S);
                vec3.transformQuat(v3_1, v3_1, R);
                vec3.add(v3_1, v3_1, T);
                quat.multiply(qt_1, R, bindpose.rotation);
                vec3.multiply(v3_2, S, bindpose.scale);
                uploadJointData(textureBuffer, 12 * (frames * i + frame), v3_1, qt_1, v3_2, i === 0);
            }
        }
        texture.uploadData(textureBuffer.buffer);
        this._jointsTextures.set(clip, texture);
        return texture;
    }
}

cc.Skeleton = Skeleton;
