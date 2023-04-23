/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { Camera, CameraUsage } from '../../render-scene/scene';
import { buildFxaaPass, buildBloomPass as buildBloomPasses, buildForwardPass,
    buildNativeDeferredPipeline, buildNativeForwardPass, buildPostprocessPass,
    AntiAliasing, buildUIPass, buildSSSSBlurPass, buildSpecularPass, buildToneMapPass, buildAlphaPass } from './define';
import { Pipeline, PipelineBuilder } from './pipeline';
import { isUICamera } from './utils';

export class CustomPipelineBuilder implements PipelineBuilder {
    public setup (cameras: Camera[], ppl: Pipeline): void {
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene === null) {
                continue;
            }
            const isGameView = camera.cameraUsage === CameraUsage.GAME
                || camera.cameraUsage === CameraUsage.GAME_VIEW;
            if (!isGameView) {
                // forward pass
                buildForwardPass(camera, ppl, isGameView);
                continue;
            }
            // TODO: There is currently no effective way to judge the ui camera. Let’s do this first.
            if (!isUICamera(camera)) {
                const postAlpha = true;
                // forward pass
                const forwardInfo = buildForwardPass(camera, ppl, isGameView, !postAlpha);
                // blur pass
                const blurInfo  = buildSSSSBlurPass(camera, ppl, forwardInfo.rtName, forwardInfo.dsName);
                // specalur pass
                const specalurInfo = buildSpecularPass(camera, ppl, blurInfo.rtName, blurInfo.dsName);
                // fxaa pass
                // const fxaaInfo = buildFxaaPass(camera, ppl, specalurInfo.rtName);
                // bloom passes
                // const bloomInfo = buildBloomPasses(camera, ppl, fxaaInfo.rtName);
                // alpha pass
                const alphaPass = buildAlphaPass(camera, ppl, specalurInfo.rtName, specalurInfo.dsName, postAlpha);
                // tone map
                const toneMapInfo = buildToneMapPass(camera, ppl, alphaPass.rtName, alphaPass.dsName);
                // Present Pass
                buildPostprocessPass(camera, ppl, toneMapInfo.rtName, AntiAliasing.NONE);
                continue;
            }
            // render ui
            buildUIPass(camera, ppl);
        }
    }
}

export class NativePipelineBuilder implements PipelineBuilder {
    public setup (cameras: Camera[], ppl: Pipeline): void {
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene === null) {
                continue;
            }
            if (camera.cameraUsage !== CameraUsage.GAME) {
                buildForwardPass(camera, ppl, false);
                continue;
            }
            buildNativeForwardPass(camera, ppl);
            // buildNativeDeferredPipeline(camera, ppl);
        }
    }
}
