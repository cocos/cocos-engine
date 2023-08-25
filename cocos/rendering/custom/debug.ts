/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

/* eslint-disable max-len */
import { Viewport } from '../../gfx';
import { assert } from '../../core';
import { DefaultVisitor, ReferenceGraphView, ED} from './graph';
import { Blit, ClearView, ComputePass, ComputeSubpass, CopyPass, Dispatch, getRenderGraphValueName, MovePass, RasterPass, RasterSubpass, RaytracePass, RenderGraph, RenderGraphVisitor, RenderQueue, SceneData } from './render-graph';
import { getQueueHintName } from './types';

export const enableDebug = true;

let oss = '';
let space = '';

class PrePrintVisitor implements RenderGraphVisitor {
    constructor (g: RenderGraph) {
        this.g = g;
    }
    clear (value: ClearView[]): void {
        // do nothing
    }
    viewport (value: Viewport): void {
        // do nothing
    }
    rasterPass (value: RasterPass): void {
        oss += `${space}width = ${value.width}\n`;
        oss += `${space}height = ${value.height}\n`;
        for (const rasterView of value.rasterViews) {
            oss += `${space}"${rasterView[0]}": RasterView\n`;
        }
        for (const computeView of value.computeViews) {
            oss += `${space}"${computeView[0]}": ComputeView[]\n`;
        }
    }
    rasterSubpass(value: RasterSubpass): void {}
    computeSubpass(value: ComputeSubpass): void {}
    compute (value: ComputePass): void {
        for (const computeView of value.computeViews) {
            oss += `${space}"${computeView[0]}": ComputeView[]\n`;
        }
    }
    copy (value: CopyPass): void {
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
    move (value: MovePass): void {
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
    raytrace (value: RaytracePass): void {
        for (const computeView of value.computeViews) {
            oss += `${space}"${computeView[0]}": ComputeView[]\n`;
        }
    }
    queue (value: RenderQueue): void {
        oss += `${space}hint = ${getQueueHintName(value.hint)}\n`;
    }
    scene (value: SceneData): void {
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
    blit (value: Blit): void {}
    dispatch (value: Dispatch): void {
        oss += `${space}material = "${value.material?.name}"\n`;
        oss += `${space}passID = "${value.passID}"\n`;
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
    clear (value: ClearView[]): void {
        // do nothing
    }
    viewport (value: Viewport): void {
        // do nothing
    }
    rasterPass (value: RasterPass): void {
        // post raster pass
    }
    rasterSubpass(value: RasterSubpass): void {}
    computeSubpass(value: ComputeSubpass): void {}
    compute (value: ComputePass): void {}
    copy (value: CopyPass): void {}
    move (value: MovePass): void {}
    raytrace (value: RaytracePass): void {}
    queue (value: RenderQueue): void {
        // collect scene results
    }
    scene (value: SceneData): void {
        // scene command list finished
    }
    blit (value: Blit): void {}
    dispatch (value: Dispatch): void {}
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
        // assert(g.holds(RenderGraphValue.RasterPass, v)
        //     || g.holds(RenderGraphValue.Compute, v)
        //     || g.holds(RenderGraphValue.Copy, v)
        //     || g.holds(RenderGraphValue.Move, v)
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
