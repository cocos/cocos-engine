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
import { BasicPipeline, PipelineBuilder } from './pipeline';
import { buildClusterPasses } from './define';
import { isUICamera } from './utils';
import {
    prepareResource,
    setupForwardPass,
    setupForwardRes,
    setupReflectionProbePass,
    setupReflectionProbeRes,
    updateForwardRes,
    updateReflectionProbeRes,
    CameraInfo,
    setupGBufferPass,
    updateGBufferRes,
    setupGBufferRes,
    setupLightingPass,
    setupLightingRes,
    updateLightingRes,
    setupPostprocessPass,
    setupPostprocessRes,
    updatePostprocessRes,
    setupUIPass,
    setupUIRes,
    updateUIRes,
    setupDeferredForward,
    setupScenePassTiled,
} from './pipeline-define';
import { Feature } from '../../gfx';

export class ForwardPipelineBuilder implements PipelineBuilder {
    public setup (cameras: Camera[], ppl: BasicPipeline): void {
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene === null) {
                continue;
            }
            ppl.update(camera);
            const info = prepareResource(ppl, camera, this.initResource, this.updateResource);
            setupForwardPass(ppl, info);
            if (EDITOR) {
                setupReflectionProbePass(ppl, info);
            }
        }
    }
    private initResource (ppl: BasicPipeline, cameraInfo: CameraInfo): void {
        setupForwardRes(ppl, cameraInfo);
        if (EDITOR) setupReflectionProbeRes(ppl, cameraInfo);
    }
    private updateResource (ppl: BasicPipeline, cameraInfo: CameraInfo): void {
        updateForwardRes(ppl, cameraInfo);
        if (EDITOR) updateReflectionProbeRes(ppl, cameraInfo);
    }
}

export class DeferredPipelineBuilder implements PipelineBuilder {
    public setup (cameras: Camera[], ppl: BasicPipeline): void {
        for (let i = 0; i < cameras.length; ++i) {
            const camera = cameras[i];
            if (!camera.scene) {
                continue;
            }
            ppl.update(camera);
            const forceDisableCluster = false;
            const useCluster = !forceDisableCluster && ppl.device.hasFeature(Feature.COMPUTE_SHADER);

            const isGameView = camera.cameraUsage === CameraUsage.GAME
                || camera.cameraUsage === CameraUsage.GAME_VIEW;
            const info = prepareResource(ppl, camera, this.initResource, this.updateResource);
            if (!isGameView) {
                setupForwardPass(ppl, info);
                continue;
            }
            if (!isUICamera(camera)) {
                if (useCluster) {
                    buildClusterPasses(camera, ppl);
                }

                // GBuffer Pass
                setupGBufferPass(ppl, info);
                // Lighting Pass
                const lightInfo = setupLightingPass(ppl, info, useCluster);
                // Deferred ForwardPass, for non-surface-shader material and transparent material
                setupDeferredForward(ppl, info, lightInfo.rtName, useCluster);
                // Postprocess
                setupPostprocessPass(ppl, info, lightInfo.rtName);

                continue;
            }
            // render ui
            setupUIPass(ppl, info);
        }
    }
    private initResource (ppl: BasicPipeline, cameraInfo: CameraInfo): void {
        if (EDITOR) {
            setupForwardRes(ppl, cameraInfo);
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (!isUICamera(cameraInfo.camera)) {
            setupGBufferRes(ppl, cameraInfo);
            setupLightingRes(ppl, cameraInfo);
            setupPostprocessRes(ppl, cameraInfo);
        } else {
            setupUIRes(ppl, cameraInfo);
        }
    }
    private updateResource (ppl: BasicPipeline, cameraInfo: CameraInfo): void {
        if (EDITOR) {
            updateForwardRes(ppl, cameraInfo);
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (!isUICamera(cameraInfo.camera)) {
            updateGBufferRes(ppl, cameraInfo);
            updateLightingRes(ppl, cameraInfo);
            updatePostprocessRes(ppl, cameraInfo);
        } else {
            updateUIRes(ppl, cameraInfo);
        }
    }
}
