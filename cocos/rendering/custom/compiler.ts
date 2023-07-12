/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/
import { DEBUG } from 'internal:constants';
import { Buffer, Framebuffer, LoadOp, StoreOp, Texture, Viewport } from '../../gfx';
import { assert } from '../../core';
import { VectorGraphColorMap } from './effect';
import { DefaultVisitor, depthFirstSearch, ReferenceGraphView } from './graph';
import { LayoutGraphData } from './layout-graph';
import { BasicPipeline } from './pipeline';
import { Blit, ClearView, ComputePass, ComputeSubpass, CopyPass, Dispatch, FormatView, ManagedBuffer, ManagedResource, ManagedTexture, MovePass,
    RasterPass, RasterSubpass, RaytracePass, RenderGraph, RenderGraphVisitor, RasterView, ComputeView,
    RenderQueue, RenderSwapchain, ResolvePass, ResourceGraph, ResourceGraphVisitor, SceneData, SubresourceView } from './render-graph';
import { AccessType, ResourceResidency, SceneFlags } from './types';

let hashCode = 0;

function hashCombine (hash) {
    hashCode ^= (hash >>> 0) + 0x9e3779b9 + (hashCode << 6) + (hashCode >> 2);
}

function hashCombineNum (val: number) {
    const hash = 5381;
    hashCombine((hash * 33) ^ val);
}

function hashCombineStr (str: string) {
    // DJB2 HASH
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    hashCombine(hash);
}
function genHashValue (pass: RasterPass) {
    hashCode = 0;
    for (const [name, raster] of pass.rasterViews) {
        hashCombineStr('raster');
        hashCombineStr(name);
        hashCombineStr(raster.slotName);
        hashCombineNum(raster.accessType);
        hashCombineNum(raster.attachmentType);
        hashCombineNum(raster.loadOp);
        hashCombineNum(raster.storeOp);
        hashCombineNum(raster.clearFlags);
        hashCombineNum(raster.clearColor.x);
        hashCombineNum(raster.clearColor.y);
        hashCombineNum(raster.clearColor.z);
        hashCombineNum(raster.clearColor.w);
        hashCombineNum(raster.slotID);
        hashCombineNum(raster.shaderStageFlags);
    }
    for (const [name, computes] of pass.computeViews) {
        hashCombineStr(name);
        for (const compute of computes) {
            hashCombineStr('compute');
            hashCombineStr(compute.name);
            hashCombineNum(compute.accessType);
            hashCombineNum(compute.clearFlags);
            hashCombineNum(compute.clearValueType);
            hashCombineNum(compute.clearValue.x);
            hashCombineNum(compute.clearValue.y);
            hashCombineNum(compute.clearValue.z);
            hashCombineNum(compute.clearValue.w);
            hashCombineNum(compute.shaderStageFlags);
        }
    }
    hashCombineNum(pass.width);
    hashCombineNum(pass.height);
    hashCombineNum(pass.viewport.left);
    hashCombineNum(pass.viewport.top);
    hashCombineNum(pass.viewport.width);
    hashCombineNum(pass.viewport.height);
    hashCombineNum(pass.viewport.minDepth);
    hashCombineNum(pass.viewport.maxDepth);
    hashCombineNum(pass.showStatistics ? 1 : 0);
    pass.hashValue = hashCode;
}

class PassVisitor implements RenderGraphVisitor {
    public queueID = 0xFFFFFFFF;
    public sceneID = 0xFFFFFFFF;
    public passID = 0xFFFFFFFF;
    // output resourcetexture id
    public resID = 0xFFFFFFFF;
    public context: CompilerContext;
    private _currPass: RasterPass | CopyPass | null = null;
    private _resVisitor: ResourceVisitor;
    constructor (context: CompilerContext) {
        this.context = context;
        this._resVisitor = new ResourceVisitor(this.context);
    }
    protected _isRasterPass (u: number): boolean {
        return !!this.context.renderGraph.tryGetRasterPass(u);
    }
    protected _isCopyPass (u: number): boolean {
        return !!this.context.renderGraph.tryGetCopy(u);
    }
    protected _isQueue (u: number): boolean {
        return !!this.context.renderGraph.tryGetQueue(u);
    }
    protected _isShadowMap (u: number): boolean {
        const sceneData = this._getSceneData(u);
        if (sceneData) {
            return sceneData.light && !!sceneData.light.light && (sceneData.flags & SceneFlags.SHADOW_CASTER) !== 0;
        }
        return false;
    }
    protected _getSceneData (u: number): SceneData | null {
        return this.context.renderGraph.tryGetScene(u);
    }
    protected _isScene (u: number): boolean {
        return !!this._getSceneData(u);
    }
    protected _isBlit (u: number): boolean {
        return !!this.context.renderGraph.tryGetBlit(u);
    }

    private _useResourceInfo (input: string, raster: RasterView) {
        if (!DEBUG) {
            return;
        }
        const resContext = this.context.resourceContext;
        const useContext = resContext.get(input);
        const resGraph = this.context.resourceGraph;
        // There are resources being used
        if (useContext) {
            const rasters = useContext.rasters;
            const passRaster = rasters.get(this.passID);
            if (passRaster === raster) {
                return;
            }
            const computes = useContext.computes;
            let isPreRaster = false;
            for (const [passId, currRaster] of rasters) {
                if (passId > this.passID) {
                    isPreRaster = true;
                    // TODO: Shadow map is rather special, as it will be merged into one pass later, and then this determination can be removed.
                    if (!this._isShadowMap(this.sceneID)) {
                        assert(currRaster.loadOp === LoadOp.LOAD,
                            `The resource with name ${input} is being used, and the pass that uses this resource must have loadOp set to 'load'`);
                    }
                }
            }
            for (const [passId] of computes) {
                if (passId > this.passID) {
                    isPreRaster = true;
                    break;
                }
            }
            if (isPreRaster) {
                assert(raster.storeOp === StoreOp.STORE, `The resource ${input} is being used, so storeOp needs to be set to 'store'`);
            }
            rasters.set(this.passID, raster);
        } else {
            const resId = resGraph.vertex(input);
            const trait = resGraph.getTraits(resId);
            switch (trait.residency) {
            case ResourceResidency.PERSISTENT:
                assert(raster.storeOp === StoreOp.STORE, `Persistent resources must have storeOp set to 'store'.`);
                break;
            default:
            }
            const useContext = new ResourceUseContext();
            resContext.set(input, useContext);
            useContext.rasters.set(this.passID, raster);
        }
    }

    private _fetchValidPass () {
        const rg = this.context.renderGraph;
        const resContext = this.context.resourceContext;
        if (!DEBUG && rg.getValid(this.passID)) {
            rg.setValid(this.queueID, true);
            rg.setValid(this.sceneID, true);
            return;
        }
        const outputId = this.resID;
        const outputName = this.context.resourceGraph.vertexName(outputId);
        const readViews: Map<string, RasterView> = new Map();
        const pass = this._currPass! as RasterPass;
        const validPass = rg.getValid(this.passID);
        for (const [readName, raster] of pass.rasterViews) {
            // find the pass
            if (readName === outputName
                && raster.accessType !== AccessType.READ) {
                if (DEBUG) {
                    this._useResourceInfo(readName, raster);
                }
                rg.setValid(this.passID, true);
                rg.setValid(this.queueID, true);
                rg.setValid(this.sceneID, true);
                continue;
            }
            if (raster.accessType !== AccessType.WRITE) {
                readViews.set(readName, raster);
            }
        }
        if (DEBUG && validPass) return;
        if (rg.getValid(this.sceneID)) {
            for (const [readName, raster] of pass.rasterViews) {
                context.pipeline.resourceUses.push(readName);
            }
            let resourceGraph;
            let vertID;
            for (const [rasterName, raster] of readViews) {
                resourceGraph = this.context.resourceGraph;
                vertID = resourceGraph.find(rasterName);
                if (vertID !== 0xFFFFFFFF) {
                    this._resVisitor.resID = vertID;
                    resourceGraph.visitVertex(this._resVisitor, vertID);
                }
            }
            for (const [computeName, cViews] of pass.computeViews) {
                if (DEBUG) {
                    let resUseContext = resContext.get(computeName);
                    if (!resUseContext) {
                        resUseContext = new ResourceUseContext();
                        resContext.set(computeName, resUseContext);
                    }
                    const computes = resUseContext.computes;
                    const currUseComputes = computes.get(this.passID);
                    if (currUseComputes) {
                        currUseComputes.push(cViews);
                    } else {
                        computes.set(this.passID, [cViews]);
                    }
                }
                resourceGraph = this.context.resourceGraph;
                vertID = resourceGraph.find(computeName);
                if (vertID !== 0xFFFFFFFF) {
                    this._resVisitor.resID = vertID;
                    resourceGraph.visitVertex(this._resVisitor, vertID);
                }
            }
            genHashValue(pass);
        }
    }
    applyID (id: number, resId: number): void {
        this.resID = resId;
        if (this._isRasterPass(id) || this._isCopyPass(id)) {
            this.passID = id;
        } else if (this._isQueue(id)) {
            this.queueID = id;
        } else if (this._isScene(id) || this._isBlit(id)) {
            this.sceneID = id;
        }
    }
    rasterPass (pass: RasterPass) {
        // const rg = this.context.renderGraph;
        // Since the pass is valid, there is no need to continue traversing.
        // if (rg.getValid(this.passID)) {
        //     return;
        // }
        this._currPass = pass;
    }
    rasterSubpass (value: RasterSubpass) {}
    computeSubpass (value: ComputeSubpass) {}
    compute (value: ComputePass) {}
    resolve (value: ResolvePass) {}
    copy (value: CopyPass) {
        const rg = context.renderGraph;
        if (rg.getValid(this.passID)) {
            return;
        }
        const resourceGraph = this.context.resourceGraph;
        this._currPass = value;
        const outputId = this.resID;
        const outputName = resourceGraph.vertexName(outputId);
        let vertID;
        for (const pair of value.copyPairs) {
            if (pair.target === outputName) {
                rg.setValid(this.passID, true);
                vertID = resourceGraph.find(pair.source);
                if (vertID !== 0xFFFFFFFF) {
                    this._resVisitor.resID = vertID;
                    resourceGraph.visitVertex(this._resVisitor, vertID);
                }
            }
        }
    }
    move (value: MovePass) {}
    raytrace (value: RaytracePass) {}
    queue (value: RenderQueue) {}
    scene (value: SceneData) {
        this._fetchValidPass();
    }
    blit (value: Blit) {
        this._fetchValidPass();
    }
    dispatch (value: Dispatch) {}
    clear (value: ClearView[]) {}
    viewport (value: Viewport) {}
}

class PassManagerVisitor extends DefaultVisitor {
    private _colorMap: VectorGraphColorMap;
    private _graphView: ReferenceGraphView<RenderGraph>;
    private _passVisitor: PassVisitor;
    private _resId = 0xFFFFFFFF;

    set resId (value: number) {
        this._resId = value;
        this._colorMap.colors.length = context.renderGraph.numVertices();
    }
    get resId () {
        return this._resId;
    }
    constructor (context: CompilerContext, resId: number) {
        super();
        this._resId = resId;
        this._passVisitor = new PassVisitor(context);
        this._graphView = new ReferenceGraphView<RenderGraph>(context.renderGraph);
        this._colorMap = new VectorGraphColorMap(context.renderGraph.numVertices());
    }
    get graphView () { return this._graphView; }
    get colorMap () { return this._colorMap; }
    discoverVertex (u: number, gv: ReferenceGraphView<RenderGraph>) {
        const g = gv.g;
        this._passVisitor.applyID(u, this.resId);
        g.visitVertex(this._passVisitor, u);
    }
}

class ResourceVisitor implements ResourceGraphVisitor {
    private readonly _context: CompilerContext;
    public resID = 0xFFFFFFFF;
    private _passManagerVis;
    constructor (context: CompilerContext) {
        this._context = context;
    }
    managedBuffer (value: ManagedBuffer) {
        // noop
    }
    managedTexture (value: ManagedTexture) {
        // noop
    }
    managed (value: ManagedResource) {
        this.dependency();
    }
    persistentBuffer (value: Buffer) {
    }

    dependency () {
        if (!this._passManagerVis) {
            this._passManagerVis  = new PassManagerVisitor(this._context, this.resID);
        } else {
            this._passManagerVis.resId = this.resID;
        }
        depthFirstSearch(this._passManagerVis.graphView, this._passManagerVis, this._passManagerVis.colorMap);
    }

    persistentTexture (value: Texture) {
        this.dependency();
    }
    framebuffer (value: Framebuffer) {
        this.dependency();
    }
    swapchain (value: RenderSwapchain) {
        this.dependency();
    }
    formatView (value: FormatView) {
    }
    subresourceView (value: SubresourceView) {
    }
}

class ResourceUseContext {
    // <passID, pass view>
    readonly rasters: Map<number, RasterView> = new Map<number, RasterView>();
    // <pass Use ID, compute views>
    computes: Map<number, [ComputeView[]]> = new Map<number, [ComputeView[]]>();
}
class CompilerContext {
    set (pipeline: BasicPipeline,
        resGraph: ResourceGraph,
        renderGraph: RenderGraph,
        layoutGraph: LayoutGraphData) {
        this.pipeline = pipeline;
        this.resourceGraph = resGraph;
        this.renderGraph = renderGraph;
        this.layoutGraph = layoutGraph;
        if (!this.resourceContext) {
            this.resourceContext = new Map<string, ResourceUseContext>();
        }
        this.resourceContext.clear();
    }
    resourceGraph!: ResourceGraph;
    pipeline;
    renderGraph!: RenderGraph;
    layoutGraph!: LayoutGraphData;
    resourceContext!: Map<string, ResourceUseContext>;
}

export class Compiler {
    private _resourceGraph: ResourceGraph;
    private _pipeline: BasicPipeline;
    private _layoutGraph: LayoutGraphData;
    private _visitor: ResourceManagerVisitor;
    constructor (pipeline: BasicPipeline,
        renderGraph: RenderGraph,
        resGraph: ResourceGraph,
        layoutGraph: LayoutGraphData) {
        this._pipeline = pipeline;
        this._resourceGraph = resGraph;
        this._layoutGraph = layoutGraph;
        context.set(this._pipeline, this._resourceGraph, renderGraph, this._layoutGraph);
        this._visitor = new ResourceManagerVisitor(context);
    }
    compile (rg: RenderGraph) {
        context.set(this._pipeline, this._resourceGraph, rg, this._layoutGraph);
        context.pipeline.resourceUses.length = 0;
        this._visitor.colorMap.colors.length = context.resourceGraph.numVertices();
        depthFirstSearch(this._resourceGraph, this._visitor, this._visitor.colorMap);

        if (DEBUG) {
            const useContext = context.resourceContext;
            for (const [name, use] of useContext) {
                const resId = this._resourceGraph.vertex(name);
                const trait = this._resourceGraph.getTraits(resId);
                const rasterArr: number[] = Array.from(use.rasters.keys());
                if (!rasterArr.length) {
                    continue;
                }

                const min = rasterArr.reduce((prev, current) => (prev < current ? prev : current));
                const firstRaster = use.rasters.get(min)!;
                switch (trait.residency) {
                case ResourceResidency.PERSISTENT:
                    assert(firstRaster.loadOp !== LoadOp.DISCARD,
                        `The loadOp for persistent resources in the top-level pass cannot be set to 'discard'.`);
                    break;
                case ResourceResidency.MANAGED:
                    assert(firstRaster.loadOp === LoadOp.CLEAR, `The loadOp for Managed resources in the top-level pass can only be set to 'clear'.`);
                    break;
                default:
                    break;
                }
                const computeArr: number[] = Array.from(use.computes.keys());
                const max = rasterArr.reduce((prev, current) => (prev > current ? prev : current));
                let maxCompute = -1;
                if (computeArr.length) {
                    maxCompute = computeArr.reduce((prev, current) => (prev > current ? prev : current));
                }
                if (max > maxCompute) {
                    const lastRaster = use.rasters.get(max)!;
                    switch (trait.residency) {
                    case ResourceResidency.MANAGED:
                        // TODO
                        // assert(lastRaster.storeOp === StoreOp.DISCARD, `MANAGED resources that are not being used must be set to 'discard'.`);
                        break;
                    default:
                        break;
                    }
                }
            }
        }
    }
}
const context = new CompilerContext();
export class ResourceManagerVisitor extends DefaultVisitor {
    private _colorMap: VectorGraphColorMap;
    private _resourceGraph: ResourceGraph;
    private _resVisitor: ResourceVisitor;
    constructor (context: CompilerContext) {
        super();
        this._colorMap = new VectorGraphColorMap(context.resourceGraph.numVertices());
        this._resourceGraph = context.resourceGraph;
        this._resVisitor = new ResourceVisitor(context);
    }
    get colorMap () { return this._colorMap; }
    discoverVertex (u: number, gv: ResourceGraph) {
        const traits = this._resourceGraph.getTraits(u);
        if (traits.residency === ResourceResidency.MANAGED
                || traits.residency === ResourceResidency.MEMORYLESS) {
            return;
        }
        this._resVisitor.resID = u;
        this._resourceGraph.visitVertex(this._resVisitor, u);
    }
}
