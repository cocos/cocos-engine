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
import { Camera } from '../../renderer/scene/camera';
import { Buffer, Format, Sampler, Texture } from '../../gfx/index';
import { Color, Mat4, Quat, Vec2, Vec4 } from '../../math';
import { QueueHint, ResourceDimension, ResourceResidency } from './types';
import { Blit, ComputePass, ComputeView, CopyPair, CopyPass, Dispatch, MovePair, MovePass, RasterPass, RasterView, RenderData, RenderGraph, RenderGraphValue, RenderQueue, ResourceDesc, ResourceFlags, ResourceGraph, ResourceTraits, SceneData } from './render-graph';
import { ComputePassBuilder, ComputeQueueBuilder, CopyPassBuilder, MovePassBuilder, Pipeline, RasterPassBuilder, RasterQueueBuilder, Setter } from './pipeline';
import { PipelineSceneData } from '../pipeline-scene-data';
import { RenderScene } from '../../renderer/scene';
import { legacyCC } from '../../global-exports';
import { LayoutGraphData } from './layout-graph';

export class WebSetter extends Setter {
    constructor (data: RenderData) {
        super();
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
    addSceneOfCamera (camera: Camera, name = 'Camera'): void {
        const sceneData = new SceneData(name);
        sceneData.camera = camera;
        this._renderGraph.addVertex<RenderGraphValue.Scene>(
            RenderGraphValue.Scene, sceneData, name, '', new RenderData(), this._vertID,
        );
        setCameraValues(this, camera, this._pipeline,
            camera.scene ? camera.scene : legacyCC.director.getScene().renderScene);
    }
    addScene (sceneName: string): void {
        const sceneData = new SceneData(sceneName);
        this._renderGraph.addVertex<RenderGraphValue.Scene>(
            RenderGraphValue.Scene, sceneData, sceneName, '', new RenderData(), this._vertID,
        );
    }
    addFullscreenQuad (shader: string, layoutName = '', name = 'Quad'): void {
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit, new Blit(shader), name, '', new RenderData(), this._vertID,
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
            RenderGraphValue.Queue, queue, name, layoutName, data, this._vertID,
        );
        return new WebRasterQueueBuilder(data, this._renderGraph, queueID, queue, this._pipeline);
    }
    addFullscreenQuad (shader: string, layoutName = '', name = 'Quad') {
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit,
            new Blit(shader),
            name, layoutName, new RenderData(), this._vertID,
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
            name, layoutName, new RenderData(), this._vertID,
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
            RenderGraphValue.Queue, queue, name, layoutName, data, this._vertID,
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
            name, layoutName, new RenderData(), this._vertID,
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

export class WebPipeline extends Pipeline {
    addRenderTexture (name: string, format: Format, width: number, height: number) {
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.flags = ResourceFlags.ALLOW_RENDER_TARGET | ResourceFlags.ALLOW_UNORDERED_ACCESS;

        return this._resourceGraph.addVertex(name, desc, new ResourceTraits(ResourceResidency.Persistent));
    }
    addRenderTarget (name: string, format: Format, width: number, height: number) {
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.flags = ResourceFlags.ALLOW_RENDER_TARGET | ResourceFlags.ALLOW_UNORDERED_ACCESS;
        return this._resourceGraph.addVertex(name, desc, new ResourceTraits());
    }
    addDepthStencil (name: string, format: Format, width: number, height: number) {
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.flags = ResourceFlags.ALLOW_DEPTH_STENCIL;
        return this._resourceGraph.addVertex(name, desc, new ResourceTraits());
    }
    beginFrame (pplScene: PipelineSceneData) {
        this._renderGraph = new RenderGraph();
        this._pipelineSceneData = pplScene;
    }
    endFrame () {
        this._renderGraph = null;
        this._pipelineSceneData = null;
    }
    addRasterPass (width: number, height: number, layoutName: string, name = 'Raster'): RasterPassBuilder {
        const pass = new RasterPass();
        const data = new RenderData();
        const vertID = this._renderGraph!.addVertex<RenderGraphValue.Raster>(
            RenderGraphValue.Raster, pass, name, layoutName, data,
        );
        const result = new WebRasterPassBuilder(data, this._renderGraph!, vertID, pass, this._pipelineSceneData!);
        this._updateRasterPassConstants(result, width, height);
        return result;
    }
    addComputePass (layoutName: string, name = 'Compute'): ComputePassBuilder {
        const pass = new ComputePass();
        const data = new RenderData();
        const vertID = this._renderGraph!.addVertex<RenderGraphValue.Compute>(
            RenderGraphValue.Compute, pass, name, layoutName, new RenderData(),
        );
        return new WebComputePassBuilder(data, this._renderGraph!, vertID, pass, this._pipelineSceneData!);
    }
    addMovePass (name = 'Move'): MovePassBuilder {
        const pass = new MovePass();
        const vertID = this._renderGraph!.addVertex<RenderGraphValue.Move>(RenderGraphValue.Move, pass, name, '', new RenderData());
        return new WebMovePassBuilder(this._renderGraph!, vertID, pass);
    }
    addCopyPass (name = 'Copy'): CopyPassBuilder {
        const pass = new CopyPass();
        const vertID = this._renderGraph!.addVertex<RenderGraphValue.Copy>(RenderGraphValue.Copy, pass, name, '', new RenderData());
        return new WebCopyPassBuilder(this._renderGraph!, vertID, pass);
    }
    get renderGraph () {
        return this._renderGraph;
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
    private readonly _layoutGraph: LayoutGraphData = new LayoutGraphData();
    private readonly _resourceGraph: ResourceGraph = new ResourceGraph();
    private _renderGraph: RenderGraph | null = null;
    private _pipelineSceneData: PipelineSceneData | null = null;
}
