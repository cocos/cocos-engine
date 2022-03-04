import { AccessFlagBit, Color, ColorAttachment, CommandBuffer, DepthStencilAttachment, Device, Format, Framebuffer,
    FramebufferInfo,
    GeneralBarrierInfo,
    LoadOp,
    RenderPass, RenderPassInfo, SampleCount, StoreOp, Texture, TextureInfo, TextureType,
    TextureUsage, TextureUsageBit } from '../../gfx';
import { legacyCC } from '../../global-exports';
import { LayoutGraph, LayoutGraphData } from './layout-graph';
import { AccessType, AttachmentType, ComputeView, RasterView, RenderGraph, RenderGraphValue,
    ResourceDesc, ResourceFlags, ResourceGraph, ResourceTraits, SceneData } from './render-graph';
import { QueueHint, ResourceDimension, ResourceResidency } from './types';

export class RenderResource {
    protected _type: ResourceDimension = ResourceDimension.TEXTURE2D;
    protected _physicalIndex = -1;
    protected _name = '';
    protected _writeInPasses: RenderGraphPass[] = [];
    protected _readInPasses: RenderGraphPass[] = [];
    constructor (name: string, type: ResourceDimension) {
        this._name = name;
        this._type = type;
    }
    get type (): ResourceDimension { return this._type; }
    set type (value: ResourceDimension) { this._type = value; }
    get name (): string { return this._name; }
    set name (value: string) { this._name = value; }
    set writeInPass (pass: RenderGraphPass) {
        this._writeInPasses.push(pass);
    }
    get writeInPasses (): RenderGraphPass[] { return this._writeInPasses; }
    set readInPass (pass: RenderGraphPass) {
        this._readInPasses.push(pass);
    }
    get readInPasses (): RenderGraphPass[] { return this._readInPasses; }
}

export class RenderTextureResource extends RenderResource {
    protected _info: ResourceDesc | null = null;
    protected _trait: ResourceTraits | null = null;
    protected _transient = false;
    protected _deviceTexture: DeviceRenderTextureResource | null = null;
    constructor (name: string, desc: ResourceDesc, traits: ResourceTraits) {
        super(name, desc.dimension);
        this.resourceTraits = traits;
        this.attachmentInfo = desc;
    }
    set transientState (enable: boolean) {
        this._transient = enable;
    }
    get transientState () { return this._transient; }
    set attachmentInfo (info: ResourceDesc | null) {
        this._info = info;
    }
    get attachmentInfo () {
        return this._info;
    }
    set resourceTraits (traits: ResourceTraits | null) {
        this._trait = traits;
    }
    get resourceTraits () {
        return this._trait;
    }
    addImageUsage (flags: ResourceFlags) {
        if (this._info) {
            this._info.flags |= flags;
        }
    }
    get imageUsage () {
        return this._info && this._info.flags;
    }
    buildDeviceTexture () {
        if (!this._deviceTexture) {
            this._deviceTexture = new DeviceRenderTextureResource(this);
        }
    }
    get deviceTexture () {
        return this._deviceTexture;
    }
}

// There are no detailed implementations of BufferInfo yet, just inheritance
export class RenderBufferResource extends RenderResource {
    protected _deviceBuffer: DeviceRenderBufferResource | null = null;
    constructor (name: string) {
        super(name, ResourceDimension.BUFFER);
    }
    buildDeviceBuffer () {
        if (!this._deviceBuffer) {
            this._deviceBuffer = new DeviceRenderBufferResource(this);
        }
    }
    get deviceBuffer () {
        return this._deviceBuffer;
    }
}

export class RenderGraphPass {
    protected _name = '';
    protected _graphBuild: RenderDependencyGraph | null = null;
    protected _graphFlag: RenderGraphValue = RenderGraphValue.Raster;
    protected _queueHint: QueueHint = QueueHint.NONE;
    protected _rasterViews: Map<string, RasterView> = new Map<string, RasterView>();
    protected _computeViews: Map<string, ComputeView> = new Map<string, ComputeView>();
    protected _outputs: RenderResource[] = [];
    protected _inputs: RenderResource[] = [];
    protected _sceneData: SceneData | null = null;
    protected _present: RenderTextureResource | null = null;
    protected _inputPhases: string[] = [];
    // The current pass corresponds to the last pass of the current phase
    protected _currentPhase: RenderGraphPhase | null = null;
    protected _devicePass: DeviceRenderGraphPass | null = null;
    constructor (graph: RenderDependencyGraph, graphFlag: RenderGraphValue = RenderGraphValue.Raster) {
        this._graphBuild = graph;
        this._graphFlag = graphFlag;
    }
    set name (value: string) {
        this._name = value;
    }
    get name () { return this._name; }
    set graphFlag (value: RenderGraphValue) {
        this._graphFlag = value;
    }
    get graphFlag (): RenderGraphValue { return this._graphFlag; }
    get sceneData (): SceneData | null { return this._sceneData; }
    set sceneData (value: SceneData | null) { this._sceneData = value; }
    set queueHint (value: QueueHint) { this._queueHint = value; }
    get queueHint (): QueueHint { return this._queueHint; }
    get graph (): RenderDependencyGraph { return this._graphBuild!; }
    get inputs () { return this._inputs; }
    get outputs () { return this._outputs; }
    setRasterViews (key: string, val: RasterView) { this._rasterViews.set(key, val); }
    get rasterViews () { return this._rasterViews; }
    getRasterView (key: string) { return this._rasterViews.get(key); }
    setComputeViews (key: string, val: ComputeView) { this._computeViews.set(key, val); }
    get computeViews () { return this._computeViews; }
    getComputeView (key: string) { return this._computeViews.get(key); }
    addOutput (res: RenderResource) {
        res.writeInPass = this;
        this._outputs.push(res);
    }
    addInput (res: RenderResource) {
        res.readInPass = this;
        this._inputs.push(res);
    }
    get present () { return this._present; }
    set present (val: RenderTextureResource | null) {
        this._present = val;
    }
    get currentPhase () { return this._currentPhase; }
    set currentPhase (value: RenderGraphPhase | null) { this._currentPhase = value; }
    addInputPhase (inputPhase: string) {
        if (!this.inputPhases.includes(inputPhase)) {
            this._inputPhases.push(inputPhase);
        }
    }
    get inputPhases () { return this._inputPhases; }
    buildDevicePass () {
        if (!this._devicePass) {
            this._devicePass = new DeviceRenderGraphPass(this);
        }
    }
    get devicePass () { return this._devicePass; }
}

export class RenderGraphPhase {
    protected _textures: RenderTextureResource[] = [];
    protected _passes: RenderGraphPass[] = [];
    protected _name = '';
    constructor (textureResource: RenderTextureResource) {
        this._textures.push(textureResource);
        this._name = textureResource.name;
    }
    get name () { return this._name; }
    get passes () { return this._passes; }
    get textures () { return this._textures; }
    addTexture (texture: RenderTextureResource) {
        if (!this._textures.includes(texture)) {
            this._textures.push(texture);
        }
    }
    getTexture (name: string) {
        for (const tex of this._textures) {
            if (tex.name === name) {
                return tex;
            }
        }
        return null;
    }
    addPass (pass: RenderGraphPass) {
        if (!this._passes.includes(pass)) {
            this._passes.push(pass);
        }
    }
}

// Device Resource
export class DeviceRenderResource {
    protected _device: Device;
    protected _graphResource: RenderResource;
    constructor (graphResource: RenderResource) {
        const root = legacyCC.director.root;
        this._device = root.device;
        this._graphResource = graphResource;
    }
    get device () { return this._device; }
}
export class DeviceRenderTextureResource extends DeviceRenderResource {
    protected _texture: Texture;
    get texture () { return this._texture; }
    constructor (graphResource: RenderTextureResource) {
        super(graphResource);
        const info = graphResource.attachmentInfo!;
        let type = TextureType.TEX2D;
        switch (info.dimension) {
        case ResourceDimension.TEXTURE1D:
            type = TextureType.TEX1D;
            break;
        case ResourceDimension.TEXTURE2D:
            type = TextureType.TEX2D;
            break;
        case ResourceDimension.TEXTURE3D:
            type = TextureType.TEX3D;
            break;
        default:
        }

        this._texture = this.device.createTexture(new TextureInfo(
            type,
            TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
            info.format,
            info.width,
            info.height,
        ));
    }
}

export class DeviceRenderBufferResource extends DeviceRenderResource {
    constructor (buffer: RenderBufferResource) {
        super(buffer);
    }
}
export class DeviceRenderGraphPass {
    protected _graphPass: RenderGraphPass;
    protected _renderPass: RenderPass;
    protected _framebuffer: Framebuffer;
    protected _clearColor: Color = new Color(0, 0, 0, 0);
    constructor (graphPass: RenderGraphPass) {
        this._graphPass = graphPass;
        const root = legacyCC.director.root;
        const depthStencilAttachment = new DepthStencilAttachment();
        depthStencilAttachment.format = Format.DEPTH_STENCIL;
        const colors: ColorAttachment[] = [];
        const colorTexs: Texture[] = [];
        let depthTex: Texture | null = null;
        const device = this._graphPass.graph.device;
        for (const kV of this._graphPass.rasterViews) {
            const resName = kV[0];
            const rasterV = kV[1];
            const resTex = this._graphPass.graph.getResource(resName) as RenderTextureResource;
            switch (rasterV.attachmentType) {
            case AttachmentType.RENDER_TARGET:
                colorTexs.push(resTex.deviceTexture!.texture);
                this._clearColor = rasterV.clearColor;
                colors.push(new ColorAttachment(
                    resTex.attachmentInfo!.format,
                    resTex.attachmentInfo!.sampleCount,
                    rasterV.loadOp,
                    rasterV.storeOp,
                ));
                break;
            case AttachmentType.DEPTH_STENCIL:
                depthTex = resTex.deviceTexture!.texture;
                depthStencilAttachment.format = resTex.attachmentInfo!.format;
                depthStencilAttachment.depthLoadOp = rasterV.loadOp;
                depthStencilAttachment.depthStoreOp = rasterV.storeOp;
                depthStencilAttachment.stencilLoadOp = rasterV.loadOp;
                depthStencilAttachment.stencilStoreOp = rasterV.storeOp;
                break;
            default:
            }
        }
        if (colors.length === 0) {
            const colorAttachment = new ColorAttachment();
            colors.push(colorAttachment);
        }
        if (depthTex) {
            depthTex = device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.DEPTH_STENCIL_ATTACHMENT | TextureUsageBit.SAMPLED,
                Format.DEPTH_STENCIL,
                colorTexs[0].width,
                colorTexs[0].height,
            ));
        }
        this._renderPass = device.createRenderPass(new RenderPassInfo(colors, depthStencilAttachment));
        this._framebuffer = device.createFramebuffer(new FramebufferInfo(this._renderPass, colorTexs, depthTex));
    }
    get graphPass () { return this._graphPass; }
    get renderPass () { return this._renderPass; }
    get framebuffer () { return this._framebuffer; }
    get clearColor () { return this._clearColor; }
    // record common buffer
    record () {}
}
export class RenderDependencyGraph {
    protected _renderGraph: RenderGraph;
    protected _resourceGraph: ResourceGraph;
    protected _layoutGraph: LayoutGraphData;
    protected _passes: RenderGraphPass[] = [];
    protected _resources: RenderResource[] = [];
    protected _phases: Map<string, RenderGraphPhase> = new Map<string, RenderGraphPhase>();
    protected _presentPass: RenderGraphPass | null = null;
    protected _commandBuffers: CommandBuffer[] = [];
    protected _device: Device;
    constructor (renderGraph: RenderGraph, resourceGraph: ResourceGraph, layoutGraph: LayoutGraphData) {
        this._renderGraph = renderGraph;
        this._resourceGraph = resourceGraph;
        this._layoutGraph = layoutGraph;
        const root = legacyCC.director.root;
        this._device = root.device;
        this._commandBuffers.push(this._device.commandBuffer);
    }
    get commonBuffer () { return this._commandBuffers[0]; }
    get device () { return this._device; }
    protected _createRenderPass (passIdx: number, renderPass: RenderGraphPass | null = null): RenderGraphPass | null {
        const vertName = this._renderGraph.vertexName(passIdx);
        const layoutName = this._renderGraph.getLayout(passIdx);
        const renderData = this._renderGraph.getData(passIdx);
        const graphDataType = this._renderGraph.id(passIdx);
        const childs = this._renderGraph.children(passIdx);
        switch (graphDataType) {
        case RenderGraphValue.Blit:
            break;
        case RenderGraphValue.Compute:
            break;
        case RenderGraphValue.Copy:
            break;
        case RenderGraphValue.Dispatch:
            break;
        case RenderGraphValue.Move:
            break;
        case RenderGraphValue.Queue: {
            if (!renderPass) {
                return null;
            }
            const queueData = this._renderGraph.tryGetQueue(passIdx);
            if (queueData) renderPass.queueHint = queueData.hint;
        }
            break;
        case RenderGraphValue.Present: {
            if (this._presentPass) {
                throw new Error(`The same renderGraph can only have one presentPass`);
            }
            const presentPass = this._renderGraph.tryGetPresent(passIdx);
            if (!renderPass) {
                renderPass = new RenderGraphPass(this, RenderGraphValue.Present);
                renderPass.name = vertName;
                this.addPass(renderPass);
            }
            if (presentPass) {
                for (const resIdx of this._resourceGraph.vertices()) {
                    const resName = this._resourceGraph.vertexName(resIdx);
                    if (presentPass.resourceName === resName) {
                        const res = this.getResource(resName);
                        if (!res) {
                            throw new Error(`No RenderTextureResource with name "${resName}" found in RenderGraph`);
                        }
                        if (res.type === ResourceDimension.BUFFER) {
                            throw new Error(`The present pass cannot be of type RenderBufferResource`);
                        }
                        renderPass.present = res as RenderTextureResource;
                        this._presentPass = renderPass;
                        break;
                    }
                }
            }
        }
            break;
        case RenderGraphValue.Raster: {
            const rasterPass = this._renderGraph.tryGetRaster(passIdx);
            if (!renderPass) {
                renderPass = new RenderGraphPass(this, RenderGraphValue.Raster);
                renderPass.name = vertName;
                this.addPass(renderPass);
            }
            if (rasterPass) {
                for (const resIdx of this._resourceGraph.vertices()) {
                    const resName = this._resourceGraph.vertexName(resIdx);
                    const rasterView = rasterPass.rasterViews.get(resName);
                    if (rasterView) {
                        renderPass.setRasterViews(resName, rasterView);
                        const resDesc = this._resourceGraph.getDesc(resIdx);
                        const resTraits = this._resourceGraph.getTraits(resIdx);
                        switch (resDesc.dimension) {
                        case ResourceDimension.TEXTURE1D:
                        case ResourceDimension.TEXTURE2D:
                        case ResourceDimension.TEXTURE3D: {
                            let renderTex = this.getResource(resName);
                            if (!renderTex) {
                                renderTex = new RenderTextureResource(resName, resDesc, resTraits);
                                this._resources.push(renderTex);
                            }
                            switch (rasterView.accessType) {
                            case AccessType.WRITE:
                                renderPass.addOutput(renderTex);
                                break;
                            case AccessType.READ:
                                renderPass.addInput(renderTex);
                                break;
                            case AccessType.READ_WRITE:
                                renderPass.addInput(renderTex);
                                renderPass.addOutput(renderTex);
                                break;
                            default:
                            }
                        }
                            break;
                        case ResourceDimension.BUFFER:
                            break;
                        default:
                        }
                    }
                }
            }
        }
            break;
        case RenderGraphValue.Raytrace:
            break;
        case RenderGraphValue.Scene: {
            if (!renderPass) {
                return null;
            }
            const sceneData = this._renderGraph.tryGetScene(passIdx);
            if (sceneData) renderPass.sceneData = sceneData;
        }
            break;
        default:
        }
        for (const val of childs) {
            this._createRenderPass(val.target as number, renderPass);
        }
        return renderPass;
    }
    protected _buildIO () {
        for (const idx of this._renderGraph.vertices()) {
            this._createRenderPass(idx);
        }
    }
    reset () {
        this._passes.length = 0;
        this._resources.length = 0;
        this._presentPass = null;
        this._phases.clear();
    }
    protected _buildRenderPhase (phase: RenderGraphPhase, pass: RenderGraphPass) {
        if (pass.graphFlag === RenderGraphValue.Present && pass.present !== null) {
            const resTex = pass.present;
            const traits = resTex.resourceTraits!;
            if (traits.residency !== ResourceResidency.MANAGED
                    && traits.residency !== ResourceResidency.MEMORYLESS) {
                // The phase contains multiple passes that need to be executed.
                // Adding a phase is equivalent to adding all the dependent passes.
                pass.addInputPhase(resTex.name);
            }
        } else {
            for (const res of pass.inputs) {
                // TODO: It may be a buffer but ignore it for now
                const resTex = res as RenderTextureResource;
                const traits = resTex.resourceTraits!;
                if (traits.residency !== ResourceResidency.MANAGED
                    && traits.residency !== ResourceResidency.MEMORYLESS) {
                    // The phase contains multiple passes that need to be executed.
                    // Adding a phase is equivalent to adding all the dependent passes.
                    pass.addInputPhase(resTex.name);
                    continue;
                }
                for (const writer of res.writeInPasses) {
                    if (writer.currentPhase) {
                        pass.addInputPhase(writer.currentPhase.name);
                        continue;
                    }
                    this._buildRenderPhase(phase, writer);
                }
            }
        }
        phase.addPass(pass);
    }
    protected _buildPhases () {
        // Post order depth first search. Note that this doesn't do any colouring, so it only works on acyclic graphs.
        for (const res of this._resources) {
            // TODO: improved later
            if (res.type === ResourceDimension.BUFFER) {
                continue;
            }

            const texRes = res as RenderTextureResource;
            const traits = texRes.resourceTraits!;
            // The render phase will only create persistent, external and backbuffer resources.
            if (traits.residency === ResourceResidency.MANAGED
        || traits.residency === ResourceResidency.MEMORYLESS) {
                continue;
            }
            const currPhase = new RenderGraphPhase(texRes);
            // Create renderphase
            // If the next render phase depends on the previous render phase in the depth-first search,
            // the loop will terminate and the previous render phase will be used as the input of the current render phase.
            for (const pass of res.writeInPasses) {
                if (pass.currentPhase) {
                    pass.currentPhase.addTexture(texRes);
                    continue;
                }
                this._buildRenderPhase(currPhase, pass);
                pass.currentPhase = currPhase;
                // If multiple passes correspond to a phase at the same time,
                // the naming is first come first served
                if (!this._phases.get(texRes.name)) {
                    this._phases.set(texRes.name, currPhase);
                }
            }
        }
        // create present renderPhase
        if (this._presentPass) {
            const presentTex = this._presentPass.present!;
            const currPhase = new RenderGraphPhase(presentTex);
            this._buildRenderPhase(currPhase, this._presentPass);
            this._presentPass.currentPhase = currPhase;
            this._phases.set(`${presentTex.name}_Present`, currPhase);
        }
    }
    protected _buildPhaseDeviceResource (phase: RenderGraphPhase) {
        for (const pass of phase.passes) {
            // First convert the output resources to device resources
            // so that the current pass can create a framebuffer.
            for (const res of pass.outputs) {
                // TODO:It may be a buffer but ignore it for now
                if (res.type === ResourceDimension.BUFFER) {
                    continue;
                }
                const resTex = res as RenderTextureResource;
                resTex.buildDeviceTexture();
            }
            pass.buildDevicePass();
        }
    }
    protected _buildDeviceResources () {
        for (const pKV of this._phases) {
            const currPhase = pKV[1];
            this._buildPhaseDeviceResource(currPhase);
        }
    }
    build () {
        // determine rendergraph inputs and outputs
        this._buildIO();
        // create render phases
        this._buildPhases();
        // In Phases, all renderPass have been fetched and unneeded resources have been filtered
        // Next, create physical resources including textures and buffers and passes
        this._buildDeviceResources();
    }
    render () {}
    addPass (pass: RenderGraphPass) {
        this._passes.push(pass);
    }
    get passes () {
        return this._passes;
    }
    getResource (name: string) {
        for (const res of this._resources) {
            if (res.name === name) {
                return res;
            }
        }
        return null;
    }
}
