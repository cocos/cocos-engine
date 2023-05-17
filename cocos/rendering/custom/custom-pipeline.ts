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

import { Format, LoadOp } from '../../gfx/base/define';
import { Camera, CameraUsage } from '../../render-scene/scene';
import { BasicPipeline, PipelineBuilder } from './pipeline';
import { CopyPair, LightInfo, QueueHint, ResourceResidency, SceneFlags } from './types';
import { AntiAliasing, buildBloomPass, buildForwardPass, buildFxaaPass, buildPostprocessPass, buildSSSSPass,
    buildToneMappingPass, buildTransparencyPass, buildUIPass, hasSkinObject, buildHBAOPasses, buildCopyPass, getRenderArea } from './define';
import { isUICamera } from './utils';
import { RenderWindow } from '../../render-scene/core/render-window';

const copyPair = new CopyPair();
const pairs = [copyPair];
export class CustomPipelineBuilder implements PipelineBuilder {
    public setup (cameras: Camera[], ppl: BasicPipeline): void {
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
                const area = getRenderArea(camera, camera.window.width, camera.window.height);
                const width = area.width;
                const height = area.height;
                if (!ppl.containsResource('copyTexTest')) {
                    ppl.addRenderTarget('copyTexTest', Format.RGBA16F, width, height, ResourceResidency.PERSISTENT);
                }
                copyPair.source = forwardInfo.rtName;
                copyPair.target = 'copyTexTest';
                buildCopyPass(ppl, pairs);
                // fxaa pass
                const fxaaInfo = buildFxaaPass(camera, ppl, 'copyTexTest', forwardInfo.dsName);
                // bloom passes
                const bloomInfo = buildBloomPass(camera, ppl, fxaaInfo.rtName);
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
    public setup (cameras: Camera[], ppl: BasicPipeline): void {
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
                // hbao pass
                const hbaoInfo = buildHBAOPasses(camera, ppl, deferredTransparencyInfo.rtName, deferredTransparencyInfo.dsName);
                // tone map pass
                const toneMappingInfo =  buildToneMappingPass(camera, ppl, hbaoInfo.rtName, hbaoInfo.dsName);
                // fxaa pass
                const fxaaInfo = buildFxaaPass(camera, ppl, toneMappingInfo.rtName, toneMappingInfo.dsName);
                // bloom passes
                // todo: bloom need to be rendered before tone-mapping
                const bloomInfo = buildBloomPass(camera, ppl, fxaaInfo.rtName);
                // Present Pass
                buildPostprocessPass(camera, ppl, bloomInfo.rtName, AntiAliasing.NONE);
                continue;
            }
            // render ui
            buildUIPass(camera, ppl);
        }
    }
}

class CameraInfo {
    constructor (id: number, windowID: number, width: number, height: number) {
        this.id = id;
        this.windowID = windowID;
        this.width = width;
        this.height = height;
    }
    id = 0xFFFFFFFF;
    windowID = 0xFFFFFFFF;
    width = 0;
    height = 0;
}

export class TestPipelineBuilder implements PipelineBuilder {
    public setup (cameras: Camera[], ppl: BasicPipeline): void {
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene === null) {
                continue;
            }
            if (camera.cameraUsage !== CameraUsage.GAME) {
                buildForwardPass(camera, ppl, false);
                continue;
            }
            const info = this.prepareGameCamera(ppl, camera);
            this.buildForward(ppl, camera, info.id, info.width, info.height);
        }
    }
    private prepareRenderWindow (camera: Camera): number {
        let windowID = this._windows.get(camera.window);
        if (windowID === undefined) {
            windowID = this._windows.size;
            this._windows.set(camera.window, windowID);
        }
        return windowID;
    }
    private prepareGameCamera (ppl: BasicPipeline, camera: Camera): CameraInfo {
        let info = this._cameras.get(camera);
        if (info !== undefined) {
            let width = camera.window.width;
            let height = camera.window.height;
            if (width === 0) {
                width = 1;
            }
            if (height === 0) {
                height = 1;
            }
            const windowID = this.prepareRenderWindow(camera);
            if (info.width === width && info.height === height && info.windowID === windowID) {
                return info;
            }
            this.updateGameCamera(ppl, camera, info.id, info.windowID, info.width, info.height);
            return info;
        }
        const windowID = this.prepareRenderWindow(camera);
        info = new CameraInfo(
            this._cameras.size,
            windowID,
            camera.window.width ? camera.window.width : 1,
            camera.window.height ? camera.window.height : 1,
        );
        this.initGameCamera(ppl, camera, info.id, info.windowID, info.width, info.height);
        this._cameras.set(camera, info);
        return info;
    }
    private initGameCamera (ppl: BasicPipeline, camera: Camera, id: number, windowID: number, width: number, height: number) {
        ppl.addRenderWindow(`Color${windowID}`, Format.BGRA8, width, height, camera.window);
        ppl.addDepthStencil(`DepthStencil${id}`, Format.DEPTH_STENCIL, width, height);
    }
    private updateGameCamera (ppl: BasicPipeline, camera: Camera, id: number, windowID: number, width: number, height: number) {
        ppl.updateRenderWindow(`Color${windowID}`, camera.window);
        ppl.updateDepthStencil(`DepthStencil${id}`, width, height);
    }
    private buildForward (ppl: BasicPipeline, camera: Camera, id: number, width: number, height: number) {
        const scene = camera.scene;
        const pass = ppl.addRenderPass(width, height, 'default');

        pass.addRenderTarget(`Color${id}`, 'color', LoadOp.CLEAR);
        pass.addDepthStencil(`DepthStencil${id}`, '_', LoadOp.CLEAR);

        if (scene) {
            pass.addQueue(QueueHint.RENDER_OPAQUE, 'default')
                .addSceneOfCamera(camera, new LightInfo(), SceneFlags.OPAQUE_OBJECT | SceneFlags.DEFAULT_LIGHTING);

            pass.addQueue(QueueHint.RENDER_CUTOUT, 'default')
                .addSceneOfCamera(camera, new LightInfo(), SceneFlags.CUTOUT_OBJECT | SceneFlags.DEFAULT_LIGHTING);

            pass.addQueue(QueueHint.RENDER_TRANSPARENT, 'default')
                .addSceneOfCamera(camera, new LightInfo(), SceneFlags.TRANSPARENT_OBJECT | SceneFlags.DEFAULT_LIGHTING);
        }
    }
    readonly _cameras = new Map<Camera, CameraInfo>();
    readonly _windows = new Map<RenderWindow, number>();
}
