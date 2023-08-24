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

import { systemInfo } from 'pal/system-info';
import { Color, Format, LoadOp, Rect, StoreOp, Viewport } from '../../gfx/base/define';
import { CSMLevel, Camera, CameraUsage, Light, DirectionalLight, Shadows, SpotLight } from '../../render-scene/scene';
import { BasicPipeline, PipelineBuilder } from './pipeline';
import { CopyPair, LightInfo, QueueHint, ResourceResidency, SceneFlags } from './types';
import { buildBloomPass, buildForwardPass, buildFxaaPass, buildPostprocessPass, buildSSSSPass,
    buildToneMappingPass, buildTransparencyPass, buildUIPass, hasSkinObject,
    buildHBAOPasses, buildCopyPass, getRenderArea, buildReflectionProbePasss } from './define';
import { isUICamera } from './utils';
import { RenderWindow } from '../../render-scene/core/render-window';
import { assert, cclegacy, geometry } from '../../core';
import { RenderScene } from '../../render-scene';
import { AABB } from '../../core/geometry/aabb';
import { PipelineSceneData } from '../pipeline-scene-data';
import { supportsR32FloatTexture } from '../define';
import { CSMLayers } from '../shadow/csm-layers';

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
                // reflection probe pass
                buildReflectionProbePasss(camera, ppl);
                continue;
            }
            // TODO: There is currently no effective way to judge the ui camera. Let’s do this first.
            if (!isUICamera(camera)) {
                const hasDeferredTransparencyObjects = hasSkinObject(ppl);
                // forward pass
                const forwardInfo = buildForwardPass(camera, ppl, isGameView, !hasDeferredTransparencyObjects);
                // reflection probe pass
                buildReflectionProbePasss(camera, ppl);
                const area = getRenderArea(camera, camera.window.width, camera.window.height);
                const width = area.width;
                const height = area.height;
                if (!ppl.containsResource('copyTexTest')) {
                    ppl.addRenderTarget('copyTexTest', Format.RGBA16F, width, height, ResourceResidency.PERSISTENT);
                }
                copyPair.source = forwardInfo.rtName;
                copyPair.target = 'copyTexTest';
                buildCopyPass(ppl, pairs);

                // skin pass
                const skinInfo = buildSSSSPass(camera, ppl, 'copyTexTest', forwardInfo.dsName);
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
                buildPostprocessPass(camera, ppl, bloomInfo.rtName);
                continue;
            }
            // render ui
            buildUIPass(camera, ppl);
        }
    }
}

class WindowInfo {
    constructor (id: number, width: number, height: number) {
        this.id = id;
        this.width = width;
        this.height = height;
    }
    id = 0xFFFFFFFF;
    width = 0;
    height = 0;
}

class SceneInfo {
    constructor (pipelineSceneData: PipelineSceneData) {
        this.pipelineSceneData = pipelineSceneData;
        this.shadows = pipelineSceneData.shadows;
    }
    public reset (): void {
        this.punctualLights.length = 0;
        this.spotLights.length = 0;
    }
    readonly pipelineSceneData: PipelineSceneData;
    readonly punctualLights: Light[] = [];
    readonly spotLights: SpotLight[] = [];
    readonly shadows: Shadows;
}

export class TestPipelineBuilder implements PipelineBuilder {
    constructor (pipelineSceneData: PipelineSceneData) {
        this._sceneInfo = new SceneInfo(pipelineSceneData);
    }

    // interface
    public setup (cameras: Camera[], ppl: BasicPipeline): void {
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene === null || camera.window === null) {
                continue;
            }
            if (camera.cameraUsage !== CameraUsage.GAME) {
                buildForwardPass(camera, ppl, false);
                continue;
            }
            ppl.update(camera);
            const info = this.prepareGameCamera(ppl, camera);
            this.prepareSceneInfo(camera.scene, camera.frustum, this._sceneInfo);
            this.buildForward(
                ppl,
                camera,
                info.id,
                info.width,
                info.height,
            );
        }
    }
    // implementation
    private prepareSceneInfo (
        scene: Readonly<RenderScene>,
        frustum: geometry.Frustum,
        sceneInfo: SceneInfo,
    ): void {
        // clear scene info
        sceneInfo.reset();
        // spot lights
        for (let i = 0; i < scene.spotLights.length; i++) {
            const light = scene.spotLights[i];
            if (light.baked) {
                continue;
            }
            geometry.Sphere.set(this._sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (geometry.intersect.sphereFrustum(this._sphere, frustum)) {
                sceneInfo.punctualLights.push(light);
                sceneInfo.spotLights.push(light);
            }
        }
        // sphere lights
        for (let i = 0; i < scene.sphereLights.length; i++) {
            const light = scene.sphereLights[i];
            if (light.baked) {
                continue;
            }
            geometry.Sphere.set(this._sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (geometry.intersect.sphereFrustum(this._sphere, frustum)) {
                sceneInfo.punctualLights.push(light);
            }
        }
        // point lights
        for (let i = 0; i < scene.pointLights.length; i++) {
            const light = scene.pointLights[i];
            if (light.baked) {
                continue;
            }
            geometry.Sphere.set(this._sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (geometry.intersect.sphereFrustum(this._sphere, frustum)) {
                sceneInfo.punctualLights.push(light);
            }
        }
        // ranged dir lights
        for (let i = 0; i < scene.rangedDirLights.length; i++) {
            const light = scene.rangedDirLights[i];
            AABB.transform(this._tmpBoundingBox, this._rangedDirLightBoundingBox, light.node!.getWorldMatrix());
            if (geometry.intersect.aabbFrustum(this._tmpBoundingBox, frustum)) {
                sceneInfo.punctualLights.push(light);
            }
        }
    }
    private prepareGameCamera (ppl: BasicPipeline, camera: Camera): WindowInfo {
        let info = this._windows.get(camera.window);
        if (info !== undefined) {
            let width = camera.window.width;
            let height = camera.window.height;
            if (width === 0) {
                width = 1;
            }
            if (height === 0) {
                height = 1;
            }
            if (info.width === width && info.height === height) {
                return info;
            }
            info.width = width;
            info.height = height;
            this.updateGameCamera(ppl, camera, info.id, info.width, info.height);
            return info;
        }
        const id = this._windows.size;
        info = new WindowInfo(
            id,
            camera.window.width ? camera.window.width : 1,
            camera.window.height ? camera.window.height : 1,
        );
        this.initGameCamera(ppl, camera, info.id, info.width, info.height);
        this._windows.set(camera.window, info);
        return info;
    }
    private initGameCamera (ppl: BasicPipeline, camera: Camera, id: number, width: number, height: number): void {
        const device = ppl.device;
        // Main Target
        ppl.addRenderWindow(`Color${id}`, Format.BGRA8, width, height, camera.window);
        ppl.addDepthStencil(`DepthStencil${id}`, Format.DEPTH_STENCIL, width, height);
        // CSM
        const shadowFormat  = supportsR32FloatTexture(device) ? Format.R32F : Format.RGBA8;
        const shadowSize = this._sceneInfo.shadows.size;
        ppl.addRenderTarget(`ShadowMap${id}`, shadowFormat, shadowSize.x, shadowSize.y);
        ppl.addRenderTarget(`SpotShadowMap${id}0`, shadowFormat, shadowSize.x, shadowSize.y);
        ppl.addRenderTarget(`SpotShadowMap${id}1`, shadowFormat, shadowSize.x, shadowSize.y);
        ppl.addRenderTarget(`SpotShadowMap${id}2`, shadowFormat, shadowSize.x, shadowSize.y);
        ppl.addRenderTarget(`SpotShadowMap${id}3`, shadowFormat, shadowSize.x, shadowSize.y);
        ppl.addDepthStencil(`ShadowDepth${id}`, Format.DEPTH_STENCIL, shadowSize.x, shadowSize.y);
        ppl.addDepthStencil(`SpotLightShadowDepth${id}0`, Format.DEPTH_STENCIL, shadowSize.x, shadowSize.y);
        ppl.addDepthStencil(`SpotLightShadowDepth${id}1`, Format.DEPTH_STENCIL, shadowSize.x, shadowSize.y);
        ppl.addDepthStencil(`SpotLightShadowDepth${id}2`, Format.DEPTH_STENCIL, shadowSize.x, shadowSize.y);
        ppl.addDepthStencil(`SpotLightShadowDepth${id}3`, Format.DEPTH_STENCIL, shadowSize.x, shadowSize.y);
    }
    private updateGameCamera (ppl: BasicPipeline, camera: Camera, id: number, width: number, height: number): void {
        // Main Target
        ppl.updateRenderWindow(`Color${id}`, camera.window);
        ppl.updateDepthStencil(`DepthStencil${id}`, width, height);
        // CSM
        const shadowSize = this._sceneInfo.shadows.size;
        ppl.updateRenderTarget(`ShadowMap${id}`, shadowSize.x, shadowSize.y);
        ppl.updateRenderTarget(`SpotShadowMap${id}0`, shadowSize.x, shadowSize.y);
        ppl.updateRenderTarget(`SpotShadowMap${id}1`, shadowSize.x, shadowSize.y);
        ppl.updateRenderTarget(`SpotShadowMap${id}2`, shadowSize.x, shadowSize.y);
        ppl.updateRenderTarget(`SpotShadowMap${id}3`, shadowSize.x, shadowSize.y);
        ppl.updateDepthStencil(`ShadowDepth${id}`, shadowSize.x, shadowSize.y);
        ppl.updateDepthStencil(`SpotLightShadowDepth${id}0`, shadowSize.x, shadowSize.y);
        ppl.updateDepthStencil(`SpotLightShadowDepth${id}1`, shadowSize.x, shadowSize.y);
        ppl.updateDepthStencil(`SpotLightShadowDepth${id}2`, shadowSize.x, shadowSize.y);
        ppl.updateDepthStencil(`SpotLightShadowDepth${id}3`, shadowSize.x, shadowSize.y);
    }
    private buildForwardTiled (
        ppl: BasicPipeline,
        camera: Camera,
        id: number,
        width: number,
        height: number,
        sceneInfo: SceneInfo,
    ): void {
        assert(this._tiled);
        assert(camera.scene !== null);
        // init
        const scene = camera.scene;
        const mainLight = scene.mainLight;

        // CSM
        // MainLight ShadowMapPass
        // if (mainLight && mainLight.shadowEnabled) {
        //     if (mainLight.shadowFixedArea) {
        //     } else {
        //     }
        // }

        // Forward Lighting
        {
            const pass = ppl.addRenderPass(width, height, 'default');
            pass.addRenderTarget(`Color${id}`, LoadOp.CLEAR);
            pass.addDepthStencil(`DepthStencil${id}`, LoadOp.CLEAR);
            pass.addQueue(QueueHint.NONE)
                .addSceneOfCamera(camera, new LightInfo(), SceneFlags.OPAQUE | SceneFlags.MASK);

            pass.addQueue(QueueHint.RENDER_TRANSPARENT)
                .addSceneOfCamera(camera, new LightInfo(), SceneFlags.BLEND);
        }
    }
    private buildForward (
        ppl: BasicPipeline,
        camera: Camera,
        id: number,
        width: number,
        height: number,
    ): void {
        assert(camera.scene !== null);
        if (camera.scene === null) {
            return;
        }
        const scene = camera.scene;
        const mainLight = scene.mainLight;

        // CSM
        if (mainLight && mainLight.shadowEnabled) {
            this.buildCascadedShadowMapPass(ppl, id, mainLight, camera);
        }

        // Forward Lighting
        {
            const pass = ppl.addRenderPass(width, height, 'default');
            pass.addRenderTarget(`Color${id}`, LoadOp.CLEAR);
            pass.addDepthStencil(`DepthStencil${id}`, LoadOp.CLEAR);
            pass.addTexture(`ShadowMap${id}`, 'cc_shadowMap');
            pass.addQueue(QueueHint.NONE)
                .addSceneOfCamera(camera, new LightInfo(), SceneFlags.OPAQUE | SceneFlags.MASK);
            pass.addQueue(QueueHint.RENDER_TRANSPARENT)
                .addSceneOfCamera(camera, new LightInfo(), SceneFlags.BLEND);
        }
    }
    private buildCascadedShadowMapPass (ppl: BasicPipeline, id: number, light: DirectionalLight, camera: Camera): void {
        const width = this._sceneInfo.shadows.size.x;
        const height = this._sceneInfo.shadows.size.y;
        const pass = ppl.addRenderPass(width, height, 'default');
        pass.addRenderTarget(`ShadowMap${id}`, LoadOp.CLEAR, StoreOp.STORE, new Color(1, 1, 1, 1));
        pass.addDepthStencil(`ShadowDepth${id}`, LoadOp.CLEAR, StoreOp.DISCARD);
        if (light.shadowFixedArea) {
            const queue = pass.addQueue(QueueHint.NONE, 'shadow-caster');
            // queue.addSceneCulledByDirectionalLight(camera,
            //     SceneFlags.OPAQUE | SceneFlags.MASK | SceneFlags.SHADOW_CASTER,
            //     light, 0);
            queue.addSceneOfCamera(
                camera,
                new LightInfo(light, 0),
                SceneFlags.OPAQUE | SceneFlags.MASK | SceneFlags.SHADOW_CASTER,
            );
        } else {
            const csmLevel = ppl.pipelineSceneData.csmSupported
                ? light.csmLevel : 1;
            for (let level = 0; level !== csmLevel; ++level) {
                this.getMainLightViewport(light, width, height, level, this._viewport);
                const queue = pass.addQueue(QueueHint.NONE, 'shadow-caster');
                queue.setViewport(this._viewport);
                // queue.addSceneCulledByDirectionalLight(camera,
                //     SceneFlags.OPAQUE | SceneFlags.MASK | SceneFlags.SHADOW_CASTER,
                //     light, level);
                queue.addSceneOfCamera(
                    camera,
                    new LightInfo(light, level),
                    SceneFlags.OPAQUE | SceneFlags.MASK | SceneFlags.SHADOW_CASTER,
                );
            }
        }
    }
    private getViewport (area: Rect, w: number, h: number, vp: Viewport): void {
        vp.left = Math.trunc(area.x * w);
        vp.top = Math.trunc(area.y * h);
        vp.width = Math.trunc(area.width * w);
        vp.height = Math.trunc(area.height * h);
        vp.left = Math.max(0, vp.left);
        vp.top = Math.max(0, vp.top);
        vp.width = Math.max(1, vp.width);
        vp.height = Math.max(1, vp.height);
    }
    private getMainLightViewport (
        light: DirectionalLight,
        w: number,
        h: number,
        level: number,
        vp: Viewport,
    ): void {
        if (light.shadowFixedArea || light.csmLevel === CSMLevel.LEVEL_1) {
            vp.left = 0;
            vp.top = 0;
            vp.width = Math.trunc(w);
            vp.height = Math.trunc(h);
        } else {
            vp.left = Math.trunc(level % 2 * 0.5 * w);
            if (this._flipY) {
                vp.top = Math.trunc((1 - Math.floor(level / 2)) * 0.5 * h);
            } else {
                vp.top = Math.trunc(Math.floor(level / 2) * 0.5 * h);
            }
            vp.width = Math.trunc(0.5 * w);
            vp.height = Math.trunc(0.5 * h);
        }
        vp.left = Math.max(0, vp.left);
        vp.top = Math.max(0, vp.top);
        vp.width = Math.max(1, vp.width);
        vp.height = Math.max(1, vp.height);
    }
    readonly _windows = new Map<RenderWindow, WindowInfo>();
    readonly _sceneInfo: SceneInfo;
    // context
    readonly _tiled = systemInfo.isMobile;
    readonly _flipY = cclegacy.director.root.device.capabilities.screenSpaceSignY;
    readonly _area = new Rect(0, 0, 1, 1);
    readonly _sphere = geometry.Sphere.create(0, 0, 0, 1);
    readonly _rangedDirLightBoundingBox = new AABB(0.0, 0.0, 0.0, 0.5, 0.5, 0.5);
    readonly _viewport = new Viewport();
    readonly _tmpBoundingBox = new AABB();
}
