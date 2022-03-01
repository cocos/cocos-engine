import { LayoutGraph, LayoutGraphData } from './layout-graph';
import { AccessType, RenderGraph, RenderGraphValue, ResourceDesc, ResourceFlags, ResourceGraph, ResourceTraits, SceneData } from './render-graph';
import { QueueHint, ResourceDimension, ResourceResidency } from './types';

export class RenderResource {
    protected _type: ResourceDimension = ResourceDimension.TEXTURE2D;
    // protected _idx = -1;
    protected _physicalIndex = -1;
    protected _name = '';
    protected _writeInPasses: RenderPass[] = [];
    protected _readInPasses: RenderPass[] = [];
    // protected _queueFlag: RenderGraphValue = RenderGraphValue.Raster;
    constructor (name: string, type: ResourceDimension) {
        this._name = name;
        this._type = type;
        // this._idx = index;
    }
    // set graphQueueFlag (value: RenderGraphValue) {
    //     this._queueFlag = value;
    // }
    // get graphQueueFlag () : RenderGraphValue { return this._queueFlag; }
    // get index (): number { return this._idx; }
    get type (): ResourceDimension { return this._type; }
    set type (value: ResourceDimension) { this._type = value; }
    get name (): string { return this._name; }
    set name (value: string) { this._name = value; }
    set writeInPass (pass: RenderPass) {
        this._writeInPasses.push(pass);
    }
    get writeInPasses (): RenderPass[] { return this._writeInPasses; }
    set readInPass (pass: RenderPass) {
        this._readInPasses.push(pass);
    }
    get readInPasses (): RenderPass[] { return this._readInPasses; }
}

export class RenderTextureResource extends RenderResource {
    protected _info: ResourceDesc | null = null;
    protected _trait: ResourceTraits | null = null;
    protected _transient = false;
    constructor (name: string, desc: ResourceDesc, traits: ResourceTraits) {
        super(name, desc.dimension);
        this.setResourceTraits(traits);
        this.setAttachmentInfo(desc);
    }
    set transientState (enable: boolean) {
        this._transient = enable;
    }
    get transientState () { return this._transient; }
    setAttachmentInfo (info: ResourceDesc) {
        this._info = info;
    }
    getAttachmentInfo () {
        return this._info;
    }
    setResourceTraits (traits: ResourceTraits) {
        this._trait = traits;
    }
    getResourceTraits () {
        return this._trait;
    }
    addImageUsage (flags: ResourceFlags) {
        if (this._info) {
            this._info.flags |= flags;
        }
    }
    getImageUsage () {
        return this._info && this._info.flags;
    }
}

// There are no detailed implementations of BufferInfo yet, just inheritance
export class RenderBufferResource extends RenderResource {
    constructor (name: string) {
        super(name, ResourceDimension.BUFFER);
    }
}

export class RenderPass {
    protected _name = '';
    protected _graphBuild: RenderDependencyGraph | null = null;
    protected _graphFlag: RenderGraphValue = RenderGraphValue.Raster;
    protected _queueHint: QueueHint = QueueHint.NONE;
    protected _outputs: RenderResource[] = [];
    protected _inputs: RenderResource[] = [];
    protected _sceneData: SceneData | null = null;
    protected _present: RenderTextureResource | null = null;
    protected _inputPhases: string[] = [];
    // The current pass corresponds to the last pass of the current phase
    protected _currentPhase: RenderPhase | null = null;
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
    addOutput (res: RenderResource) {
        res.writeInPass = this;
        this._outputs.push(res);
    }
    addInput (res: RenderResource) {
        res.readInPass = this;
        this._inputs.push(res);
    }
    get present (): RenderTextureResource | null { return this._present; }
    set present (val: RenderTextureResource | null) {
        this._present = val;
    }
    get currentPhase (): RenderPhase | null { return this._currentPhase; }
    set currentPhase (value: RenderPhase | null) { this._currentPhase = value; }
    addInputPhase (inputPhase: string) {
        if (!this.getInputPhases().includes(inputPhase)) {
            this._inputPhases.push(inputPhase);
        }
    }
    getInputPhases () { return this._inputPhases; }
}

export class RenderPhase {
    protected _textures: RenderTextureResource[] = [];
    protected _passes: RenderPass[] = [];
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
    addPass (pass: RenderPass) {
        if (!this._passes.includes(pass)) {
            this._passes.push(pass);
        }
    }
}

export class RenderDependencyGraph {
    protected _renderGraph: RenderGraph;
    protected _resourceGraph: ResourceGraph;
    protected _layoutGraph: LayoutGraphData;
    protected _passes: RenderPass[] = [];
    protected _resources: RenderResource[] = [];
    protected _phases: Map<string, RenderPhase> = new Map<string, RenderPhase>();
    protected _presentPass: RenderPass | null = null;
    constructor (renderGraph: RenderGraph, resourceGraph: ResourceGraph, layoutGraph: LayoutGraphData) {
        this._renderGraph = renderGraph;
        this._resourceGraph = resourceGraph;
        this._layoutGraph = layoutGraph;
    }
    protected _createRenderPass (passIdx: number, renderPass: RenderPass | null = null): RenderPass | null {
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
                renderPass = new RenderPass(this, RenderGraphValue.Present);
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
                renderPass = new RenderPass(this, RenderGraphValue.Raster);
                renderPass.name = vertName;
                this.addPass(renderPass);
            }
            if (rasterPass) {
                for (const resIdx of this._resourceGraph.vertices()) {
                    const resName = this._resourceGraph.vertexName(resIdx);
                    const rasterView = rasterPass.rasterViews.get(resName);
                    if (rasterView) {
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
    protected _buildRenderPhase (phase: RenderPhase, pass: RenderPass) {
        if (pass.graphFlag === RenderGraphValue.Present && pass.present !== null) {
            const resTex = pass.present;
            const traits = resTex.getResourceTraits()!;
            if (traits.residency !== ResourceResidency.Managed
                    && traits.residency !== ResourceResidency.Memoryless) {
                // The phase contains multiple passes that need to be executed.
                // Adding a phase is equivalent to adding all the dependent passes.
                pass.addInputPhase(resTex.name);
            }
        } else {
            for (const res of pass.inputs) {
                const resTex = res as RenderTextureResource;
                const traits = resTex.getResourceTraits()!;
                if (traits.residency !== ResourceResidency.Managed
                    && traits.residency !== ResourceResidency.Memoryless) {
                    // The phase contains multiple passes that need to be executed.
                    // Adding a phase is equivalent to adding all the dependent passes.
                    pass.addInputPhase(resTex.name);
                    continue;
                }
                for (const writer of res.writeInPasses) {
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
            const traits = texRes.getResourceTraits()!;
            // The render phase will only create persistent, external and backbuffer resources.
            if (traits.residency === ResourceResidency.Managed
        || traits.residency === ResourceResidency.Memoryless) {
                continue;
            }
            const currPhase = new RenderPhase(texRes);
            // Create renderphase
            // If the next render phase depends on the previous render phase in the depth-first search,
            // the loop will terminate and the previous render phase will be used as the input of the current render phase.
            for (const pass of res.writeInPasses) {
                if (pass.currentPhase) {
                    pass.currentPhase.addTexture(texRes);
                    continue;
                }
                pass.currentPhase = currPhase;
                this._buildRenderPhase(currPhase, pass);
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
            const currPhase = new RenderPhase(presentTex);
            this._buildRenderPhase(currPhase, this._presentPass);
            this._phases.set(`${presentTex.name}_Present`, currPhase);
        }
    }
    build () {
        // determine rendergraph inputs and outputs
        this._buildIO();
        // create render phases
        this._buildPhases();
        // In Phases, all renderPass have been fetched and unneeded resources have been filtered
    }
    addPass (pass: RenderPass) {
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
