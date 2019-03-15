// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import Skeleton from '../../3d/assets/skeleton';
import { Texture2D } from '../../assets/texture-2d';
import { Filter, PixelFormat, WrapMode } from '../../assets/texture-base';
import { mat4 } from '../../core/vmath';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXFeature } from '../../gfx/device';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { UBOSkinning, UNIFORM_JOINTS_TEXTURE } from '../../pipeline/define';
import { Node } from '../../scene-graph/node';
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
                nativeData: new Float32Array(skeleton.joints.length * 16),
            } as IJointUniformsStorage;
        }
    }

    public updateJointMatrix (iMatrix: number, matrix: mat4) {
        if (!this._jointStorage) {
            return;
        }
        _setJointMatrix(this._jointStorage.nativeData, iMatrix, matrix);
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

    protected _onCreatePSO (pso: GFXPipelineState) {
        super._onCreatePSO(pso);
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

function _setJointMatrix (out: Float32Array, iMatrix: number, matrix: mat4) {
    out[16 * iMatrix + 0] = matrix.m00;
    out[16 * iMatrix + 1] = matrix.m01;
    out[16 * iMatrix + 2] = matrix.m02;
    out[16 * iMatrix + 3] = matrix.m03;
    out[16 * iMatrix + 4] = matrix.m04;
    out[16 * iMatrix + 5] = matrix.m05;
    out[16 * iMatrix + 6] = matrix.m06;
    out[16 * iMatrix + 7] = matrix.m07;
    out[16 * iMatrix + 8] = matrix.m08;
    out[16 * iMatrix + 9] = matrix.m09;
    out[16 * iMatrix + 10] = matrix.m10;
    out[16 * iMatrix + 11] = matrix.m11;
    out[16 * iMatrix + 12] = matrix.m12;
    out[16 * iMatrix + 13] = matrix.m13;
    out[16 * iMatrix + 14] = matrix.m14;
    out[16 * iMatrix + 15] = matrix.m15;
}

function _createJointsTexture (skinning: { joints: any[]; }) {
    const jointCount = skinning.joints.length;

    // Set jointsTexture.
    // A squared texture with side length N(N > 1) multiples of 2 can store
    // 2 ^ (2 * N - 2) matrices.
    // We support most 1024 joints.
    let size = 0;
    if (jointCount > 1024) {
        throw new Error('To many joints(more than 1024).');
    } else if (jointCount > 256) {
        size = 64;
    } else if (jointCount > 64) {
        size = 32;
    } else if (jointCount > 16) {
        size = 16;
    } else if (jointCount > 4) {
        size = 8;
    } else {
        size = 4;
    }

    const texture = new Texture2D();
    texture.create(size, size, PixelFormat.RGBA32F);
    texture.setFilters(Filter.NEAREST, Filter.NEAREST);
    texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
    return texture;
}
