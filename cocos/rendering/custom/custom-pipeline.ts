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
    AntiAliasing, buildUIPass, buildSSSSPass, hasSkinObject, buildTransparencyPass, buildToneMappingPass } from './define';
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
                // forward pass
                const forwardInfo = buildForwardPass(camera, ppl, isGameView);
                // fxaa pass
                const fxaaInfo = buildFxaaPass(camera, ppl, forwardInfo.rtName, forwardInfo.dsName);
                // bloom passes
                const bloomInfo = buildBloomPasses(camera, ppl, fxaaInfo.rtName);
                // tone map pass
                const toneMappingInfo =  buildToneMappingPass(camera, ppl, bloomInfo.rtName, bloomInfo.dsName);
                // Present Pass
                buildPostprocessPass(camera, ppl, toneMappingInfo.rtName, AntiAliasing.NONE);
                continue;
            }
            // render ui
            buildUIPass(camera, ppl);
        }
    }
}

export class SkinPipelineBuilder implements PipelineBuilder {
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
                const hasDeferredTransparencyObjects = hasSkinObject(ppl);
                // forward pass
                const forwardInfo = buildForwardPass(camera, ppl, isGameView, !hasDeferredTransparencyObjects);
                // skin pass
                const skinInfo = buildSSSSPass(camera, ppl, forwardInfo.rtName, forwardInfo.dsName);
                // deferred transparency objects
                const deferredTransparencyInfo = buildTransparencyPass(camera, ppl, skinInfo.rtName, skinInfo.dsName, hasDeferredTransparencyObjects);
                // todo: hbao pass
                // tone map pass
                const toneMappingInfo =  buildToneMappingPass(camera, ppl, deferredTransparencyInfo.rtName, deferredTransparencyInfo.dsName);
                // fxaa pass
                const fxaaInfo = buildFxaaPass(camera, ppl, toneMappingInfo.rtName, toneMappingInfo.dsName);
                // bloom passes
                // todo: bloom need to be rendered before tone-mapping
                const bloomInfo = buildBloomPasses(camera, ppl, fxaaInfo.rtName);
                // Present Pass
                buildPostprocessPass(camera, ppl, bloomInfo.rtName, AntiAliasing.NONE);
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
