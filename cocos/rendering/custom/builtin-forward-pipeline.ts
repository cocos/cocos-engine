/*
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

import { ClearFlagBit, Color, Format, LoadOp, StoreOp, Viewport } from '../../gfx/base/define';
import { RenderWindow } from '../../render-scene/core/render-window';
import { Camera } from '../../render-scene/scene/camera';
import { BasicPipeline, PipelineBuilder } from './pipeline';
import { QueueHint, SceneFlags } from './types';

function forwardNeedClearColor (camera: Camera): boolean {
    return !!(camera.clearFlag & (ClearFlagBit.COLOR | (ClearFlagBit.STENCIL << 1)));
}

export class BuiltinForwardPipeline implements PipelineBuilder {
    gameWindowResize (ppl: BasicPipeline, renderWindow: RenderWindow, width: number, height: number): void {
        // console.log(`BuiltinForwardPipeline.gameWindowResize(${width}, ${height})`);
        ppl.addRenderWindow(renderWindow.colorName, Format.BGRA8, width, height, renderWindow);
        ppl.addDepthStencil(renderWindow.depthStencilName, Format.DEPTH_STENCIL, width, height);
    }
    setup (cameras: Camera[], pipeline: BasicPipeline): void {
        for (const camera of cameras) {
            this.buildForward(pipeline, camera);
        }
    }
    // build forward lighting pipeline
    private buildForward (
        ppl: BasicPipeline,
        camera: Camera,
    ): void {
        const width = camera.window.width;
        const height = camera.window.height;

        // prepare camera clear color
        this._clearColor.x = camera.clearColor.x;
        this._clearColor.y = camera.clearColor.y;
        this._clearColor.z = camera.clearColor.z;
        this._clearColor.w = camera.clearColor.w;

        // prepare camera viewport
        this._viewport.left = camera.viewport.x * width;
        this._viewport.top = camera.viewport.y * height;
        this._viewport.width = camera.viewport.z * width;
        this._viewport.height = camera.viewport.w * height;

        const colorName = camera.window.colorName;
        const depthStencilName = camera.window.depthStencilName;

        // Forward Lighting
        const pass = ppl.addRenderPass(width, height, 'default');

        // set viewport
        pass.setViewport(this._viewport);

        // bind output render target
        if (forwardNeedClearColor(camera)) {
            pass.addRenderTarget(colorName, LoadOp.CLEAR, StoreOp.STORE, this._clearColor);
        } else {
            pass.addRenderTarget(colorName, LoadOp.LOAD);
        }

        // bind depth stencil buffer
        if (camera.clearFlag & ClearFlagBit.DEPTH_STENCIL) {
            pass.addDepthStencil(
                depthStencilName,
                LoadOp.CLEAR,
                StoreOp.STORE,
                camera.clearDepth,
                camera.clearStencil,
                camera.clearFlag & ClearFlagBit.DEPTH_STENCIL,
            );
        } else {
            pass.addDepthStencil(depthStencilName, LoadOp.LOAD);
        }
        // add opaque and mask queue
        pass.addQueue(QueueHint.NONE)
            .addScene(
                camera,
                SceneFlags.OPAQUE | SceneFlags.MASK,
            );
        // add transparent queue
        pass.addQueue(QueueHint.BLEND)
            .addScene(
                camera,
                SceneFlags.BLEND,
            );
    }

    // internal cached resources
    readonly _clearColor = new Color(0, 0, 0, 1);
    readonly _viewport = new Viewport();
}
