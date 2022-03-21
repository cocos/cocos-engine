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
import { Buffer, Texture } from '../../gfx';
import { assert } from '../../platform/debug';
import { LayoutGraphData } from './layout-graph';
import { Pipeline } from './pipeline';
import { AccessType, Blit, ComputePass, CopyPass, Dispatch, ManagedResource, MovePass,
    PresentPass, RasterPass, RasterView, RaytracePass, RenderGraph, RenderGraphValue, RenderGraphVisitor,
    RenderQueue, RenderSwapchain, ResourceGraph, ResourceGraphVisitor, SceneData } from './render-graph';
import { ResourceResidency } from './types';

class PassInfo {
    private _passID: number;
    private _queueID: number;
    private _sceneID: number;
    // output resourcetexture id
    private _resID: number;
    constructor (resID: number, passID: number, queueID: number, sceneID: number) {
        this._passID = passID;
        this._queueID = queueID;
        this._sceneID = sceneID;
        this._resID = resID;
    }
    get resID () { return this._resID; }
    get passID () { return this._passID; }
    get queueID () { return this._queueID; }
    get sceneID () { return this._sceneID; }
}

class RasterSceneVisitor implements RenderGraphVisitor {
    private readonly _context: CompilerContext;
    private _passInfo: PassInfo | null = null;
    constructor (context: CompilerContext) {
        this._context = context;
    }
    set passInfo (passInfo: PassInfo | null) {
        this._passInfo = passInfo;
    }
    get passInfo () { return this._passInfo; }
    raster (pass: RasterPass) {
    }
    compute (value: ComputePass) {
    }
    copy (value: CopyPass) {
    }
    move (value: MovePass) {
    }
    present (value: PresentPass) {
    }
    raytrace (value: RaytracePass) {
    }
    queue (value: RenderQueue) {
    }
    scene (value: SceneData) {
        const outputId = this.passInfo!.resID;
        const passId = this.passInfo!.passID;
        const outputName = this._context.resourceGraph.vertexName(outputId);
        const readViews: Map<string, RasterView> = new Map();
        const pass = this._context.renderGraph.tryGetRaster(passId)!;
        for (const [name, raster] of pass.rasterViews) {
            // find the pass
            if (name === outputName
                && raster.accessType !== AccessType.READ) {
                assert(!pass.isValid, 'The same pass cannot output multiple resources with the same name at the same time');
                pass.isValid = true;
                continue;
            }
            if (raster.accessType !== AccessType.WRITE) {
                readViews.set(name, raster);
            }
        }
        if (pass.isValid) {
            for (const [name, raster] of readViews) {
                const resVisitor = new ResourceVisitor(this._context);
                const resourceGraph = this._context.resourceGraph;
                const vertID = resourceGraph.vertex(name);
                if (vertID) {
                    resVisitor.resID = vertID;
                    resourceGraph.visitVertex(resVisitor, vertID);
                }
            }
        }
    }
    blit (value: Blit) {
    }
    dispatch (value: Dispatch) {
    }
}

class PassVisitor implements RenderGraphVisitor {
    public passID = 0xFFFFFFFF;
    // output resourcetexture id
    public resID = 0xFFFFFFFF;
    private readonly _context: CompilerContext;

    constructor (context: CompilerContext) {
        this._context = context;
    }
    raster (pass: RasterPass) {
        // Since the pass is valid, there is no need to continue traversing.
        if (pass.isValid) {
            return;
        }
        const rg = this._context.renderGraph;
        const sceneVisitor = new RasterSceneVisitor(this._context);
        for (const q of rg.children(this.passID)) {
            // It is possible that the pass has already been found in the first for loop
            if (pass.isValid) {
                return;
            }
            const queueID = q.target as number;
            assert(rg.holds(RenderGraphValue.Queue, queueID));
            // const queue = rg.value(RenderGraphValue.Queue, queueID);
            for (const s of rg.children(queueID)) {
                if (pass.isValid) {
                    return;
                }
                const sceneID = s.target as number;
                const passInfo = new PassInfo(this.resID, this.passID, queueID, sceneID);
                sceneVisitor.passInfo = passInfo;
                rg.visitVertex(sceneVisitor, sceneID);
            }
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
    }
    scene (value: SceneData) {
    }
    blit (value: Blit) {
    }
    dispatch (value: Dispatch) {
    }
}

export class ResourceVisitor implements ResourceGraphVisitor {
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
    private _renderGraph: RenderGraph;
    private _layoutGraph: LayoutGraphData;
    constructor (pipeline: Pipeline,
        resGraph: ResourceGraph,
        renderGraph: RenderGraph,
        layoutGraph: LayoutGraphData) {
        this._pipeline = pipeline;
        this._resourceGraph = resGraph;
        this._renderGraph = renderGraph;
        this._layoutGraph = layoutGraph;
    }
    compile () {
        const context = new CompilerContext(
            this._pipeline,
            this._resourceGraph,
            this._renderGraph,
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
