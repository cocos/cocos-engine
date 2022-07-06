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
import { Color, Buffer, DescriptorSetLayout, Device, Feature, Format, FormatFeatureBit, Sampler, Swapchain, Texture, StoreOp, LoadOp, ClearFlagBit, DescriptorSet, deviceManager } from '../../gfx/index';
import { Mat4, Quat, Vec2, Vec4 } from '../../math';
import { QueueHint, ResourceDimension, ResourceFlags, ResourceResidency, SceneFlags, UpdateFrequency } from './types';
import { AccessType, AttachmentType, Blit, ComputePass, ComputeView, CopyPair, CopyPass, Dispatch, ManagedResource, MovePair, MovePass, PresentPass, RasterPass, RasterView, RenderData, RenderGraph, RenderGraphValue, RenderQueue, RenderSwapchain, ResourceDesc, ResourceGraph, ResourceGraphValue, ResourceStates, ResourceTraits, SceneData } from './render-graph';
import { ComputePassBuilder, ComputeQueueBuilder, CopyPassBuilder, LayoutGraphBuilder, MovePassBuilder, Pipeline, RasterPassBuilder, RasterQueueBuilder, SceneTask, SceneTransversal, SceneVisitor, Setter } from './pipeline';
import { PipelineSceneData } from '../pipeline-scene-data';
import { Model, Camera, SKYBOX_FLAG, Light, LightType, ShadowType, DirectionalLight, Shadows } from '../../renderer/scene';
import { legacyCC } from '../../global-exports';
import { LayoutGraphData } from './layout-graph';
import { Executor } from './executor';
import { RenderWindow } from '../../renderer/core/render-window';
import { assert } from '../../platform/debug';
import { macro } from '../../platform/macro';
import { WebSceneTransversal } from './web-scene';
import { MacroRecord, RenderScene } from '../../renderer';
import { GlobalDSManager } from '../global-descriptor-set-manager';
import { supportsR16HalfFloatTexture, supportsR32FloatTexture, UNIFORM_SHADOWMAP_BINDING, UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING } from '../define';
import { OS } from '../../../../pal/system-info/enum-type';
import { Compiler } from './compiler';
import { PipelineUBO } from './ubos';
import { builtinResMgr } from '../../builtin/builtin-res-mgr';
import { Texture2D } from '../../assets/texture-2d';
import { WebLayoutGraphBuilder } from './web-layout-graph';
import { GeometryRenderer } from '../geometry-renderer';
import { Material } from '../../assets';

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

function getFirstChildLayoutName (lg: LayoutGraphData, parentID: number): string {
    if (lg.numVertices() && lg.numChildren(parentID)) {
        const childNodes = lg.children(parentID);
        if (childNodes.next().value && childNodes.next().value.target !== lg.nullVertex()) {
            const ququeLayoutID = childNodes.next().value.target;
            return lg.getName(ququeLayoutID);
        }
    }
    return '';
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
    addFullscreenQuad (material: Material, layoutName = '', name = 'Quad'): void {
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit, new Blit(material), name, '', new RenderData(), false, this._vertID,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _queue: RenderQueue;
    private readonly _pipeline: PipelineSceneData;
}

export class WebRasterPassBuilder extends WebSetter implements RasterPassBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, pass: RasterPass, pipeline: PipelineSceneData) {
        super(data);
        this._renderGraph = renderGraph;
        this._layoutGraph = layoutGraph;
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
        if (!layoutName) {
            layoutName = getFirstChildLayoutName(this._layoutGraph, this._vertID);
        }
        const queue = new RenderQueue(hint);
        const data = new RenderData();
        const queueID = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue, queue, name, layoutName, data, false, this._vertID,
        );
        return new WebRasterQueueBuilder(data, this._renderGraph, queueID, queue, this._pipeline);
    }

    addFullscreenQuad (material: Material, layoutName = '', name = 'FullscreenQuad') {
        if (!layoutName) {
            layoutName = getFirstChildLayoutName(this._layoutGraph, this._vertID);
        }
        const queue = new RenderQueue(QueueHint.RENDER_TRANSPARENT);
        const queueId = this._renderGraph.addVertex<RenderGraphValue.Queue>(RenderGraphValue.Queue,
            queue, name, layoutName, new RenderData(),
            false, this._vertID);
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit,
            new Blit(material),
            'FullscreenQuad', '', new RenderData(), false, queueId,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _pass: RasterPass;
    private readonly _pipeline: PipelineSceneData;
    private readonly _layoutGraph: LayoutGraphData;
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
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, pass: ComputePass, pipeline: PipelineSceneData) {
        super(data);
        this._renderGraph = renderGraph;
        this._layoutGraph = layoutGraph;
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
        if (!layoutName) {
            layoutName = getFirstChildLayoutName(this._layoutGraph, this._vertID);
        }
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
        if (!layoutName) {
            layoutName = getFirstChildLayoutName(this._layoutGraph, this._vertID);
        }
        this._renderGraph.addVertex<RenderGraphValue.Dispatch>(
            RenderGraphValue.Dispatch,
            new Dispatch(shader, threadGroupCountX, threadGroupCountY, threadGroupCountZ),
            name, layoutName, new RenderData(), false, this._vertID,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _layoutGraph: LayoutGraphData;
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
    public addComputePass(layoutName: string, name: string): ComputePassBuilder;
    public addComputePass(layoutName: string): ComputePassBuilder;
    public addComputePass (layoutName: any, name?: any): ComputePassBuilder {
        throw new Error('Method not implemented.');
    }
    public addMovePass (name: string): MovePassBuilder {
        throw new Error('Method not implemented.');
    }
    public addCopyPass (name: string): CopyPassBuilder {
        throw new Error('Method not implemented.');
    }
    public presentAll (): void {
        throw new Error('Method not implemented.');
    }
    public createSceneTransversal (camera: Camera, scene: RenderScene): SceneTransversal {
        throw new Error('Method not implemented.');
    }
    public get layoutGraphBuilder (): LayoutGraphBuilder {
        return new WebLayoutGraphBuilder(this._device, this._layoutGraph);
    }
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
        this._device = deviceManager.gfxDevice;
        this._globalDSManager = new GlobalDSManager(this._device);
        this.setMacroBool('CC_USE_HDR', this._pipelineSceneData.isHDR);
        this._generateConstantMacros(false);
        this._pipelineSceneData.activate(this._device);
        this._pipelineUBO.activate(this._device, this);
        const root = legacyCC.director.root;
        if (root.useDeferredPipeline) {
            // enable the deferred pipeline
            this.setMacroInt('CC_PIPELINE_TYPE', 1);
        }
        const shadowMapSampler = this._globalDSManager.pointSampler;
        this.descriptorSet.bindSampler(UNIFORM_SHADOWMAP_BINDING, shadowMapSampler);
        this.descriptorSet.bindTexture(UNIFORM_SHADOWMAP_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this.descriptorSet.bindSampler(UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING, shadowMapSampler);
        this.descriptorSet.bindTexture(UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this.descriptorSet.update();

        this.layoutGraphBuilder.compile();

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
    public getMacroString (name: string): string {
        const str = this._macros[name];
        if (str === undefined) {
            return '';
        }
        return str as string;
    }
    public getMacroInt (name: string): number {
        const value = this._macros[name];
        if (value === undefined) {
            return 0;
        }
        return value as number;
    }
    public getMacroBool (name: string): boolean {
        const value = this._macros[name];
        if (value === undefined) {
            return false;
        }
        return value as boolean;
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
            this._executor = new Executor(this, this._pipelineUBO, this._device, this._resourceGraph, this.layoutGraph);
        }
        this._executor.execute(this._renderGraph);
    }
    protected _buildShadowPass (automata: WebPipeline,
        camera: Camera,
        light: Light,
        shadows: Readonly<Shadows>,
        passName: Readonly<string>,
        width: Readonly<number>,
        height: Readonly<number>) {
        const dsShadowMap = passName;
        if (!automata.resourceGraph.contains(dsShadowMap)) {
            const format = supportsR32FloatTexture(this._device) ? Format.R32F : Format.RGBA8;
            automata.addRenderTarget(dsShadowMap, format, width, height, ResourceResidency.PERSISTENT);
        }
        const pass = automata.addRasterPass(width, height, '_', passName);
        pass.addRasterView(dsShadowMap, new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            LoadOp.CLEAR, StoreOp.STORE,
            ClearFlagBit.COLOR,
            new Color(0, 0, 0, 0)));
        const queue = pass.addQueue(QueueHint.RENDER_OPAQUE);
        queue.addSceneOfCamera(camera, light,
            SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT | SceneFlags.SHADOW_CASTER);
    }
    protected _buildShadowPasses (automata: WebPipeline,
        camera: Camera,
        validLights: Light[],
        pplScene: Readonly<PipelineSceneData>,
        name: Readonly<string>): void {
        const shadows = pplScene.shadows;
        if (!shadows.enabled || shadows.type !== ShadowType.ShadowMap) {
            return;
        }
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
        const mapWidth = shadows.size.x;
        const mapHeight = shadows.size.y;
        const mainLight = camera.scene!.mainLight;
        // main light
        if (mainLight) {
            this._mainLightShadowName =  `MainLightShadow${name}`;
            this._buildShadowPass(automata, camera, mainLight, shadows,
                this._mainLightShadowName, mapWidth, mapHeight);
        }
        // spot lights
        for (let i = 0; i !== validLights.length; ++i) {
            const passName = `SpotLightShadow${i.toString()}${name}`;
            this._spotLightShadowName[i] = passName;
            this._buildShadowPass(automata, camera, validLights[i], shadows,
                passName, mapWidth, mapHeight);
        }
    }
    private readonly _validLights: Light[] = [];
    private _mainLightShadowName = ``;
    private _spotLightShadowName: string[] = [];
    clear () {
        this._mainLightShadowName = '';
        this._spotLightShadowName = [];
    }

    private _forward (camera: Camera, idx: number): boolean {
        const window = camera.window;
        const width = Math.floor(window.width);
        const height = Math.floor(window.height);
        const root = legacyCC.director.root;
        const isDeferred: boolean = root.useDeferredPipeline;
        if (!isDeferred) {
            const forwardPassRTName = `dsForwardPassColorCamera${idx}`;
            const forwardPassDSName = `dsForwardPassDSCamera${idx}`;
            if (!this.resourceGraph.contains(forwardPassRTName)) {
                this.addRenderTexture(forwardPassRTName, Format.RGBA8, width, height, camera.window);
                this.addDepthStencil(forwardPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
            }
            const forwardPass = this.addRasterPass(width, height, 'DEFAULT', `CameraForwardPass${idx}`);
            if (this._mainLightShadowName && this.resourceGraph.contains(this._mainLightShadowName)) {
                const computeView = new ComputeView();
                forwardPass.addComputeView(this._mainLightShadowName, computeView);
            }
            for (const spotShadowName of this._spotLightShadowName) {
                if (this.resourceGraph.contains(spotShadowName)) {
                    const computeView = new ComputeView();
                    forwardPass.addComputeView(spotShadowName, computeView);
                }
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
        return !isDeferred;
    }

    private _deferred (camera: Camera, idx: number): boolean {
        const window = camera.window;
        const width = Math.floor(window.width);
        const height = Math.floor(window.height);
        const root = legacyCC.director.root;
        const isDeferred: boolean = root.useDeferredPipeline;
        if (isDeferred) {
            const deferredGbufferPassRTName = `dsDeferredPassColorCamera${idx}`;
            const deferredGbufferPassNormal = `deferredGbufferPassNormal${idx}`;
            const deferredGbufferPassEmissive = `deferredGbufferPassEmissive${idx}`;
            const deferredGbufferPassDSName = `dsDeferredPassDSCamera${idx}`;
            const isSurpportR16 = supportsR16HalfFloatTexture(this.device);
            if (!this.resourceGraph.contains(deferredGbufferPassRTName)) {
                const colFormat = isSurpportR16 ? Format.R16F : Format.RGBA8;
                this.addRenderTarget(deferredGbufferPassRTName, colFormat, width, height, ResourceResidency.PERSISTENT);
                this.addRenderTarget(deferredGbufferPassNormal, colFormat, width, height, ResourceResidency.PERSISTENT);
                this.addRenderTarget(deferredGbufferPassEmissive, colFormat, width, height, ResourceResidency.PERSISTENT);
                this.addDepthStencil(deferredGbufferPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.PERSISTENT);
            }
            // gbuffer pass
            const gbufferPass = this.addRasterPass(width, height, 'Geometry', `CameraGbufferPass${idx}`);
            if (this._mainLightShadowName && this.resourceGraph.contains(this._mainLightShadowName)) {
                const computeView = new ComputeView();
                gbufferPass.addComputeView(this._mainLightShadowName, computeView);
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
            gbufferPass.addRasterView(deferredGbufferPassRTName, passView);
            gbufferPass.addRasterView(deferredGbufferPassNormal, passView);
            gbufferPass.addRasterView(deferredGbufferPassEmissive, passView);
            gbufferPass.addRasterView(deferredGbufferPassDSName, passDSView);
            gbufferPass
                .addQueue(QueueHint.RENDER_OPAQUE)
                .addSceneOfCamera(camera, null, SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT);
            const deferredLightingPassRTName = `deferredLightingPassRTName${idx}`;
            const deferredLightingPassDS = `deferredLightingPassDS${idx}`;
            if (!this.resourceGraph.contains(deferredLightingPassRTName)) {
                this.addRenderTarget(deferredLightingPassRTName, Format.RGBA8, width, height, ResourceResidency.PERSISTENT);
                this.addDepthStencil(deferredLightingPassDS, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
            }
            // lighting pass
            const lightingPass = this.addRasterPass(width, height, 'Lighting', `CameraLightingPass${idx}`);
            if (this._resourceGraph.contains(deferredGbufferPassRTName)) {
                const computeView = new ComputeView();
                computeView.name = 'gbuffer_albedoMap';
                lightingPass.addComputeView(deferredGbufferPassRTName, computeView);

                const computeNormalView = new ComputeView();
                computeNormalView.name = 'gbuffer_normalMap';
                lightingPass.addComputeView(deferredGbufferPassNormal, computeNormalView);

                const computeEmissiveView = new ComputeView();
                computeEmissiveView.name = 'gbuffer_emissiveMap';
                lightingPass.addComputeView(deferredGbufferPassEmissive, computeEmissiveView);

                const computeDepthView = new ComputeView();
                computeDepthView.name = 'depth_stencil';
                lightingPass.addComputeView(deferredGbufferPassDSName, computeDepthView);
            }
            const lightingPassView = new RasterView('_',
                AccessType.WRITE, AttachmentType.RENDER_TARGET,
                LoadOp.CLEAR, StoreOp.STORE,
                camera.clearFlag,
                new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w));
            const lightingPassDSView = new RasterView('_',
                AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
                LoadOp.CLEAR, StoreOp.STORE,
                camera.clearFlag,
                new Color(1, 0, 0, 0));
            lightingPass.addRasterView(deferredLightingPassRTName, lightingPassView);
            lightingPass.addRasterView(deferredLightingPassDS, lightingPassDSView);
            lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addFullscreenQuad(new Material(), '');
            lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera, null, SceneFlags.TRANSPARENT_OBJECT);
            // Postprocess
            const postprocessPassRTName = `postprocessPassRTName${idx}`;
            const postprocessPassDS = `postprocessPassDS${idx}`;
            if (!this.resourceGraph.contains(postprocessPassRTName)) {
                this.addRenderTarget(postprocessPassRTName, Format.RGBA8, width, height, ResourceResidency.PERSISTENT);
                this.addDepthStencil(postprocessPassDS, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
            }
            const postprocessPass = this.addRasterPass(width, height, 'Postprocess', `CameraPostprocessPass${idx}`);
            if (this._resourceGraph.contains(deferredLightingPassRTName)) {
                const computeView = new ComputeView();
                computeView.name = 'outputResultMap';
                postprocessPass.addComputeView(deferredLightingPassRTName, computeView);
            }
            const postprocessPassView = new RasterView('_',
                AccessType.WRITE, AttachmentType.RENDER_TARGET,
                LoadOp.CLEAR, StoreOp.STORE,
                camera.clearFlag,
                new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w));
            const postprocessPassDSView = new RasterView('_',
                AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
                LoadOp.CLEAR, StoreOp.STORE,
                camera.clearFlag,
                new Color(1, 0, 0, 0));
            postprocessPass.addRasterView(postprocessPassRTName, postprocessPassView);
            postprocessPass.addRasterView(postprocessPassDS, postprocessPassDSView);
            postprocessPass.addQueue(QueueHint.NONE).addFullscreenQuad(new Material(), '');
        }
        return isDeferred;
    }

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
        this.clear();
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene) {
                const idx = this._cameras.indexOf(camera);
                this._buildShadowPasses(this, camera, this._validLights,
                    this._pipelineSceneData,
                    `Camera${idx}`);

                if (this._deferred(camera, i)) {
                    continue;
                }
                this._forward(camera, i);
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
        const result = new WebRasterPassBuilder(data, this._renderGraph!, this._layoutGraph, vertID, pass, this._pipelineSceneData);
        this._updateRasterPassConstants(result, width, height);
        return result;
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

    public static MAX_BLOOM_FILTER_PASS_NUM = 6;
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
