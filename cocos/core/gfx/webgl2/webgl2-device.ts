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

import { DescriptorSet } from '../base/descriptor-set';
import { DescriptorSetLayout } from '../base/descriptor-set-layout';
import { PipelineLayout } from '../base/pipeline-layout';
import { Buffer } from '../base/buffer';
import { CommandBuffer } from '../base/command-buffer';
import { Device } from '../base/device';
import { Framebuffer } from '../base/framebuffer';
import { InputAssembler } from '../base/input-assembler';
import { PipelineState, PipelineStateInfo } from '../base/pipeline-state';
import { Queue } from '../base/queue';
import { RenderPass } from '../base/render-pass';
import { Sampler } from '../base/states/sampler';
import { Shader } from '../base/shader';
import { Texture } from '../base/texture';
import { WebGL2DescriptorSet } from './webgl2-descriptor-set';
import { WebGL2Buffer } from './webgl2-buffer';
import { WebGL2CommandBuffer } from './webgl2-command-buffer';
import { WebGL2Framebuffer } from './webgl2-framebuffer';
import { WebGL2InputAssembler } from './webgl2-input-assembler';
import { WebGL2DescriptorSetLayout } from './webgl2-descriptor-set-layout';
import { WebGL2PipelineLayout } from './webgl2-pipeline-layout';
import { WebGL2PipelineState } from './webgl2-pipeline-state';
import { WebGL2PrimaryCommandBuffer } from './webgl2-primary-command-buffer';
import { WebGL2Queue } from './webgl2-queue';
import { WebGL2RenderPass } from './webgl2-render-pass';
import { WebGL2Sampler } from './states/webgl2-sampler';
import { WebGL2Shader } from './webgl2-shader';
import { WebGL2Swapchain, getExtensions } from './webgl2-swapchain';
import { WebGL2Texture } from './webgl2-texture';
import {
    CommandBufferType, DescriptorSetLayoutInfo, DescriptorSetInfo,
    PipelineLayoutInfo, BufferViewInfo, CommandBufferInfo, BufferInfo, FramebufferInfo, InputAssemblerInfo,
    QueueInfo, RenderPassInfo, SamplerInfo, ShaderInfo, TextureInfo, TextureViewInfo, DeviceInfo, GlobalBarrierInfo, TextureBarrierInfo,
    QueueType, API, Feature, BufferTextureCopy, SwapchainInfo,
} from '../base/define';
import { WebGL2CmdFuncCopyTextureToBuffers, WebGL2CmdFuncCopyBuffersToTexture, WebGL2CmdFuncCopyTexImagesToTexture } from './webgl2-commands';
import { GlobalBarrier } from '../base/states/global-barrier';
import { TextureBarrier } from '../base/states/texture-barrier';
import { debug } from '../../platform/debug';
import { Swapchain } from '../base/swapchain';
import { WebGL2DeviceManager } from './webgl2-define';

export class WebGL2Device extends Device {
    get gl () {
        return this._swapchain!.gl;
    }

    get extensions () {
        return this._swapchain!.extensions;
    }

    get stateCache () {
        return this._swapchain!.stateCache;
    }

    get nullTex2D () {
        return this._swapchain!.nullTex2D;
    }

    get nullTexCube () {
        return this._swapchain!.nullTexCube;
    }

    private _swapchain: WebGL2Swapchain | null = null;

    public initialize (info: DeviceInfo): boolean {
        WebGL2DeviceManager.setInstance(this);
        this._gfxAPI = API.WEBGL2;

        this._bindingMappingInfo = info.bindingMappingInfo;
        if (!this._bindingMappingInfo.bufferOffsets.length) this._bindingMappingInfo.bufferOffsets.push(0);
        if (!this._bindingMappingInfo.samplerOffsets.length) this._bindingMappingInfo.samplerOffsets.push(0);

        let gl: WebGL2RenderingContext | null = null;

        try {
            gl = document.createElement('canvas').getContext('webgl2');
        } catch (err) {
            console.error(err);
        }

        if (!gl) {
            console.error('This device does not support WebGL.');
            return false;
        }

        // create queue
        this._queue = this.createQueue(new QueueInfo(QueueType.GRAPHICS));
        this._cmdBuff = this.createCommandBuffer(new CommandBufferInfo(this._queue));

        this._caps.maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        this._caps.maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
        this._caps.maxFragmentUniformVectors = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
        this._caps.maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        this._caps.maxVertexTextureUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        this._caps.maxUniformBufferBindings = gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS);
        this._caps.maxUniformBlockSize = gl.getParameter(gl.MAX_UNIFORM_BLOCK_SIZE);
        this._caps.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this._caps.maxCubeMapTextureSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        this._caps.uboOffsetAlignment = gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT);

        const extensions = gl.getSupportedExtensions();
        let extStr = '';
        if (extensions) {
            for (const ext of extensions) {
                extStr += `${ext} `;
            }
        }

        const exts = getExtensions(gl);

        if (exts.WEBGL_debug_renderer_info) {
            this._renderer = gl.getParameter(exts.WEBGL_debug_renderer_info.UNMASKED_RENDERER_WEBGL);
            this._vendor = gl.getParameter(exts.WEBGL_debug_renderer_info.UNMASKED_VENDOR_WEBGL);
        } else {
            this._renderer = gl.getParameter(gl.RENDERER);
            this._vendor = gl.getParameter(gl.VENDOR);
        }

        const version: string = gl.getParameter(gl.VERSION);

        this._features.fill(false);
        this._features[Feature.TEXTURE_FLOAT] = true;
        this._features[Feature.TEXTURE_HALF_FLOAT] = true;
        this._features[Feature.FORMAT_R11G11B10F] = true;
        this._features[Feature.FORMAT_SRGB] = true;
        this._features[Feature.FORMAT_RGB8] = true;
        this._features[Feature.ELEMENT_INDEX_UINT] = true;
        this._features[Feature.INSTANCED_ARRAYS] = true;
        this._features[Feature.MULTIPLE_RENDER_TARGETS] = true;
        this._features[Feature.BLEND_MINMAX] = true;

        if (exts.EXT_color_buffer_float) {
            this._features[Feature.COLOR_FLOAT] = true;
            this._features[Feature.COLOR_HALF_FLOAT] = true;
        }

        if (exts.OES_texture_float_linear) {
            this._features[Feature.TEXTURE_FLOAT_LINEAR] = true;
        }

        if (exts.OES_texture_half_float_linear) {
            this._features[Feature.TEXTURE_HALF_FLOAT_LINEAR] = true;
        }

        let compressedFormat = '';

        if (exts.WEBGL_compressed_texture_etc1) {
            this._features[Feature.FORMAT_ETC1] = true;
            compressedFormat += 'etc1 ';
        }

        if (exts.WEBGL_compressed_texture_etc) {
            this._features[Feature.FORMAT_ETC2] = true;
            compressedFormat += 'etc2 ';
        }

        if (exts.WEBGL_compressed_texture_s3tc) {
            this._features[Feature.FORMAT_DXT] = true;
            compressedFormat += 'dxt ';
        }

        if (exts.WEBGL_compressed_texture_pvrtc) {
            this._features[Feature.FORMAT_PVRTC] = true;
            compressedFormat += 'pvrtc ';
        }

        if (exts.WEBGL_compressed_texture_astc) {
            this._features[Feature.FORMAT_ASTC] = true;
            compressedFormat += 'astc ';
        }

        debug('WebGL2 device initialized.');
        debug(`RENDERER: ${this._renderer}`);
        debug(`VENDOR: ${this._vendor}`);
        debug(`VERSION: ${version}`);
        debug(`COMPRESSED_FORMAT: ${compressedFormat}`);
        debug(`EXTENSIONS: ${extStr}`);

        return true;
    }

    public destroy (): void {
        if (this._queue) {
            this._queue.destroy();
            this._queue = null;
        }

        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }

        const it = this._samplers.values();
        let res = it.next();
        while (!res.done) {
            (res.value as WebGL2Sampler).destroy();
            res = it.next();
        }

        this._swapchain = null;
    }

    public flushCommands (cmdBuffs: CommandBuffer[]) {}

    public acquire (swapchains: Swapchain[]) {}

    public present () {
        const queue = (this._queue as WebGL2Queue);
        this._numDrawCalls = queue.numDrawCalls;
        this._numInstances = queue.numInstances;
        this._numTris = queue.numTris;
        queue.clear();
    }

    public createCommandBuffer (info: CommandBufferInfo): CommandBuffer {
        // const Ctor = WebGLCommandBuffer; // opt to instant invocation
        const Ctor = info.type === CommandBufferType.PRIMARY ? WebGL2PrimaryCommandBuffer : WebGL2CommandBuffer;
        const cmdBuff = new Ctor();
        if (cmdBuff.initialize(info)) {
            return cmdBuff;
        }
        return null!;
    }

    public createSwapchain (info: SwapchainInfo): Swapchain {
        const swapchain = new WebGL2Swapchain();
        this._swapchain = swapchain;
        if (swapchain.initialize(info)) {
            return swapchain;
        }
        return null!;
    }

    public createBuffer (info: BufferInfo | BufferViewInfo): Buffer {
        const buffer = new WebGL2Buffer();
        if (buffer.initialize(info)) {
            return buffer;
        }
        return null!;
    }

    public createTexture (info: TextureInfo | TextureViewInfo): Texture {
        const texture = new WebGL2Texture();
        if (texture.initialize(info)) {
            return texture;
        }
        return null!;
    }

    public createDescriptorSet (info: DescriptorSetInfo): DescriptorSet {
        const descriptorSet = new WebGL2DescriptorSet();
        if (descriptorSet.initialize(info)) {
            return descriptorSet;
        }
        return null!;
    }

    public createShader (info: ShaderInfo): Shader {
        const shader = new WebGL2Shader();
        if (shader.initialize(info)) {
            return shader;
        }
        return null!;
    }

    public createInputAssembler (info: InputAssemblerInfo): InputAssembler {
        const inputAssembler = new WebGL2InputAssembler();
        if (inputAssembler.initialize(info)) {
            return inputAssembler;
        }
        return null!;
    }

    public createRenderPass (info: RenderPassInfo): RenderPass {
        const renderPass = new WebGL2RenderPass();
        if (renderPass.initialize(info)) {
            return renderPass;
        }
        return null!;
    }

    public createFramebuffer (info: FramebufferInfo): Framebuffer {
        const framebuffer = new WebGL2Framebuffer();
        if (framebuffer.initialize(info)) {
            return framebuffer;
        }
        return null!;
    }

    public createDescriptorSetLayout (info: DescriptorSetLayoutInfo): DescriptorSetLayout {
        const descriptorSetLayout = new WebGL2DescriptorSetLayout();
        if (descriptorSetLayout.initialize(info)) {
            return descriptorSetLayout;
        }
        return null!;
    }

    public createPipelineLayout (info: PipelineLayoutInfo): PipelineLayout {
        const pipelineLayout = new WebGL2PipelineLayout();
        if (pipelineLayout.initialize(info)) {
            return pipelineLayout;
        }
        return null!;
    }

    public createPipelineState (info: PipelineStateInfo): PipelineState {
        const pipelineState = new WebGL2PipelineState();
        if (pipelineState.initialize(info)) {
            return pipelineState;
        }
        return null!;
    }

    public createQueue (info: QueueInfo): Queue {
        const queue = new WebGL2Queue();
        if (queue.initialize(info)) {
            return queue;
        }
        return null!;
    }

    public getSampler (info: SamplerInfo): Sampler {
        const hash = Sampler.computeHash(info);
        if (!this._samplers.has(hash)) {
            this._samplers.set(hash, new WebGL2Sampler(info));
        }
        return this._samplers.get(hash)!;
    }

    public getGlobalBarrier (info: GlobalBarrierInfo) {
        const hash = GlobalBarrier.computeHash(info);
        if (!this._globalBarriers.has(hash)) {
            this._globalBarriers.set(hash, new GlobalBarrier(info));
        }
        return this._globalBarriers.get(hash)!;
    }

    public getTextureBarrier (info: TextureBarrierInfo) {
        const hash = TextureBarrier.computeHash(info);
        if (!this._textureBarriers.has(hash)) {
            this._textureBarriers.set(hash, new TextureBarrier(info));
        }
        return this._textureBarriers.get(hash)!;
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]) {
        WebGL2CmdFuncCopyBuffersToTexture(
            this,
            buffers,
            (texture as WebGL2Texture).gpuTexture,
            regions,
        );
    }

    public copyTextureToBuffers (texture: Texture, buffers: ArrayBufferView[], regions: BufferTextureCopy[]) {
        WebGL2CmdFuncCopyTextureToBuffers(
            this,
            (texture as WebGL2Texture).gpuTexture,
            buffers,
            regions,
        );
    }

    public copyTexImagesToTexture (
        texImages: TexImageSource[],
        texture: Texture,
        regions: BufferTextureCopy[],
    ) {
        WebGL2CmdFuncCopyTexImagesToTexture(
            this,
            texImages,
            (texture as WebGL2Texture).gpuTexture,
            regions,
        );
    }
}
