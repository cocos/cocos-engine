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

import { cclegacy } from '../../core';
import { AABB } from '../../core/geometry/aabb';
import { Frustum } from '../../core/geometry/frustum';
import intersect from '../../core/geometry/intersect';
import { Sphere } from '../../core/geometry/sphere';
import { API, ClearFlagBit, Color, Format, FormatFeatureBit, LoadOp, StoreOp, Viewport } from '../../gfx/base/define';
import { Device } from '../../gfx/base/device';
import { RenderScene } from '../../render-scene/core/render-scene';
import { RenderWindow } from '../../render-scene/core/render-window';
import { Camera, CameraUsage } from '../../render-scene/scene/camera';
import { DirectionalLight } from '../../render-scene/scene/directional-light';
import { Light, LightType } from '../../render-scene/scene/light';
import { CSMLevel } from '../../render-scene/scene/shadows';
import { SpotLight } from '../../render-scene/scene/spot-light';
import { BasicPipeline, BasicRenderPassBuilder, PipelineBuilder } from './pipeline';
import { QueueHint, SceneFlags } from './types';

function forwardNeedClearColor (camera: Camera): boolean {
    return !!(camera.clearFlag & (ClearFlagBit.COLOR | (ClearFlagBit.STENCIL << 1)));
}

class ForwardLighting {
    public cullLights (scene: RenderScene, frustum: Frustum): void {
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
    }
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
        for (const light of this.shadowEnabledSpotLights) {
            const shadowMapSize = ppl.pipelineSceneData.shadows.size;
            const shadowPass = ppl.addRenderPass(shadowMapSize.x, shadowMapSize.y, 'default');
            shadowPass.name = 'SpotlightShadowPass';
            shadowPass.addRenderTarget(`ShadowMap${id}`, LoadOp.CLEAR, StoreOp.STORE, new Color(1, 1, 1, 1));
            shadowPass.addDepthStencil(`ShadowDepth${id}`, LoadOp.CLEAR, StoreOp.DISCARD);
            shadowPass.addQueue(QueueHint.NONE, 'shadow-caster')
                .addScene(
                    camera,
                    SceneFlags.OPAQUE
                    | SceneFlags.MASK
                    | SceneFlags.SHADOW_CASTER,
                )
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
    // valid lights
    private readonly lights: Light[] = [];
    private readonly shadowEnabledSpotLights: SpotLight[] = [];
    private readonly _sphere = Sphere.create(0, 0, 0, 1);
    private readonly _boundingBox = new AABB();
    private readonly _rangedDirLightBoundingBox = new AABB(0.0, 0.0, 0.0, 0.5, 0.5, 0.5);
}

function getMainLightViewport (
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

const _viewport = new Viewport();

function buildCascadedShadowMapPass (
    ppl: BasicPipeline,
    id: number,
    light: DirectionalLight,
    camera: Camera,
    screenSpaceSignY: number,
): void {
    const width = ppl.pipelineSceneData.shadows.size.x;
    const height = ppl.pipelineSceneData.shadows.size.y;
    const pass = ppl.addRenderPass(width, height, 'default');
    pass.name = 'CSM';
    pass.addRenderTarget(`ShadowMap${id}`, LoadOp.CLEAR, StoreOp.STORE, new Color(1, 1, 1, 1));
    pass.addDepthStencil(`ShadowDepth${id}`, LoadOp.CLEAR, StoreOp.DISCARD);
    const csmLevel = ppl.pipelineSceneData.csmSupported ? light.csmLevel : 1;
    for (let level = 0; level !== csmLevel; ++level) {
        getMainLightViewport(light, width, height, level, _viewport, screenSpaceSignY);
        const queue = pass.addQueue(QueueHint.NONE, 'shadow-caster');
        queue.setViewport(_viewport);
        queue
            .addScene(
                camera,
                SceneFlags.OPAQUE
                    | SceneFlags.MASK
                    | SceneFlags.SHADOW_CASTER,
            )
            .useLightFrustum(light, level);
    }
}

export class BuiltinForwardPipeline implements PipelineBuilder {
    private _supportsR32FloatTexture (device: Device): boolean {
        return (device.getFormatFeatures(Format.R32F) & (FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE))
            === (FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE)
            && !(device.gfxAPI === API.WEBGL); // wegl 1  Single-channel float type is not supported under webgl1, so it is excluded
    }

    private _forwardWindowResize (ppl: BasicPipeline, window: RenderWindow, width: number, height: number): void {
        ppl.addRenderWindow(window.colorName, Format.BGRA8, width, height, window);
        ppl.addDepthStencil(window.depthStencilName, Format.DEPTH_STENCIL, width, height);
        // CSM
        const id = window.renderWindowId;
        const shadowFormat = this._supportsR32FloatTexture(ppl.device) ? Format.R32F : Format.RGBA8;
        const shadowSize = ppl.pipelineSceneData.shadows.size;
        ppl.addRenderTarget(`ShadowMap${id}`, shadowFormat, shadowSize.x, shadowSize.y);
        ppl.addDepthStencil(`ShadowDepth${id}`, Format.DEPTH_STENCIL, shadowSize.x, shadowSize.y);
    }

    editorSceneViewResize (ppl: BasicPipeline, window: RenderWindow, width: number, height: number): void {
        this._forwardWindowResize(ppl, window, width, height);
    }
    editorGameViewResize (ppl: BasicPipeline, window: RenderWindow, width: number, height: number): void {
        this._forwardWindowResize(ppl, window, width, height);
    }
    gameWindowResize (ppl: BasicPipeline, window: RenderWindow, width: number, height: number): void {
        this._forwardWindowResize(ppl, window, width, height);
    }

    setup (cameras: Camera[], ppl: BasicPipeline): void {
        for (const camera of cameras) {
            // skip invalid camera
            if (camera.scene === null || camera.window === null) {
                continue;
            }
            if (camera.cameraUsage >= CameraUsage.GAME
                || camera.cameraUsage === CameraUsage.SCENE_VIEW) {
                this._buildForward(ppl, camera);
            } else {
                this._buildEditor(ppl, camera);
            }
        }
    }

    private _resetPipelineStates (camera: Camera, width: number, height: number): void {
        // Prepare camera clear color
        this._clearColor.x = camera.clearColor.x;
        this._clearColor.y = camera.clearColor.y;
        this._clearColor.z = camera.clearColor.z;
        this._clearColor.w = camera.clearColor.w;

        // Prepare camera viewport
        this._viewport.left = camera.viewport.x * width;
        this._viewport.top = camera.viewport.y * height;
        this._viewport.width = camera.viewport.z * width;
        this._viewport.height = camera.viewport.w * height;
    }

    // build forward lighting ppl
    private _buildForward (
        ppl: BasicPipeline,
        camera: Camera,
    ): void {
        if (!camera.scene) {
            return;
        }
        //----------------------------------------------------------------
        // Init
        // ---------------------------------------------------------------
        const width = camera.window.width;
        const height = camera.window.height;
        const id = camera.window.renderWindowId;
        const colorName = camera.window.colorName;
        const depthStencilName = camera.window.depthStencilName;
        const scene = camera.scene;
        const mainLight = scene.mainLight;
        this._resetPipelineStates(camera, width, height);
        this.forwardLighting.cullLights(scene, camera.frustum);

        //----------------------------------------------------------------
        // Shadow map pass
        //----------------------------------------------------------------
        const enableCSM = mainLight && mainLight.shadowEnabled;
        if (enableCSM) {
            buildCascadedShadowMapPass(
                ppl,
                id,
                mainLight,
                camera,
                cclegacy.director.root.device.capabilities.screenSpaceSignY as number,
            );
        }

        //----------------------------------------------------------------
        // Forward Lighting (Directional Light)
        //----------------------------------------------------------------
        const pass = ppl.addRenderPass(width, height, 'default');
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

        // add opaque and mask queue
        pass.addQueue(QueueHint.NONE) // Currently we put OPAQUE and MASK into one queue, so QueueHint is NONE
            .addScene(
                camera,
                SceneFlags.OPAQUE | SceneFlags.MASK,
                mainLight || undefined,
            );

        // TODO(zhouzhenglong): Separate OPAQUE and MASK queue

        //----------------------------------------------------------------
        // Forward Lighting (Additive Lights)
        //----------------------------------------------------------------
        // Additive lights
        const lastPass = this.forwardLighting.addLightPasses(
            colorName,
            depthStencilName,
            id,
            width,
            height,
            camera,
            ppl,
            pass,
        );

        //----------------------------------------------------------------
        // Forward Lighting (Blend)
        //----------------------------------------------------------------
        // Add transparent queue
        lastPass.addQueue(QueueHint.BLEND)
            .addScene(
                camera,
                SceneFlags.BLEND | SceneFlags.UI,
                mainLight || undefined,
            );
    }

    private _buildEditor (
        ppl: BasicPipeline,
        camera: Camera,
    ): void {
        if (!camera.scene) {
            return;
        }
        //----------------------------------------------------------------
        // Init
        // ---------------------------------------------------------------
        const width = camera.window.width;
        const height = camera.window.height;
        const id = camera.window.renderWindowId;
        const colorName = camera.window.colorName;
        const depthStencilName = camera.window.depthStencilName;
        const scene = camera.scene;
        const mainLight = scene.mainLight;
        this._resetPipelineStates(camera, width, height);
        //----------------------------------------------------------------
        // Forward Lighting (Directional Light)
        //----------------------------------------------------------------
        const pass = ppl.addRenderPass(width, height, 'default');
        // Set viewport
        pass.setViewport(this._viewport);
        // Bind output render target
        if (forwardNeedClearColor(camera)) {
            pass.addRenderTarget(colorName, LoadOp.CLEAR, StoreOp.STORE, this._clearColor);
        } else {
            pass.addRenderTarget(colorName, LoadOp.LOAD);
        }
        // Bind depth stencil buffer
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
        // Add opaque and mask queue
        pass.addQueue(QueueHint.NONE) // Currently we put OPAQUE and MASK into one queue, so QueueHint is NONE
            .addScene(
                camera,
                SceneFlags.OPAQUE | SceneFlags.MASK,
                mainLight || undefined,
            );

        // TODO(zhouzhenglong): Separate OPAQUE and MASK queue

        //----------------------------------------------------------------
        // Forward Lighting (Blend)
        //----------------------------------------------------------------
        pass.addQueue(QueueHint.BLEND)
            .addScene(
                camera,
                SceneFlags.BLEND,
                mainLight || undefined,
            );
    }

    // Internal cached resources
    readonly _clearColor = new Color(0, 0, 0, 1);
    readonly _viewport = new Viewport();

    private readonly forwardLighting = new ForwardLighting();
}
