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
import { Buffer, Framebuffer, Texture, Viewport } from '../../gfx';
import { assert } from '../../platform/debug';
import { LayoutGraphData } from './layout-graph';
import { Pipeline } from './pipeline';
import { Blit, ClearView, ComputePass, CopyPass, Dispatch, ManagedResource, MovePass,
    PresentPass, RasterPass, RaytracePass, RenderGraph, RenderGraphValue, RenderGraphVisitor,
    RenderQueue, RenderSwapchain, ResourceGraph, ResourceGraphVisitor, SceneData } from './render-graph';
import { AccessType, RasterView, ResourceResidency } from './types';

class PassVisitor implements RenderGraphVisitor {
    public passID = 0xFFFFFFFF;
    // output resourcetexture id
    public resID = 0xFFFFFFFF;
    private _currPass: RasterPass | null = null;
    private readonly _context: CompilerContext;
    protected _queueID = 0xFFFFFFFF;
    protected _sceneID = 0xFFFFFFFF;
    constructor (context: CompilerContext) {
        this._context = context;
    }
    clear (value: ClearView[]): unknown {
        throw new Error('Method not implemented.');
    }
    viewport (value: Viewport): unknown {
        throw new Error('Method not implemented.');
    }
    raster (pass: RasterPass) {
        // Since the pass is valid, there is no need to continue traversing.
        if (pass.isValid) {
            return;
        }
        this._currPass = pass;
        const rg = this._context.renderGraph;
        for (const q of rg.children(this.passID)) {
            const queueID = q.target as number;
            assert(rg.holds(RenderGraphValue.Queue, queueID));
            this._queueID = queueID;
            rg.visitVertex(this, queueID);
        }
    }
    compute (pass: ComputePass) {
    }
    copy (pass: CopyPass) {

    }
    move (pass: MovePass) {

    }
    present (pass: PresentPass) {

    }
    raytrace (pass: RaytracePass) {

    }
    queue (value: RenderQueue) {
        // It is possible that the pass has already been found in the first for loop
        if (this._currPass!.isValid) {
            return;
        }
        const rg = this._context.renderGraph;
        for (const s of rg.children(this._queueID)) {
            const sceneID = s.target as number;
            this._sceneID = sceneID;
            rg.visitVertex(this, sceneID);
        }
    }
    private _fetchValidPass () {
        if (this._currPass!.isValid) {
            return;
        }
        const outputId = this.resID;
        const outputName = this._context.resourceGraph.vertexName(outputId);
        const readViews: Map<string, RasterView> = new Map();
        const pass = this._currPass!;

        for (const [readName, raster] of pass.rasterViews) {
            // find the pass
            if (readName === outputName
                && raster.accessType !== AccessType.READ) {
                assert(!pass.isValid, 'The same pass cannot output multiple resources with the same name at the same time');
                pass.isValid = true;
                continue;
            }
            if (raster.accessType !== AccessType.WRITE) {
                readViews.set(readName, raster);
            }
        }
        if (pass.isValid) {
            let resVisitor;
            let resourceGraph;
            let vertID;
            for (const [rasterName, raster] of readViews) {
                resVisitor = new ResourceVisitor(this._context);
                resourceGraph = this._context.resourceGraph;
                vertID = resourceGraph.find(rasterName);
                if (vertID !== 0xFFFFFFFF) {
                    resVisitor.resID = vertID;
                    resourceGraph.visitVertex(resVisitor, vertID);
                }
            }
            for (const [computeName, cViews] of pass.computeViews) {
                resVisitor = new ResourceVisitor(this._context);
                resourceGraph = this._context.resourceGraph;
                vertID = resourceGraph.find(computeName);
                if (vertID !== 0xFFFFFFFF) {
                    resVisitor.resID = vertID;
                    resourceGraph.visitVertex(resVisitor, vertID);
                }
            }
        }
    }
    scene (value: SceneData) {
        this._fetchValidPass();
    }
    blit (value: Blit) {
        this._fetchValidPass();
    }
    dispatch (value: Dispatch) {
    }
}

class ResourceVisitor implements ResourceGraphVisitor {
    private readonly _context: CompilerContext;
    public resID = 0xFFFFFFFF;
    constructor (context: CompilerContext) {
        this._context = context;
    }
    managed (value: ManagedResource) {
        this.dependency();
    }
    persistentBuffer (value: Buffer) {
    }

    dependency () {
        // const resName = this._context.resourceGraph.vertexName(this.resID);
        const rg = this._context.renderGraph;
        const passVisitor = new PassVisitor(this._context);
        for (const vertID of rg.vertices()) {
            if (rg.numParents(vertID) === 0) {
                // vertex has no parents, must be pass
                passVisitor.passID = vertID;
                passVisitor.resID = this.resID;
                rg.visitVertex(passVisitor, vertID);
            }
        }
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
        const resVisitor = new ResourceVisitor(context);
        for (const vertID of this._resourceGraph.vertices()) {
            const traits = this._resourceGraph.getTraits(vertID);
            if (traits.residency === ResourceResidency.MANAGED
                || traits.residency === ResourceResidency.MEMORYLESS) {
                continue;
            }
            resVisitor.resID = vertID;
            this._resourceGraph.visitVertex(resVisitor, vertID);
        }
    }
}
