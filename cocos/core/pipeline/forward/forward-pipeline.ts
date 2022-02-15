/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 */

/**
 * @packageDocumentation
 * @module pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { RenderPipeline, IRenderPipelineInfo } from '../render-pipeline';
import { ForwardFlow } from './forward-flow';
import { RenderTextureConfig } from '../pipeline-serialization';
import { ShadowFlow } from '../shadow/shadow-flow';
import { UBOGlobal, UBOShadow, UBOCamera, UNIFORM_SHADOWMAP_BINDING, UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING } from '../define';
import { Swapchain, RenderPass } from '../../gfx';
import { builtinResMgr } from '../../builtin';
import { Texture2D } from '../../assets/texture-2d';
import { Camera } from '../../renderer/scene';
import { errorID } from '../../platform/debug';
import { PipelineSceneData } from '../pipeline-scene-data';
import { RenderGraph } from '../custom/render-graph';
import { LayoutGraph } from '../custom/layout-graph';
import { DeviceResourceGraph } from '../custom/executor';
import { Pipeline } from '../custom/pipeline';

const PIPELINE_TYPE = 0;

/**
 * @en The forward render pipeline
 * @zh 前向渲染管线。
 */
@ccclass('ForwardPipeline')
export class ForwardPipeline extends RenderPipeline {
    @type([RenderTextureConfig])
    @serializable
    @displayOrder(2)
    protected renderTextures: RenderTextureConfig[] = [];

    protected _postRenderPass: RenderPass | null = null;

    public get postRenderPass (): RenderPass | null {
        return this._postRenderPass;
    }

    public initialize (info: IRenderPipelineInfo): boolean {
        super.initialize(info);

        if (this._flows.length === 0) {
            const shadowFlow = new ShadowFlow();
            shadowFlow.initialize(ShadowFlow.initInfo);
            this._flows.push(shadowFlow);

            const forwardFlow = new ForwardFlow();
            forwardFlow.initialize(ForwardFlow.initInfo);
            this._flows.push(forwardFlow);
        }

        return true;
    }

    public activate (swapchain: Swapchain): boolean {
        if (EDITOR) { console.info('Forward render pipeline initialized.'); }

        this._macros = { CC_PIPELINE_TYPE: PIPELINE_TYPE };
        this._pipelineSceneData = new PipelineSceneData();

        if (!super.activate(swapchain)) {
            return false;
        }

        if (!this._activeRenderer(swapchain)) {
            errorID(2402);
            return false;
        }

        return true;
    }

    protected _ensureEnoughSize (cameras: Camera[]) {
        let newWidth = this._width;
        let newHeight = this._height;
        for (let i = 0; i < cameras.length; ++i) {
            const window = cameras[i].window;
            newWidth = Math.max(window.width, newWidth);
            newHeight = Math.max(window.height, newHeight);
        }
        if (newWidth !== this._width || newHeight !== this._height) {
            this._width = newWidth;
            this._height = newHeight;
        }
    }

    public destroy () {
        this._destroyUBOs();
        this._destroyQuadInputAssembler();
        const rpIter = this._renderPasses.values();
        let rpRes = rpIter.next();
        while (!rpRes.done) {
            rpRes.value.destroy();
            rpRes = rpIter.next();
        }

        this._commandBuffers.length = 0;

        return super.destroy();
    }

    private _activeRenderer (swapchain: Swapchain) {
        const device = this.device;

        this._commandBuffers.push(device.commandBuffer);

        const shadowMapSampler = this.globalDSManager.pointSampler;
        this._descriptorSet.bindSampler(UNIFORM_SHADOWMAP_BINDING, shadowMapSampler);
        this._descriptorSet.bindTexture(UNIFORM_SHADOWMAP_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this._descriptorSet.bindSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, shadowMapSampler);
        this._descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this._descriptorSet.update();

        return true;
    }

    private _destroyUBOs () {
        if (this._descriptorSet) {
            this._descriptorSet.getBuffer(UBOGlobal.BINDING).destroy();
            this._descriptorSet.getBuffer(UBOShadow.BINDING).destroy();
            this._descriptorSet.getBuffer(UBOCamera.BINDING).destroy();
            this._descriptorSet.getTexture(UNIFORM_SHADOWMAP_BINDING).destroy();
            this._descriptorSet.getTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING).destroy();
        }
    }
}
