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
import { assert, warn } from '../../core';
import { VectorGraphColorMap } from './effect';
import { DefaultVisitor, depthFirstSearch, ReferenceGraphView } from './graph';
import { LayoutGraphData } from './layout-graph';
import { Pipeline } from './pipeline';
import { Blit, ClearView, ComputePass, ComputeSubpass, CopyPass, Dispatch, ManagedBuffer, ManagedResource, ManagedTexture, MovePass,
    RasterPass, RasterSubpass, RaytracePass, RenderGraph, RenderGraphVisitor,
    RenderQueue, RenderSwapchain, ResourceGraph, ResourceGraphObject, ResourceGraphVisitor, ResourceTraits, SceneData } from './render-graph';
import { AccessType, RasterView, ComputeView, ResourceResidency, SceneFlags } from './types';

class PassVisitor implements RenderGraphVisitor {
    public queueID = 0xFFFFFFFF;
    public sceneID = 0xFFFFFFFF;
    public passID = 0xFFFFFFFF;
    // output resourcetexture id
    public resID = 0xFFFFFFFF;
    public context: CompilerContext;
    private _currPass: RasterPass | null = null;
    constructor (context: CompilerContext) {
        this.context = context;
    }
    protected _isRasterPass (u: number): boolean {
        return !!this.context.renderGraph.tryGetRasterPass(u);
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
        const pass = this._currPass!;
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
            let resVisitor;
            let resourceGraph;
            let vertID;
            for (const [rasterName, raster] of readViews) {
                resVisitor = new ResourceVisitor(this.context);
                resourceGraph = this.context.resourceGraph;
                vertID = resourceGraph.find(rasterName);
                if (vertID !== 0xFFFFFFFF) {
                    resVisitor.resID = vertID;
                    resourceGraph.visitVertex(resVisitor, vertID);
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
                resVisitor = new ResourceVisitor(this.context);
                resourceGraph = this.context.resourceGraph;
                vertID = resourceGraph.find(computeName);
                if (vertID !== 0xFFFFFFFF) {
                    resVisitor.resID = vertID;
                    resourceGraph.visitVertex(resVisitor, vertID);
                }
            }
        }
    }
    applyID (id: number, resId: number): void {
        this.resID = resId;
        if (this._isRasterPass(id)) {
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
    copy (value: CopyPass) {}
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
    public resId = 0xFFFFFFFF;
    constructor (context: CompilerContext, resId: number) {
        super();
        this.resId = resId;
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
        const visitor = new PassManagerVisitor(this._context, this.resID);
        depthFirstSearch(visitor.graphView, visitor, visitor.colorMap);
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
}

class ResourceUseContext {
    // <passID, pass view>
    readonly rasters: Map<number, RasterView> = new Map<number, RasterView>();
    // <pass Use ID, compute views>
    computes: Map<number, [ComputeView[]]> = new Map<number, [ComputeView[]]>();
}
class CompilerContext {
    set (pipeline: Pipeline,
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
    private _pipeline: Pipeline;
    private _layoutGraph: LayoutGraphData;
    constructor (pipeline: Pipeline,
        resGraph: ResourceGraph,
        layoutGraph: LayoutGraphData) {
        this._pipeline = pipeline;
        this._resourceGraph = resGraph;
        this._layoutGraph = layoutGraph;
    }
    compile (rg: RenderGraph) {
        context.set(this._pipeline, this._resourceGraph, rg, this._layoutGraph);
        const visitor = new ResourceManagerVisitor(context);
        depthFirstSearch(this._resourceGraph, visitor, visitor.colorMap);
        if (DEBUG) {
            const useContext = context.resourceContext;
            for (const [name, use] of useContext) {
                const resId = this._resourceGraph.vertex(name);
                const trait = this._resourceGraph.getTraits(resId);
                const rasterArr: number[] = Array.from(use.rasters.keys());

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
                        assert(lastRaster.storeOp === StoreOp.DISCARD, `MANAGED resources that are not being used must be set to 'discard'.`);
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
