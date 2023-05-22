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

import { Vec4 } from '../../../core';
import { Camera, CameraUsage } from '../../../render-scene/scene';
import { BasicPipeline, QueueHint, SceneFlags } from '../../custom';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';
import { ClearFlagBit, Format } from '../../../gfx';
import { MeshRenderer } from '../../../3d';
import { ShadowPass } from './shadow-pass';

import { ForceEnableFloatOutput, GetRTFormatBeforeToneMapping, getSetting, SettingPass } from './setting-pass';
import { Skin } from '../components';

export const COPY_INPUT_DS_PASS_INDEX = 0;
export const SSSS_BLUR_X_PASS_INDEX = 1;
export const SSSS_BLUR_Y_PASS_INDEX = 2;

function hasSkinObject (ppl: BasicPipeline) {
    const sceneData = ppl.pipelineSceneData;
    return sceneData.skin.enabled && sceneData.standardSkinModel !== null;
}

export class SkinPass extends SettingPass {
    get setting () { return getSetting(Skin); }

    name = 'SkinPass'
    effectName = '../advanced/skin';
    outputNames = ['SSSSBlur', 'SSSSBlurDS']

    checkEnable (camera: Camera) {
        let enable = super.checkEnable(camera);
        if (EDITOR && camera.cameraUsage === CameraUsage.PREVIEW) {
            enable = false;
        }
        return enable;
    }

    public render (camera: Camera, ppl: BasicPipeline): void {
        passContext.material = this.material;

        const inputRT = this.lastPass?.slotName(camera, 0);
        const inputDS = this.lastPass?.slotName(camera, 1);
        if (hasSkinObject(ppl)) {
            ForceEnableFloatOutput(ppl);
            const blurInfo = this._buildSSSSBlurPass(camera, ppl, inputRT!, inputDS!);
            this._buildSpecularPass(camera, ppl, blurInfo.rtName, blurInfo.dsName);
        } else {
            this._buildSpecularPass(camera, ppl, inputRT!, inputDS!);
        }
    }

    private _buildCopyDSPass (camera: Camera,
        ppl: BasicPipeline,
        inputRT: string,
        inputDS: string) {
        const cameraID = getCameraUniqueID(camera);

        const outputDS = super.slotName(camera, 1);
        const layoutName = 'copy-pass';
        const passName = `copyDS-pass${cameraID}`;
        const passIdx = COPY_INPUT_DS_PASS_INDEX;

        passContext.updatePassViewPort()
            .addRenderPass(layoutName, passName)
            .setClearFlag(ClearFlagBit.COLOR)
            .setClearColor(1.0, 0, 0, 0)
            .setPassInput(inputDS, 'depthRaw')
            .addRasterView(outputDS, Format.RGBA8)
            .blitScreen(passIdx)
            .version();

        return { rtName: inputRT, dsName: outputDS };
    }

    private _buildBlurPass (camera: Camera,
        ppl: BasicPipeline,
        inputRT: string,
        inputDS: string,
        isY: boolean) {
        const cameraID = getCameraUniqueID(camera);

        let boundingBox = 0.4;
        const standardSkinModel = ppl.pipelineSceneData.standardSkinModel;
        const model = (standardSkinModel as MeshRenderer).model;
        if (model) {
            const halfExtents = model.worldBounds.halfExtents;
            boundingBox = Math.min(halfExtents.x, halfExtents.y, halfExtents.z) * 2.0;
        }
        const setting = this.setting;
        const passIdx = !isY ? SSSS_BLUR_X_PASS_INDEX : SSSS_BLUR_Y_PASS_INDEX;
        this.material.setProperty('blurInfo', new Vec4(camera.fov, setting.blurRadius,
            boundingBox, setting.sssIntensity), passIdx);
        this.material.setProperty('kernel',  setting.ssssBlurData.kernel, passIdx);

        const outputRT = super.slotName(camera, 0);
        const layoutName = !isY ? 'ssss-blurX' : 'ssss-blurY';
        const passName = !isY ? `ssss-blurX${cameraID}` : `ssss-blurY${cameraID}`;
        passContext.updatePassViewPort()
            .addRenderPass(layoutName, passName)
            .setPassInput(inputRT, 'colorTex')
            .setPassInput(inputDS, 'depthTex')
            .setClearFlag(!isY ? ClearFlagBit.COLOR : ClearFlagBit.NONE)
            .setClearColor(0, 0, 0, 1)
            .addRasterView(outputRT, GetRTFormatBeforeToneMapping(ppl))
            .setClearFlag(ClearFlagBit.NONE)
            .setClearColor(0, 0, 0, 0)
            .addRasterView(inputDS, Format.DEPTH_STENCIL)
            .blitScreen(passIdx)
            .version();

        return { rtName: outputRT, dsName: inputDS };
    }

    private _buildSSSSBlurPass (camera: Camera,
        ppl: BasicPipeline,
        inputRT: string,
        inputDS: string) {
        const copyPathInfo = this._buildCopyDSPass(camera, ppl, inputRT, inputDS);
        const blurXInfo = this._buildBlurPass(camera, ppl, inputRT, copyPathInfo.dsName, false);
        const blurYInfo = this._buildBlurPass(camera, ppl, blurXInfo.rtName, copyPathInfo.dsName, true);
        return { rtName: blurYInfo.rtName, dsName: blurYInfo.dsName };
    }

    private _buildSpecularPass (camera: Camera,
        ppl: BasicPipeline,
        inputRT: string,
        inputDS: string) {
        const cameraID = getCameraUniqueID(camera);
        passContext.updatePassViewPort()
            .addRenderPass('default', `${this.name}_${cameraID}`)
            .addRasterView(inputRT, GetRTFormatBeforeToneMapping(ppl))
            .addRasterView(inputDS, Format.DEPTH_STENCIL)
            .version();

        const pass = passContext.pass!;
        const shadowPass = passContext.shadowPass as ShadowPass;
        if (shadowPass) {
            for (const dirShadowName of shadowPass.mainLightShadows) {
                if (ppl.containsResource(dirShadowName)) {
                    pass.addTexture(dirShadowName, 'cc_shadowMap');
                }
            }
            for (const spotShadowName of shadowPass.spotLightShadows) {
                if (ppl.containsResource(spotShadowName)) {
                    pass.addTexture(spotShadowName, 'cc_spotShadowMap');
                }
            }
        }

        pass.addQueue(QueueHint.RENDER_OPAQUE)
            .addScene(camera.scene!,
                SceneFlags.OPAQUE_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.CUTOUT_OBJECT
                | SceneFlags.DEFAULT_LIGHTING | SceneFlags.DRAW_INSTANCING);
    }

    slotName (camera: Camera, index = 0) {
        return this.lastPass!.slotName(camera, index);
    }
}
