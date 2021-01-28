/*
 Copyright (c) Huawei Technologies Co., Ltd. 2020-2021.

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
 * @category pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { RenderPipeline, IRenderPipelineInfo } from '../render-pipeline';
import { GbufferFlow } from './gbuffer-flow';
import { LightingFlow } from './lighting-flow';
import { RenderTextureConfig, MaterialConfig } from '../pipeline-serialization';
import { ShadowFlow } from '../shadow/shadow-flow';
import { BufferUsageBit, Format, MemoryUsageBit, ClearFlag, StoreOp, Filter, Address, SurfaceTransform} from '../../gfx/define';
import { UBOGlobal, UBOCamera, UBOShadow, UNIFORM_SHADOWMAP_BINDING, UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING } from '../define';
import { ColorAttachment, DepthStencilAttachment, RenderPass, LoadOp, TextureLayout, RenderPassInfo, BufferInfo, Texture} from '../../gfx';
import { SKYBOX_FLAG } from '../../renderer/scene/camera';
import { Feature } from '../../gfx/define';
import { InputAssembler, InputAssemblerInfo, Attribute } from '../../gfx/input-assembler';
import { Buffer } from '../../gfx/buffer';
import { Camera } from '../../renderer/scene';
import { genSamplerHash, samplerLib } from 'cocos/core/renderer/core/sampler-lib';
import { builtinResMgr } from 'cocos/core/builtin';
import { Texture2D } from 'cocos/core/assets/texture-2d';

const _samplerInfo = [
    Filter.LINEAR,
    Filter.LINEAR,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
];

class InputAssemblerData {
    quadIB: Buffer|null = null;
    quadVB: Buffer|null = null;
    quadIA: InputAssembler|null = null;
}

/**
 * @en The deferred render pipeline
 * @zh 前向渲染管线。
 */
@ccclass('DeferredPipeline')
export class DeferredPipeline extends RenderPipeline {
    protected _quadIB: Buffer | null = null;
    protected _quadVBOnscreen: Buffer | null = null;
    protected _quadVBOffscreen: Buffer | null = null;
    protected _quadIAOnscreen: InputAssembler | null = null;
    protected _quadIAOffscreen: InputAssembler | null = null;
    protected _gbufferDepth: Texture|null = null;

    @type([RenderTextureConfig])
    @serializable
    @displayOrder(2)
    protected renderTextures: RenderTextureConfig[] = [];

    @type([MaterialConfig])
    @serializable
    @displayOrder(3)
    protected materials: MaterialConfig[] = [];
    protected _renderPasses = new Map<ClearFlag, RenderPass>();

    /**
     * @zh
     * 四边形输入汇集器。
     */
    public get quadIAOnscreen (): InputAssembler {
        return this._quadIAOnscreen!;
    }

    public get quadIAOffscreen (): InputAssembler {
        return this._quadIAOffscreen!;
    }

    get gbufferDepth() {
        return this._gbufferDepth;
    }

    set gbufferDepth(val) {
        this._gbufferDepth = val;
    }

    public initialize (info: IRenderPipelineInfo): boolean {
        super.initialize(info);

        if (this._flows.length === 0) {
            const shadowFlow = new ShadowFlow();
            shadowFlow.initialize(ShadowFlow.initInfo);
            this._flows.push(shadowFlow);

            const gbufferFlow = new GbufferFlow();
            gbufferFlow.initialize(GbufferFlow.initInfo);
            this._flows.push(gbufferFlow);

            const lightingFlow = new LightingFlow();
            lightingFlow.initialize(LightingFlow.initInfo);
            this._flows.push(lightingFlow);
        }

        return true;
    }

    public activate (): boolean {
        this._macros = {};

        if (!super.activate()) {
            return false;
        }

        if (!this._activeRenderer()) {
            console.error('DeferredPipeline startup failed!');
            return false;
        }

        return true;
    }

    public render (cameras: Camera[]) {
        if (cameras.length == 0) {
            return;
        }

        this._commandBuffers[0].begin();
        this._pipelineUBO.updateGlobalUBO();
        const camera = cameras[0];
        if (camera.scene) {
            this._pipelineUBO.updateCameraUBO(camera, true);
            for (let j = 0; j < this._flows.length; j++) {
                this._flows[j].render(camera);
            }
        }
        this._commandBuffers[0].end();
        this._device.queue.submit(this._commandBuffers);
    }

    public getRenderPass (clearFlags: ClearFlag): RenderPass {
        let renderPass = this._renderPasses.get(clearFlags);
        if (renderPass) { return renderPass; }

        const device = this.device;
        const colorAttachment = new ColorAttachment();
        const depthStencilAttachment = new DepthStencilAttachment();
        colorAttachment.format = device.colorFormat;
        depthStencilAttachment.format = device.depthStencilFormat;
        depthStencilAttachment.stencilStoreOp = StoreOp.DISCARD;
        depthStencilAttachment.depthStoreOp = StoreOp.DISCARD;

        if (!(clearFlags & ClearFlag.COLOR)) {
            if (clearFlags & SKYBOX_FLAG) {
                colorAttachment.loadOp = LoadOp.DISCARD;
            } else {
                colorAttachment.loadOp = LoadOp.LOAD;
                colorAttachment.beginLayout = TextureLayout.PRESENT_SRC;
            }
        }

        if ((clearFlags & ClearFlag.DEPTH_STENCIL) !== ClearFlag.DEPTH_STENCIL) {
            if (!(clearFlags & ClearFlag.DEPTH)) depthStencilAttachment.depthLoadOp = LoadOp.LOAD;
            if (!(clearFlags & ClearFlag.STENCIL)) depthStencilAttachment.stencilLoadOp = LoadOp.LOAD;
            depthStencilAttachment.beginLayout = TextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
        }

        const renderPassInfo = new RenderPassInfo([colorAttachment], depthStencilAttachment);
        renderPass = device.createRenderPass(renderPassInfo);
        this._renderPasses.set(clearFlags, renderPass);

        return renderPass;
    }

    private _activeRenderer () {
        const device = this.device;

        this._commandBuffers.push(device.commandBuffer);

        const shadowMapSamplerHash = genSamplerHash(_samplerInfo);
        const shadowMapSampler = samplerLib.getSampler(device, shadowMapSamplerHash);
        this._descriptorSet.bindSampler(UNIFORM_SHADOWMAP_BINDING, shadowMapSampler);
        this._descriptorSet.bindTexture(UNIFORM_SHADOWMAP_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this._descriptorSet.bindSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, shadowMapSampler);
        this._descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this._descriptorSet.update();

        // update global defines when all states initialized.
        this.macros.CC_USE_HDR = this._pipelineSceneData.isHDR;
        this.macros.CC_SUPPORT_FLOAT_TEXTURE = this.device.hasFeature(Feature.TEXTURE_FLOAT);
        
        var inputAssemblerDataOffscreen = new InputAssemblerData;
        inputAssemblerDataOffscreen = this.createQuadInputAssembler(SurfaceTransform.IDENTITY);
        if (!inputAssemblerDataOffscreen.quadIB || !inputAssemblerDataOffscreen.quadVB || !inputAssemblerDataOffscreen.quadIA) {
            return false;
        }
        this._quadIB = inputAssemblerDataOffscreen.quadIB;
        this._quadVBOffscreen =  inputAssemblerDataOffscreen.quadVB;
        this._quadIAOffscreen =  inputAssemblerDataOffscreen.quadIA;

        var inputAssemblerDataOnscreen = new InputAssemblerData;
        inputAssemblerDataOnscreen = this.createQuadInputAssembler(device.surfaceTransform);
        if (!inputAssemblerDataOnscreen.quadIB || !inputAssemblerDataOnscreen.quadVB || !inputAssemblerDataOnscreen.quadIA) {
            return false;
        }
        this._quadVBOnscreen =  inputAssemblerDataOnscreen.quadVB;
        this._quadIAOnscreen =  inputAssemblerDataOnscreen.quadIA;

        return true;
    }

    private destroyUBOs () {
        if (this._descriptorSet) {
            this._descriptorSet.getBuffer(UBOGlobal.BINDING).destroy();
            this._descriptorSet.getBuffer(UBOShadow.BINDING).destroy();
            this._descriptorSet.getBuffer(UBOCamera.BINDING).destroy();
            this._descriptorSet.getSampler(UNIFORM_SHADOWMAP_BINDING).destroy();
            this._descriptorSet.getSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING).destroy();
            this._descriptorSet.getTexture(UNIFORM_SHADOWMAP_BINDING).destroy();
            this._descriptorSet.getTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING).destroy();
        }
    }

    public destroy () {
        this.destroyUBOs();
        this.destroyQuadInputAssembler();

        const rpIter = this._renderPasses.values();
        let rpRes = rpIter.next();
        while (!rpRes.done) {
            rpRes.value.destroy();
            rpRes = rpIter.next();
        }

        this._commandBuffers.length = 0;

        return super.destroy();
    }

    /**
     * @zh
     * 创建四边形输入汇集器。
     */
    protected createQuadInputAssembler (surfaceTransform: SurfaceTransform): InputAssemblerData {

        // create vertex buffer
        var inputAssemblerData = new InputAssemblerData;

        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;

        var quadVB = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            vbSize,
            vbStride,
        ));

        if (!quadVB) {
            return inputAssemblerData;
        }

        const vbData = new Float32Array(4 * 4);

        let n = 0;
        switch (surfaceTransform) {
            case (SurfaceTransform.IDENTITY):
                n = 0;
                vbData[n++] = -1.0; vbData[n++] = -1.0; vbData[n++] = 0.0; vbData[n++] = 1.0;
                vbData[n++] = 1.0; vbData[n++] = -1.0; vbData[n++] = 1.0; vbData[n++] = 1.0;
                vbData[n++] = -1.0; vbData[n++] = 1.0; vbData[n++] = 0.0; vbData[n++] = 0.0;
                vbData[n++] = 1.0; vbData[n++] = 1.0; vbData[n++] = 1.0; vbData[n++] = 0.0;
                break;
            case (SurfaceTransform.ROTATE_90): 
                n = 0;
                vbData[n++] = -1.0; vbData[n++] = -1.0; vbData[n++] = 1.0; vbData[n++] = 1.0;
                vbData[n++] = 1.0; vbData[n++] = -1.0; vbData[n++] = 1.0; vbData[n++] = 0.0;
                vbData[n++] = -1.0; vbData[n++] = 1.0; vbData[n++] = 0.0; vbData[n++] = 1.0;
                vbData[n++] = 1.0; vbData[n++] = 1.0; vbData[n++] = 0.0; vbData[n++] = 0.0;
                break;
            case (SurfaceTransform.ROTATE_180):
                n = 0;
                vbData[n++] = -1.0; vbData[n++] = -1.0; vbData[n++] = 0.0; vbData[n++] = 0.0;
                vbData[n++] = 1.0; vbData[n++] = -1.0; vbData[n++] = 1.0; vbData[n++] = 0.0;
                vbData[n++] = -1.0; vbData[n++] = 1.0; vbData[n++] = 0.0; vbData[n++] = 1.0;
                vbData[n++] = 1.0; vbData[n++] = 1.0; vbData[n++] = 1.0; vbData[n++] = 1.0;
                break;
            case (SurfaceTransform.ROTATE_270):
                n = 0;
                vbData[n++] = -1.0; vbData[n++] = -1.0; vbData[n++] = 0.0; vbData[n++] = 0.0;
                vbData[n++] = 1.0; vbData[n++] = -1.0; vbData[n++] = 0.0; vbData[n++] = 1.0;
                vbData[n++] = -1.0; vbData[n++] = 1.0; vbData[n++] = 1.0; vbData[n++] = 0.0;
                vbData[n++] = 1.0; vbData[n++] = 1.0; vbData[n++] = 1.0; vbData[n++] = 1.0;
                break;
            default:
                break;
        }

        quadVB.update(vbData);

        // create index buffer
        const ibStride = Uint8Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        var quadIB = this._device.createBuffer(new BufferInfo( 
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            ibSize,
            ibStride,
        ));

        if (!quadIB) {
            return inputAssemblerData;
        }

        const indices = new Uint8Array(6);
        indices[0] = 0; indices[1] = 1; indices[2] = 2;
        indices[3] = 1; indices[4] = 3; indices[5] = 2;

        quadIB.update(indices);

        // create input assembler

        const attributes = new Array<Attribute>(2);
        attributes[0] = new Attribute('a_position', Format.RG32F);
        attributes[1] = new Attribute('a_texCoord', Format.RG32F);

        var quadIA = this._device.createInputAssembler(new InputAssemblerInfo(
            attributes,
            [quadVB],
            quadIB,
        ));

        inputAssemblerData.quadIB = quadIB;
        inputAssemblerData.quadVB = quadVB;
        inputAssemblerData.quadIA = quadIA;
        return inputAssemblerData;
    }

    /**
     * @zh
     * 销毁四边形输入汇集器。
     */
    protected destroyQuadInputAssembler () {
        if (this._quadIB) {
            this._quadIB.destroy();
            this._quadIB = null;
        }

        if (this._quadVBOnscreen) {
            this._quadVBOnscreen.destroy();
            this._quadVBOnscreen = null;
        }

        if (this._quadVBOffscreen) {
            this._quadVBOffscreen.destroy();
            this._quadVBOffscreen = null;
        }

        if (this._quadIAOnscreen) {
            this._quadIAOnscreen.destroy();
            this._quadIAOnscreen = null;
        }

        if (this._quadIAOffscreen) {
            this._quadIAOffscreen.destroy();
            this._quadIAOffscreen = null;
        }
    }
}
