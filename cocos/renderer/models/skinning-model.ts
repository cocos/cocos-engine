// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import Skeleton from '../../3d/assets/skeleton';
import { Filter, PixelFormat, WrapMode } from '../../assets/asset-enum';
import { Texture2D } from '../../assets/texture-2d';
import { mat4 } from '../../core/vmath';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXDevice, GFXFeature } from '../../gfx/device';
import { JointUniformCapacity, UBOSkinning, UBOSkinningTextureCase, UNIFORM_JOINTS_TEXTURE } from '../../pipeline/define';
import { Node } from '../../scene-graph/node';
import { Pass } from '../core/pass';
import { samplerLib } from '../core/sampler-lib';
import { Model } from '../scene/model';
import { RenderScene } from '../scene/render-scene';
import { Mat4 } from '../../core';

const textureSizeBuffer = new Float32Array(4);
const skinningVectors = JointUniformCapacity * 3; // both Mat3x4 and DQ

const vertexVectorLeeway = 30; // the minimum number of free vectors guaranteed in vertex shader when using uniform joint storage

export enum JointStorageKind {
    textureRGBA8,
    textureRGBA32F,
    uniform,
}

interface IUniformStorage {
    kind: JointStorageKind.uniform;
    nativeData: Float32Array;
}

interface ITextureStorage {
    kind: JointStorageKind.textureRGBA32F | JointStorageKind.textureRGBA8;
    texture: MatrixTexture;
}

type JointStorage = ITextureStorage | IUniformStorage;

function isTextureStorage (storage: JointStorage): storage is ITextureStorage {
    return storage.kind === JointStorageKind.textureRGBA8 || storage.kind === JointStorageKind.textureRGBA32F;
}

export class SkinningModel extends Model {
    private _binded: null | {
        jointStorage: JointStorage,
        skinningUBO: GFXBuffer,
        skinningUBOBinding: number,
    } = null;

    constructor (scene: RenderScene, node: Node) {
        super(scene, node);
        this._type = 'skinning';
    }

    public isTextureStorage () {
        return this._binded && isTextureStorage(this._binded.jointStorage);
    }

    public bindSkeleton (skeleton: Skeleton) {
        this._destroyJointStorage();
        const storageKind = selectStorageKind(this._device);

        if (storageKind === JointStorageKind.textureRGBA32F ||
            storageKind === JointStorageKind.textureRGBA8) {
            const mat4TextureKind = storageKind === JointStorageKind.textureRGBA32F ? Mat4TextureKind.rgba32f : Mat4TextureKind.rgba8888;
            const mat4Texture = new MatrixTexture(skeleton.joints.length, mat4TextureKind, this._device);

            this._binded = {
                skinningUBOBinding: UBOSkinningTextureCase.BLOCK.binding,
                skinningUBO: this._device.createBuffer({
                    usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                    memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                    size: UBOSkinningTextureCase.SIZE,
                    stride: UBOSkinningTextureCase.SIZE,
                }),
                jointStorage: {
                    kind: storageKind,
                    texture: mat4Texture,
                },
            };

            textureSizeBuffer[0] = mat4Texture.texture.width;
            this._binded.skinningUBO.update(
                textureSizeBuffer, UBOSkinningTextureCase.JOINTS_TEXTURE_SIZE_OFFSET, textureSizeBuffer.byteLength);
        } else {
            if (skeleton.joints.length > JointUniformCapacity) {
                console.error(`Joints count exceeds the default limits: ${skeleton.joints.length}/${JointUniformCapacity} in ${skeleton.name}`);
            }

            this._binded = {
                skinningUBOBinding: UBOSkinning.BLOCK.binding,
                skinningUBO: this._device.createBuffer({
                    usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                    memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                    size: UBOSkinning.SIZE,
                    stride: UBOSkinning.SIZE,
                }),
                jointStorage: {
                    kind: JointStorageKind.uniform,
                    nativeData: new Float32Array(skeleton.joints.length * 12),
                },
            };
        }
    }

    public updateJointMatrix (iMatrix: number, matrix: Mat4) {
        if (!this._binded) {
            return;
        }
        const { jointStorage } = this._binded;
        if (isTextureStorage(jointStorage)) {
            jointStorage.texture.set(iMatrix, matrix);
        } else {
            setMat4InUniform(jointStorage.nativeData, iMatrix, matrix);
        }
    }

    public commitJointMatrices () {
        if (!this._binded) {
            return;
        }
        const { jointStorage, skinningUBO } = this._binded;
        if (isTextureStorage(jointStorage)) {
            jointStorage.texture.commit();
        } else {
            skinningUBO.update(jointStorage.nativeData, UBOSkinning.MAT_JOINT_OFFSET);
        }
    }

    protected _doCreatePSO (pass: Pass) {
        const pso = super._doCreatePSO(pass);
        if (this._binded) {
            const { jointStorage, skinningUBO, skinningUBOBinding } = this._binded;
            pso.pipelineLayout.layouts[0].bindBuffer(skinningUBOBinding, skinningUBO);
            if (isTextureStorage(jointStorage)) {
                const jointTexture = jointStorage.texture.texture;
                const view = jointTexture.getGFXTextureView();
                const sampler = samplerLib.getSampler(this._device, jointTexture.getGFXSamplerInfo());
                if (view && sampler) {
                    pso.pipelineLayout.layouts[0].bindTextureView(UNIFORM_JOINTS_TEXTURE.binding, view);
                    pso.pipelineLayout.layouts[0].bindSampler(UNIFORM_JOINTS_TEXTURE.binding, sampler);
                }
            }
        }
        return pso;
    }

    private _destroyJointStorage () {
        if (this._binded) {
            const { jointStorage, skinningUBO } = this._binded;
            if (isTextureStorage(jointStorage)) {
                jointStorage.texture.destroy();
            }
            skinningUBO.destroy();
            this._binded = null;
        }
    }
}

export function selectStorageKind (device: GFXDevice): JointStorageKind {
    if (device.maxVertexUniformVectors - skinningVectors > vertexVectorLeeway) {
        return JointStorageKind.uniform;
    } else if (device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
        return JointStorageKind.textureRGBA32F;
    } else {
        return JointStorageKind.textureRGBA8;
    }
}

function setMat4InUniform (out: Float32Array, iMatrix: number, matrix: mat4) {
    const base = 12 * iMatrix;
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
}

enum Mat4TextureKind {
    rgba8888,
    rgba32f,
}

class MatrixTexture {

    get texture () {
        return this._texture;
    }

    private static Mat4TextureAttributes = {
        [Mat4TextureKind.rgba8888]: {
            localStorage: Float32Array,
            pixelsPerMatrix: 4,
            capacityTable: MatrixTexture.createCapacityTable(1024, 16),
            pixelFormat: PixelFormat.RGBA8888,
        },
        [Mat4TextureKind.rgba32f]: {
            localStorage: Float32Array,
            pixelsPerMatrix: 4,
            capacityTable: MatrixTexture.createCapacityTable(1024, 4),
            pixelFormat: PixelFormat.RGBA32F,
        },
    };
    private static createCapacityTable (maxCapacity: number, pixelsPerJoint: number) {
        const result: Array<{ textureExtent: number; capacity: number; }> = [];
        for (let i = 0; ; ++i) {
            const textureExtent = 1 << i;
            if (textureExtent % pixelsPerJoint !== 0) {
                continue;
            }
            const rowCapacity = textureExtent / pixelsPerJoint;
            if (rowCapacity < 1) {
                continue;
            }
            const capacity = textureExtent * rowCapacity;
            result.push({ textureExtent, capacity });
            if (capacity >= maxCapacity) {
                break;
            }
        }
        return result;
    }

    private _texture: Texture2D;
    private _nativeData: Float32Array | Uint8Array;
    private _kind: Mat4TextureKind;

    /**
     * Creates a texture which is able to store matrices(4x4).
     * The matrices is directly emplaced (in textureRGBA32F case) or encoded (in textureRGBA8888 case),
     * one by one, in column major order, into texture pixels, without any spacing pixels.
     * Every row of texture is guaranteed to store integer multiple of matrix count.
     * This means when retrive a single matrix from such a texture, every matrix element has a same texcoord 'v',
     * and their texcoord 'u' is incremented by '1 step'.
     * @param capacity The count of matrices this texture is able store.
     * @param kind The texture format.
     * @throws Throws error if matrix count is too large.
     */
    constructor (capacity: number, kind: Mat4TextureKind, device: GFXDevice) {
        this._kind = kind;
        const attribute = MatrixTexture.Mat4TextureAttributes[kind];
        let textureExtent = -1;
        for (const item of attribute.capacityTable) {
            if (item.capacity >= capacity) {
                textureExtent = item.textureExtent;
                break;
            }
        }
        if (textureExtent < 0) {
            throw new Error('Too many joints.');
        }
        this._texture = new Texture2D();
        this._texture.create(textureExtent, textureExtent, attribute.pixelFormat);
        this._texture.setFilters(Filter.NEAREST, Filter.NEAREST);
        this._texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
        this._nativeData = new (attribute.localStorage)(this._texture.width * this._texture.height * attribute.pixelsPerMatrix * 4);
    }

    public destroy () {
        this._texture.destroy();
    }

    public set (iMatrix: number, matrix: mat4) {
        // just use identical memory layout for all texture formats
        mat4.array(this._nativeData, matrix, iMatrix * 4 * 4);
    }

    public commit () {
        this._texture.directUpdate(this._nativeData.buffer);
    }
}
