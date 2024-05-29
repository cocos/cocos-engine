/*
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

import { DEBUG } from 'internal:constants';
import { cclegacy, sys, Vec3 } from '../../core';
import { AABB } from '../../core/geometry/aabb';
import { Frustum } from '../../core/geometry/frustum';
import intersect from '../../core/geometry/intersect';
import { Sphere } from '../../core/geometry/sphere';
import { ClearFlagBit, Color, Format, LoadOp, StoreOp, Viewport } from '../../gfx/base/define';
import { RenderScene } from '../../render-scene/core/render-scene';
import { RenderWindow } from '../../render-scene/core/render-window';
import { Camera, CameraUsage } from '../../render-scene/scene/camera';
import { DirectionalLight } from '../../render-scene/scene/directional-light';
import { Light, LightType } from '../../render-scene/scene/light';
import { CSMLevel } from '../../render-scene/scene/shadows';
import { SpotLight } from '../../render-scene/scene/spot-light';
import { defaultWindowResize, supportsR32FloatTexture } from './framework';
import { BasicPipeline, BasicRenderPassBuilder, PipelineBuilder, PipelineSettings } from './pipeline';
import { QueueHint, SceneFlags } from './types';

function forwardNeedClearColor (camera: Camera): boolean {
    return !!(camera.clearFlag & (ClearFlagBit.COLOR | (ClearFlagBit.STENCIL << 1)));
}

function getCsmMainLightViewport (
    light: DirectionalLight,
    w: number,
    h: number,
    level: number,
    vp: Viewport,
    screenSpaceSignY: number,
): void {
    if (light.shadowFixedArea || light.csmLevel === CSMLevel.LEVEL_1) {
        vp.left = 0;
        vp.top = 0;
        vp.width = Math.trunc(w);
        vp.height = Math.trunc(h);
    } else {
        vp.left = Math.trunc(level % 2 * 0.5 * w);
        if (screenSpaceSignY > 0) {
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

class ForwardLighting {
    // Active lights
    private readonly lights: Light[] = [];
    // Active spot lights with shadows (Mutually exclusive with `lights`)
    private readonly shadowEnabledSpotLights: SpotLight[] = [];

    // Internal cached resources
    private readonly _sphere = Sphere.create(0, 0, 0, 1);
    private readonly _boundingBox = new AABB();
    private readonly _rangedDirLightBoundingBox = new AABB(0.0, 0.0, 0.0, 0.5, 0.5, 0.5);

    //----------------------------------------------------------------
    // Interface
    //----------------------------------------------------------------
    public cullLights (scene: RenderScene, frustum: Frustum, cameraPos?: Vec3): void {
        // TODO(zhouzhenglong): Make light culling native
        this.lights.length = 0;
        this.shadowEnabledSpotLights.length = 0;
        // spot lights
        for (const light of scene.spotLights) {
            if (light.baked) {
                continue;
            }
            Sphere.set(this._sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphereFrustum(this._sphere, frustum)) {
                if (light.shadowEnabled) {
                    this.shadowEnabledSpotLights.push(light);
                } else {
                    this.lights.push(light);
                }
            }
        }
        // sphere lights
        for (const light of scene.sphereLights) {
            if (light.baked) {
                continue;
            }
            Sphere.set(this._sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphereFrustum(this._sphere, frustum)) {
                this.lights.push(light);
            }
        }
        // point lights
        for (const light of scene.pointLights) {
            if (light.baked) {
                continue;
            }
            Sphere.set(this._sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphereFrustum(this._sphere, frustum)) {
                this.lights.push(light);
            }
        }
        // ranged dir lights
        for (const light of scene.rangedDirLights) {
            AABB.transform(this._boundingBox, this._rangedDirLightBoundingBox, light.node!.getWorldMatrix());
            if (intersect.aabbFrustum(this._boundingBox, frustum)) {
                this.lights.push(light);
            }
        }

        if (cameraPos) {
            this.shadowEnabledSpotLights.sort(
                (lhs, rhs) => Vec3.squaredDistance(cameraPos, lhs.position) - Vec3.squaredDistance(cameraPos, rhs.position),
            );
        }
    }
    private _addLightQueues (camera: Camera, pass: BasicRenderPassBuilder): void {
        for (const light of this.lights) {
            const queue = pass.addQueue(QueueHint.BLEND, 'forward-add');
            switch (light.type) {
            case LightType.SPHERE:
                queue.name = 'sphere-light';
                break;
            case LightType.SPOT:
                queue.name = 'spot-light';
                break;
            case LightType.POINT:
                queue.name = 'point-light';
                break;
            case LightType.RANGED_DIRECTIONAL:
                queue.name = 'ranged-directional-light';
                break;
            default:
                queue.name = 'unknown-light';
            }
            queue.addScene(
                camera,
                SceneFlags.BLEND,
                light,
            );
        }
    }
    public addMobileShadowPasses (ppl: BasicPipeline, camera: Camera, maxNumShadowMaps: number): void {
        let i = 0;
        for (const light of this.shadowEnabledSpotLights) {
            const shadowMapSize = ppl.pipelineSceneData.shadows.size;
            const shadowPass = ppl.addRenderPass(shadowMapSize.x, shadowMapSize.y, 'default');
            shadowPass.name = `SpotLightShadowPass${i}`;
            shadowPass.addRenderTarget(`SpotShadowMap${i}`, LoadOp.CLEAR, StoreOp.STORE, new Color(1, 1, 1, 1));
            shadowPass.addDepthStencil(`SpotShadowDepth${i}`, LoadOp.CLEAR, StoreOp.DISCARD);
            shadowPass.addQueue(QueueHint.NONE, 'shadow-caster')
                .addScene(camera, SceneFlags.OPAQUE | SceneFlags.MASK | SceneFlags.SHADOW_CASTER)
                .useLightFrustum(light);
            ++i;
            if (i >= maxNumShadowMaps) {
                break;
            }
        }
    }
    public addMobileLightQueues (pass: BasicRenderPassBuilder, camera: Camera, maxNumShadowMaps: number): void {
        this._addLightQueues(camera, pass);
        let i = 0;
        for (const light of this.shadowEnabledSpotLights) {
            // Add spot-light pass
            // Save last RenderPass to the `pass` variable
            // TODO(zhouzhenglong): Fix per queue addTexture
            pass.addTexture(`SpotShadowMap${i}`, 'cc_spotShadowMap');
            const queue = pass.addQueue(QueueHint.BLEND, 'forward-add');
            queue.addScene(camera, SceneFlags.BLEND, light);
            ++i;
            if (i >= maxNumShadowMaps) {
                break;
            }
        }
    }

    // Notice: ForwardLighting cannot handle a lot of lights.
    // If there are too many lights, the performance will be very poor.
    // If many lights are needed, please implement a forward+ or deferred rendering pipeline.
    public addLightPasses (
        colorName: string,
        depthStencilName: string,
        id: number, // window id
        width: number,
        height: number,
        camera: Camera,
        ppl: BasicPipeline,
        pass: BasicRenderPassBuilder,
    ): BasicRenderPassBuilder {
        this._addLightQueues(camera, pass);

        const shadowMapSize = ppl.pipelineSceneData.shadows.size;
        for (const light of this.shadowEnabledSpotLights) {
            const shadowPass = ppl.addRenderPass(shadowMapSize.x, shadowMapSize.y, 'default');
            shadowPass.name = 'SpotlightShadowPass';
            // Reuse csm shadow map
            shadowPass.addRenderTarget(`ShadowMap${id}`, LoadOp.CLEAR, StoreOp.STORE, new Color(1, 1, 1, 1));
            shadowPass.addDepthStencil(`ShadowDepth${id}`, LoadOp.CLEAR, StoreOp.DISCARD);
            shadowPass.addQueue(QueueHint.NONE, 'shadow-caster')
                .addScene(camera, SceneFlags.OPAQUE | SceneFlags.MASK | SceneFlags.SHADOW_CASTER)
                .useLightFrustum(light);

            // Add spot-light pass
            // Save last RenderPass to the `pass` variable
            pass = ppl.addRenderPass(width, height, 'default');
            pass.name = 'SpotlightWithShadowMap';
            pass.addRenderTarget(colorName, LoadOp.LOAD);
            pass.addDepthStencil(depthStencilName, LoadOp.LOAD);
            pass.addTexture(`ShadowMap${id}`, 'cc_spotShadowMap');
            const queue = pass.addQueue(QueueHint.BLEND, 'forward-add');
            queue.addScene(
                camera,
                SceneFlags.BLEND,
                light,
            );
        }
        return pass;
    }
}

export class BuiltinForwardPipeline implements PipelineBuilder {
    // Internal cached resources
    readonly _clearColor = new Color(0, 0, 0, 1);
    readonly _viewport = new Viewport();

    // Forward lighting
    private readonly settings: PipelineSettings = {
        forwardPipeline: {
            // TODO(zhouzhenglong): Relex this limitation.
            // Currently, only support 1 shadow map for spot light on mobile platform.
            mobileMaxSpotLightShadowMaps: 1,
        },
    };
    private readonly forwardLighting = new ForwardLighting();

    //----------------------------------------------------------------
    // Interface
    //----------------------------------------------------------------
    gameWindowResize (ppl: BasicPipeline, window: RenderWindow, width: number, height: number): void {
        defaultWindowResize(ppl, window, width, height);
        if (sys.isMobile) {
            const shadowMapSize = ppl.pipelineSceneData.shadows.size;
            const shadowFormat = supportsR32FloatTexture(ppl.device) ? Format.R32F : Format.RGBA8;
            const count = this.settings.forwardPipeline.mobileMaxSpotLightShadowMaps;
            for (let i = 0; i !== count; ++i) {
                ppl.addRenderTarget(`SpotShadowMap${i}`, shadowFormat, shadowMapSize.x, shadowMapSize.y);
                ppl.addDepthStencil(`SpotShadowDepth${i}`, Format.DEPTH_STENCIL, shadowMapSize.x, shadowMapSize.y);
            }
        }
    }
    setup (cameras: Camera[], ppl: BasicPipeline): void {
        for (const camera of cameras) {
            // skip invalid camera
            if (camera.scene === null || camera.window === null) {
                continue;
            }
            if (sys.isMobile) {
                this._buildMobileForwardPipeline(ppl, camera, camera.scene);
            } else {
                this._buildForwardPipeline(ppl, camera, camera.scene);
            }
        }
    }

    //----------------------------------------------------------------
    // Implementation
    //----------------------------------------------------------------
    // build forward lighting pipeline
    private _buildForwardPipeline (ppl: BasicPipeline, camera: Camera, scene: RenderScene): void {
        // Init
        const width = Math.max(Math.floor(camera.window.width), 1);
        const height = Math.max(Math.floor(camera.window.height), 1);
        const id = camera.window.renderWindowId;
        const colorName = camera.window.colorName;
        const depthStencilName = camera.window.depthStencilName;
        const mainLight = scene.mainLight;
        const screenSpaceSignY = cclegacy.director.root.device.capabilities.screenSpaceSignY as number;

        // Forward Lighting (Light Culling)
        this.forwardLighting.cullLights(scene, camera.frustum);

        // Main Directional light CSM Shadow Map
        const enableCSM = mainLight !== null && mainLight.shadowEnabled;
        if (enableCSM) {
            this._addCascadedShadowMapPass(ppl, id, mainLight, camera, screenSpaceSignY);
        }

        // Forward Lighting
        this._addForwardPasses(ppl, id, camera, width, height, colorName, depthStencilName, enableCSM, mainLight);
    }

    private _buildMobileForwardPipeline (ppl: BasicPipeline, camera: Camera, scene: RenderScene): void {
        // Init
        const width = Math.max(Math.floor(camera.window.width), 1);
        const height = Math.max(Math.floor(camera.window.height), 1);
        const id = camera.window.renderWindowId;
        const colorName = camera.window.colorName;
        const depthStencilName = camera.window.depthStencilName;
        const mainLight = scene.mainLight;
        const screenSpaceSignY = cclegacy.director.root.device.capabilities.screenSpaceSignY as number;

        // Forward Lighting (Light Culling)
        this.forwardLighting.cullLights(scene, camera.frustum, camera.position);

        // Main Directional light CSM shadow map
        const enableCSM = mainLight !== null && mainLight.shadowEnabled;
        if (enableCSM) {
            this._addCascadedShadowMapPass(ppl, id, mainLight, camera, screenSpaceSignY);
        }

        // Spot light shadow maps
        this.forwardLighting.addMobileShadowPasses(ppl, camera, this.settings.forwardPipeline.mobileMaxSpotLightShadowMaps);

        // Forward Lighting
        this._addForwardPasses(ppl, id, camera, width, height, colorName, depthStencilName, enableCSM, mainLight);
    }

    private _addCascadedShadowMapPass (
        ppl: BasicPipeline,
        id: number,
        light: DirectionalLight,
        camera: Camera,
        screenSpaceSignY: number,
    ): void {
        //----------------------------------------------------------------
        // Dynamic states
        //----------------------------------------------------------------
        const width = ppl.pipelineSceneData.shadows.size.x;
        const height = ppl.pipelineSceneData.shadows.size.y;
        this._viewport.left = 0;
        this._viewport.top = 0;
        this._viewport.width = width;
        this._viewport.height = height;

        //----------------------------------------------------------------
        // CSM Shadow Map
        //----------------------------------------------------------------
        const pass = ppl.addRenderPass(width, height, 'default');
        pass.name = 'CSM';
        pass.addRenderTarget(`ShadowMap${id}`, LoadOp.CLEAR, StoreOp.STORE, new Color(1, 1, 1, 1));
        pass.addDepthStencil(`ShadowDepth${id}`, LoadOp.CLEAR, StoreOp.DISCARD);
        const csmLevel = ppl.pipelineSceneData.csmSupported ? light.csmLevel : 1;

        // Add shadow map viewports
        for (let level = 0; level !== csmLevel; ++level) {
            getCsmMainLightViewport(light, width, height, level, this._viewport, screenSpaceSignY);
            const queue = pass.addQueue(QueueHint.NONE, 'shadow-caster');
            queue.setViewport(this._viewport);
            queue
                .addScene(camera, SceneFlags.OPAQUE | SceneFlags.MASK | SceneFlags.SHADOW_CASTER)
                .useLightFrustum(light, level);
        }
    }

    private _buildForwardMainLightPass (
        pass: BasicRenderPassBuilder,
        id: number,
        camera: Camera,
        colorName: string,
        depthStencilName: string,
        enableCSM: boolean,
        mainLight: DirectionalLight | null,
    ): void {
        // set viewport
        pass.setViewport(this._viewport);

        // bind output render target
        if (forwardNeedClearColor(camera)) {
            pass.addRenderTarget(colorName, LoadOp.CLEAR, StoreOp.STORE, this._clearColor);
        } else {
            pass.addRenderTarget(colorName, LoadOp.LOAD);
        }

        // bind depth stencil buffer
        if (camera.clearFlag & ClearFlagBit.DEPTH_STENCIL) {
            pass.addDepthStencil(
                depthStencilName,
                LoadOp.CLEAR,
                StoreOp.STORE,
                camera.clearDepth,
                camera.clearStencil,
                camera.clearFlag & ClearFlagBit.DEPTH_STENCIL,
            );
        } else {
            pass.addDepthStencil(depthStencilName, LoadOp.LOAD);
        }

        // Set shadow map if enabled
        if (enableCSM) {
            pass.addTexture(`ShadowMap${id}`, 'cc_shadowMap');
        }

        // TODO(zhouzhenglong): Separate OPAQUE and MASK queue

        // add opaque and mask queue
        pass.addQueue(QueueHint.NONE) // Currently we put OPAQUE and MASK into one queue, so QueueHint is NONE
            .addScene(camera, SceneFlags.OPAQUE | SceneFlags.MASK, mainLight || undefined);
    }

    private _addForwardPasses (
        ppl: BasicPipeline,
        id: number,
        camera: Camera,
        width: number,
        height: number,
        colorName: string,
        depthStencilName: string,
        enableCSM: boolean,
        mainLight: DirectionalLight | null,
    ): void {
        //----------------------------------------------------------------
        // Dynamic states
        //----------------------------------------------------------------
        // Prepare camera clear color
        this._clearColor.x = camera.clearColor.x;
        this._clearColor.y = camera.clearColor.y;
        this._clearColor.z = camera.clearColor.z;
        this._clearColor.w = camera.clearColor.w;

        // Prepare camera viewport
        this._viewport.left = Math.floor(camera.viewport.x * width);
        this._viewport.top = Math.floor(camera.viewport.y * height);
        this._viewport.width = Math.floor(camera.viewport.z * width);
        this._viewport.height = Math.floor(camera.viewport.w * height);

        //----------------------------------------------------------------
        // Forward Lighting (Main Directional Light)
        //----------------------------------------------------------------
        const pass = ppl.addRenderPass(width, height, 'default');
        pass.name = 'ForwardPass';
        this._buildForwardMainLightPass(pass, id, camera, colorName, depthStencilName, enableCSM, mainLight);

        //----------------------------------------------------------------
        // Forward Lighting (Additive Lights)
        //----------------------------------------------------------------
        // Additive lights
        const lastPass = this.forwardLighting
            .addLightPasses(colorName, depthStencilName, id, width, height, camera, ppl, pass);

        //----------------------------------------------------------------
        // Forward Lighting (Blend)
        //----------------------------------------------------------------
        // Add transparent queue
        let flags =  SceneFlags.BLEND | SceneFlags.UI;
        if (DEBUG && camera.cameraUsage === CameraUsage.GAME && camera.window.swapchain) {
            lastPass.showStatistics = true;
            flags |= SceneFlags.PROFILER;
        }
        lastPass
            .addQueue(QueueHint.BLEND)
            .addScene(camera, flags, mainLight || undefined);
    }

    private _addMobileForwardPass (
        ppl: BasicPipeline,
        id: number,
        camera: Camera,
        width: number,
        height: number,
        colorName: string,
        depthStencilName: string,
        enableCSM: boolean,
        mainLight: DirectionalLight | null,
    ): void {
        //----------------------------------------------------------------
        // Dynamic states
        //----------------------------------------------------------------
        // Prepare camera clear color
        this._clearColor.x = camera.clearColor.x;
        this._clearColor.y = camera.clearColor.y;
        this._clearColor.z = camera.clearColor.z;
        this._clearColor.w = camera.clearColor.w;

        // Prepare camera viewport
        this._viewport.left = Math.floor(camera.viewport.x * width);
        this._viewport.top = Math.floor(camera.viewport.y * height);
        this._viewport.width = Math.floor(camera.viewport.z * width);
        this._viewport.height = Math.floor(camera.viewport.w * height);

        //----------------------------------------------------------------
        // Forward Lighting (Main Directional Light)
        //----------------------------------------------------------------
        const pass = ppl.addRenderPass(width, height, 'default');
        pass.name = 'ForwardPass';
        this._buildForwardMainLightPass(pass, id, camera, colorName, depthStencilName, enableCSM, mainLight);

        //----------------------------------------------------------------
        // Forward Lighting (Additive Lights)
        //----------------------------------------------------------------
        // Additive lights
        this.forwardLighting.addMobileLightQueues(pass, camera, this.settings.forwardPipeline.mobileMaxSpotLightShadowMaps);

        //----------------------------------------------------------------
        // Forward Lighting (Blend)
        //----------------------------------------------------------------
        // Add transparent queue
        let flags =  SceneFlags.BLEND | SceneFlags.UI;
        if (DEBUG && camera.cameraUsage === CameraUsage.GAME && camera.window.swapchain) {
            pass.showStatistics = true;
            flags |= SceneFlags.PROFILER;
        }
        pass
            .addQueue(QueueHint.BLEND)
            .addScene(camera, flags, mainLight || undefined);
    }
}
