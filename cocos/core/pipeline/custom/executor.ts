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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
/* eslint-disable max-len */
import { CommandBuffer, Device } from '../../gfx';
import { assert } from '../../platform';
import { PipelineSceneData } from '../pipeline-scene-data';
import { Blit, ComputePass, CopyPass, Dispatch, MovePass, PresentPass, RasterPass, RaytracePass, RenderGraph, RenderGraphValue, RenderGraphVisitor, RenderQueue, ResourceGraph, SceneData } from './render-graph';

class Framebuffer {

}

class ExecutorContext {
    constructor (device: Device,
        commandBuffer: CommandBuffer,
        pipelineSceneData: PipelineSceneData,
        resourceGraph: ResourceGraph,
        framebuffers: Map<string, Framebuffer>,
        renderGraph: RenderGraph) {
        this.device = device;
        this.commandBuffer = commandBuffer;
        this.pipelineSceneData = pipelineSceneData;
        this.resourceGraph = resourceGraph;
        this.framebuffers = framebuffers;
        this.renderGraph = renderGraph;
    }
    readonly device: Device;
    readonly commandBuffer: CommandBuffer;
    readonly pipelineSceneData: PipelineSceneData;
    readonly resourceGraph: ResourceGraph;
    readonly framebuffers: Map<string, Framebuffer>;
    readonly renderGraph: RenderGraph;
}

class RasterSceneVisitor implements RenderGraphVisitor {
    private readonly _context: ExecutorContext;
    constructor (context: ExecutorContext) {
        this._context = context;
    }
    raster (value: RasterPass) {
        assert(false);
    }
    compute (value: ComputePass) {
        assert(false);
    }
    copy (value: CopyPass) {
        assert(false);
    }
    move (value: MovePass) {
        assert(false);
    }
    present (value: PresentPass) {
        assert(false);
    }
    raytrace (value: RaytracePass) {
        assert(false);
    }
    queue (value: RenderQueue) {
        assert(false);
    }
    scene (value: SceneData) {
        const cb = this._context.commandBuffer;
        // visit scene with WebSceneVisitor

        // in WebSceneVisitor
        // for (each model in scene) {
        //     if (model.material !== prevMaternal) {
        //         upload PerBatch uniform data
        //         set PerBatch descriptors
        //     }
        //     upload PerInstance uniform data
        //     set PerInstance descriptors
        //     cb.draw
        // }
    }
    blit (value: Blit) {
        const cb = this._context.commandBuffer;
        // upload PerBatch uniform data
        // upload PerInstance uniform data

        // set PerBatch descriptors
        // set PerInstance descriptors

        // draw fullscreen quad
    }
    dispatch (value: Dispatch) {
        assert(false);
    }
}

class PassVisitor implements RenderGraphVisitor {
    public passID = 0xFFFFFFFF;
    private readonly _context: ExecutorContext;

    constructor (context: ExecutorContext) {
        this._context = context;
    }
    raster (pass: RasterPass) {
        const rg = this._context.renderGraph;
        const cb = this._context.commandBuffer;
        // setup fbo keys
        const fboKey = new Set<string>();
        for (const [name, raster] of pass.rasterViews) {
            fboKey.add(name);
        }
        // get fbo
        const fbo = this._context.framebuffers.get(JSON.stringify(fboKey));
        assert(fbo);

        // begin render pass
        // cb.beginRenderPass();

        // upload PerPass uniform data
        // bind PerPass descriptors

        const sceneVisitor = new RasterSceneVisitor(this._context);

        for (const q of rg.children(this.passID)) {
            const queueID = q.target as number;
            assert(rg.holds(RenderGraphValue.Queue, queueID));
            const queue = rg.value(RenderGraphValue.Queue, queueID);

            // upload PerQueue uniform data
            // bind PerQueue descriptors

            for (const s of rg.children(queueID)) {
                const sceneID = s.target as number;
                rg.visitVertex(sceneVisitor, sceneID);
            }
        }
        // cb.endRenderPass();
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
        assert(false);
    }
    scene (value: SceneData) {
        assert(false);
    }
    blit (value: Blit) {
        assert(false);
    }
    dispatch (value: Dispatch) {
        assert(false);
    }
}

export class ExecutorExample {
    constructor (device: Device,
        commandBuffer: CommandBuffer,
        pipelineSceneData: PipelineSceneData,
        resourceGraph: ResourceGraph) {
        this._device = device;
        this._commandBuffer = commandBuffer;
        this._pipelineSceneData = pipelineSceneData;
        this._resourceGraph = resourceGraph;
    }

    execute (rg: RenderGraph) {
        const context = new ExecutorContext(
            this._device, this._commandBuffer,
            this._pipelineSceneData,
            this._resourceGraph,
            this._framebuffers,
            rg,
        );
        const passVisitor = new PassVisitor(context);
        for (const vertID of rg.vertices()) {
            if (rg.numParents(vertID) === 0) {
                // vertex has no parents, must be pass
                passVisitor.passID = vertID;
                rg.visitVertex(passVisitor, vertID);
            }
        }
    }

    private readonly _device: Device
    private readonly _commandBuffer: CommandBuffer
    private readonly _pipelineSceneData: PipelineSceneData
    private readonly _resourceGraph: ResourceGraph
    private readonly _framebuffers = new Map<string, Framebuffer>();
}
