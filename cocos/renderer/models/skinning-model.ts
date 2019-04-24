// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import Skeleton from '../../3d/assets/skeleton';
import { Texture2D } from '../../assets/texture-2d';
import { Filter, PixelFormat, WrapMode } from '../../assets/texture-base';
import { mat4, vec3, vec4 } from '../../core/vmath';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXAPI, GFXDevice, GFXFeature } from '../../gfx/device';
import { JointUniformCapacity, UBOSkinning, UBOSkinningTextureCase, UNIFORM_JOINTS_TEXTURE } from '../../pipeline/define';
import { Node } from '../../scene-graph/node';
import { Pass } from '../core/pass';
import { samplerLib } from '../core/sampler-lib';
import { Model } from '../scene/model';
import { RenderScene } from '../scene/render-scene';

const textureSizeBuffer = new Float32Array(4);

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

export const __FORCE_USE_UNIFORM_STORAGE__ = false;

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
        const storageKind = this._selectStorageKind();

        if (storageKind === JointStorageKind.textureRGBA32F ||
            storageKind === JointStorageKind.textureRGBA8) {
            const mat4TextureKind = storageKind === JointStorageKind.textureRGBA32F ? Mat4TextureKind.rgba32f : Mat4TextureKind.rgba8888;
            const mat4Texture = new MatrixTexture(skeleton.joints.length  * 2, mat4TextureKind);

            for (let iJoint = 0; iJoint < skeleton.bindposes.length; ++iJoint) {
                mat4Texture.set(iJoint * 2 + 0, skeleton.bindposes[iJoint]);
            }

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
                console.error(
                    `Skeleton ${skeleton.name} has ${skeleton.joints.length} joints ` +
                    `which exceeds Cocos's max allowed joint count(${JointUniformCapacity}).`);
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

    public updateJointMatrix (iMatrix: number, matrix: mat4) {
        if (!this._binded) {
            return;
        }
        const { jointStorage, skinningUBO } = this._binded;
        if (isTextureStorage(jointStorage)) {
            jointStorage.texture.set(iMatrix * 2 + 1, matrix);
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

    private _selectStorageKind (): JointStorageKind {
        return selectStorageKind(this._device);
    }
}

export function selectStorageKind (device: GFXDevice): JointStorageKind {
    if (__FORCE_USE_UNIFORM_STORAGE__) {
        return JointStorageKind.uniform;
    } else if (device.gfxAPI === GFXAPI.WEBGL2) {
        return JointStorageKind.uniform; // BUG Now
    } else if (device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
        return JointStorageKind.textureRGBA8;
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
            localStorage: Uint8Array,
            pixelsPerMatrix: 16,
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
    constructor (capacity: number, kind: Mat4TextureKind) {
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
        if (this._kind === Mat4TextureKind.rgba32f) {
            mat4.array(this._nativeData, matrix, iMatrix * 4 * 4);
        } else {
            const base = iMatrix * 16 * 4;
            const o = this._nativeData as Uint8Array;
            encode32(matrix.m00, o, base + 0 * 4);
            encode32(matrix.m01, o, base + 1 * 4);
            encode32(matrix.m02, o, base + 2 * 4);
            encode32(matrix.m03, o, base + 3 * 4);
            encode32(matrix.m04, o, base + 4 * 4);
            encode32(matrix.m05, o, base + 5 * 4);
            encode32(matrix.m06, o, base + 6 * 4);
            encode32(matrix.m07, o, base + 7 * 4);
            encode32(matrix.m08, o, base + 8 * 4);
            encode32(matrix.m09, o, base + 9 * 4);
            encode32(matrix.m10, o, base + 10 * 4);
            encode32(matrix.m11, o, base + 11 * 4);
            encode32(matrix.m12, o, base + 12 * 4);
            encode32(matrix.m13, o, base + 13 * 4);
            encode32(matrix.m14, o, base + 14 * 4);
            encode32(matrix.m15, o, base + 15 * 4);
        }
    }

    public commit () {
        this._texture.directUpdate(this._nativeData.buffer);
    }
}

const encode32 = (() => {
    const EXP2_XX_1 = exp2(-1.0);
    const EXP2_XX_2 = exp2(23.0 - 8.0);
    const EXP2_XX_3 = exp2(8.0);
    const EXP2_XX_4 = exp2(23.0);
    const EXP2_XX_5 = exp2(-15.0);

    function decode32 (r: number, g: number, b: number, a: number) {
        const Sign = 1.0 - step(128.0, r) * 2.0;
        const Exponent = 2.0 * mod(r, 128.0) + step(128.0, g) - 127.0;

        // From Arjan's answer.
        if (Exponent === -127) {
            return 0;
        }

        const Mantissa = mod(g, 128.0) * 65536.0 + b * 256.0 + a + (0x800000);

        // Original
        // const Result =  Sign * exp2(Exponent) * (Mantissa * exp2(-23.0 ));
        // return Result;

        // From Arjan's answer.
        return Sign * exp2(Exponent - 23.0) * Mantissa;
    }

    return (f: number, output: Uint8Array, offset: number) => {
        f = numberToFloat32(f);

        // https://stackoverflow.com/questions/7059962/how-do-i-convert-a-vec4-rgba-value-to-a-float
        // http://www.shaderific.com/glsl-functions/
        const e = 5.0;
        const F = Math.abs(f);

        // From Arjan's answer.
        if (F === 0) {
            output[offset + 0] = 0;
            output[offset + 1] = 0;
            output[offset + 2] = 0;
            output[offset + 3] = 0;
            return;
        }

        const Sign = step(0.0, -f);
        let Exponent = Math.floor(Math.log2(F));

        // Original.
        // const Mantissa = (exp2(- Exponent) * F);
        // Exponent = Math.floor(Math.log2(F) + 127.0) + Math.floor(Math.log2(Mantissa));

        // From Arjan's answer.
        const Mantissa = F / exp2(Exponent);
        if (Mantissa < 1) {
            Exponent -= 1;
        }
        Exponent += 127;

        const r = 128.0 * Sign  + Math.floor(Exponent * EXP2_XX_1);
        const g = 128.0 * mod(Exponent, 2.0) + mod(Math.floor(Mantissa * 128.0), 128.0);
        const b = Math.floor(mod(Math.floor(Mantissa * EXP2_XX_2), EXP2_XX_3));
        const a = Math.floor(EXP2_XX_4 * mod(Mantissa, EXP2_XX_5));

        // Verification.
        // const x = decode32(r, g, b, a);
        // if (Math.abs(x - f) > 0.00001) {
        //     f = x;
        // }

        output[offset + 0] = r;
        output[offset + 1] = g;
        output[offset + 2] = b;
        output[offset + 3] = a;
    };
})();

const numberToFloat32 = (() => {
    const f32storage = new Float32Array(1);
    return (x: number) => {
        f32storage[0] = x;
        return f32storage[0];
    };
})();

function step (edge: number, x: number): number {
    return x < edge ? 0.0 : 1.0;
}

function mod (x: number, y: number): number {
    return x - y * Math.floor(x / y);
}

function exp2 (x: number): number {
    return Math.pow(2, x);
}

function int (x: number) {
    return Math.trunc(x);
}

function fract (x: number) {
    return x - Math.floor(x);
}
