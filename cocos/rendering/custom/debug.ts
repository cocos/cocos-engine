/* eslint-disable max-len */
import { Viewport } from '../../gfx';
import { assert } from '../../core';
import { DefaultVisitor, ReferenceGraphView, ED} from './graph';
import { Blit, ClearView, ComputePass, CopyPass, Dispatch, getRenderGraphValueName, MovePass, PresentPass, RasterPass, RaytracePass, RenderGraph, RenderGraphVisitor, RenderQueue, SceneData } from './render-graph';
import { getQueueHintName } from './types';

export const enableDebug = true;

let oss = '';
let space = '';

class PrePrintVisitor implements RenderGraphVisitor {
    constructor (g: RenderGraph) {
        this.g = g;
    }
    clear (value: ClearView[]) {
        // do nothing
    }
    viewport (value: Viewport) {
        // do nothing
    }
    raster (value: RasterPass) {
        oss += `${space}width = ${value.width}\n`;
        oss += `${space}height = ${value.height}\n`;
        for (const rasterView of value.rasterViews) {
            oss += `${space}"${rasterView[0]}": RasterView\n`;
        }
        for (const computeView of value.computeViews) {
            oss += `${space}"${computeView[0]}": ComputeView[]\n`;
        }
    }
    compute (value: ComputePass) {
        for (const computeView of value.computeViews) {
            oss += `${space}"${computeView[0]}": ComputeView[]\n`;
        }
    }
    copy (value: CopyPass) {
        if (value.copyPairs.length === 1) {
            const pair = value.copyPairs[0];
            oss += `${space}source = "${pair.source}"\n`;
            oss += `${space}target = "${pair.target}"\n`;
        } else {
            let i = 0;
            oss += `${space}sources = [`;
            for (const pair of value.copyPairs) {
                if (i++) {
                    oss += ', ';
                }
                oss += `"${pair.source}"`;
            }
            oss += ']\n';

            oss += `${space}targets = [`;
            for (const pair of value.copyPairs) {
                if (i++) {
                    oss += ', ';
                }
                oss += `"${pair.target}"`;
            }
            oss += ']\n';
        }
    }
    move (value: MovePass) {
        if (value.movePairs.length === 1) {
            const pair = value.movePairs[0];
            oss += `${space}source = "${pair.source}"\n`;
            oss += `${space}target = "${pair.target}"\n`;
        } else {
            let i = 0;
            oss += `${space}sources = [`;
            for (const pair of value.movePairs) {
                if (i++) {
                    oss += ', ';
                }
                oss += `"${pair.source}"`;
            }
            oss += ']\n';

            oss += `${space}targets = [`;
            for (const pair of value.movePairs) {
                if (i++) {
                    oss += ', ';
                }
                oss += `"${pair.target}"`;
            }
            oss += ']\n';
        }
    }
    present (value: PresentPass) {
        for (const present of value.presents) {
            oss += `${space}"${present[0]}": Present{ interval = ${present[1].syncInterval} }\n`;
        }
    }
    raytrace (value: RaytracePass) {
        for (const computeView of value.computeViews) {
            oss += `${space}"${computeView[0]}": ComputeView[]\n`;
        }
    }
    queue (value: RenderQueue) {
        oss += `${space}hint = ${getQueueHintName(value.hint)}\n`;
    }
    scene (value: SceneData) {
        oss += `${space}scenes = [`;
        let i = 0;
        for (const scene of value.scenes) {
            if (i++) {
                oss += ', ';
            }
            oss += `"${scene}"`;
        }
        oss += ']\n';
    }
    blit (value: Blit) {}
    dispatch (value: Dispatch) {
        oss += `${space}shader = "${value.shader}"\n`;
        oss += `${space}groupX = ${value.threadGroupCountX}\n`;
        oss += `${space}groupY = ${value.threadGroupCountY}\n`;
        oss += `${space}groupZ = ${value.threadGroupCountZ}\n`;
    }
    g: RenderGraph;
}

class PostPrintVisitor implements RenderGraphVisitor {
    constructor (g: RenderGraph) {
        this.g = g;
    }
    clear (value: ClearView[]) {
        // do nothing
    }
    viewport (value: Viewport) {
        // do nothing
    }
    raster (value: RasterPass) {
        // post raster pass
    }
    compute (value: ComputePass) {}
    copy (value: CopyPass) {}
    move (value: MovePass) {}
    present (value: PresentPass) {}
    raytrace (value: RaytracePass) {}
    queue (value: RenderQueue) {
        // collect scene results
    }
    scene (value: SceneData) {
        // scene command list finished
    }
    blit (value: Blit) {}
    dispatch (value: Dispatch) {}
    g: RenderGraph;
}

export class RenderGraphPrintVisitor extends DefaultVisitor {
    constructor (g: RenderGraph) {
        super();
        this.preVertexVisitor = new PrePrintVisitor(g);
        this.postVertexVisitor = new PostPrintVisitor(g);
    }
    initializeVertex (v: number, gv: ReferenceGraphView<RenderGraph>): void {
        // initialization
    }
    startVertex (v: number, gv: ReferenceGraphView<RenderGraph>): void {
        const g = gv.g;
        // passes begin
        // assert(g.holds(RenderGraphValue.Raster, v)
        //     || g.holds(RenderGraphValue.Compute, v)
        //     || g.holds(RenderGraphValue.Copy, v)
        //     || g.holds(RenderGraphValue.Move, v)
        //     || g.holds(RenderGraphValue.Present, v)
        //     || g.holds(RenderGraphValue.Raytrace, v));
    }
    discoverVertex (v: number, gv: ReferenceGraphView<RenderGraph>): void {
        const g = gv.g;
        oss += `${space}"${g.getName(v)}": ${getRenderGraphValueName(g.id(v))} {\n`;
        space += '    ';

        g.visitVertex(this.preVertexVisitor, v);
    }
    backEdge (e: ED, gv: ReferenceGraphView<RenderGraph>): void {
        assert(false);
    }
    forwardOrCrossEdge (e: ED, gv: ReferenceGraphView<RenderGraph>): void {
        assert(false);
    }
    finishEdge (e: ED, gv: ReferenceGraphView<RenderGraph>): void {
        const g = gv.g;
    }
    finishVertex (v: number, gv: ReferenceGraphView<RenderGraph>): void {
        const g = gv.g;
        g.visitVertex(this.postVertexVisitor, v);

        space = space.substring(0, space.length - 4);
        oss += `${space}}\n`;
    }
    print (): string {
        return oss;
    }
    readonly preVertexVisitor;
    readonly postVertexVisitor;
}
