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

import { EDITOR } from 'internal:constants';
import { Camera, CameraUsage } from '../../render-scene/scene';
import { Pipeline, PipelineBuilder } from './pipeline';
import { buildForwardPass, buildGBufferPass, buildLightingPass, buildPostprocessPass,
    buildReflectionProbePasss, buildUIPass } from './define';
import { isUICamera } from './utils';

export class ForwardPipelineBuilder implements PipelineBuilder {
    public setup (cameras: Camera[], ppl: Pipeline): void {
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene === null) {
                continue;
            }
            // forward pass
            buildForwardPass(camera, ppl, false);
            if (EDITOR) {
                buildReflectionProbePasss(camera, ppl, false);
            }
        }
    }
}

export class DeferredPipelineBuilder implements PipelineBuilder {
    public setup (cameras: Camera[], ppl: Pipeline): void {
        for (let i = 0; i < cameras.length; ++i) {
            const camera = cameras[i];
            if (!camera.scene) {
                continue;
            }
            const isGameView = camera.cameraUsage === CameraUsage.GAME
                || camera.cameraUsage === CameraUsage.GAME_VIEW;
            if (!isGameView) {
                buildForwardPass(camera, ppl, false);
                continue;
            }
            if (!isUICamera(camera)) {
            // GBuffer Pass
                const gBufferInfo = buildGBufferPass(camera, ppl);
                // Lighting Pass
                const lightInfo = buildLightingPass(camera, ppl, gBufferInfo);
                // Postprocess
                buildPostprocessPass(camera, ppl, lightInfo.rtName);
                continue;
            }
            // render ui
            buildUIPass(camera, ppl);
        }
    }
}
