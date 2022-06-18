/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

/* eslint-disable max-len */
import { systemInfo } from 'pal/system-info';
import { Color, Buffer, DescriptorSetLayout, Device, Feature, Format, FormatFeatureBit, Sampler, Swapchain, Texture, StoreOp, LoadOp, ClearFlagBit, DescriptorSet } from '../../gfx/index';
import { Mat4, Quat, Vec2, Vec4 } from '../../math';
import { QueueHint, ResourceDimension, ResourceFlags, ResourceResidency, SceneFlags, UpdateFrequency } from './types';
import { AccessType, AttachmentType, Blit, ComputePass, ComputeView, CopyPair, CopyPass, Dispatch, ManagedResource, MovePair, MovePass, PresentPass, RasterPass, RasterView, RenderData, RenderGraph, RenderGraphValue, RenderQueue, RenderSwapchain, ResourceDesc, ResourceGraph, ResourceGraphValue, ResourceStates, ResourceTraits, SceneData } from './render-graph';
import { ComputePassBuilder, ComputeQueueBuilder, CopyPassBuilder, LayoutGraphBuilder, MovePassBuilder, Pipeline, RasterPassBuilder, RasterQueueBuilder, SceneTask, SceneTransversal, SceneVisitor, Setter } from './pipeline';
import { PipelineSceneData } from '../pipeline-scene-data';
import { Model, Camera, SKYBOX_FLAG, Light, LightType, ShadowType, DirectionalLight, Shadows } from '../../renderer/scene';
import { legacyCC } from '../../global-exports';
import { LayoutGraphData } from './layout-graph';
import { Executor } from './executor';
import { WebImplExample } from './web-pipeline-impl';
import { RenderWindow } from '../../renderer/core/render-window';
import { assert, macro } from '../../platform';
import { WebSceneTransversal } from './web-scene';
import { MacroRecord, RenderScene } from '../../renderer';
import { GlobalDSManager } from '../global-descriptor-set-manager';
import { supportsR32FloatTexture, UNIFORM_SHADOWMAP_BINDING, UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING } from '../define';
import { OS } from '../../../../pal/system-info/enum-type';
import { WebDescriptorHierarchy } from './web-descriptor-hierarchy';
import { Compiler } from './compiler';
import { PipelineUBO } from './ubos';
import { builtinResMgr } from '../../builtin/builtin-res-mgr';
import { Texture2D } from '../../assets/texture-2d';
import { WebLayoutGraphBuilder } from './web-layout-graph';
import { GeometryRenderer } from '..';

export class WebSetter {
    constructor (data: RenderData) {
        this._data = data;
    }
    public setMat4 (name: string, mat: Mat4): void {}
    public setQuaternion (name: string, quat: Quat): void {}
    public setColor (name: string, color: Color): void {}
    public setVec4 (name: string, vec: Vec4): void {}
    public setVec2 (name: string, vec: Vec2): void {}
    public setFloat (name: string, v: number): void {}
    public setBuffer (name: string, buffer: Buffer): void {}
    public setTexture (name: string, texture: Texture): void {}
    public setReadWriteBuffer (name: string, buffer: Buffer): void {}
    public setReadWriteTexture (name: string, texture: Texture): void {}
    public setSampler (name: string, sampler: Sampler): void {}

    // protected
    private readonly _data: RenderData;
}

function setCameraValues (setter: Setter,
    camera: Readonly<Camera>, cfg: Readonly<PipelineSceneData>,
    scene: Readonly<RenderScene>) {
    setter.setMat4('cc_matView', camera.matView);
    setter.setMat4('cc_matViewInv', camera.node.worldMatrix);
    setter.setMat4('cc_matProj', camera.matProj);
    setter.setMat4('cc_matProjInv', camera.matProjInv);
    setter.setMat4('cc_matViewProj', camera.matViewProj);
    setter.setMat4('cc_matViewProjInv', camera.matViewProjInv);
    setter.setVec4('cc_cameraPos', new Vec4(camera.position.x, camera.position.y, camera.position.z, 0.0));
    setter.setVec4('cc_surfaceTransform', new Vec4(camera.surfaceTransform, 0.0, 0.0, 0.0));
    setter.setVec4('cc_screenScale', new Vec4(cfg.shadingScale, cfg.shadingScale, 1.0 / cfg.shadingScale, 1.0 / cfg.shadingScale));
    setter.setVec4('cc_exposure', new Vec4(camera.exposure, 1.0 / camera.exposure, cfg.isHDR ? 1.0 : 0.0, 0.0));

    const mainLight = scene.mainLight;
    if (mainLight) {
        setter.setVec4('cc_mainLitDir', new Vec4(mainLight.direction.x, mainLight.direction.y, mainLight.direction.z, 0.0));
        let r = mainLight.color.x;
        let g = mainLight.color.y;
        let b = mainLight.color.z;
        if (mainLight.useColorTemperature) {
            r *= mainLight.colorTemperatureRGB.x;
            g *= mainLight.colorTemperatureRGB.y;
            b *= mainLight.colorTemperatureRGB.z;
        }
        let w = mainLight.illuminance;
        if (cfg.isHDR) {
            w *= camera.exposure;
        }
        setter.setVec4('cc_mainLitColor', new Vec4(r, g, b, w));
    } else {
        setter.setVec4('cc_mainLitDir', new Vec4(0, 0, 1, 0));
        setter.setVec4('cc_mainLitColor', new Vec4(0, 0, 0, 0));
    }

    const ambient = cfg.ambient;
    const skyColor = ambient.skyColor;
    if (cfg.isHDR) {
        skyColor.w = ambient.skyIllum * camera.exposure;
    } else {
        skyColor.w = ambient.skyIllum;
    }
    setter.setVec4('cc_ambientSky', new Vec4(skyColor.x, skyColor.y, skyColor.z, skyColor.w));
    setter.setVec4('cc_ambientGround', new Vec4(ambient.groundAlbedo.x, ambient.groundAlbedo.y, ambient.groundAlbedo.z, ambient.groundAlbedo.w));

    const fog = cfg.fog;
    const colorTempRGB = fog.colorArray;
    setter.setVec4('cc_fogColor', new Vec4(colorTempRGB.x, colorTempRGB.y, colorTempRGB.z, colorTempRGB.w));
    setter.setVec4('cc_fogBase', new Vec4(fog.fogStart, fog.fogEnd, fog.fogDensity, 0.0));
    setter.setVec4('cc_fogAdd', new Vec4(fog.fogTop, fog.fogRange, fog.fogAtten, 0.0));
    setter.setVec4('cc_nearFar', new Vec4(camera.nearClip, camera.farClip, 0.0, 0.0));
    setter.setVec4('cc_viewPort', new Vec4(camera.viewport.x, camera.viewport.y, camera.viewport.z, camera.viewport.w));
}

export class WebRasterQueueBuilder extends WebSetter implements RasterQueueBuilder  {
    constructor (data: RenderData, renderGraph: RenderGraph, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData) {
        super(data);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._queue = queue;
        this._pipeline = pipeline;
    }
    addSceneOfCamera (camera: Camera, light: Light | null, sceneFlags: SceneFlags, name = 'Camera'): void {
        const sceneData = new SceneData(name, sceneFlags);
        sceneData.camera = camera;
        sceneData.light = light;
        this._renderGraph.addVertex<RenderGraphValue.Scene>(
            RenderGraphValue.Scene, sceneData, name, '', new RenderData(), false, this._vertID,
        );
        setCameraValues(this, camera, this._pipeline,
            camera.scene ? camera.scene : legacyCC.director.getScene().renderScene);
    }
    addScene (sceneName: string, sceneFlags: SceneFlags): void {
        const sceneData = new SceneData(sceneName, sceneFlags);
        this._renderGraph.addVertex<RenderGraphValue.Scene>(
            RenderGraphValue.Scene, sceneData, sceneName, '', new RenderData(), false, this._vertID,
        );
    }
    addFullscreenQuad (shader: string, layoutName = '', name = 'Quad'): void {
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit, new Blit(shader), name, '', new RenderData(), false, this._vertID,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _queue: RenderQueue;
    private readonly _pipeline: PipelineSceneData;
}

export class WebRasterPassBuilder extends WebSetter implements RasterPassBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, vertID: number, pass: RasterPass, pipeline: PipelineSceneData) {
        super(data);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._pass = pass;
        this._pipeline = pipeline;
    }
    addRasterView (name: string, view: RasterView) {
        this._pass.rasterViews.set(name, view);
    }
    addComputeView (name: string, view: ComputeView) {
        if (this._pass.computeViews.has(name)) {
            this._pass.computeViews.get(name)?.push(view);
        } else {
            this._pass.computeViews.set(name, [view]);
        }
    }
    addQueue (hint: QueueHint = QueueHint.RENDER_OPAQUE, layoutName = '', name = 'Queue') {
        if (layoutName === '') {
            switch (hint) {
            case QueueHint.RENDER_OPAQUE:
                layoutName = 'Opaque';
                break;
            case QueueHint.RENDER_CUTOUT:
                layoutName = 'Cutout';
                break;
            case QueueHint.RENDER_TRANSPARENT:
                layoutName = 'Transparent';
                break;
            default:
                throw Error('cannot infer layoutName from QueueHint');
            }
        }
        const queue = new RenderQueue(hint);
        const data = new RenderData();
        const queueID = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue, queue, name, layoutName, data, false, this._vertID,
        );
        return new WebRasterQueueBuilder(data, this._renderGraph, queueID, queue, this._pipeline);
    }
    addFullscreenQuad (shader: string, layoutName = '', name = 'Quad') {
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit,
            new Blit(shader),
            name, layoutName, new RenderData(), false, this._vertID,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _pass: RasterPass;
    private readonly _pipeline: PipelineSceneData;
}

export class WebComputeQueueBuilder extends WebSetter implements ComputeQueueBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData) {
        super(data);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._queue = queue;
        this._pipeline = pipeline;
    }
    addDispatch (shader: string,
        threadGroupCountX: number,
        threadGroupCountY: number,
        threadGroupCountZ: number,
        layoutName = '',
        name = 'Dispatch') {
        this._renderGraph.addVertex<RenderGraphValue.Dispatch>(
            RenderGraphValue.Dispatch,
            new Dispatch(shader, threadGroupCountX, threadGroupCountY, threadGroupCountZ),
            name, layoutName, new RenderData(), false, this._vertID,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _queue: RenderQueue;
    private readonly _pipeline: PipelineSceneData;
}

export class WebComputePassBuilder extends WebSetter implements ComputePassBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, vertID: number, pass: ComputePass, pipeline: PipelineSceneData) {
        super(data);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._pass = pass;
        this._pipeline = pipeline;
    }
    addComputeView (name: string, view: ComputeView) {
        if (this._pass.computeViews.has(name)) {
            this._pass.computeViews.get(name)?.push(view);
        } else {
            this._pass.computeViews.set(name, [view]);
        }
    }
    addQueue (layoutName = '', name = 'Queue') {
        const queue = new RenderQueue();
        const data = new RenderData();
        const queueID = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue, queue, name, layoutName, data, false, this._vertID,
        );
        return new WebComputeQueueBuilder(data, this._renderGraph, queueID, queue, this._pipeline);
    }
    addDispatch (shader: string,
        threadGroupCountX: number,
        threadGroupCountY: number,
        threadGroupCountZ: number,
        layoutName = '',
        name = 'Dispatch') {
        this._renderGraph.addVertex<RenderGraphValue.Dispatch>(
            RenderGraphValue.Dispatch,
            new Dispatch(shader, threadGroupCountX, threadGroupCountY, threadGroupCountZ),
            name, layoutName, new RenderData(), false, this._vertID,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _pass: ComputePass;
    private readonly _pipeline: PipelineSceneData;
}

export class WebMovePassBuilder extends MovePassBuilder {
    constructor (renderGraph: RenderGraph, vertID: number, pass: MovePass) {
        super();
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._pass = pass;
    }
    addPair (pair: MovePair) {
        this._pass.movePairs.push(pair);
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _pass: MovePass;
}

export class WebCopyPassBuilder extends CopyPassBuilder {
    constructor (renderGraph: RenderGraph, vertID: number, pass: CopyPass) {
        super();
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._pass = pass;
    }
    addPair (pair: CopyPair) {
        this._pass.copyPairs.push(pair);
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _pass: CopyPass;
}

function isManaged (residency: ResourceResidency): boolean {
    return residency === ResourceResidency.MANAGED
    || residency === ResourceResidency.MEMORYLESS;
}

export class WebPipeline extends Pipeline {
    protected _generateConstantMacros (clusterEnabled: boolean) {
        let str = '';
        str += `#define CC_DEVICE_SUPPORT_FLOAT_TEXTURE ${this._device.getFormatFeatures(Format.RGBA32F)
            & (FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE) ? 1 : 0}\n`;
        str += `#define CC_ENABLE_CLUSTERED_LIGHT_CULLING ${clusterEnabled ? 1 : 0}\n`;
        str += `#define CC_DEVICE_MAX_VERTEX_UNIFORM_VECTORS ${this._device.capabilities.maxVertexUniformVectors}\n`;
        str += `#define CC_DEVICE_MAX_FRAGMENT_UNIFORM_VECTORS ${this._device.capabilities.maxFragmentUniformVectors}\n`;
        str += `#define CC_DEVICE_CAN_BENEFIT_FROM_INPUT_ATTACHMENT ${this._device.hasFeature(Feature.INPUT_ATTACHMENT_BENEFIT) ? 1 : 0}\n`;
        str += `#define CC_PLATFORM_ANDROID_AND_WEBGL ${systemInfo.os === OS.ANDROID && systemInfo.isBrowser ? 1 : 0}\n`;
        str += `#define CC_ENABLE_WEBGL_HIGHP_STRUCT_VALUES ${macro.ENABLE_WEBGL_HIGHP_STRUCT_VALUES ? 1 : 0}\n`;
        this._constantMacros = str;
    }

    public activate (swapchain: Swapchain): boolean {
        this._device = legacyCC.director.root.device;
        this._globalDSManager = new GlobalDSManager(this._device);
        this._macros.CC_USE_HDR = this._pipelineSceneData.isHDR;
        this._generateConstantMacros(false);
        this._pipelineSceneData.activate(this._device);
        const descH = new WebDescriptorHierarchy();
        //descH.addEffect(new EffectAsset());
        this._pipelineUBO.activate(this._device, this);
        const shadowMapSampler = this._globalDSManager.pointSampler;
        this.descriptorSet.bindSampler(UNIFORM_SHADOWMAP_BINDING, shadowMapSampler);
        this.descriptorSet.bindTexture(UNIFORM_SHADOWMAP_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this.descriptorSet.bindSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, shadowMapSampler);
        this.descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this.descriptorSet.update();
        return true;
    }
    public destroy (): boolean {
        this._globalDSManager?.destroy();
        this._pipelineSceneData?.destroy();
        return true;
    }
    public get macros (): MacroRecord {
        return this._macros;
    }
    public get globalDSManager (): GlobalDSManager {
        return this._globalDSManager;
    }
    public get descriptorSetLayout (): DescriptorSetLayout {
        return this._globalDSManager.descriptorSetLayout;
    }
    public get descriptorSet (): DescriptorSet {
        return this._globalDSManager.globalDescriptorSet;
    }
    public get pipelineSceneData (): PipelineSceneData {
        return this._pipelineSceneData;
    }
    public get constantMacros (): string {
        return this._constantMacros;
    }
    public get profiler (): Model | null {
        return this._profiler;
    }
    public set profiler (profiler: Model | null) {
        this._profiler = profiler;
    }
    public get geometryRenderer (): GeometryRenderer | null {
        throw new Error('Method not implemented.');
    }
    public get shadingScale (): number {
        return this._pipelineSceneData.shadingScale;
    }
    public set shadingScale (scale: number) {
        this._pipelineSceneData.shadingScale = scale;
    }
    public setMacroString (name: string, value: string): void {
        this._macros[name] = value;
    }
    public setMacroInt (name: string, value: number): void {
        this._macros[name] = value;
    }
    public setMacroBool (name: string, value: boolean): void {
        this._macros[name] = value;
    }
    public get device () {
        return this._device;
    }
    public onGlobalPipelineStateChanged (): void {
        // do nothing
    }
    addRenderTexture (name: string, format: Format, width: number, height: number, renderWindow: RenderWindow) {
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.flags = ResourceFlags.COLOR_ATTACHMENT;

        if (renderWindow.swapchain === null) {
            assert(renderWindow.framebuffer.colorTextures.length === 1
                && renderWindow.framebuffer.colorTextures[0] !== null);
            return this._resourceGraph.addVertex<ResourceGraphValue.Framebuffer>(
                ResourceGraphValue.Framebuffer,
                renderWindow.framebuffer,
                name, desc,
                new ResourceTraits(ResourceResidency.EXTERNAL),
                new ResourceStates(),
            );
        } else {
            return this._resourceGraph.addVertex<ResourceGraphValue.Swapchain>(
                ResourceGraphValue.Swapchain,
                new RenderSwapchain(renderWindow.swapchain),
                name, desc,
                new ResourceTraits(ResourceResidency.BACKBUFFER),
                new ResourceStates(),
            );
        }
    }
    addRenderTarget (name: string, format: Format, width: number, height: number, residency: ResourceResidency) {
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.flags = ResourceFlags.COLOR_ATTACHMENT;

        assert(isManaged(residency));
        return this._resourceGraph.addVertex<ResourceGraphValue.Managed>(
            ResourceGraphValue.Managed,
            new ManagedResource(),
            name, desc,
            new ResourceTraits(residency),
            new ResourceStates(),
        );
    }
    addDepthStencil (name: string, format: Format, width: number, height: number, residency: ResourceResidency) {
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.flags = ResourceFlags.DEPTH_STENCIL_ATTACHMENT;
        return this._resourceGraph.addVertex<ResourceGraphValue.Managed>(
            ResourceGraphValue.Managed,
            new ManagedResource(),
            name, desc,
            new ResourceTraits(residency),
            new ResourceStates(),
        );
    }
    beginFrame () {
        this._renderGraph = new RenderGraph();
    }
    endFrame () {
        this._renderGraph = null;
    }

    compile () {
        if (!this._renderGraph) {
            throw new Error('RenderGraph cannot be built without being created');
        }
        if (!this._compiler) {
            this._compiler = new Compiler(this, this._resourceGraph, this._layoutGraph);
        }
        this._compiler.compile(this._renderGraph);
    }

    execute () {
        if (!this._renderGraph) {
            throw new Error('Cannot run without creating rendergraph');
        }
        if (!this._executor) {
            this._executor = new Executor(this, this._pipelineUBO, this._device, this._resourceGraph);
        }
        this._executor.execute(this._renderGraph);
    }
    protected _buildShadowPass (automata: WebPipeline,
        light: Readonly<Light>,
        shadows: Readonly<Shadows>,
        passName: Readonly<string>,
        width: Readonly<number>,
        height: Readonly<number>,
        bCastShadow: Readonly<boolean>) {
        if (bCastShadow) {
            if (!automata.resourceGraph.contains(this._dsShadowMap)) {
                const format = supportsR32FloatTexture(this._device) ? Format.R32F : Format.RGBA8;
                automata.addRenderTarget(this._dsShadowMap, format, width, height, ResourceResidency.PERSISTENT);
            }
            const pass = automata.addRasterPass(width, height, '_', passName);
            pass.addRasterView(this._dsShadowMap, new RasterView('_',
                AccessType.WRITE, AttachmentType.RENDER_TARGET,
                LoadOp.CLEAR, StoreOp.STORE,
                ClearFlagBit.COLOR,
                new Color(0, 0, 0, 0)));
            const queue = pass.addQueue(QueueHint.RENDER_OPAQUE);
            queue.addScene(`${passName}_shadowScene`,
                SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT | SceneFlags.SHADOW_CASTER);
            // setCameraValues(queue, camera, light, shadows);
        }
    }
    protected _buildShadowPasses (automata: WebPipeline, validLights: Light[],
        mainLight: Readonly<DirectionalLight> | null,
        pplScene: Readonly<PipelineSceneData>,
        name: Readonly<string>): void {
        const shadows = pplScene.shadows;
        if (!shadows.enabled || shadows.type !== ShadowType.ShadowMap) {
            return;
        }
        const castShadowObjects = pplScene.csmLayers.castShadowObjects;
        const validPunctualLights = pplScene.validPunctualLights;

        // force clean up
        validLights.length = 0;

        // pick spot lights
        let numSpotLights = 0;
        for (let i = 0; numSpotLights < shadows.maxReceived && i < validPunctualLights.length; ++i) {
            const light = validPunctualLights[i];
            if (light.type === LightType.SPOT) {
                validLights.push(light);
                ++numSpotLights;
            }
        }

        // build shadow map
        const bCastShadow = castShadowObjects.length !== 0;
        const mapWidth = bCastShadow ? shadows.size.x : 1;
        const mapHeight = bCastShadow ? shadows.size.y : 1;

        // main light
        if (mainLight) {
            const passName = `MainLightShadow${name}`;
            this._buildShadowPass(automata, mainLight, shadows,
                passName, mapWidth, mapHeight, bCastShadow);
        }
        // spot lights
        for (let i = 0; i !== validLights.length; ++i) {
            const passName = `SpotLight${i.toString()}Shadow${name}`;
            this._buildShadowPass(automata, validLights[i], shadows,
                passName, mapWidth, mapHeight, bCastShadow);
        }
    }
    private readonly _validLights: Light[] = [];
    private readonly _dsShadowMap = 'dsShadowMap';
    render (cameras: Camera[]) {
        if (cameras.length === 0) {
            return;
        }
        cameras.forEach((camera) => {
            if (!this._cameras.includes(camera)) {
                this._cameras.push(camera);
            }
        });
        // build graph
        this.beginFrame();
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene) {
                const idx = this._cameras.indexOf(camera);
                this._buildShadowPasses(this, this._validLights,
                    camera.scene.mainLight,
                    this._pipelineSceneData,
                    `Camera${idx}`);

                const window = camera.window;
                const width = Math.floor(window.width);
                const height = Math.floor(window.height);
                const forwardPassRTName = `dsForwardPassColorCamera${idx}`;
                const forwardPassDSName = `dsForwardPassDSCamera${idx}`;
                if (!this.resourceGraph.contains(forwardPassRTName)) {
                    this.addRenderTexture(forwardPassRTName, Format.RGBA8, width, height, camera.window);
                    this.addDepthStencil(forwardPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
                }
                const forwardPass = this.addRasterPass(width, height, '_', `CameraForwardPass${idx}`);
                if (this.resourceGraph.contains(this._dsShadowMap)) {
                    forwardPass.addRasterView(this._dsShadowMap, new RasterView('_',
                        AccessType.READ, AttachmentType.RENDER_TARGET,
                        LoadOp.CLEAR, StoreOp.DISCARD,
                        ClearFlagBit.NONE,
                        new Color(0, 0, 0, 1)));
                }
                const passView = new RasterView('_',
                    AccessType.WRITE, AttachmentType.RENDER_TARGET,
                    LoadOp.CLEAR, StoreOp.STORE,
                    camera.clearFlag,
                    new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w));
                const passDSView = new RasterView('_',
                    AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
                    LoadOp.CLEAR, StoreOp.STORE,
                    camera.clearFlag,
                    new Color(1, 0, 0, 0));
                forwardPass.addRasterView(forwardPassRTName, passView);
                forwardPass.addRasterView(forwardPassDSName, passDSView);
                forwardPass
                    .addQueue(QueueHint.RENDER_OPAQUE)
                    .addSceneOfCamera(camera, null, SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT);
                forwardPass
                    .addQueue(QueueHint.RENDER_TRANSPARENT)
                    .addSceneOfCamera(camera, null, SceneFlags.TRANSPARENT_OBJECT);
            }
        }
        this.compile();
        this.execute();
        this.endFrame();
    }

    addRasterPass (width: number, height: number, layoutName: string, name = 'Raster'): RasterPassBuilder {
        const pass = new RasterPass();
        const data = new RenderData();
        const vertID = this._renderGraph!.addVertex<RenderGraphValue.Raster>(
            RenderGraphValue.Raster, pass, name, layoutName, data, false,
        );
        const result = new WebRasterPassBuilder(data, this._renderGraph!, vertID, pass, this._pipelineSceneData);
        this._updateRasterPassConstants(result, width, height);
        return result;
    }
    addComputePass (layoutName: string, name = 'Compute'): ComputePassBuilder {
        const pass = new ComputePass();
        const data = new RenderData();
        const vertID = this._renderGraph!.addVertex<RenderGraphValue.Compute>(
            RenderGraphValue.Compute, pass, name, layoutName, new RenderData(), false,
        );
        return new WebComputePassBuilder(data, this._renderGraph!, vertID, pass, this._pipelineSceneData);
    }
    addMovePass (name = 'Move'): MovePassBuilder {
        const pass = new MovePass();
        const vertID = this._renderGraph!.addVertex<RenderGraphValue.Move>(RenderGraphValue.Move, pass, name, '', new RenderData(), false);
        return new WebMovePassBuilder(this._renderGraph!, vertID, pass);
    }
    addCopyPass (name = 'Copy'): CopyPassBuilder {
        const pass = new CopyPass();
        const vertID = this._renderGraph!.addVertex<RenderGraphValue.Copy>(RenderGraphValue.Copy, pass, name, '', new RenderData(), false);
        return new WebCopyPassBuilder(this._renderGraph!, vertID, pass);
    }
    presentAll (): void {
        const pass = new PresentPass();
        // TODO: add swapchains to present pass
        this._renderGraph!.addVertex<RenderGraphValue.Present>(RenderGraphValue.Present, pass, '', '', new RenderData(), false);
    }
    createSceneTransversal (camera: Camera, scene: RenderScene): SceneTransversal {
        return new WebSceneTransversal(camera, this.pipelineSceneData);
    }
    get layoutGraphBuilder (): LayoutGraphBuilder {
        return new WebLayoutGraphBuilder(this._device, this._layoutGraph);
    }
    public getDescriptorSetLayout (shaderName: string, freq: UpdateFrequency): DescriptorSetLayout {
        const lg = this._layoutGraph;
        const phaseID = lg.shaderLayoutIndex.get(shaderName)!;
        const pplLayout = lg.getLayout(phaseID);
        const setLayout = pplLayout.descriptorSets.get(freq)!;
        return setLayout.descriptorSetLayout!;
    }
    get renderGraph () {
        return this._renderGraph;
    }
    get resourceGraph () {
        return this._resourceGraph;
    }
    get layoutGraph () {
        return this._layoutGraph;
    }
    protected _updateRasterPassConstants (pass: Setter, width: number, height: number) {
        const shadingWidth = width;
        const shadingHeight = height;
        const root = legacyCC.director.root;
        pass.setVec4('cc_time',
            new Vec4(root.cumulativeTime, root.frameTime, legacyCC.director.getTotalFrames(), 0.0));
        pass.setVec4('cc_screenSize',
            new Vec4(shadingWidth, shadingHeight, 1.0 / shadingWidth, 1.0 / shadingHeight));
        pass.setVec4('cc_nativeSize',
            new Vec4(shadingWidth, shadingHeight, 1.0 / shadingWidth, 1.0 / shadingHeight));
    }

    private _device!: Device;
    private _globalDSManager!: GlobalDSManager;
    private readonly _macros: MacroRecord = {};
    private readonly _pipelineSceneData: PipelineSceneData = new PipelineSceneData();
    private _constantMacros = '';
    private _profiler: Model | null = null;
    private _pipelineUBO: PipelineUBO = new PipelineUBO();
    private _cameras: Camera[] = [];

    private readonly _layoutGraph: LayoutGraphData = new LayoutGraphData();
    private readonly _resourceGraph: ResourceGraph = new ResourceGraph();
    private _renderGraph: RenderGraph | null = null;
    private _compiler: Compiler | null = null;
    private _executor: Executor | null = null;
}
