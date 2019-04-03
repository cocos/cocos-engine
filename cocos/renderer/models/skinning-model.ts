// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import Skeleton from '../../3d/assets/skeleton';
import { Texture2D } from '../../assets/texture-2d';
import { Filter, PixelFormat, WrapMode } from '../../assets/texture-base';
import { mat4 } from '../../core/vmath';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXFeature } from '../../gfx/device';
import { UBOSkinning, UNIFORM_JOINTS_TEXTURE } from '../../pipeline/define';
import { Node } from '../../scene-graph/node';
import { Pass } from '../core/pass';
import { samplerLib } from '../core/sampler-lib';
import { Model } from '../scene/model';
import { RenderScene } from '../scene/render-scene';

const textureSizeBuffer = new Float32Array(4);

interface IJointTextureStorage {
    nativeData: Float32Array;
    texture: Texture2D;
}

interface IJointUniformsStorage {
    nativeData: Float32Array;
}

type JointStorage = IJointTextureStorage | IJointUniformsStorage;

function isTextureStorage (storage: JointStorage): storage is IJointTextureStorage {
    return 'texture' in storage;
}

function isUniformStorage (storage: JointStorage): storage is IJointUniformsStorage {
    return !('texture' in storage);
}

export const __FORCE_USE_UNIFORM_STORAGE__ = true;

export class SkinningModel extends Model {
    private _jointStorage: JointStorage | null = null;
    private _skinningUBO: GFXBuffer;

    constructor (scene: RenderScene, node: Node) {
        super(scene, node);
        this._type = 'skinning';
        this._skinningUBO = this._device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: UBOSkinning.SIZE,
            stride: UBOSkinning.SIZE,
        });
    }

    public bindSkeleton (skeleton: Skeleton) {
        this._destroyJointStorage();

        if (!__FORCE_USE_UNIFORM_STORAGE__ && this._device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
            const jointsTexture = _createJointsTexture(skeleton);
            textureSizeBuffer[0] = jointsTexture.width;
            this._skinningUBO.update(
            textureSizeBuffer, UBOSkinning.JOINTS_TEXTURE_SIZE_OFFSET, textureSizeBuffer.byteLength);
            this._jointStorage = {
                texture: jointsTexture,
                nativeData: new Float32Array(jointsTexture.width * jointsTexture.height * 4),
            } as IJointTextureStorage;
        } else {
            this._jointStorage = {
                nativeData: new Float32Array(skeleton.joints.length * 12),
            } as IJointUniformsStorage;
        }
    }

    public updateJointMatrix (iMatrix: number, matrix: mat4) {
        if (!this._jointStorage) {
            return;
        }
        _setJointMatrix(this._jointStorage.nativeData, iMatrix, matrix, isUniformStorage(this._jointStorage));
    }

    public commitJointMatrices () {
        if (!this._jointStorage) {
            return;
        }
        if (isUniformStorage(this._jointStorage)) {
            this._skinningUBO.update(this._jointStorage.nativeData, UBOSkinning.MAT_JOINT_OFFSET);
        } else if (isTextureStorage(this._jointStorage)) {
            (this._jointStorage as IJointTextureStorage).texture.directUpdate(this._jointStorage!.nativeData.buffer);
        }
    }

    protected _doCreatePSO (pass: Pass) {
        const pso = super._doCreatePSO(pass);
        pso.pipelineLayout.layouts[0].bindBuffer(UBOSkinning.BLOCK.binding, this._skinningUBO);
        if (this._jointStorage && isTextureStorage(this._jointStorage)) {
            const jointTexture = this._jointStorage.texture;
            const view = jointTexture.getGFXTextureView();
            const sampler = samplerLib.getSampler(this._device, jointTexture.getGFXSamplerInfo());
            if (view && sampler) {
                pso.pipelineLayout.layouts[0].bindTextureView(UNIFORM_JOINTS_TEXTURE.binding, view);
                pso.pipelineLayout.layouts[0].bindSampler(UNIFORM_JOINTS_TEXTURE.binding, sampler);
            }
        }
        return pso;
    }

    private _destroyJointStorage () {
        if (!this._jointStorage) {
            return;
        }
        if (isTextureStorage(this._jointStorage)) {
            this._jointStorage.texture.destroy();
        }
        this._jointStorage = null;
    }
}

function _setJointMatrix (out: Float32Array, iMatrix: number, matrix: mat4, isUniform: boolean) {
    const base = 12 * iMatrix;
    if (isUniform) {
        // Discard the last row
        out[base + 0] = matrix.m00;
        out[base + 1] = matrix.m01;
        out[base + 2] = matrix.m02;
        out[base + 3] = matrix.m04;
        out[base + 4] = matrix.m05;
        out[base + 5] = matrix.m06;
        out[base + 6] = matrix.m08;
        out[base + 7] = matrix.m09;
        out[base + 8] = matrix.m10;
        out[base + 9] = matrix.m12;
        out[base + 10] = matrix.m13;
        out[base + 11] = matrix.m14;
    } else {
        mat4.array(out, matrix, base);
    }
}

const jointTextureCapacityTable = ((maxCapacity: number) => {
    const pixelsPerJoint = 4;
    const result: Array<{ textureExtent: number; capacity: number;  }> = [];
    for (let i = 0; ; ++i) {
        const textureExtent = 1 << i;
        const capacity = (textureExtent * textureExtent) / pixelsPerJoint;
        if (capacity < 1) {
            continue;
        }
        result.push({ textureExtent, capacity });
        if (capacity >= maxCapacity) {
            break;
        }
    }
    return result;
})(1024);

function _createJointsTexture (skinning: { joints: any[]; }) {
    const jointCount = skinning.joints.length;
    let textureExtent = -1;
    for (const item of jointTextureCapacityTable) {
        if (item.capacity >= jointCount) {
            textureExtent = item.textureExtent;
            break;
        }
    }
    if (textureExtent < 0) {
        throw new Error('To many joints.');
    }

    const texture = new Texture2D();
    texture.create(textureExtent, textureExtent, PixelFormat.RGBA32F);
    texture.setFilters(Filter.NEAREST, Filter.NEAREST);
    texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
    return texture;
}
