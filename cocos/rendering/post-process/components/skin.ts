/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { CCFloat, cclegacy, Vec3, Vec4 } from '../../../core';
import { ccclass, disallowMultiple, editable, executeInEditMode, menu, range,
    serializable, slide, tooltip, type, visible } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

const _varianceArray: number[] = [0.0484, 0.187, 0.567, 1.99, 7.41];
const _strengthParameterArray: number[] = [0.100, 0.118, 0.113, 0.358, 0.078];
const _vec3Temp: Vec3 = new Vec3();
const _vec3Temp2: Vec3 = new Vec3();
const _vec4Temp: Vec4 = new Vec4();
const _vec4Temp2: Vec4 = new Vec4();

export const EXPONENT = 2.0;
export const I_SAMPLES_COUNT = 25;

export class SSSSBlurData {
    get ssssStrength () {
        return this._v3SSSSStrength;
    }
    set ssssStrength (val: Vec3) {
        this._v3SSSSStrength = val;
        this._updateSampleCount();
    }

    get ssssFallOff () {
        return this._v3SSSSFallOff;
    }
    set ssssFallOff (val: Vec3) {
        this._v3SSSSFallOff = val;
        this._updateSampleCount();
    }

    get kernel () {
        return this._kernel;
    }

    private _v3SSSSStrength = new Vec3(0.48, 0.41, 0.28);
    private _v3SSSSFallOff = new Vec3(1.0, 0.37, 0.3);
    private _kernel: Vec4[] = [];

    /**
     * We use a falloff to modulate the shape of the profile. Big falloffs
     * spreads the shape making it wider, while small falloffs make it
     * narrower.
     */
    private _gaussian (out: Vec3, variance: number, r: number) {
        const xx = r / (0.001 + this._v3SSSSFallOff.x);
        out.x = Math.exp((-(xx * xx)) / (2.0 * variance)) / (2.0 * 3.14 * variance);
        const yy = r / (0.001 + this._v3SSSSFallOff.y);
        out.y = Math.exp((-(yy * yy)) / (2.0 * variance)) / (2.0 * 3.14 * variance);
        const zz = r / (0.001 + this._v3SSSSFallOff.z);
        out.z = Math.exp((-(zz * zz)) / (2.0 * variance)) / (2.0 * 3.14 * variance);
    }

    /**
     * We used the red channel of the original skin profile defined in
     * [d'Eon07] for all three channels. We noticed it can be used for green
     * and blue channels (scaled using the falloff parameter) without
     * introducing noticeable differences and allowing for total control over
     * the profile. For example, it allows to create blue SSS gradients, which
     * could be useful in case of rendering blue creatures.
     */
    private _profile (out: Vec3, val: number) {
        for (let i = 0; i < 5; i++) {
            this._gaussian(_vec3Temp2, _varianceArray[i], val);
            _vec3Temp2.multiplyScalar(_strengthParameterArray[i]);
            out.add(_vec3Temp2);
        }
    }

    private _updateSampleCount () {
        const strength = this._v3SSSSStrength;
        const nSamples = I_SAMPLES_COUNT;
        const range = nSamples > 20 ? 3.0 : 2.0;

        // Calculate the offsets:
        const step = 2.0 * range / (nSamples - 1);
        for (let i = 0; i < nSamples; i++) {
            const o = -range + i * step;
            const sign = o < 0.0 ? -1.0 : 1.0;
            // eslint-disable-next-line no-restricted-properties
            this._kernel[i].w = range * sign * Math.abs(Math.pow(o, EXPONENT)) / Math.pow(range, EXPONENT);
        }

        // Calculate the weights:
        for (let i = 0; i < nSamples; i++) {
            const w0 = i > 0 ? Math.abs(this._kernel[i].w - this._kernel[i - 1].w) : 0.0;
            const w1 = i < nSamples - 1 ? Math.abs(this._kernel[i].w - this._kernel[i + 1].w) : 0.0;
            const area = (w0 + w1) / 2.0;
            _vec3Temp.set(0);
            this._profile(_vec3Temp, this._kernel[i].w);
            _vec3Temp.multiplyScalar(area);
            this._kernel[i].x = _vec3Temp.x;
            this._kernel[i].y = _vec3Temp.y;
            this._kernel[i].z = _vec3Temp.z;
        }

        // We want the offset 0.0 to come first:
        const remainder = nSamples % 2;
        _vec4Temp.set(this._kernel[(nSamples - remainder) / 2]);
        for (let i = (nSamples - remainder) / 2; i > 0; i--) {
            _vec4Temp2.set(this._kernel[i - 1]);
            this._kernel[i].set(_vec4Temp2);
        }
        this._kernel[0].set(_vec4Temp);

        // Calculate the sum of the weights, we will need to normalize them below:
        _vec3Temp.set(0.0);
        for (let i = 0; i < nSamples; i++) {
            _vec3Temp.add3f(this._kernel[i].x, this._kernel[i].y, this._kernel[i].z);
        }
        // Normalize the weights:
        for (let i = 0; i < nSamples; i++) {
            this._kernel[i].x /= _vec3Temp.x;
            this._kernel[i].y /= _vec3Temp.y;
            this._kernel[i].z /= _vec3Temp.z;
        }

        // Tweak them using the desired strength. The first one is:
        // lerp(1.0, kernel[0].rgb, strength)
        this._kernel[0].x = (1.0 - strength.x) * 1.0 + strength.x * this._kernel[0].x;
        this._kernel[0].y = (1.0 - strength.y) * 1.0 + strength.y * this._kernel[0].y;
        this._kernel[0].z = (1.0 - strength.z) * 1.0 + strength.z * this._kernel[0].z;

        // The others:
        // lerp(0.0, kernel[0].rgb, strength)
        for (let i = 1; i < nSamples; i++) {
            this._kernel[i].x *= strength.x;
            this._kernel[i].y *= strength.y;
            this._kernel[i].z *= strength.z;
        }
    }

    private _init () {
        for (let i = 0; i < I_SAMPLES_COUNT; i++) {
            this._kernel[i] = new Vec4();
        }
        this._updateSampleCount();
    }

    constructor () {
        this._init();
    }
}

@ccclass('cc.Skin')
@menu('PostProcess/Skin')
@disallowMultiple
@executeInEditMode
export class Skin extends PostProcessSetting {
    @serializable
    protected _blurRadius = 0.01;
    @serializable
    protected _sssIntensity = 5.0;

    private _ssssBlurData = new SSSSBlurData();

    /**
     * @en Getter/Setter sampler width.
     * @zh 设置或者获取采样宽度。
     */
    @visible(false)
    @editable
    @range([0.0, 0.1, 0.001])
    @slide
    @type(CCFloat)
    @tooltip('i18n:skin.blurRadius')
    set blurRadius (val: number) {
        if ((cclegacy.director.root.pipeline.pipelineSceneData.standardSkinModel === null)) {
            console.warn('Separable-SSS skin filter need set standard model, please check the isGlobalStandardSkinObject option in the MeshRender component.');
            return;
        }
        this._blurRadius = val;
    }
    get blurRadius () {
        return this._blurRadius;
    }

    /**
     * @en Getter/Setter depth unit scale.
     * @zh 设置或者获取深度单位比例。
     */
    @editable
    @range([0.0, 10.0, 0.1])
    @slide
    @type(CCFloat)
    @tooltip('i18n:skin.sssIntensity')
    set sssIntensity (val: number) {
        if ((cclegacy.director.root.pipeline.pipelineSceneData.standardSkinModel === null)) {
            console.warn('Separable-SSS skin filter need set standard model, please check the isGlobalStandardSkinObject option in the MeshRender component.');
            return;
        }
        this._sssIntensity = val;
    }
    get sssIntensity () {
        return this._sssIntensity;
    }

    get ssssBlurData () {
        return this._ssssBlurData;
    }
}
