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

import { ColorAttachment, DepthStencilAttachment, deviceManager, Rect, RenderPassInfo, StoreOp } from '../../gfx';
import { IRenderStageInfo, RenderStage } from '../../rendering/render-stage';
import { ForwardStagePriority } from '../../rendering/enum';
import { ForwardFlow } from '../../rendering/forward/forward-flow';
import { ForwardPipeline } from '../../rendering/forward/forward-pipeline';
import { Camera, CameraProjection } from '../../render-scene/scene';
import { WebGL2Device } from '../../gfx/webgl2/webgl2-device';
import { cclegacy } from '../../core';
import { Root } from '../../root';
import { RenderWindow } from '../../render-scene/core/render-window';
import { WebGL2Framebuffer } from '../../gfx/webgl2/webgl2-framebuffer';

const layerList = {
    NONE: 0,
    IGNORE_RAYCAST: (1 << 20),
    GIZMOS: (1 << 21),
    EDITOR: (1 << 22),
    UI_3D: (1 << 23),
    SCENE_GIZMO: (1 << 24),
    UI_2D: (1 << 25),

    PROFILER: (1 << 28),
    DEFAULT: (1 << 30),
    ALL: 0xffffffff,
};

export class ARBackgroundStage extends RenderStage {
    public static initInfo: IRenderStageInfo = {
        name: 'ARStage',
        priority: ForwardStagePriority.AR,
        tag: 0,
    };

    private _updateStateFlag = false;
    private _xrWindowSetFlag = false;
    private _uiWindowSetFlag = false;

    private _xrWindow : RenderWindow | null = null;

    constructor () {
        super();
    }

    public initialize (info: IRenderStageInfo): boolean {
        super.initialize(info);
        return true;
    }

    public activate (pipeline: ForwardPipeline, flow: ForwardFlow) {
        super.activate(pipeline, flow);
    }

    public destroy () {
    }

    public render (camera: Camera) {
        const armodule = globalThis.__globalXR.ar;
        if (!armodule) return;

        const state = armodule.getAPIState();
        if (state < 0) return;

        const pipeline = this._pipeline as ForwardPipeline;

        if (state === 3) { // webxr need add ui camera process, TODO: Need move to ar-module
            const device = pipeline.device;
            if (!this._updateStateFlag) {
                const { gl } = device as WebGL2Device;

                armodule.updateRenderState(gl as any);
                this._updateStateFlag = true;
            }

            if (this._updateStateFlag) {
                const xrgpuframebuffer = armodule.getXRLayerFrameBuffer();
                const viewport = armodule.getViewport();
                if (!xrgpuframebuffer || !viewport) return;

                if (!this._xrWindow) {
                    const root = cclegacy.director.root as Root;
                    const swapchain = deviceManager.swapchain;

                    const colorAttachment = new ColorAttachment();
                    colorAttachment.format = swapchain.colorTexture.format;
                    const depthStencilAttachment = new DepthStencilAttachment();
                    depthStencilAttachment.format = swapchain.depthStencilTexture.format;
                    depthStencilAttachment.depthStoreOp = StoreOp.DISCARD;
                    depthStencilAttachment.stencilStoreOp = StoreOp.DISCARD;
                    const renderPassInfo = new RenderPassInfo([colorAttachment], depthStencilAttachment);

                    this._xrWindow = root.createWindow({
                        title: 'xrWindow',
                        width: viewport.width,
                        height: viewport.height,
                        renderPassInfo,
                        swapchain,
                    });
                    const webGL2FBO = this._xrWindow?.framebuffer as WebGL2Framebuffer;
                    webGL2FBO.gpuFramebuffer.glFramebuffer = xrgpuframebuffer;
                }

                if (!this._xrWindowSetFlag && (armodule.CameraId === camera.node.uuid)) {
                    camera.changeTargetWindow(this._xrWindow);
                    this._xrWindowSetFlag = true;
                }

                // ui camera process
                if (!this._uiWindowSetFlag && camera.projectionType === CameraProjection.ORTHO
                    && (camera.visibility & layerList.UI_2D || camera.visibility & layerList.UI_3D)) {
                    camera.changeTargetWindow(this._xrWindow);
                    this._uiWindowSetFlag = true;
                }
            }
        }
    }
}
