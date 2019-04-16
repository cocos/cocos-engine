// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import Skeleton from '../../3d/assets/skeleton';
import { Texture2D } from '../../assets/texture-2d';
import { Filter, PixelFormat, WrapMode } from '../../assets/texture-base';
import { mat4 } from '../../core/vmath';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXAPI, GFXDevice, GFXFeature } from '../../gfx/device';
import { JointUniformCapacity, UBOSkinning, UNIFORM_JOINTS_TEXTURE } from '../../pipeline/define';
import { Node } from '../../scene-graph/node';
import { Pass } from '../core/pass';
import { samplerLib } from '../core/sampler-lib';
import { Model } from '../scene/model';
import { RenderScene } from '../scene/render-scene';

const textureSizeBuffer = new Float32Array(4);

export enum JointStorageKind {
    byteTexture,
    floatingPointTexture,
    uniform,
}

interface IFJointTextureStorage {
    kind: JointStorageKind.floatingPointTexture;
    nativeData: Float32Array;
    texture: Texture2D;
}

interface IBJointTextureStorage {
    kind: JointStorageKind.byteTexture;
    nativeData: Uint8Array;
    texture: Texture2D;
}

interface IJointUniformsStorage {
    kind: JointStorageKind.uniform;
    nativeData: Float32Array;
}

type JointStorage = IFJointTextureStorage | IBJointTextureStorage | IJointUniformsStorage;

function isTextureStorage (storage: JointStorage): storage is (IFJointTextureStorage | IBJointTextureStorage) {
    return storage.kind === JointStorageKind.byteTexture || storage.kind === JointStorageKind.floatingPointTexture;
}

const pixelsPerJointOfFJointTexture = 4;
const pixelsPerJointOfBJointTexture = 16;

export const __FORCE_USE_UNIFORM_STORAGE__ = false;

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

    get storageKind () {
        return this._jointStorage ? this._jointStorage.kind : null;
    }

    public bindSkeleton (skeleton: Skeleton) {
        this._destroyJointStorage();
        const storageKind = this._selectStorageKind();

        if (storageKind === JointStorageKind.floatingPointTexture ||
            storageKind === JointStorageKind.byteTexture) {
            const jointsTexture = _createJointsTexture(skeleton, storageKind);
            textureSizeBuffer[0] = jointsTexture.width;
            this._skinningUBO.update(
                textureSizeBuffer, UBOSkinning.JOINTS_TEXTURE_SIZE_OFFSET, textureSizeBuffer.byteLength);
            if (storageKind === JointStorageKind.floatingPointTexture) {
                this._jointStorage = {
                    kind: JointStorageKind.floatingPointTexture,
                    texture: jointsTexture,
                    nativeData: new Float32Array(jointsTexture.width * jointsTexture.height * pixelsPerJointOfFJointTexture * 4),
                };
            } else {
                this._jointStorage = {
                    kind: JointStorageKind.byteTexture,
                    texture: jointsTexture,
                    nativeData: new Uint8Array(jointsTexture.width * jointsTexture.height * pixelsPerJointOfBJointTexture * 4),
                };
            }
        } else {
            if (skeleton.joints.length > JointUniformCapacity) {
                console.error(
                    `Skeleton ${skeleton.name} has ${skeleton.joints.length} joints ` +
                    `which exceeds Cocos's max allowed joint count(${JointUniformCapacity}).`);
            }
            this._jointStorage = {
                kind: JointStorageKind.uniform,
                nativeData: new Float32Array(skeleton.joints.length * 12),
            };
        }
    }

    public updateJointMatrix (iMatrix: number, matrix: mat4) {
        if (!this._jointStorage) {
            return;
        }
        _setJointMatrix(this._jointStorage.nativeData, iMatrix, matrix, this._jointStorage.kind);
    }

    public commitJointMatrices () {
        if (!this._jointStorage) {
            return;
        }
        if (isTextureStorage(this._jointStorage)) {
            this._jointStorage.texture.directUpdate(this._jointStorage!.nativeData.buffer);
        } else {
            this._skinningUBO.update(this._jointStorage.nativeData, UBOSkinning.MAT_JOINT_OFFSET);
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
        return JointStorageKind.byteTexture;
    } else {
        return JointStorageKind.byteTexture;
    }
}

function _setJointMatrix (out: Float32Array | Uint8Array, iMatrix: number, matrix: mat4, kind: JointStorageKind) {
    if (kind === JointStorageKind.uniform) {
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
    } else if (kind === JointStorageKind.floatingPointTexture) {
        mat4.array(out, matrix, iMatrix * pixelsPerJointOfFJointTexture * 4);
    } else {
        const base = iMatrix * 16 * 4;
        const o = out as Uint8Array;
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

function createTointTextureCapacityTable (maxCapacity: number, pixelsPerJoint: number) {
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
}

const fJointTextureCapacityTable = createTointTextureCapacityTable(1024, pixelsPerJointOfFJointTexture);
const bJointTextureCapacityTable = createTointTextureCapacityTable(1024, pixelsPerJointOfBJointTexture);

function _createJointsTexture (skinning: { joints: any[]; }, kind: JointStorageKind.byteTexture | JointStorageKind.floatingPointTexture) {
    const flt = (kind === JointStorageKind.floatingPointTexture);
    const jointCount = skinning.joints.length;
    let textureExtent = -1;
    for (const item of (flt ? fJointTextureCapacityTable : bJointTextureCapacityTable)) {
        if (item.capacity >= jointCount) {
            textureExtent = item.textureExtent;
            break;
        }
    }
    if (textureExtent < 0) {
        throw new Error('Too many joints.');
    }

    const texture = new Texture2D();
    texture.create(textureExtent, textureExtent, (flt ? PixelFormat.RGBA32F : PixelFormat.RGBA8888));
    texture.setFilters(Filter.NEAREST, Filter.NEAREST);
    texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
    return texture;
}

function encode32 (f: number, output: Uint8Array, offset: number) {
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

    const r = 128.0 * Sign  + Math.floor(Exponent * exp2(-1.0));
    const g = 128.0 * mod(Exponent, 2.0) + mod(Math.floor(Mantissa * 128.0), 128.0);
    const b = Math.floor(mod(Math.floor(Mantissa * exp2(23.0 - 8.0)), exp2(8.0)));
    const a = Math.floor(exp2(23.0) * mod(Mantissa, exp2(-15.0)));

    /*
    const ff = decode32(r, g, b, a);
    if (Math.abs(ff - f) > 0.00001) {
        f = ff;
    }
    */

    output[offset + 0] = r;
    output[offset + 1] = g;
    output[offset + 2] = b;
    output[offset + 3] = a;
}

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

function step (edge: number, x: number): number {
    return x < edge ? 0.0 : 1.0;
}

function mod (x: number, y: number): number {
    return x - y * Math.floor(x / y);
}

function exp2 (x: number): number {
    return Math.pow(2, x);
}
