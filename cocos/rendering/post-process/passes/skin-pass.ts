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

import { Vec4, Vec3, cclegacy, warnID } from '../../../core';
import { Camera } from '../../../render-scene/scene';
import { LightInfo, QueueHint, SceneFlags } from '../../custom/types';
import { BasicPipeline, PipelineRuntime } from '../../custom/pipeline';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';
import { ClearFlagBit, Format } from '../../../gfx';
import { ShadowPass } from './shadow-pass';
import { Root } from '../../../root';

import { SettingPass } from './setting-pass';
import { forceEnableFloatOutput, getRTFormatBeforeToneMapping, getShadowMapSampler } from './base-pass';

export const COPY_INPUT_DS_PASS_INDEX = 0;
export const SSSS_BLUR_X_PASS_INDEX = 1;
export const SSSS_BLUR_Y_PASS_INDEX = 2;

function hasSkinObject (ppl: PipelineRuntime): boolean {
    const sceneData = ppl.pipelineSceneData;
    return sceneData.skin.enabled && sceneData.skinMaterialModel !== null;
}

const _varianceArray: number[] = [0.0484, 0.187, 0.567, 1.99, 7.41];
const _strengthParameterArray: number[] = [0.100, 0.118, 0.113, 0.358, 0.078];
const _vec3Temp: Vec3 = new Vec3();
const _vec3Temp2: Vec3 = new Vec3();
const _vec4Temp: Vec4 = new Vec4();
const _vec4Temp2: Vec4 = new Vec4();

export const EXPONENT = 2.0;
export const I_SAMPLES_COUNT = 25;

export class SSSSBlurData {
    get ssssStrength (): Vec3 {
        return this._v3SSSSStrength;
    }
    set ssssStrength (val: Vec3) {
        this._v3SSSSStrength = val;
        this._updateSampleCount();
    }

    get ssssFallOff (): Vec3 {
        return this._v3SSSSFallOff;
    }
    set ssssFallOff (val: Vec3) {
        this._v3SSSSFallOff = val;
        this._updateSampleCount();
    }

    get kernel (): Vec4[] {
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
    private _gaussian (out: Vec3, variance: number, r: number): void {
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
    private _profile (out: Vec3, val: number): void {
        for (let i = 0; i < 5; i++) {
            this._gaussian(_vec3Temp2, _varianceArray[i], val);
            _vec3Temp2.multiplyScalar(_strengthParameterArray[i]);
            out.add(_vec3Temp2);
        }
    }

    private _updateSampleCount (): void {
        const strength = this._v3SSSSStrength;
        const nSamples = I_SAMPLES_COUNT;
        const range = nSamples > 20 ? 3.0 : 2.0;

        // Calculate the offsets:
        const step = 2.0 * range / (nSamples - 1);
        for (let i = 0; i < nSamples; i++) {
            const o = -range + i * step;
            const sign = o < 0.0 ? -1.0 : 1.0;
            // eslint-disable-next-line no-restricted-properties
            this._kernel[i].w = range * sign * Math.abs(o ** EXPONENT) / range ** EXPONENT;
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

    private _init (): void {
        for (let i = 0; i < I_SAMPLES_COUNT; i++) {
            this._kernel[i] = new Vec4();
        }
        this._updateSampleCount();
    }

    constructor () {
        this._init();
    }
}

export class SkinPass extends SettingPass {
    name = 'SkinPass';
    effectName = 'pipeline/ssss-blur';
    outputNames = ['SSSSBlur', 'SSSSBlurDS'];
    ssssBlurData = new SSSSBlurData();

    private _activate = false;

    enableInAllEditorCamera = true;
    checkEnable (camera: Camera): boolean {
        const ppl = (cclegacy.director.root as Root).pipeline;
        let enable = hasSkinObject(ppl);
        if (enable) {
            if (!this._activate) {
                if (!ppl.getMacroBool('CC_USE_FLOAT_OUTPUT')) {
                    warnID(16303);
                }
                if (!ppl.pipelineSceneData.standardSkinModel) {
                    warnID(16304);
                }
                this._activate = true;
            }
            enable = forceEnableFloatOutput(ppl);
        }
        return enable;
    }

    public render (camera: Camera, ppl: BasicPipeline): void {
        passContext.material = this.material;

        const inputRT = this.lastPass?.slotName(camera, 0);
        const inputDS = passContext.depthSlotName;
        this._buildSSSSBlurPass(camera, ppl, inputRT!, inputDS);
        this._buildSpecularPass(camera, ppl, inputRT!, inputDS);
    }

    private _buildSSSSBlurPass (
        camera: Camera,
        ppl: BasicPipeline,
        inputRT: string,
        inputDS: string,
    ): void {
        const cameraID = getCameraUniqueID(camera);
        const pipelineSceneData = ppl.pipelineSceneData;

        let halfExtents = new Vec3(0.2, 0.2, 0.2);
        const standardSkinModel = pipelineSceneData.standardSkinModel;
        const skinMaterialModel = pipelineSceneData.skinMaterialModel;
        if (standardSkinModel && standardSkinModel.worldBounds) {
            halfExtents = standardSkinModel.worldBounds.halfExtents;
        } else if (skinMaterialModel && skinMaterialModel.worldBounds) {
            halfExtents = skinMaterialModel.worldBounds.halfExtents;
        }
        const boundingBox = Math.min(halfExtents.x, halfExtents.y, halfExtents.z) * 2.0;

        const skin = pipelineSceneData.skin;

        const ssssBlurRTName = super.slotName(camera, 0);
        const ssssBlurDSName = super.slotName(camera, 1);

        // ==== Copy input DS ===
        const copyInputDSPassLayoutName = 'copy-pass';
        const copyInputDSPass = `copyDS-pass${cameraID}`;
        let passIdx = COPY_INPUT_DS_PASS_INDEX;
        passContext.updatePassViewPort()
            .addRenderPass(copyInputDSPassLayoutName, copyInputDSPass)
            .setClearFlag(ClearFlagBit.COLOR)
            .setClearColor(1.0, 0, 0, 0)
            .setPassInput(inputDS, 'depthRaw')
            .addRasterView(ssssBlurDSName, Format.RGBA8)
            .blitScreen(passIdx)
            .version();

        // ==== SSSS Blur X Pass ===
        passIdx = SSSS_BLUR_X_PASS_INDEX;
        const ssssblurXPassLayoutName = 'ssss-blurX';
        const ssssblurXPassPassName = `ssss-blurX${cameraID}`;
        this.material.setProperty('blurInfo', new Vec4(
            camera.fov,
            skin.blurRadius,
            boundingBox,
            skin.sssIntensity,
        ), passIdx);
        this.material.setProperty('kernel',  this.ssssBlurData.kernel, passIdx);
        passContext.updatePassViewPort()
            .addRenderPass(ssssblurXPassLayoutName, ssssblurXPassPassName)
            .setPassInput(inputRT, 'colorTex')
            .setPassInput(ssssBlurDSName, 'depthTex')
            .setClearFlag(ClearFlagBit.COLOR)
            .setClearColor(0, 0, 0, 1)
            .addRasterView(ssssBlurRTName, getRTFormatBeforeToneMapping(ppl))
            .blitScreen(passIdx)
            .version();

        // === SSSS Blur Y Pass ===
        passIdx = SSSS_BLUR_Y_PASS_INDEX;
        const ssssblurYPassLayoutName = 'ssss-blurY';
        const ssssblurYPassPassName = `ssss-blurY${cameraID}`;
        this.material.setProperty('blurInfo', new Vec4(
            camera.fov,
            skin.blurRadius,
            boundingBox,
            skin.sssIntensity,
        ), passIdx);
        this.material.setProperty('kernel',  this.ssssBlurData.kernel, passIdx);
        passContext.updatePassViewPort()
            .addRenderPass(ssssblurYPassLayoutName, ssssblurYPassPassName)
            .setPassInput(ssssBlurRTName, 'colorTex')
            .setPassInput(ssssBlurDSName, 'depthTex')
            .setClearFlag(ClearFlagBit.NONE)
            .setClearColor(0, 0, 0, 1)
            .addRasterView(inputRT, getRTFormatBeforeToneMapping(ppl))
            .blitScreen(passIdx)
            .version();
    }

    private _buildSpecularPass (
        camera: Camera,
        ppl: BasicPipeline,
        inputRT: string,
        inputDS: string,
    ): void {
        const cameraID = getCameraUniqueID(camera);
        const layoutName = 'specular-pass';
        const passName = `specular-pass${cameraID}`;
        passContext.updatePassViewPort()
            .addRenderPass(layoutName, passName)
            .setClearFlag(ClearFlagBit.NONE)
            .setClearColor(0, 0, 0, 1)
            .addRasterView(inputRT, getRTFormatBeforeToneMapping(ppl), true)
            .setClearFlag(ClearFlagBit.NONE)
            .setClearDepthColor(camera.clearDepth, camera.clearStencil, 0, 1)
            .addRasterView(inputDS, Format.DEPTH_STENCIL, true)
            .version();

        const pass = passContext.pass!;
        const shadowPass = passContext.shadowPass as ShadowPass;
        if (shadowPass) {
            for (const dirShadowName of shadowPass.mainLightShadows) {
                if (ppl.containsResource(dirShadowName)) {
                    pass.addTexture(dirShadowName, 'cc_shadowMap', getShadowMapSampler());
                }
            }
            for (const spotShadowName of shadowPass.spotLightShadows) {
                if (ppl.containsResource(spotShadowName)) {
                    pass.addTexture(spotShadowName, 'cc_spotShadowMap', getShadowMapSampler());
                }
            }
        }

        pass.addQueue(QueueHint.RENDER_OPAQUE, 'default')
            .addSceneOfCamera(
                camera,
                new LightInfo(),
                SceneFlags.TRANSPARENT_OBJECT
            | SceneFlags.CUTOUT_OBJECT,
            );
        pass.addQueue(QueueHint.RENDER_TRANSPARENT, 'forward-add')
            .addSceneOfCamera(
                camera,
                new LightInfo(),
                SceneFlags.TRANSPARENT_OBJECT
            | SceneFlags.CUTOUT_OBJECT,
            );
    }

    slotName (camera: Camera, index = 0): string {
        return this.lastPass!.slotName(camera, index);
    }
}
