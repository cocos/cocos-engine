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
import { Buffer, Framebuffer, Texture, Viewport } from '../../gfx';
import { assert } from '../../core';
import { VectorGraphColorMap } from './effect';
import { DefaultVisitor, depthFirstSearch, ReferenceGraphView } from './graph';
import { LayoutGraphData } from './layout-graph';
import { Pipeline } from './pipeline';
import { Blit, ClearView, ComputePass, CopyPass, Dispatch, ManagedBuffer, ManagedResource, ManagedTexture, MovePass,
    PresentPass, RasterPass, RaytracePass, RenderGraph, RenderGraphVisitor,
    RenderQueue, RenderSwapchain, ResourceGraph, ResourceGraphVisitor, SceneData } from './render-graph';
import { AccessType, RasterView, ResourceResidency } from './types';

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
    protected _isRaster (u: number): boolean {
        return !!this.context.renderGraph.tryGetRaster(u);
    }
    protected _isQueue (u: number): boolean {
        return !!this.context.renderGraph.tryGetQueue(u);
    }
    protected _isScene (u: number): boolean {
        return !!this.context.renderGraph.tryGetScene(u);
    }
    protected _isBlit (u: number): boolean {
        return !!this.context.renderGraph.tryGetBlit(u);
    }
    private _fetchValidPass () {
        const rg = this.context.renderGraph;
        if (rg.getValid(this.sceneID)) {
            return;
        }
        const outputId = this.resID;
        const outputName = this.context.resourceGraph.vertexName(outputId);
        const readViews: Map<string, RasterView> = new Map();
        const pass = this._currPass!;

        for (const [readName, raster] of pass.rasterViews) {
            // find the pass
            if (readName === outputName
                && raster.accessType !== AccessType.READ) {
                assert(!rg.getValid(this.sceneID), 'The same pass cannot output multiple resources with the same name at the same time');
                rg.setValid(this.passID, true);
                rg.setValid(this.queueID, true);
                rg.setValid(this.sceneID, true);
                continue;
            }
            if (raster.accessType !== AccessType.WRITE) {
                readViews.set(readName, raster);
            }
        }
        if (rg.getValid(this.sceneID)) {
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
        if (this._isRaster(id)) {
            this.passID = id;
        } else if (this._isQueue(id)) {
            this.queueID = id;
        } else if (this._isScene(id) || this._isBlit(id)) {
            this.sceneID = id;
        }
    }
    raster (pass: RasterPass) {
        // const rg = this.context.renderGraph;
        // Since the pass is valid, there is no need to continue traversing.
        // if (rg.getValid(this.passID)) {
        //     return;
        // }
        this._currPass = pass;
    }
    compute (value: ComputePass) {}
    copy (value: CopyPass) {}
    move (value: MovePass) {}
    present (value: PresentPass) {}
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
class CompilerContext {
    constructor (pipeline: Pipeline,
        resGraph: ResourceGraph,
        renderGraph: RenderGraph,
        layoutGraph: LayoutGraphData) {
        this.pipeline = pipeline;
        this.resourceGraph = resGraph;
        this.renderGraph = renderGraph;
        this.layoutGraph = layoutGraph;
    }
    readonly resourceGraph: ResourceGraph;
    readonly pipeline: Pipeline;
    readonly renderGraph: RenderGraph;
    readonly layoutGraph: LayoutGraphData;
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
        const context = new CompilerContext(
            this._pipeline,
            this._resourceGraph,
            rg,
            this._layoutGraph,
        );
        const visitor = new ResourceManagerVisitor(context);
        depthFirstSearch(this._resourceGraph, visitor, visitor.colorMap);
    }
}

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
