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

import { EDITOR } from 'internal:constants';
import { cclegacy, toRadian, Vec2, Vec4, Vec3, v3 } from '../../../core';
import { Camera, CameraUsage } from '../../../render-scene/scene';
import { Pipeline, QueueHint } from '../../custom';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';

import { getSetting, SettingPass } from './setting-pass';
import { HBAO } from '../components';
import { Texture2D } from '../../../asset/assets/texture-2d';
import { ImageAsset } from '../../../asset/assets/image-asset';
import { DebugViewCompositeType, DebugViewSingleType } from '../../debug-view';
import { ClearFlagBit, Format } from '../../../gfx';
import { Scene } from '../../../scene-graph/scene';

const vec2 = new Vec2();

class HBAOParams {
    declare randomTexture: Texture2D;

    get uvDepthToEyePosParams () {
        return this._uvDepthToEyePosParams;
    }

    get radiusParam () {
        return this._radiusParam;
    }

    get miscParam () {
        return this._miscParam;
    }

    get blurParam () {
        return this._blurParam;
    }

    set depthTexFullResolution (val: Vec2) {
        this._depthTexFullResolution.set(val);
    }

    set depthTexResolution (val: Vec2) {
        this._depthTexResolution.set(val);
    }

    set sceneScale (val: number) {
        this._sceneScale = val;
    }

    set cameraFov (val: number) {
        this._cameraFov = val;
    }

    set radiusScale (val: number) {
        this._radiusScale = val;
    }

    set angleBiasDegree (val: number) {
        this._angleBiasDegree = val;
    }

    set aoStrength (val: number) {
        this._aoStrength = val;
    }

    set blurSharpness (val: number) {
        this._blurSharpness = val;
    }

    set aoSaturation (val: number) {
        this._aoSaturation = val;
    }

    private _uvDepthToEyePosParams = new Vec4();
    private _radiusParam = new Vec4();
    private _miscParam = new Vec4();
    private _blurParam = new Vec4();

    private _depthTexFullResolution = new Vec2(1024);
    private _depthTexResolution = new Vec2(1024);
    private _sceneScale = 1.0;
    private _cameraFov = toRadian(45.0);
    private _radiusScale = 1.0;
    private _angleBiasDegree = 10.0;
    private _aoStrength = 1.0;
    private _blurSharpness = 8;
    private _aoSaturation = 1.0;

    private _randomDirAndJitter: number[] = [
        238, 91, 87, 255, 251, 44, 119, 255, 247, 64, 250, 255, 232, 5, 225, 255,
        253, 177, 140, 255, 250, 51, 84, 255, 243, 76, 97, 255, 252, 36, 232, 255,
        235, 100, 24, 255, 252, 36, 158, 255, 254, 20, 142, 255, 245, 135, 124, 255,
        251, 43, 121, 255, 253, 31, 145, 255, 235, 98, 160, 255, 240, 146, 198, 255,
    ];
    private _init () {
        const width = 4;
        const height = 4;
        const pixelFormat = Texture2D.PixelFormat.RGBA8888;
        const arrayBuffer = new Uint8Array(width * height * 4);
        for (let i = 0; i < this._randomDirAndJitter.length; i++) {
            arrayBuffer[i] = this._randomDirAndJitter[i];
        }
        const image = new ImageAsset({
            width,
            height,
            _data: arrayBuffer,
            _compressed: false,
            format: pixelFormat,
        });
        this.randomTexture = new Texture2D();
        this.randomTexture.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
        this.randomTexture.setMipFilter(Texture2D.Filter.NONE);
        this.randomTexture.setWrapMode(Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT, Texture2D.WrapMode.REPEAT);
        this.randomTexture.image = image;
        if (!this.randomTexture.getGFXTexture()) {
            console.warn('Unexpected: failed to create ao texture?');
        }
    }

    public update () {
        // should be same value as shader
        const HALF_KERNEL_RADIUS = 4;
        const INV_LN2 = 1.44269504;
        const SQRT_LN2 = 0.8325546;

        const gR = this._radiusScale * this._sceneScale;
        const gR2 = gR * gR;
        const gNegInvR2 = -1.0 / gR2;
        const gMaxRadiusPixels = 0.1 * Math.min(this._depthTexFullResolution.x, this._depthTexFullResolution.y);
        this._radiusParam.set(gR, gR2, gNegInvR2, gMaxRadiusPixels);

        const vec2 = new Vec2(this._depthTexResolution.y / this._depthTexResolution.x, 1.0);
        const gFocalLen = new Vec2(vec2.x / Math.tan(this._cameraFov * 0.5), vec2.y / Math.tan(this._cameraFov * 0.5));
        const gTanAngleBias = Math.tan(toRadian(this._angleBiasDegree));
        const gStrength = this._aoStrength;
        this._miscParam.set(gFocalLen.x, gFocalLen.y, gTanAngleBias, gStrength);

        const gUVToViewA = new Vec2(2.0 / gFocalLen.x, -2.0 / gFocalLen.y);
        const gUVToViewB = new Vec2(-1.0 / gFocalLen.x, 1.0 / gFocalLen.y);
        this._uvDepthToEyePosParams.set(gUVToViewA.x, gUVToViewA.y, gUVToViewB.x, gUVToViewB.y);

        const BlurSigma = (HALF_KERNEL_RADIUS + 1.0) * 0.5;
        const gBlurFallOff = INV_LN2 / (2.0 * BlurSigma * BlurSigma);
        const gBlurDepthThreshold = 2.0 * SQRT_LN2 * (this._sceneScale / this._blurSharpness);
        this._blurParam.set(gBlurFallOff, gBlurDepthThreshold, this._blurSharpness / 8.0, this._aoSaturation);
    }

    constructor () {
        this._init();
        this.update();
    }
}

export class HBAOPass extends SettingPass {
    private HBAO_PASS_INDEX = 0;
    private HBAO_BLUR_X_PASS_INDEX = 1;
    private HBAO_BLUR_Y_PASS_INDEX = 2;
    private HBAO_COMBINED_PASS_INDEX = 3;
    private _hbaoParams: HBAOParams = new HBAOParams();
    private _initialize = false;
    private averageSceneScale = new Map<Scene, number>();

    get setting () { return getSetting(HBAO); }

    name = 'HBAOPass'
    effectName = 'pipeline/post-process/hbao';
    outputNames = ['hbaoRTName', 'hbaoBluredRTName']

    checkEnable (camera: Camera) {
        let enable = super.checkEnable(camera);
        if (EDITOR && camera.cameraUsage === CameraUsage.PREVIEW) {
            enable = false;
        }
        return enable;
    }

    public getSceneScale (camera: Camera) {
        let sceneScale = camera.nearClip;
        if (!this.averageSceneScale.has(camera.node.scene)) {
            this._calculateSceneScale(camera.node.scene, camera.visibility);
        }
        if (this.averageSceneScale.has(camera.node.scene)) {
            sceneScale = this.averageSceneScale.get(camera.node.scene)!;
        }
        return sceneScale;
    }

    public render (camera: Camera, ppl: Pipeline): void {
        passContext.updatePassViewPort();
        const width = passContext.passViewport.width;
        const height = passContext.passViewport.height;

        const setting = this.setting;
        if (!this._initialize) {
            passContext.material = this.material;
            this.material.setProperty('RandomTex', this._hbaoParams.randomTexture, 0);
        }

        // params
        const aoStrength = 1.0;
        // todo: nearest object distance from camera
        const sceneScale = this.getSceneScale(camera);
        // todo: Half Res Depth Tex
        this._hbaoParams.depthTexFullResolution = vec2.set(width, height);
        this._hbaoParams.depthTexResolution = vec2.set(width, height);
        this._hbaoParams.sceneScale = sceneScale;
        this._hbaoParams.cameraFov = camera.fov;
        this._hbaoParams.radiusScale = setting.radiusScale;
        this._hbaoParams.angleBiasDegree = setting.angleBiasDegree;
        this._hbaoParams.aoStrength = aoStrength;
        this._hbaoParams.blurSharpness = setting.blurSharpness;
        this._hbaoParams.aoSaturation = setting.aoSaturation;
        this._hbaoParams.update();

        // debug view
        const director = cclegacy.director;
        const root = director.root;
        if (root.debugView) {
            if (root.debugView.isEnabled()
                && (root.debugView.singleMode !== DebugViewSingleType.NONE && root.debugView.singleMode !== DebugViewSingleType.AO
                || !root.debugView.isCompositeModeEnabled(DebugViewCompositeType.AO))) {
                this.enable = false;
            }
        }

        const inputRT = this.lastPass!.slotName(camera, 0);
        const inputDS = this.lastPass!.slotName(camera, 1);
        const hbaoInfo = this._renderHBAOPass(camera, inputDS);
        let hbaoCombinedInputRTName = hbaoInfo.rtName;
        if (this.setting.needBlur) {
            const haboBlurInfoX =  this._renderHBAOBlurPass(camera, hbaoInfo.rtName, inputDS, false);
            const haboBlurInfoY = this._renderHBAOBlurPass(camera, haboBlurInfoX.rtName, inputDS, true);
            hbaoCombinedInputRTName = haboBlurInfoY.rtName;
        }
        this._renderHBAOCombinedPass(camera, hbaoCombinedInputRTName, inputRT);
    }

    private _renderHBAOPass (camera: Camera, inputDS: string) {
        const cameraID = getCameraUniqueID(camera);

        const passIdx = this.HBAO_PASS_INDEX;
        this.material.setProperty('uvDepthToEyePosParams',  this._hbaoParams.uvDepthToEyePosParams, passIdx);
        this.material.setProperty('radiusParam', this._hbaoParams.radiusParam, passIdx);
        this.material.setProperty('miscParam', this._hbaoParams.miscParam, passIdx);
        this.material.setProperty('randomTexSize',
            new Vec4(
                this._hbaoParams.randomTexture.width,
                this._hbaoParams.randomTexture.height,
                1.0 / this._hbaoParams.randomTexture.width,
                1.0 / this._hbaoParams.randomTexture.height,
            ),
            passIdx);
        this.material.setProperty('blurParam', this._hbaoParams.blurParam, passIdx);

        passContext.clearBlack();

        const outputRT = super.slotName(camera, 0);
        const layoutName = 'hbao-pass';
        const passName = `CameraHBAOPass${cameraID}`;
        passContext.addRenderPass(layoutName, passName)
            .setPassInput(inputDS, 'DepthTex')
            .addRasterView(outputRT, Format.BGRA8)
            .blitScreen(passIdx)
            .version();

        return { rtName: outputRT, dsName: inputDS };
    }

    private _renderHBAOBlurPass (camera: Camera, inputRT: string, inputDS: string, isYPass: boolean) {
        const cameraID = getCameraUniqueID(camera);

        passContext.clearBlack();

        const passIdx = isYPass ? this.HBAO_BLUR_Y_PASS_INDEX : this.HBAO_BLUR_X_PASS_INDEX;
        passContext.material = this.material;
        this.material.setProperty('uvDepthToEyePosParams',  this._hbaoParams.uvDepthToEyePosParams, passIdx);
        this.material.setProperty('radiusParam', this._hbaoParams.radiusParam, passIdx);
        this.material.setProperty('miscParam', this._hbaoParams.miscParam, passIdx);
        this.material.setProperty('randomTexSize',
            new Vec4(
                this._hbaoParams.randomTexture.width,
                this._hbaoParams.randomTexture.height,
                1.0 / this._hbaoParams.randomTexture.width,
                1.0 / this._hbaoParams.randomTexture.height,
            ),
            passIdx);
        this.material.setProperty('blurParam', this._hbaoParams.blurParam, passIdx);

        let outputRT = super.slotName(camera, 1);
        let layoutName = 'blurx-pass';
        let passName = `CameraHBAOBluredXPass${cameraID}`;
        if (isYPass) {
            outputRT = super.slotName(camera, 0);
            layoutName = 'blury-pass';
            passName = `CameraHBAOBluredYPass${cameraID}`;
        }
        passContext.addRenderPass(layoutName, passName)
            .setPassInput(inputRT, 'AOTexNearest')
            .setPassInput(inputDS, 'DepthTex')
            .addRasterView(outputRT, Format.BGRA8)
            .blitScreen(passIdx)
            .version();

        return { rtName: outputRT, dsName: inputDS };
    }

    private _renderHBAOCombinedPass (camera: Camera, inputRT: string, outputRT: string) {
        const cameraID = getCameraUniqueID(camera);

        const passIdx = this.HBAO_COMBINED_PASS_INDEX;
        passContext.material = this.material;
        this.material.setProperty('uvDepthToEyePosParams',  this._hbaoParams.uvDepthToEyePosParams, passIdx);
        this.material.setProperty('radiusParam', this._hbaoParams.radiusParam, passIdx);
        this.material.setProperty('miscParam', this._hbaoParams.miscParam, passIdx);
        this.material.setProperty('randomTexSize',
            new Vec4(
                this._hbaoParams.randomTexture.width,
                this._hbaoParams.randomTexture.height,
                1.0 / this._hbaoParams.randomTexture.width,
                1.0 / this._hbaoParams.randomTexture.height,
            ),
            passIdx);
        this.material.setProperty('blurParam', this._hbaoParams.blurParam, passIdx);

        passContext.clearFlag = ClearFlagBit.NONE;

        const layoutName = 'combine-pass';
        const passName = `CameraHBAOCombinedPass${cameraID}`;
        passContext.addRenderPass(layoutName, passName)
            .setPassInput(inputRT, 'AOTexNearest')
            .addRasterView(outputRT, Format.BGRA8)
            .blitScreen(passIdx)
            .version();
    }

    private _calculateSceneScale (scene: Scene, visibility: number) {
        if (!scene || !scene.renderScene) {
            return;
        }
        const sumSize = new Vec3(0);
        let modelCount = 0;
        const models = scene.renderScene.models;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            if (!model.node || !model.worldBounds) continue;
            if (model.node.layer & visibility) {
                sumSize.add(model.worldBounds.halfExtents);
                modelCount++;
            }
        }
        if (modelCount > 0) {
            sumSize.divide(v3(modelCount));
            const scale = Math.min(sumSize.x, sumSize.y, sumSize.z);
            this.averageSceneScale.set(scene, scale);
        }
    }

    slotName (camera: Camera, index = 0) {
        return this.lastPass!.slotName(camera, index);
    }
}
