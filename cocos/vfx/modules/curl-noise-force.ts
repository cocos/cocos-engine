/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { ccclass, type, serializable, rangeMin, visible } from 'cc.decorator';
import { Enum, clamp, Vec2, Vec3, RealCurve } from '../../core';
import { FloatExpression, ConstantFloatExpression, ConstantVec3Expression, Vec3Expression } from '../expressions';
import { VFXModule, VFXExecutionStageFlags, VFXStage } from '../vfx-module';
import { RandomStream } from '../random-stream';
import { VFXEmitter, VFXEmitterState } from '../vfx-emitter';
import { P_VELOCITY, P_POSITION, P_PHYSICS_FORCE, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';

export class PerlinNoise1DCache {
    i0 = 0;
    i1 = 0;
    g0 = 0;
    g1 = 0;
    db = 0;

    updateCache (x: number) {
        if (x < this.i1 && x > this.i0) {
            return;
        }
        let i0 = this.i0 = Math.floor(x);
        this.i1 = i0 + 1;
        i0 &= 255;
        const i1 = i0 + 1;
        const g0 = this.g0 = gradients1D[permutation[i0] & gradientsMask1D];
        const g1 = this.g1 = gradients1D[permutation[i1] & gradientsMask1D];
        this.db = g1 - g0;
    }
}

export class PerlinNoise2DCache {
    ix0 = 0;
    iy0 = 0;
    ix1 = 0;
    iy1 = 0;
    g00 = new Vec2();
    g10 = new Vec2();
    g01 = new Vec2();
    g11 = new Vec2();
    db = new Vec2();
    dc = new Vec2();
    dd = new Vec2();

    updateCache (x: number, y: number) {
        if (x < this.ix1 && x > this.ix0 && y < this.iy1 && y > this.iy0) {
            return;
        }
        let ix0 = this.ix0 = Math.floor(x);
        let iy0 = this.iy0 = Math.floor(y);
        this.ix1 = ix0 + 1;
        this.iy1 = iy0 + 1;
        ix0 &= 255;
        iy0 &= 255;
        const ix1 = ix0 + 1.0;
        const iy1 = iy0 + 1.0;

        const h0 = permutation[ix0];
        const h1 = permutation[ix1];

        const g00 = this.g00 = gradients2D[permutation[h0 + iy0] & gradientMask2D];
        const g10 = this.g10 = gradients2D[permutation[h1 + iy0] & gradientMask2D];
        const g01 = this.g01 = gradients2D[permutation[h0 + iy1] & gradientMask2D];
        const g11 = this.g11 = gradients2D[permutation[h1 + iy1] & gradientMask2D];

        Vec2.subtract(this.db, g10, g00);
        Vec2.subtract(this.dc, g01, g00);
        Vec2.subtract(this.dd, g11, g01);
        Vec2.subtract(this.dd, this.dd, this.db);
    }
}

export class PerlinNoise3DCache {
    ix0 = 0;
    iy0 = 0;
    iz0 = 0;
    ix1 = 0;
    iy1 = 0;
    iz1 = 0;
    g000 = new Vec3();
    g100 = new Vec3();
    g010 = new Vec3();
    g110 = new Vec3();
    g001 = new Vec3();
    g101 = new Vec3();
    g011 = new Vec3();
    g111 = new Vec3();
    db = new Vec3();
    dc = new Vec3();
    dd = new Vec3();
    de = new Vec3();
    df = new Vec3();
    dg = new Vec3();
    dh = new Vec3();

    updateCache (x: number, y: number, z: number) {
        if (x < this.ix1 && x > this.ix0 && y < this.iy1 && y > this.iy0 && z < this.iz1 && z > this.iz0) {
            return;
        }
        let ix0 = this.ix0 = Math.floor(x);
        let iy0 = this.iy0 = Math.floor(y);
        let iz0 = this.iz0 = Math.floor(z);
        this.ix1 = this.ix0 + 1;
        this.iy1 = this.iy0 + 1;
        this.iz1 = this.iz0 + 1;
        ix0 &= 255;
        iy0 &= 255;
        iz0 &= 255;
        const ix1 = ix0 + 1;
        const iy1 = iy0 + 1;
        const iz1 = iz0 + 1;
        const h0 = permutation[ix0];
        const h1 = permutation[ix1];
        const h00 = permutation[h0 + iy0];
        const h10 = permutation[h1 + iy0];
        const h01 = permutation[h0 + iy1];
        const h11 = permutation[h1 + iy1];
        const g000 = this.g000 = gradients3D[permutation[h00 + iz0] & gradientMask3D];
        const g100 = this.g100 = gradients3D[permutation[h10 + iz0] & gradientMask3D];
        const g010 = this.g010 = gradients3D[permutation[h01 + iz0] & gradientMask3D];
        const g110 = this.g110 = gradients3D[permutation[h11 + iz0] & gradientMask3D];
        const g001 = this.g001 = gradients3D[permutation[h00 + iz1] & gradientMask3D];
        const g101 = this.g101 = gradients3D[permutation[h10 + iz1] & gradientMask3D];
        const g011 = this.g011 = gradients3D[permutation[h01 + iz1] & gradientMask3D];
        const g111 = this.g111 = gradients3D[permutation[h11 + iz1] & gradientMask3D];
        const db = this.db;
        const dc = this.dc;
        const de = this.de;
        const df = this.df;
        const dg = this.dg;
        const dh = this.dh;
        Vec2.subtract(db, g100, g000);
        Vec2.subtract(dc, g010, g000);
        Vec2.subtract(this.dd, g001, g000);
        Vec2.subtract(de, g110, g010);
        Vec2.subtract(de, de, db);
        Vec2.subtract(df, g101, g001);
        Vec2.subtract(df, df, db);
        Vec2.subtract(dg, g011, g001);
        Vec2.subtract(dg, dg, dc);
        Vec2.subtract(dh, g111, g011);
        Vec2.subtract(dh, dh, df);
        Vec2.subtract(dh, dh, de);
        Vec2.subtract(dh, dh, db);
    }
}

// https://mrl.cs.nyu.edu/~perlin/noise/
const permutation = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233,  7, 225,
    140, 36, 103, 30, 69, 142,  8, 99, 37, 240, 21, 10, 23, 190,  6, 148,
    247, 120, 234, 75,  0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
    57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
    74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
    60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
    65, 25, 63, 161,  1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
    200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,  3, 64,
    52, 217, 226, 250, 124, 123,  5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
    207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
    119, 248, 152,  2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172,  9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
    218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
    81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
    184, 84, 204, 176, 115, 121, 50, 45, 127,  4, 150, 254, 138, 236, 205, 93,
    222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,

    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233,  7, 225,
    140, 36, 103, 30, 69, 142,  8, 99, 37, 240, 21, 10, 23, 190,  6, 148,
    247, 120, 234, 75,  0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
    57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
    74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
    60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
    65, 25, 63, 161,  1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
    200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,  3, 64,
    52, 217, 226, 250, 124, 123,  5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
    207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
    119, 248, 152,  2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172,  9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
    218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
    81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
    184, 84, 204, 176, 115, 121, 50, 45, 127,  4, 150, 254, 138, 236, 205, 93,
    222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
];

const gradients3D = [
    new Vec3(1, 1, 0),
    new Vec3(-1, 1, 0),
    new Vec3(1, -1, 0),
    new Vec3(-1, -1, 0),
    new Vec3(1, 0, 1),
    new Vec3(-1, 0, 1),
    new Vec3(1, 0, -1),
    new Vec3(-1, 0, -1),
    new Vec3(0, 1, 1),
    new Vec3(0, -1, 1),
    new Vec3(0, 1, -1),
    new Vec3(0, -1, -1),

    new Vec3(1, 1, 0),
    new Vec3(-1, 1, 0),
    new Vec3(0, -1, 1),
    new Vec3(0, -1, -1),
];

const gradientMask3D = 15;

const gradients2D = [
    new Vec2(1, 0),
    new Vec2(-1, 0),
    new Vec2(0, 1),
    new Vec2(0, -1),
    new Vec2(1, 1).normalize(),
    new Vec2(-1, 1).normalize(),
    new Vec2(1, -1).normalize(),
    new Vec2(-1, -1).normalize(),
];
const gradientMask2D = 7;

const gradients1D = [
    1, -1,
];
const gradientsMask1D = 1;

function smooth (t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function smoothDerivative (t: number) { return 30 * t * t * (t * (t - 2) + 1); }

const temp1 = new Vec3();
const temp2 = new Vec3();

export function perlin3D (outDerivative: Vec2, position: Vec3, frequency: number, cache: PerlinNoise3DCache) {
    const x = position.x * frequency;
    const y = position.y * frequency;
    const z = position.z * frequency;
    cache.updateCache(x, y, z);
    const tx0 = x - cache.ix0;
    const ty0 = y - cache.iy0;
    const tz0 = z - cache.iz0;
    const tx1 = tx0 - 1;
    const ty1 = ty0 - 1;
    const tz1 = tz0 - 1;
    const v000 = dot3(cache.g000, tx0, ty0, tz0);
    const v100 = dot3(cache.g100, tx1, ty0, tz0);
    const v010 = dot3(cache.g010, tx0, ty1, tz0);
    const v110 = dot3(cache.g110, tx1, ty1, tz0);
    const v001 = dot3(cache.g001, tx0, ty0, tz1);
    const v101 = dot3(cache.g101, tx1, ty0, tz1);
    const v011 = dot3(cache.g011, tx0, ty1, tz1);
    const v111 = dot3(cache.g111, tx1, ty1, tz1);
    const tx = smooth(tx0);
    const ty = smooth(ty0);
    const tz = smooth(tz0);
    const dtx = smoothDerivative(tx0);
    const dty = smoothDerivative(ty0);

    const b = v100 - v000;
    const c = v010 - v000;
    const e = v110 - v010 - b;
    const f = v101 - v001 - b;
    const g = v011 - v001 - c;
    const h = v111 - v011 - f - e - b;
    Vec2.scaleAndAdd(temp1,
        Vec2.scaleAndAdd(temp1, Vec2.scaleAndAdd(temp1, cache.g000, Vec2.scaleAndAdd(temp1, cache.dc, cache.de, tx), ty), cache.db, tx),
        Vec2.scaleAndAdd(temp2, Vec2.scaleAndAdd(temp2, cache.dd, Vec2.scaleAndAdd(temp2, cache.dg, cache.dh, tx), ty), cache.df, tx),
        tz);
    outDerivative.x = temp1.x + (b + e * ty + (f + h * ty) * tz) * dtx;
    outDerivative.y = temp1.y + (c + e * tx + (g + h * tx) * tz) * dty;
    Vec2.multiplyScalar(outDerivative, outDerivative, frequency);
    return outDerivative;
}

export function perlin2D (outDerivative: Vec2, position: Vec2, frequency: number, cache: PerlinNoise2DCache) {
    const x = position.x * frequency;
    const y = position.y * frequency;
    cache.updateCache(x, y);
    const tx0 = x - cache.ix0;
    const ty0 = y - cache.iy0;
    const tx1 = tx0 - 1;
    const ty1 = ty0 - 1;

    const v00 = dot2(cache.g00, tx0, ty0);
    const v10 = dot2(cache.g10, tx1, ty0);
    const v01 = dot2(cache.g01, tx0, ty1);
    const v11 = dot2(cache.g11, tx1, ty1);
    const tx = smooth(tx0);
    const ty = smooth(ty0);
    const dtx = smoothDerivative(tx0);
    const dty = smoothDerivative(ty0);

    const b = v10 - v00;
    const c = v01 - v00;
    const d = v11 - v01 - b;

    Vec2.scaleAndAdd(outDerivative, Vec2.scaleAndAdd(outDerivative, cache.g00, Vec2.scaleAndAdd(outDerivative, cache.dc, cache.dd, tx), ty), cache.db, tx);
    outDerivative.x += (b + d * ty) * dtx;
    outDerivative.y += (c + d * tx) * dty;
    Vec2.multiplyScalar(outDerivative, outDerivative, frequency * Math.SQRT2);
    return outDerivative;
}

export function perlin1D (outDerivative: Vec2, x: number, frequency: number, cache: PerlinNoise1DCache) {
    x *= frequency;
    cache.updateCache(x);
    const t0 = x - cache.i0;
    const t1 = t0 - 1;

    const v0 = cache.g0 * t0;
    const v1 = cache.g1 * t1;
    const dt = smoothDerivative(t0);
    const t = smooth(t0);
    outDerivative.x = (cache.g0 + cache.db * t + (v1 - v0) * dt) * frequency * 2.0;
    outDerivative.y = 0;
    return outDerivative;
}

function dot2 (a: Vec2, bx: number, by: number) {
    return a.x * bx + a.y * by;
}

function dot3 (a: Vec3, bx: number, by: number, bz: number) {
    return a.x * bx + a.y * by + a.z * bz;
}

const pos = new Vec3();
const point3D = new Vec3();
const point2D = new Vec2();
const sampleX = new Vec2();
const sampleY = new Vec2();
const sampleZ = new Vec2();
const noiseXCache3D = new PerlinNoise3DCache();
const noiseYCache3D = new PerlinNoise3DCache();
const noiseZCache3D = new PerlinNoise3DCache();
const noiseXCache2D = new PerlinNoise2DCache();
const noiseYCache2D = new PerlinNoise2DCache();
const noiseZCache2D = new PerlinNoise2DCache();
const noiseXCache1D = new PerlinNoise1DCache();
const noiseYCache1D = new PerlinNoise1DCache();
const noiseZCache1D = new PerlinNoise1DCache();
const tempPanOffset = new Vec3();

export enum Algorithm {
    PERLIN,
    SIMPLEX,
    VALUE,
}

export enum Quality {
    LOW,
    MIDDLE,
    HIGH
}

@ccclass('cc.CurlNoiseForceModule')
@VFXModule.register('CurlNoiseForce', VFXExecutionStageFlags.UPDATE, [P_VELOCITY.name], [])
export class CurlNoiseForceModule extends VFXModule {
    @visible(true)
    public get separateAxes () {
        return this._separateAxes;
    }

    public set separateAxes (val) {
        this._separateAxes = val;
        this.requireRecompile();
    }

    @type(Vec3Expression)
    @visible(function (this: CurlNoiseForceModule) { return this.separateAxes; })
    public get strength () {
        if (!this._strength) {
            this._strength = new ConstantVec3Expression(1, 1, 1);
        }
        return this._strength;
    }

    public set strength (value) {
        this._strength = value;
        this.requireRecompile();
    }

    @type(FloatExpression)
    @visible(function (this: CurlNoiseForceModule) { return !this.separateAxes; })
    public get uniformStrength () {
        if (!this._uniformStrength) {
            this._uniformStrength = new ConstantFloatExpression(1);
        }
        return this._uniformStrength;
    }

    public set uniformStrength (val) {
        this._uniformStrength = val;
        this.requireRecompile();
    }

    @type(FloatExpression)
    @rangeMin(0.0001)
    public get frequency () {
        if (!this._frequency) {
            this._frequency = new ConstantFloatExpression(0.5);
        }
        return this._frequency;
    }
    public set frequency (value) {
        this._frequency = value;
        this.requireRecompile();
    }

    @type(Vec3Expression)
    public get panSpeed () {
        if (!this._panSpeed) {
            this._panSpeed = new ConstantVec3Expression(0, 0, 0);
        }
        return this._panSpeed;
    }

    public set panSpeed (val) {
        this._panSpeed = val;
        this.requireRecompile();
    }

    @type(Enum(Quality))
    @visible(true)
    public get quality () {
        return this._quality;
    }

    public set quality (val) {
        this._quality = val;
        this.requireRecompile();
    }

    @visible(true)
    public get enableRemap () {
        return this._enableRemap;
    }

    public set enableRemap (val) {
        this._enableRemap = val;
        this.requireRecompile();
    }

    @type(RealCurve)
    @visible(function (this: CurlNoiseForceModule) { return this.enableRemap && this.separateAxes; })
    public get remapX () {
        if (!this._remapX) {
            this._remapX = new RealCurve();
        }
        return this._remapX;
    }
    public set remapX (value) {
        this._remapX = value;
        this.requireRecompile();
    }

    @type(RealCurve)
    @visible(function (this: CurlNoiseForceModule) { return this.enableRemap && this.separateAxes; })
    public get remapY () {
        if (!this._remapY) {
            this._remapY = new RealCurve();
        }
        return this._remapY;
    }
    public set remapY (value) {
        this._remapY = value;
        this.requireRecompile();
    }

    @type(RealCurve)
    @visible(function (this: CurlNoiseForceModule) { return this.enableRemap && this.separateAxes; })
    public get remapZ () {
        if (!this._remapZ) {
            this._remapZ = new RealCurve();
        }
        return this._remapZ;
    }
    public set remapZ (value) {
        this._remapZ = value;
        this.requireRecompile();
    }

    @type(RealCurve)
    @visible(function (this: CurlNoiseForceModule) { return this.enableRemap && !this.separateAxes; })
    public get remapCurve () {
        return this.remapX;
    }
    public set remapCurve (value) {
        this.remapX = value;
    }

    @serializable
    private _strength: Vec3Expression | null = null;
    @serializable
    private _uniformStrength: FloatExpression | null = null;
    @serializable
    private _panSpeed: Vec3Expression | null = null;
    @serializable
    private _frequency: FloatExpression | null = null;
    @serializable
    private _remapX: RealCurve | null = null;
    @serializable
    private _remapY: RealCurve | null = null;
    @serializable
    private _remapZ: RealCurve | null = null;
    @serializable
    private _separateAxes = false;
    @serializable
    private _quality = Quality.HIGH;
    @serializable
    private _enableRemap = false;

    private _offset = new Vec3();

    public onPlay (state: VFXEmitterState) {
        super.onPlay(state);
        RandomStream.get3Float(this.randomSeed, this._offset);
        this._offset.multiplyScalar(100);
    }

    public compile (parameterMap: VFXParameterMap, owner: VFXStage) {
        super.compile(parameterMap, owner);
        parameterMap.ensure(P_POSITION);
        parameterMap.ensure(P_VELOCITY);
        parameterMap.ensure(P_PHYSICS_FORCE);
        if (this._separateAxes) {
            this.strength.compile(parameterMap, this);
        } else {
            this.uniformStrength.compile(parameterMap, this);
        }
        this.panSpeed.compile(parameterMap, this);
    }

    public execute (parameterMap: VFXParameterMap) {
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const samplePosition = parameterMap.getVec3ArrayValue(P_POSITION);
        const physicsForce = parameterMap.getVec3ArrayValue(P_PHYSICS_FORCE);
        const frequencyExp = this._frequency as FloatExpression;
        const strengthExp = this._strength as Vec3Expression;
        const uniformStrengthExp = this._uniformStrength as FloatExpression;
        const panSpeedExp = this._panSpeed as Vec3Expression;
        const offset = this._offset;
        const separateAxes = this._separateAxes;
        const remap = this._enableRemap;
        if (separateAxes) {
            strengthExp.bind(parameterMap);
        } else {
            uniformStrengthExp.bind(parameterMap);
        }
        panSpeedExp.bind(parameterMap);
        frequencyExp.bind(parameterMap);

        // eslint-disable-next-line no-lonely-if
        if (this._quality === Quality.HIGH) {
            for (let i = fromIndex; i < toIndex; i++) {
                panSpeedExp.evaluate(i, tempPanOffset);
                samplePosition.getVec3At(pos, i);
                const frequency = frequencyExp.evaluate(i);
                pos.add(offset);
                perlin3D(sampleX, Vec3.set(point3D, pos.z, pos.y, pos.x + tempPanOffset.x), frequency, noiseXCache3D);
                perlin3D(sampleY, Vec3.set(point3D, pos.x + 100, pos.z, pos.y + tempPanOffset.y), frequency, noiseYCache3D);
                perlin3D(sampleZ, Vec3.set(point3D, pos.y, pos.x + 100, pos.z + tempPanOffset.z), frequency, noiseZCache3D);
                Vec3.set(temp1, sampleZ.x - sampleY.y, sampleX.x - sampleZ.y, sampleY.x - sampleX.y);
                this.remapAndScale(separateAxes, remap, i, temp1);
                physicsForce.addVec3At(temp1, i);
            }
        } else if (this._quality === Quality.MIDDLE) {
            for (let i = fromIndex; i < toIndex; i++) {
                panSpeedExp.evaluate(i, tempPanOffset);
                samplePosition.getVec3At(pos, i);
                const frequency = frequencyExp.evaluate(i);
                pos.add(offset);
                perlin2D(sampleX, Vec2.set(point2D, pos.z, pos.y + tempPanOffset.x), frequency, noiseXCache2D);
                perlin2D(sampleY, Vec2.set(point2D, pos.x + 100, pos.z + tempPanOffset.y), frequency, noiseYCache2D);
                perlin2D(sampleZ, Vec2.set(point2D, pos.y, pos.x + 100 + tempPanOffset.z), frequency, noiseZCache2D);
                Vec3.set(temp1, sampleZ.x - sampleY.y, sampleX.x - sampleZ.y, sampleY.x - sampleX.y);
                this.remapAndScale(separateAxes, remap, i, temp1);
                physicsForce.addVec3At(temp1, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                panSpeedExp.evaluate(i, tempPanOffset);
                samplePosition.getVec3At(pos, i);
                const frequency = frequencyExp.evaluate(i);
                pos.add(offset);
                perlin1D(sampleX, pos.z + tempPanOffset.x, frequency, noiseXCache1D);
                perlin1D(sampleY, pos.x + 100 + tempPanOffset.y, frequency, noiseYCache1D);
                perlin1D(sampleZ, pos.y + tempPanOffset.z, frequency, noiseZCache1D);
                Vec3.set(temp1, sampleZ.x - sampleY.y, sampleX.x - sampleZ.y, sampleY.x - sampleX.y);
                this.remapAndScale(separateAxes, remap, i, temp1);
                physicsForce.addVec3At(temp1, i);
            }
        }
    }

    private remapAndScale (separateAxes: boolean, remap: boolean, index: number, noise: Vec3) {
        // remap
        if (remap) {
            if (separateAxes) {
                const remapX = this.remapX;
                const remapY = this.remapY;
                const remapZ = this.remapZ;
                noise.x = remapX.evaluate(clamp(noise.x * 0.5 + 0.5, 0, 1));
                noise.y = remapY.evaluate(clamp(noise.y * 0.5 + 0.5, 0, 1));
                noise.z = remapZ.evaluate(clamp(noise.z * 0.5 + 0.5, 0, 1));
            } else {
                const remapCurve = this.remapCurve;
                noise.x = remapCurve.evaluate(clamp(noise.x * 0.5 + 0.5, 0, 1));
                noise.y = remapCurve.evaluate(clamp(noise.y * 0.5 + 0.5, 0, 1));
                noise.z = remapCurve.evaluate(clamp(noise.z * 0.5 + 0.5, 0, 1));
            }
        }
        // eslint-disable-next-line no-lonely-if
        if (separateAxes) {
            Vec3.multiply(noise, noise, (this._strength as Vec3Expression).evaluate(index, temp1));
        } else {
            Vec3.multiplyScalar(noise, noise, (this._uniformStrength as FloatExpression).evaluate(index));
        }
    }
}
