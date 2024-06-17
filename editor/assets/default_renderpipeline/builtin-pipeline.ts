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

import { DEBUG } from 'cc/env';
import {
    assert,
    clamp,
    geometry,
    gfx,
    makePipelineSettings,
    Material,
    pipeline,
    PipelineSettings,
    renderer,
    rendering,
    sys,
    Vec2,
    Vec3,
    Vec4,
} from 'cc';

const { AABB, Sphere, intersect } = geometry;
const { ClearFlagBit, Color, Format, FormatFeatureBit, LoadOp, StoreOp, TextureType, Viewport } = gfx;
const { scene } = renderer;
const { CameraUsage, CSMLevel, LightType } = scene;

function forwardNeedClearColor(camera: renderer.scene.Camera): boolean {
    return !!(camera.clearFlag & (ClearFlagBit.COLOR | (ClearFlagBit.STENCIL << 1)));
}

function getCsmMainLightViewport(
    light: renderer.scene.DirectionalLight,
    w: number,
    h: number,
    level: number,
    vp: gfx.Viewport,
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

class PipelineConfigs {
    isWeb = false;
    isMobile = false;
    isHDR = false;
    useFloatOutput = false;
    toneMappingType = 0; // 0: ACES, 1: None
    shadowMapFormat = Format.R32F;
    shadowMapSize = new Vec2(1, 1);
    screenSpaceSignY = 1;
    supportDepthSample = false;
    mobileMaxSpotLightShadowMaps = 1;

    platform = new Vec4(0, 0, 0, 0);
}

function setupPipelineConfigs(
    ppl: rendering.BasicPipeline,
    configs: PipelineConfigs,
): void {
    const sampleFeature = FormatFeatureBit.SAMPLED_TEXTURE | FormatFeatureBit.LINEAR_FILTER;
    configs.isWeb = !sys.isNative;
    configs.isMobile = sys.isMobile;
    configs.isHDR = ppl.pipelineSceneData.isHDR; // Has tone mapping
    configs.useFloatOutput = ppl.getMacroBool('CC_USE_FLOAT_OUTPUT');
    configs.toneMappingType = ppl.pipelineSceneData.postSettings.toneMappingType;
    configs.shadowMapFormat = pipeline.supportsR32FloatTexture(ppl.device) ? Format.R32F : Format.RGBA8;
    configs.shadowMapSize.set(ppl.pipelineSceneData.shadows.size);
    configs.screenSpaceSignY = ppl.device.capabilities.screenSpaceSignY;
    configs.supportDepthSample = (ppl.device.getFormatFeatures(Format.DEPTH_STENCIL) & sampleFeature) === sampleFeature;

    const device = ppl.device;
    configs.platform.x = configs.isMobile ? 1.0 : 0.0;
    configs.platform.w = (device.capabilities.screenSpaceSignY * 0.5 + 0.5) << 1 | (device.capabilities.clipSpaceSignY * 0.5 + 0.5);
}

const defaultSettings = makePipelineSettings();

class CameraConfigs {
    enableShadowMap = false;
    enablePostProcess = false;
    enableProfiler = false;
    enableShadingScale = false;
    enableMSAA = false;
    enableFSR = false;
    singleForwardRadiancePass = false;
    shadingScale = 0.5;
    pipelineSettings: PipelineSettings = defaultSettings;
}

function isPostProcessNeeded(
    pipelineConfigs: PipelineConfigs,
    settings: PipelineSettings,
    camera: renderer.scene.Camera,
): boolean {
    return pipelineConfigs.useFloatOutput
        && camera.usePostProcess
        && (settings.depthOfField.enabled
        || settings.bloom.enabled
        || settings.colorGrading.enabled
        || settings.fxaa.enabled);
}

function setupCameraConfigs(
    camera: renderer.scene.Camera,
    pipelineConfigs: PipelineConfigs,
    cameraConfigs: CameraConfigs,
): void {
    const isMainGameWindow: boolean = camera.cameraUsage === CameraUsage.GAME && !!camera.window.swapchain;
    const isEditorView: boolean = camera.cameraUsage === CameraUsage.SCENE_VIEW || camera.cameraUsage === CameraUsage.PREVIEW;

    cameraConfigs.enableShadowMap = camera.scene
        ? camera.scene.mainLight !== null && camera.scene.mainLight.shadowEnabled
        : false;

    cameraConfigs.enableProfiler = DEBUG && isMainGameWindow;

    cameraConfigs.pipelineSettings = camera.pipelineSettings
        ? camera.pipelineSettings : defaultSettings;

    cameraConfigs.enablePostProcess
        = isPostProcessNeeded(pipelineConfigs, cameraConfigs.pipelineSettings, camera)
        && (isMainGameWindow || isEditorView);

    if (isEditorView) {
        const editorSettings = rendering.getEditorPipelineSettings();
        const pipelineCamera = rendering.getEditorPipelineCamera();
        if (editorSettings && pipelineCamera) {
            cameraConfigs.pipelineSettings = editorSettings;
            cameraConfigs.enablePostProcess = isPostProcessNeeded(
                pipelineConfigs, cameraConfigs.pipelineSettings, pipelineCamera);
        }
    }

    // MSAA
    cameraConfigs.enableMSAA = cameraConfigs.pipelineSettings.msaa.enabled
        && !pipelineConfigs.isWeb;

    // Shading scale
    cameraConfigs.shadingScale = cameraConfigs.pipelineSettings.shadingScale;
    cameraConfigs.enableShadingScale = cameraConfigs.pipelineSettings.enableShadingScale
        && cameraConfigs.shadingScale !== 1.0;

    // FSR (Depend on Shading scale)
    cameraConfigs.enableFSR = cameraConfigs.pipelineSettings.fsr.enabled
        && cameraConfigs.enableShadingScale
        && cameraConfigs.shadingScale < 1.0;

    // Forward rendering (Depend on MSAA and TBR)
    cameraConfigs.singleForwardRadiancePass
        = pipelineConfigs.isMobile || cameraConfigs.enableMSAA;
}

if (rendering) {

    const { QueueHint, SceneFlags, ResourceFlags, ResourceResidency } = rendering;

    class ForwardLighting {
        // Active lights
        private readonly lights: renderer.scene.Light[] = [];
        // Active spot lights with shadows (Mutually exclusive with `lights`)
        private readonly shadowEnabledSpotLights: renderer.scene.SpotLight[] = [];

        // Internal cached resources
        private readonly _sphere = Sphere.create(0, 0, 0, 1);
        private readonly _boundingBox = new AABB();
        private readonly _rangedDirLightBoundingBox = new AABB(0.0, 0.0, 0.0, 0.5, 0.5, 0.5);

        // ----------------------------------------------------------------
        // Interface
        // ----------------------------------------------------------------
        public cullLights(scene: renderer.RenderScene, frustum: geometry.Frustum, cameraPos?: Vec3): void {
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
        private _addLightQueues(camera: renderer.scene.Camera, pass: rendering.BasicRenderPassBuilder): void {
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
        public addSpotlightShadowPasses(
            ppl: rendering.BasicPipeline,
            camera: renderer.scene.Camera,
            maxNumShadowMaps: number,
        ): void {
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
        public addLightQueues(pass: rendering.BasicRenderPassBuilder,
            camera: renderer.scene.Camera, maxNumShadowMaps: number): void {
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
        public addLightPasses(
            colorName: string,
            depthStencilName: string,
            depthStencilStoreOp: gfx.StoreOp,
            id: number, // window id
            width: number,
            height: number,
            camera: renderer.scene.Camera,
            ppl: rendering.BasicPipeline,
            pass: rendering.BasicRenderPassBuilder,
        ): rendering.BasicRenderPassBuilder {
            this._addLightQueues(camera, pass);

            let count = 0;
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
                ++count;
                const storeOp = count === this.shadowEnabledSpotLights.length
                    ? depthStencilStoreOp
                    : StoreOp.STORE;

                pass = ppl.addRenderPass(width, height, 'default');
                pass.name = 'SpotlightWithShadowMap';
                pass.addRenderTarget(colorName, LoadOp.LOAD);
                pass.addDepthStencil(depthStencilName, LoadOp.LOAD, storeOp);
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

        public isMultipleLightPassesNeeded(): boolean {
            return this.shadowEnabledSpotLights.length > 0;
        }
    }

    class BuiltinPipeline implements rendering.PipelineBuilder {
        // Internal cached resources
        private readonly _clearColor = new Color(0, 0, 0, 1);
        private readonly _clearColorTransparentBlack = new Color(0, 0, 0, 0);
        private readonly _viewport = new Viewport();
        private readonly _configs = new PipelineConfigs();
        private readonly _cameraConfigs = new CameraConfigs();
        // DepthOfField
        private readonly _cocParams = new Vec4(0, 0, 0, 0);
        private readonly _cocTexSize = new Vec4(0, 0, 0, 0);
        // Bloom
        private readonly _bloomParams = new Vec4(0, 0, 0, 0);
        private readonly _bloomTexSize = new Vec4(0, 0, 0, 0);
        private readonly _bloomWidths: Array<number> = [];
        private readonly _bloomHeights: Array<number> = [];
        private readonly _bloomTexNames: Array<string> = [];
        // Color Grading
        private readonly _colorGradingTexSize = new Vec2(0, 0);
        // FSR
        private readonly _fsrParams = new Vec4(0, 0, 0, 0);
        private readonly _fsrTexSize = new Vec4(0, 0, 0, 0);
        // Materials
        private readonly _copyAndTonemapMaterial = new Material();
        private readonly _dofMaterial = new Material();
        private readonly _bloomMaterial = new Material();
        private readonly _colorGradingMaterial = new Material();
        private readonly _fxaaMaterial = new Material();
        private readonly _fsrMaterial = new Material();

        // Internal States
        private _initialized = false; // TODO(zhouzhenglong): Make default effect asset loading earlier and remove this flag

        // Forward lighting
        private readonly forwardLighting = new ForwardLighting();

        // ----------------------------------------------------------------
        // Interface
        // ----------------------------------------------------------------
        windowResize(
            ppl: rendering.BasicPipeline,
            window: renderer.RenderWindow,
            camera: renderer.scene.Camera,
            nativeWidth: number,
            nativeHeight: number,
        ): void {
            setupPipelineConfigs(ppl, this._configs);
            setupCameraConfigs(camera, this._configs, this._cameraConfigs);
            const settings = this._cameraConfigs.pipelineSettings;
            const id = window.renderWindowId;

            const width = this._cameraConfigs.enableShadingScale
                ? Math.max(Math.floor(nativeWidth * this._cameraConfigs.shadingScale), 1)
                : nativeWidth;
            const height = this._cameraConfigs.enableShadingScale
                ? Math.max(Math.floor(nativeHeight * this._cameraConfigs.shadingScale), 1)
                : nativeHeight;

            // Render Window (UI)
            ppl.addRenderWindow(window.colorName, Format.BGRA8, nativeWidth, nativeHeight, window);

            if (this._cameraConfigs.enableFSR) {
                ppl.addRenderTarget(`FsrColor${id}`, Format.RGBA8, nativeWidth, nativeHeight);
            }

            // Radiance
            if (this._configs.useFloatOutput) {
                ppl.addRenderTarget(`Radiance${id}`, Format.RGBA16F, width, height);
            } else if (this._cameraConfigs.enableShadingScale) {
                ppl.addRenderTarget(`Radiance${id}`, Format.RGBA8, width, height);
            } else {
                // Reuse render window
            }
            ppl.addDepthStencil(window.depthStencilName, Format.DEPTH_STENCIL, width, height);
            ppl.addRenderTarget(`LdrColor${id}`, Format.RGBA8, width, height);

            // MsaaRadiance
            if (this._cameraConfigs.enableMSAA) {
                // Notice: We never store multisample results.
                // These samples are always resolved and discarded at the end of the render pass.
                // So the ResourceResidency should be MEMORYLESS.
                if (this._configs.useFloatOutput) {
                    ppl.addTexture(`MsaaRadiance${id}`, TextureType.TEX2D, Format.RGBA16F, width, height, 1, 1, 1,
                        settings.msaa.sampleCount, ResourceFlags.COLOR_ATTACHMENT, ResourceResidency.MEMORYLESS);
                } else {
                    ppl.addTexture(`MsaaRadiance${id}`, TextureType.TEX2D, Format.RGBA8, width, height, 1, 1, 1,
                        settings.msaa.sampleCount, ResourceFlags.COLOR_ATTACHMENT, ResourceResidency.MEMORYLESS);
                }
                ppl.addTexture(`MsaaDepthStencil${id}`, TextureType.TEX2D, Format.DEPTH_STENCIL, width, height, 1, 1, 1,
                    settings.msaa.sampleCount, ResourceFlags.DEPTH_STENCIL_ATTACHMENT, ResourceResidency.MEMORYLESS);
            }

            // Mainlight ShadowMap
            ppl.addRenderTarget(
                `ShadowMap${id}`,
                this._configs.shadowMapFormat,
                this._configs.shadowMapSize.x,
                this._configs.shadowMapSize.y,
            );
            ppl.addDepthStencil(
                `ShadowDepth${id}`,
                Format.DEPTH_STENCIL,
                this._configs.shadowMapSize.x,
                this._configs.shadowMapSize.y,
            );

            // Spot-light shadow maps
            if (this._cameraConfigs.singleForwardRadiancePass) {
                const count = this._configs.mobileMaxSpotLightShadowMaps;
                for (let i = 0; i !== count; ++i) {
                    ppl.addRenderTarget(
                        `SpotShadowMap${i}`,
                        this._configs.shadowMapFormat,
                        this._configs.shadowMapSize.x,
                        this._configs.shadowMapSize.y,
                    );
                    ppl.addDepthStencil(
                        `SpotShadowDepth${i}`,
                        Format.DEPTH_STENCIL,
                        this._configs.shadowMapSize.x,
                        this._configs.shadowMapSize.y,
                    );
                }
            }

            // Post Process
            if (this._cameraConfigs.enablePostProcess) {
                // DepthOfField
                if (settings.depthOfField.enabled) {
                    const halfWidth = Math.max(Math.floor(width / 2), 1);
                    const halfHeight = Math.max(Math.floor(height / 2), 1);
                    // `DofCoc${id}` texture will reuse `LdrColor${id}`
                    ppl.addRenderTarget(`DofRadiance${id}`, Format.RGBA16F, width, height);
                    ppl.addRenderTarget(`DofPrefilter${id}`, Format.RGBA16F, halfWidth, halfHeight);
                    ppl.addRenderTarget(`DofBokeh${id}`, Format.RGBA16F, halfWidth, halfHeight);
                    ppl.addRenderTarget(`DofFilter${id}`, Format.RGBA16F, halfWidth, halfHeight);
                }
                // Bloom (Kawase Dual Filter)
                if (settings.bloom.enabled) {
                    let bloomWidth = width;
                    let bloomHeight = height;
                    for (let i = 0; i !== settings.bloom.iterations + 1; ++i) {
                        bloomWidth = Math.max(Math.floor(bloomWidth / 2), 1);
                        bloomHeight = Math.max(Math.floor(bloomHeight / 2), 1);
                        ppl.addRenderTarget(`BloomTex${id}_${i}`, Format.RGBA16F, bloomWidth, bloomHeight);
                    }
                }
                // FXAA
                if (settings.fxaa.enabled && this._cameraConfigs.enableShadingScale) {
                    ppl.addRenderTarget(`AaColor${id}`, Format.RGBA8, width, height);
                }
            }
        }
        setup(cameras: renderer.scene.Camera[], ppl: rendering.BasicPipeline): void {
            // TODO(zhouzhenglong): Make default effect asset loading earlier and remove _initMaterials
            if (this._initMaterials(ppl)) {
                return;
            }
            // Render cameras
            for (const camera of cameras) {
                // Skip invalid camera
                if (camera.scene === null || camera.window === null) {
                    continue;
                }
                // Setup camera configs
                setupCameraConfigs(camera, this._configs, this._cameraConfigs);

                // Build pipeline
                this._buildForwardPipeline(ppl, camera, camera.scene);
            }
        }

        // ----------------------------------------------------------------
        // Pipelines
        // ----------------------------------------------------------------
        private _buildForwardPipeline(
            ppl: rendering.BasicPipeline,
            camera: renderer.scene.Camera,
            scene: renderer.RenderScene,
        ): void {
            // Init
            const settings = this._cameraConfigs.pipelineSettings;
            const nativeWidth = Math.max(Math.floor(camera.window.width), 1);
            const nativeHeight = Math.max(Math.floor(camera.window.height), 1);
            const width = this._cameraConfigs.enableShadingScale
                ? Math.max(Math.floor(nativeWidth * this._cameraConfigs.shadingScale), 1)
                : nativeWidth;
            const height = this._cameraConfigs.enableShadingScale
                ? Math.max(Math.floor(nativeHeight * this._cameraConfigs.shadingScale), 1)
                : nativeHeight;
            const id = camera.window.renderWindowId;
            const colorName = camera.window.colorName;
            const depthStencilName = camera.window.depthStencilName;
            const radianceName = `Radiance${id}`;
            const mainLight = scene.mainLight;

            // Forward Lighting (Light Culling)
            this.forwardLighting.cullLights(scene, camera.frustum);

            // Main Directional light CSM Shadow Map
            if (this._cameraConfigs.enableShadowMap) {
                this._addCascadedShadowMapPass(ppl, id, mainLight!, camera);
            }

            // Spot light shadow maps (Mobile or MSAA)
            if (this._cameraConfigs.singleForwardRadiancePass) {
                // Currently, only support 1 spot light with shadow map on mobile platform.
                // TODO(zhouzhenglong): Relex this limitation.
                this.forwardLighting.addSpotlightShadowPasses(ppl, camera, this._configs.mobileMaxSpotLightShadowMaps);
            }

            // Forward Lighting
            let lastPass: rendering.BasicRenderPassBuilder;
            if (this._configs.useFloatOutput) { // HDR
                if (this._cameraConfigs.enablePostProcess) { // Post Process
                    // Radiance and DoF
                    if (this._configs.supportDepthSample && settings.depthOfField.enabled) {
                        const dofRadianceName = `DofRadiance${id}`;
                        // Disable MSAA, depth stencil cannot be resolved cross-platformly
                        this._addForwardRadiancePasses(ppl, id, camera, width, height, mainLight,
                            dofRadianceName, depthStencilName, true, StoreOp.STORE);
                        this._addDepthOfFieldPasses(ppl, settings, id, camera, width, height,
                            dofRadianceName, depthStencilName, radianceName);
                    } else {
                        this._addForwardRadiancePasses(ppl, id, camera, width, height, mainLight,
                            radianceName, depthStencilName);
                    }
                    // Bloom
                    if (settings.bloom.enabled) {
                        this._addKawaseDualFilterBloomPasses(ppl, settings, id, width, height, radianceName);
                    }
                    // Tone Mapping and FXAA
                    if (settings.fxaa.enabled) {
                        const ldrColorName = `LdrColor${id}`;
                        // FXAA is applied after tone mapping
                        this._addCopyAndTonemapPass(ppl, settings, width, height, radianceName, ldrColorName);
                        // Apply FXAA
                        if (this._cameraConfigs.enableShadingScale) {
                            const aaColorName = `AaColor${id}`;
                            // Apply FXAA on scaled image
                            this._addFxaaPass(ppl, width, height, ldrColorName, aaColorName);
                            // Copy FXAA result to screen
                            if (this._cameraConfigs.enableFSR) {
                                // Apply FSR
                                lastPass = this._addFsrPass(ppl, settings, id, width, height, aaColorName,
                                    nativeWidth, nativeHeight, colorName);
                            } else {
                                // Scale FXAA result to screen
                                lastPass = this._addCopyPass(ppl, nativeWidth, nativeHeight, aaColorName, colorName);
                            }
                        } else {
                            // Image not scaled, output FXAA result to screen directly
                            lastPass = this._addFxaaPass(ppl, nativeWidth, nativeHeight, ldrColorName, colorName);
                        }
                    } else {
                        // No FXAA (Size might be scaled)
                        lastPass = this._addTonemapResizeOrSuperResolutionPasses(ppl, settings, id,
                            width, height, radianceName,
                            nativeWidth, nativeHeight, colorName);
                    }
                } else {
                    // No post process, output HDR result to screen directly (Size might be scaled)
                    this._addForwardRadiancePasses(ppl, id, camera,
                        width, height, mainLight, radianceName, depthStencilName);
                    lastPass = this._addTonemapResizeOrSuperResolutionPasses(ppl, settings, id,
                        width, height, radianceName,
                        nativeWidth, nativeHeight, colorName);
                }
            } else if (this._cameraConfigs.enableShadingScale) { // LDR (Size is scaled)
                this._addForwardRadiancePasses(ppl, id, camera,
                    width, height, mainLight, radianceName, depthStencilName);
                lastPass = this._addTonemapResizeOrSuperResolutionPasses(ppl, settings, id,
                    width, height, radianceName,
                    nativeWidth, nativeHeight, colorName);
            } else { // LDR (Size is not scaled)
                lastPass = this._addForwardRadiancePasses(ppl, id, camera,
                    nativeWidth, nativeHeight, mainLight, colorName, depthStencilName);
            }

            // UI size is not scaled, does not have AA
            this._addUIQueue(camera, lastPass);
        }

        // ----------------------------------------------------------------
        // Common Passes
        // ----------------------------------------------------------------
        private _addTonemapResizeOrSuperResolutionPasses(
            ppl: rendering.BasicPipeline,
            settings: PipelineSettings,
            id: number,
            width: number,
            height: number,
            radianceName: string,
            nativeWidth: number,
            nativeHeight: number,
            colorName: string,
        ): rendering.BasicRenderPassBuilder {
            const ldrColorName = `LdrColor${id}`;
            let lastPass: rendering.BasicRenderPassBuilder;
            if (this._cameraConfigs.enableFSR) {
                // Apply FSR
                this._addCopyAndTonemapPass(ppl, settings,
                    width, height, radianceName, ldrColorName);
                lastPass = this._addFsrPass(ppl, settings, id,
                    width, height, ldrColorName,
                    nativeWidth, nativeHeight, colorName);
            } else {
                // Output HDR/LDR result to screen directly (Size might be scaled)
                lastPass = this._addCopyAndTonemapPass(ppl, settings,
                    nativeWidth, nativeHeight, radianceName, colorName);
            }
            return lastPass;
        }

        private _addCascadedShadowMapPass(
            ppl: rendering.BasicPipeline,
            id: number,
            light: renderer.scene.DirectionalLight,
            camera: renderer.scene.Camera,
        ): void {
            // ----------------------------------------------------------------
            // Dynamic states
            // ----------------------------------------------------------------
            const width = ppl.pipelineSceneData.shadows.size.x;
            const height = ppl.pipelineSceneData.shadows.size.y;
            this._viewport.left = 0;
            this._viewport.top = 0;
            this._viewport.width = width;
            this._viewport.height = height;

            // ----------------------------------------------------------------
            // CSM Shadow Map
            // ----------------------------------------------------------------
            const pass = ppl.addRenderPass(width, height, 'default');
            pass.name = 'CascadedShadowMap';
            pass.addRenderTarget(`ShadowMap${id}`, LoadOp.CLEAR, StoreOp.STORE, new Color(1, 1, 1, 1));
            pass.addDepthStencil(`ShadowDepth${id}`, LoadOp.CLEAR, StoreOp.DISCARD);
            const csmLevel = ppl.pipelineSceneData.csmSupported ? light.csmLevel : 1;

            // Add shadow map viewports
            for (let level = 0; level !== csmLevel; ++level) {
                getCsmMainLightViewport(light, width, height, level, this._viewport, this._configs.screenSpaceSignY);
                const queue = pass.addQueue(QueueHint.NONE, 'shadow-caster');
                queue.setViewport(this._viewport);
                queue
                    .addScene(camera, SceneFlags.OPAQUE | SceneFlags.MASK | SceneFlags.SHADOW_CASTER)
                    .useLightFrustum(light, level);
            }
        }

        private _addCopyPass(
            ppl: rendering.BasicPipeline,
            width: number,
            height: number,
            input: string,
            output: string,
        ): rendering.BasicRenderPassBuilder {
            const pass = ppl.addRenderPass(width, height, 'post-copy');
            pass.addRenderTarget(output, LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
            pass.addTexture(input, 'inputTexture');
            pass.setVec4('g_platform', this._configs.platform);
            pass.addQueue(QueueHint.OPAQUE)
                .addFullscreenQuad(this._copyAndTonemapMaterial, 2);
            return pass;
        }

        private _addCopyAndTonemapPass(
            ppl: rendering.BasicPipeline,
            settings: PipelineSettings,
            width: number,
            height: number,
            radianceName: string,
            colorName: string,
        ): rendering.BasicRenderPassBuilder {
            let pass: rendering.BasicRenderPassBuilder;
            if (this._cameraConfigs.enablePostProcess
                && settings.colorGrading.enabled
                && settings.colorGrading.colorGradingMap !== null) {
                const lutTex = settings.colorGrading.colorGradingMap;

                this._colorGradingMaterial.setProperty('colorGradingMap', lutTex);
                this._colorGradingMaterial.setProperty('contribute', settings.colorGrading.contribute);
                this._colorGradingTexSize.x = lutTex.width;
                this._colorGradingTexSize.y = lutTex.height;
                this._colorGradingMaterial.setProperty('lutTextureSize', this._colorGradingTexSize);

                const isSquareMap = lutTex.width === lutTex.height;
                if (isSquareMap) {
                    pass = ppl.addRenderPass(width, height, 'color-grading-8x8');
                } else {
                    pass = ppl.addRenderPass(width, height, 'color-grading-nx1');
                }
                pass.addRenderTarget(colorName, LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
                pass.addTexture(radianceName, 'sceneColorMap');
                pass.setVec4('cc_cameraPos', this._configs.platform); // We only use cc_cameraPos.w
                pass.addQueue(QueueHint.OPAQUE)
                    .addFullscreenQuad(this._colorGradingMaterial, isSquareMap ? 1 : 0);
            } else {
                pass = ppl.addRenderPass(width, height, 'post-final-tonemap');
                pass.addRenderTarget(colorName, LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
                pass.addTexture(radianceName, 'inputTexture');
                pass.setVec4('g_platform', this._configs.platform);
                pass.addQueue(QueueHint.OPAQUE)
                    .addFullscreenQuad(this._copyAndTonemapMaterial, 1);
            }
            return pass;
        }

        private _buildForwardMainLightPass(
            pass: rendering.BasicRenderPassBuilder,
            id: number,
            camera: renderer.scene.Camera,
            colorName: string,
            depthStencilName: string,
            depthStencilStoreOp: gfx.StoreOp,
            mainLight: renderer.scene.DirectionalLight | null,
        ): void {
            // set viewport
            pass.setViewport(this._viewport);

            const colorStoreOp = this._cameraConfigs.enableMSAA ? StoreOp.DISCARD : StoreOp.STORE;

            // bind output render target
            if (forwardNeedClearColor(camera)) {
                pass.addRenderTarget(colorName, LoadOp.CLEAR, colorStoreOp, this._clearColor);
            } else {
                pass.addRenderTarget(colorName, LoadOp.LOAD, colorStoreOp);
            }

            // bind depth stencil buffer
            if (camera.clearFlag & ClearFlagBit.DEPTH_STENCIL) {
                pass.addDepthStencil(
                    depthStencilName,
                    LoadOp.CLEAR,
                    depthStencilStoreOp,
                    camera.clearDepth,
                    camera.clearStencil,
                    camera.clearFlag & ClearFlagBit.DEPTH_STENCIL,
                );
            } else {
                pass.addDepthStencil(depthStencilName, LoadOp.LOAD, depthStencilStoreOp);
            }

            // Set shadow map if enabled
            if (this._cameraConfigs.enableShadowMap) {
                pass.addTexture(`ShadowMap${id}`, 'cc_shadowMap');
            }

            // TODO(zhouzhenglong): Separate OPAQUE and MASK queue

            // add opaque and mask queue
            pass.addQueue(QueueHint.NONE) // Currently we put OPAQUE and MASK into one queue, so QueueHint is NONE
                .addScene(camera, SceneFlags.OPAQUE | SceneFlags.MASK, mainLight || undefined);
        }

        private _addDepthOfFieldPasses(
            ppl: rendering.BasicPipeline,
            settings: PipelineSettings,
            id: number,
            camera: renderer.scene.Camera,
            width: number,
            height: number,
            dofRadianceName: string,
            depthStencil: string,
            radianceName: string,
        ): void {
            // https://catlikecoding.com/unity/tutorials/advanced-rendering/depth-of-field/

            this._cocParams.x = settings.depthOfField.focusDistance;
            this._cocParams.y = settings.depthOfField.focusRange;
            this._cocParams.z = settings.depthOfField.bokehRadius;
            this._cocParams.w = 0.0;
            this._cocTexSize.x = 1.0 / width;
            this._cocTexSize.y = 1.0 / height;
            this._cocTexSize.z = width;
            this._cocTexSize.w = height;
            this._dofMaterial.setProperty('cocParams', this._cocParams);
            this._dofMaterial.setProperty('mainTexTexelSize', this._cocTexSize);

            const halfWidth = Math.max(Math.floor(width / 2), 1);
            const halfHeight = Math.max(Math.floor(height / 2), 1);

            const cocName = `LdrColor${id}`;
            const prefilterName = `DofPrefilter${id}`;
            const bokehName = `DofBokeh${id}`;
            const filterName = `DofFilter${id}`;

            // CoC
            const cocPass = ppl.addRenderPass(width, height, 'dof-coc');
            cocPass.addRenderTarget(cocName, LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
            cocPass.addTexture(depthStencil, 'DepthTex');
            cocPass
                .addQueue(QueueHint.OPAQUE)
                .addCameraQuad(camera, this._dofMaterial, 0); // addCameraQuad will set camera related UBOs

            // Downsample and Prefilter
            const prefilterPass = ppl.addRenderPass(halfWidth, halfHeight, 'dof-prefilter');
            prefilterPass.addRenderTarget(prefilterName, LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
            prefilterPass.addTexture(cocName, 'cocTex');
            prefilterPass.addTexture(dofRadianceName, 'colorTex');
            prefilterPass.setVec4('cc_cameraPos', this._configs.platform); // We only use cc_cameraPos.w
            prefilterPass
                .addQueue(QueueHint.OPAQUE)
                .addFullscreenQuad(this._dofMaterial, 1);

            // Bokeh blur
            const bokehPass = ppl.addRenderPass(halfWidth, halfHeight, 'dof-bokeh');
            bokehPass.addRenderTarget(bokehName, LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
            bokehPass.addTexture(prefilterName, 'prefilterTex');
            bokehPass.setVec4('cc_cameraPos', this._configs.platform); // We only use cc_cameraPos.w
            bokehPass
                .addQueue(QueueHint.OPAQUE)
                .addFullscreenQuad(this._dofMaterial, 2);

            // Filtering
            const filterPass = ppl.addRenderPass(halfWidth, halfHeight, 'dof-filter');
            filterPass.addRenderTarget(filterName, LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
            filterPass.addTexture(bokehName, 'bokehTex');
            filterPass.setVec4('cc_cameraPos', this._configs.platform); // We only use cc_cameraPos.w
            filterPass
                .addQueue(QueueHint.OPAQUE)
                .addFullscreenQuad(this._dofMaterial, 3);

            // Combine
            const combinePass = ppl.addRenderPass(width, height, 'dof-combine');
            combinePass.addRenderTarget(radianceName, LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
            combinePass.addTexture(filterName, 'filterTex');
            combinePass.addTexture(dofRadianceName, 'colorTex');
            combinePass.addTexture(cocName, 'cocTex');
            combinePass.setVec4('cc_cameraPos', this._configs.platform); // We only use cc_cameraPos.w
            combinePass
                .addQueue(QueueHint.OPAQUE)
                .addFullscreenQuad(this._dofMaterial, 4);
        }

        private _addKawaseDualFilterBloomPasses(
            ppl: rendering.BasicPipeline,
            settings: PipelineSettings,
            id: number,
            width: number,
            height: number,
            radianceName: string,
        ): void {
            // Based on Kawase Dual Filter Blur. Saves bandwidth on mobile devices.
            // eslint-disable-next-line max-len
            // https://community.arm.com/cfs-file/__key/communityserver-blogs-components-weblogfiles/00-00-00-20-66/siggraph2015_2D00_mmg_2D00_marius_2D00_slides.pdf

            // Size: [prefilter(1/2), downsample(1/4), downsample(1/8), downsample(1/16), ...]
            const iterations = settings.bloom.iterations;
            const sizeCount = iterations + 1;
            this._bloomWidths.length = sizeCount;
            this._bloomHeights.length = sizeCount;
            this._bloomWidths[0] = Math.max(Math.floor(width / 2), 1);
            this._bloomHeights[0] = Math.max(Math.floor(height / 2), 1);
            for (let i = 1; i !== sizeCount; ++i) {
                this._bloomWidths[i] = Math.max(Math.floor(this._bloomWidths[i - 1] / 2), 1);
                this._bloomHeights[i] = Math.max(Math.floor(this._bloomHeights[i - 1] / 2), 1);
            }

            // Bloom texture names
            this._bloomTexNames.length = sizeCount;
            for (let i = 0; i !== sizeCount; ++i) {
                this._bloomTexNames[i] = `BloomTex${id}_${i}`;
            }

            // Setup bloom parameters
            this._bloomParams.x = this._configs.useFloatOutput ? 1 : 0;
            this._bloomParams.x = 0; // unused
            this._bloomParams.z = settings.bloom.threshold;
            this._bloomParams.w = settings.bloom.enableAlphaMask ? 1 : 0;

            // Prefilter pass
            const prefilterPass = ppl.addRenderPass(this._bloomWidths[0], this._bloomHeights[0], 'bloom1-prefilter');
            prefilterPass.addRenderTarget(
                this._bloomTexNames[0],
                LoadOp.CLEAR,
                StoreOp.STORE,
                this._clearColorTransparentBlack,
            );
            prefilterPass.addTexture(radianceName, 'inputTexture');
            prefilterPass.setVec4('g_platform', this._configs.platform);
            prefilterPass.setVec4('bloomParams', this._bloomParams);
            prefilterPass
                .addQueue(QueueHint.OPAQUE)
                .addFullscreenQuad(this._bloomMaterial, 0);

            // Downsample passes
            for (let i = 1; i !== sizeCount; ++i) {
                const downPass = ppl.addRenderPass(this._bloomWidths[i], this._bloomHeights[i], 'bloom1-downsample');
                downPass.addRenderTarget(this._bloomTexNames[i], LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
                downPass.addTexture(this._bloomTexNames[i - 1], 'bloomTexture');
                this._bloomTexSize.x = this._bloomWidths[i - 1];
                this._bloomTexSize.y = this._bloomHeights[i - 1];
                downPass.setVec4('g_platform', this._configs.platform);
                downPass.setVec4('bloomTexSize', this._bloomTexSize);
                downPass
                    .addQueue(QueueHint.OPAQUE)
                    .addFullscreenQuad(this._bloomMaterial, 1);
            }

            // Upsample passes
            for (let i = iterations; i-- > 0;) {
                const upPass = ppl.addRenderPass(this._bloomWidths[i], this._bloomHeights[i], 'bloom1-upsample');
                upPass.addRenderTarget(this._bloomTexNames[i], LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
                upPass.addTexture(this._bloomTexNames[i + 1], 'bloomTexture');
                this._bloomTexSize.x = this._bloomWidths[i + 1];
                this._bloomTexSize.y = this._bloomHeights[i + 1];
                upPass.setVec4('g_platform', this._configs.platform);
                upPass.setVec4('bloomTexSize', this._bloomTexSize);
                upPass
                    .addQueue(QueueHint.OPAQUE)
                    .addFullscreenQuad(this._bloomMaterial, 2);
            }

            // Combine pass
            const combinePass = ppl.addRenderPass(width, height, 'bloom1-combine');
            combinePass.addRenderTarget(radianceName, LoadOp.LOAD, StoreOp.STORE);
            combinePass.addTexture(this._bloomTexNames[0], 'bloomTexture');
            combinePass.setVec4('g_platform', this._configs.platform);
            combinePass.setVec4('bloomParams', this._bloomParams);
            combinePass
                .addQueue(QueueHint.BLEND)
                .addFullscreenQuad(this._bloomMaterial, 3);
        }

        private _addFsrPass(
            ppl: rendering.BasicPipeline,
            settings: PipelineSettings,
            id: number,
            width: number,
            height: number,
            ldrColorName: string,
            nativeWidth: number,
            nativeHeight: number,
            colorName: string,
        ): rendering.BasicRenderPassBuilder {
            this._fsrParams.x = clamp(1.0 - settings.fsr.sharpness, 0.02, 0.98);
            this._fsrTexSize.x = width;
            this._fsrTexSize.y = height;
            this._fsrTexSize.z = nativeWidth;
            this._fsrTexSize.w = nativeHeight;
            this._fsrMaterial.setProperty('fsrParams', this._fsrParams);
            this._fsrMaterial.setProperty('texSize', this._fsrTexSize);

            const fsrColorName = `FsrColor${id}`;

            const easuPass = ppl.addRenderPass(nativeWidth, nativeHeight, 'fsr-easu');
            easuPass.addRenderTarget(fsrColorName, LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
            easuPass.addTexture(ldrColorName, 'outputResultMap');
            easuPass.setVec4('cc_cameraPos', this._configs.platform); // We only use cc_cameraPos.w
            easuPass
                .addQueue(QueueHint.OPAQUE)
                .addFullscreenQuad(this._fsrMaterial, 0);

            const rcasPass = ppl.addRenderPass(nativeWidth, nativeHeight, 'fsr-rcas');
            rcasPass.addRenderTarget(colorName, LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
            rcasPass.addTexture(fsrColorName, 'outputResultMap');
            rcasPass.setVec4('cc_cameraPos', this._configs.platform); // We only use cc_cameraPos.w
            rcasPass
                .addQueue(QueueHint.OPAQUE)
                .addFullscreenQuad(this._fsrMaterial, 1);

            return rcasPass;
        }

        private _addFxaaPass(
            ppl: rendering.BasicPipeline,
            width: number,
            height: number,
            ldrColorName: string,
            colorName: string,
        ): rendering.BasicRenderPassBuilder {
            this._fxaaMaterial.setProperty('texSize', new Vec4(width, height, 1 / width, 1 / height));

            const pass = ppl.addRenderPass(width, height, 'fxaa');
            pass.addRenderTarget(colorName, LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
            pass.addTexture(ldrColorName, 'sceneColorMap');
            pass.setVec4('cc_cameraPos', this._configs.platform); // We only use cc_cameraPos.w
            pass.addQueue(QueueHint.OPAQUE)
                .addFullscreenQuad(this._fxaaMaterial, 0);
            return pass;
        }

        private _addUIQueue(camera: renderer.scene.Camera, pass: rendering.BasicRenderPassBuilder): void {
            let flags = SceneFlags.UI;
            if (this._cameraConfigs.enableProfiler) {
                flags |= SceneFlags.PROFILER;
                pass.showStatistics = true;
            }
            pass
                .addQueue(QueueHint.BLEND)
                .addScene(camera, flags);
        }

        // ----------------------------------------------------------------
        // Forward
        // ----------------------------------------------------------------
        private _addForwardRadiancePasses(
            ppl: rendering.BasicPipeline,
            id: number,
            camera: renderer.scene.Camera,
            width: number,
            height: number,
            mainLight: renderer.scene.DirectionalLight | null,
            colorName: string,
            depthStencilName: string,
            disableMSAA: boolean = false,
            depthStencilStoreOp: gfx.StoreOp = StoreOp.DISCARD,
        ): rendering.BasicRenderPassBuilder {
            // ----------------------------------------------------------------
            // Dynamic states
            // ----------------------------------------------------------------
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

            // MSAA
            const enableMSAA = !disableMSAA && this._cameraConfigs.enableMSAA;
            assert(!enableMSAA || this._cameraConfigs.singleForwardRadiancePass);

            // ----------------------------------------------------------------
            // Forward Lighting (Main Directional Light)
            // ----------------------------------------------------------------
            const pass = this._cameraConfigs.singleForwardRadiancePass
                ? this._addForwardSingleRadiancePass(ppl, id, camera, enableMSAA, width, height, mainLight,
                    colorName, depthStencilName, depthStencilStoreOp)
                : this._addForwardMultipleRadiancePasses(ppl, id, camera, width, height, mainLight,
                    colorName, depthStencilName, depthStencilStoreOp);

            // ----------------------------------------------------------------
            // Forward Lighting (Blend)
            // ----------------------------------------------------------------
            // Add transparent queue
            pass
                .addQueue(QueueHint.BLEND)
                .addScene(camera, SceneFlags.BLEND, mainLight || undefined);

            return pass;
        }

        private _addForwardSingleRadiancePass(
            ppl: rendering.BasicPipeline,
            id: number,
            camera: renderer.scene.Camera,
            enableMSAA: boolean,
            width: number,
            height: number,
            mainLight: renderer.scene.DirectionalLight | null,
            colorName: string,
            depthStencilName: string,
            depthStencilStoreOp: gfx.StoreOp
        ): rendering.BasicRenderPassBuilder {
            assert(this._cameraConfigs.singleForwardRadiancePass);
            // ----------------------------------------------------------------
            // Forward Lighting (Main Directional Light)
            // ----------------------------------------------------------------
            let pass: rendering.BasicRenderPassBuilder;
            if (enableMSAA) {
                const msaaRadianceName = `MsaaRadiance${id}`;
                const msaaDepthStencilName = `MsaaDepthStencil${id}`;
                const sampleCount = this._cameraConfigs.pipelineSettings.msaa.sampleCount;

                const msPass = ppl.addMultisampleRenderPass(width, height, sampleCount, 0, 'default');
                msPass.name = 'MsaaForwardPass';

                // MSAA always discards depth stencil
                this._buildForwardMainLightPass(msPass, id, camera,
                    msaaRadianceName, msaaDepthStencilName, StoreOp.DISCARD, mainLight);

                msPass.resolveRenderTarget(msaaRadianceName, colorName);

                pass = msPass;
            } else {
                pass = ppl.addRenderPass(width, height, 'default');
                pass.name = 'ForwardPass';

                this._buildForwardMainLightPass(pass, id, camera,
                    colorName, depthStencilName, depthStencilStoreOp, mainLight);
            }
            assert(pass !== undefined);

            // Forward Lighting (Additive Lights)
            this.forwardLighting.addLightQueues(
                pass,
                camera,
                this._configs.mobileMaxSpotLightShadowMaps,
            );

            return pass;
        }

        private _addForwardMultipleRadiancePasses(
            ppl: rendering.BasicPipeline,
            id: number,
            camera: renderer.scene.Camera,
            width: number,
            height: number,
            mainLight: renderer.scene.DirectionalLight | null,
            colorName: string,
            depthStencilName: string,
            depthStencilStoreOp: gfx.StoreOp
        ): rendering.BasicRenderPassBuilder {
            assert(!this._cameraConfigs.singleForwardRadiancePass);

            // Forward Lighting (Main Directional Light)
            let pass = ppl.addRenderPass(width, height, 'default');
            pass.name = 'ForwardPass';

            const firstStoreOp = this.forwardLighting.isMultipleLightPassesNeeded()
                ? StoreOp.STORE
                : depthStencilStoreOp;

            this._buildForwardMainLightPass(pass, id, camera,
                colorName, depthStencilName, firstStoreOp, mainLight);

            // Forward Lighting (Additive Lights)
            pass = this.forwardLighting
                .addLightPasses(colorName, depthStencilName, depthStencilStoreOp,
                    id, width, height, camera, ppl, pass);

            return pass;
        }

        private _initMaterials(ppl: rendering.BasicPipeline): number {
            if (this._initialized) {
                return 0;
            }

            setupPipelineConfigs(ppl, this._configs);

            // When add new effect asset, please add its uuid to the dependentAssets in cc.config.json.
            this._copyAndTonemapMaterial._uuid = `builtin-pipeline-post-final-tonemap-material`;
            this._copyAndTonemapMaterial.initialize({ effectName: 'pipeline/post-process/post-final' });

            this._dofMaterial._uuid = `builtin-pipeline-post-dof-material`;
            this._dofMaterial.initialize({ effectName: 'pipeline/post-process/dof' });

            this._bloomMaterial._uuid = `builtin-pipeline-post-bloom-material`;
            this._bloomMaterial.initialize({ effectName: 'pipeline/post-process/bloom1' });

            this._colorGradingMaterial._uuid = `builtin-pipeline-post-color-grading-material`;
            this._colorGradingMaterial.initialize({ effectName: 'pipeline/post-process/color-grading' });

            this._fxaaMaterial._uuid = `builtin-pipeline-post-fxaa-material`;
            this._fxaaMaterial.initialize({ effectName: 'pipeline/post-process/fxaa-hq' });

            this._fsrMaterial._uuid = `builtin-pipeline-post-fsr-material`;
            this._fsrMaterial.initialize({ effectName: 'pipeline/post-process/fsr' });

            if (this._copyAndTonemapMaterial.effectAsset !== null
                && this._dofMaterial.effectAsset !== null
                && this._bloomMaterial.effectAsset !== null
                && this._colorGradingMaterial.effectAsset !== null
                && this._fxaaMaterial.effectAsset !== null
                && this._fsrMaterial.effectAsset !== null
            ) {
                this._initialized = true;
            }

            return this._initialized ? 0 : 1;
        }
    }

    rendering.setCustomPipeline('Builtin', new BuiltinPipeline());

} // if (rendering)
