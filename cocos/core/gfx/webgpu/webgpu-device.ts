import { macro, warnID, warn } from '../../platform';
import { GFXDescriptorSet, GFXDescriptorSetInfo } from '../descriptor-set';
import { GFXBuffer, GFXBufferInfo, GFXBufferViewInfo } from '../buffer';
import { GFXCommandBuffer, GFXCommandBufferInfo } from '../command-buffer';
import { GFXDevice, GFXDeviceInfo, GFXBindingMappingInfo } from '../device';
import { GFXFence, GFXFenceInfo } from '../fence';
import { GFXFramebuffer, GFXFramebufferInfo } from '../framebuffer';
import { GFXInputAssembler, GFXInputAssemblerInfo } from '../input-assembler';
import { GFXPipelineState, GFXPipelineStateInfo } from '../pipeline-state';
import { GFXQueue, GFXQueueInfo } from '../queue';
import { GFXRenderPass, GFXRenderPassInfo } from '../render-pass';
import { GFXSampler, GFXSamplerInfo } from '../sampler';
import { GFXShader, GFXShaderInfo } from '../shader';
import { GFXPipelineLayout, GFXPipelineLayoutInfo } from '../pipeline-layout';
import { GFXDescriptorSetLayout, GFXDescriptorSetLayoutInfo } from '../descriptor-set-layout';
import { GFXTexture, GFXTextureInfo, GFXTextureViewInfo } from '../texture';
import { WebGPUDescriptorSet } from './WebGPU-descriptor-set';
import { WebGPUBuffer } from './WebGPU-buffer';
import { WebGPUCommandBuffer } from './WebGPU-command-buffer';
import { WebGPUFence } from './WebGPU-fence';
import { WebGPUFramebuffer } from './WebGPU-framebuffer';
import { WebGPUInputAssembler } from './WebGPU-input-assembler';
import { WebGPUDescriptorSetLayout } from './WebGPU-descriptor-set-layout';
import { WebGPUPipelineLayout } from './WebGPU-pipeline-layout';
import { WebGPUPipelineState } from './WebGPU-pipeline-state';
import { WebGPUQueue } from './WebGPU-queue';
import { WebGPURenderPass } from './WebGPU-render-pass';
import { WebGPUSampler } from './WebGPU-sampler';
import { WebGPUShader } from './WebGPU-shader';
import { WebGPUStateCache } from './webgpu-state-cache';
import { WebGPUTexture } from './WebGPU-texture';
import { GFXFormatToWebGLFormat, GFXFormatToWebGLType, WebGPUCmdFuncBlitFramebuffer,
    WebGPUCmdFuncCopyBuffersToTexture, WebGPUCmdFuncCopyTexImagesToTexture } from './WebGPU-commands';
import { getTypedArrayConstructor, GFXCommandBufferType, GFXFilter, GFXFormat, GFXFormatInfos,
    GFXQueueType, GFXTextureFlagBit, GFXTextureType, GFXTextureUsageBit,  GFXAPI, GFXFeature } from '../define';
import { GFXBufferTextureCopy, GFXRect } from '../define-class';
import { WebGPUCommandAllocator } from './WebGPU-command-allocator';
// import glslangModule from '@webgpu/glslang';

// namespace glslangModule {
//     export type ShaderStage = 'vertex' | 'fragment' | 'compute';
//     export type SpirvVersion = '1.0' | '1.1' | '1.2' | '1.3' | '1.4' | '1.5';

//     export interface ResultZeroCopy {
//         readonly data: Uint32Array;
//         free (): void;
//     }

//     export interface Glslang {
//         compileGLSLZeroCopy (glsl: string, shader_stage: ShaderStage, gen_debug: boolean, spirv_version?: SpirvVersion): ResultZeroCopy;
//         compileGLSL (glsl: string, shader_type: ShaderStage, gen_debug: boolean, spirv_version?: SpirvVersion): Uint32Array;
//     }
// }

export class WebGPUDevice extends GFXDevice {

    get gl (): WebGL2RenderingContext {
        return null!;
    }

    get isAntialias (): boolean {
        return null!;
    }

    get isPremultipliedAlpha (): boolean {
        return null!;
    }

    get useVAO (): boolean {
        return null!;
    }

    get bindingMappingInfo () {
        return this._bindingMappingInfo;
    }

    get EXT_texture_filter_anisotropic () {
        return null!;
    }

    get OES_texture_float_linear () {
        return null!;
    }

    get EXT_color_buffer_float () {
        return null!;
    }

    get EXT_disjoint_timer_query_webgl2 () {
        return null!;
    }

    get WEBGL_compressed_texture_etc1 () {
        return null!;
    }

    get WEBGL_compressed_texture_etc () {
        return null!;
    }

    get WEBGL_compressed_texture_pvrtc () {
        return null!;
    }

    get WEBGL_compressed_texture_s3tc () {
        return null!;
    }

    get WEBGL_compressed_texture_s3tc_srgb () {
        return null!;
    }

    get WEBGL_texture_storage_multisample () {
        return null!;
    }

    get WEBGL_debug_shaders () {
        return null!;
    }

    get WEBGL_lose_context () {
        return null!;
    }

    public stateCache: WebGPUStateCache = new WebGPUStateCache();
    public cmdAllocator: WebGPUCommandAllocator = new WebGPUCommandAllocator();
    public nullTex2D: WebGPUTexture | null = null;
    public nullTexCube: WebGPUTexture | null = null;

    private _adapter: GPUAdapter | null = null;
    private _device: GPUDevice | null = null;
    // private _glslang: glslangModule.Glslang | null = null;
    private _bindingMappingInfo: GFXBindingMappingInfo = new GFXBindingMappingInfo();

    public initialize (info: GFXDeviceInfo) {

        this._bindingMappingInfo = info.bindingMappingInfo;
        if (!this._bindingMappingInfo.bufferOffsets.length) this._bindingMappingInfo.bufferOffsets.push(0);
        if (!this._bindingMappingInfo.samplerOffsets.length) this._bindingMappingInfo.samplerOffsets.push(0);

        if (navigator.gpu) navigator.gpu.requestAdapter().then((adapter) => {
            this._adapter = adapter;
            if (adapter) adapter.requestDevice().then((device) => {
                this._device = device;
            });
        });
        // glslangModule().then((glslang) => {
        //     this._glslang = glslang;
        // });

        return true;
    }

    public destroy (): void {
    }

    public resize (width: number, height: number) {
    }

    public acquire () {
    }

    public present () {
        const queue = (this._queue as WebGPUQueue);
        this._numDrawCalls = queue.numDrawCalls;
        this._numInstances = queue.numInstances;
        this._numTris = queue.numTris;
        queue.clear();
    }

    public createCommandBuffer (info: GFXCommandBufferInfo): GFXCommandBuffer {
        const cmdBuff = new WebGPUCommandBuffer(this);
        if (cmdBuff.initialize(info)) {
            return cmdBuff;
        }
        return null!;
    }

    public createBuffer (info: GFXBufferInfo | GFXBufferViewInfo): GFXBuffer {
        const buffer = new WebGPUBuffer(this);
        if (buffer.initialize(info)) {
            return buffer;
        }
        return null!;
    }

    public createTexture (info: GFXTextureInfo | GFXTextureViewInfo): GFXTexture {
        const texture = new WebGPUTexture(this);
        if (texture.initialize(info)) {
            return texture;
        }
        return null!;
    }

    public createSampler (info: GFXSamplerInfo): GFXSampler {
        const sampler = new WebGPUSampler(this);
        if (sampler.initialize(info)) {
            return sampler;
        }
        return null!;
    }

    public createDescriptorSet (info: GFXDescriptorSetInfo): GFXDescriptorSet {
        const descriptorSet = new WebGPUDescriptorSet(this);
        if (descriptorSet.initialize(info)) {
            return descriptorSet;
        }
        return null!;
    }

    public createShader (info: GFXShaderInfo): GFXShader {
        const shader = new WebGPUShader(this);
        if (shader.initialize(info)) {
            return shader;
        }
        return null!;
    }

    public createInputAssembler (info: GFXInputAssemblerInfo): GFXInputAssembler {
        const inputAssembler = new WebGPUInputAssembler(this);
        if (inputAssembler.initialize(info)) {
            return inputAssembler;
        }
        return null!;
    }

    public createRenderPass (info: GFXRenderPassInfo): GFXRenderPass {
        const renderPass = new WebGPURenderPass(this);
        if (renderPass.initialize(info)) {
            return renderPass;
        }
        return null!;
    }

    public createFramebuffer (info: GFXFramebufferInfo): GFXFramebuffer {
        const framebuffer = new WebGPUFramebuffer(this);
        if (framebuffer.initialize(info)) {
            return framebuffer;
        }
        return null!;
    }

    public createDescriptorSetLayout (info: GFXDescriptorSetLayoutInfo): GFXDescriptorSetLayout {
        const descriptorSetLayout = new WebGPUDescriptorSetLayout(this);
        if (descriptorSetLayout.initialize(info)) {
            return descriptorSetLayout;
        }
        return null!;
    }

    public createPipelineLayout (info: GFXPipelineLayoutInfo): GFXPipelineLayout {
        const pipelineLayout = new WebGPUPipelineLayout(this);
        if (pipelineLayout.initialize(info)) {
            return pipelineLayout;
        }
        return null!;
    }

    public createPipelineState (info: GFXPipelineStateInfo): GFXPipelineState {
        const pipelineState = new WebGPUPipelineState(this);
        if (pipelineState.initialize(info)) {
            return pipelineState;
        }
        return null!;
    }

    public createFence (info: GFXFenceInfo): GFXFence {
        const fence = new WebGPUFence(this);
        if (fence.initialize(info)) {
            return fence;
        }
        return null!;
    }

    public createQueue (info: GFXQueueInfo): GFXQueue {
        const queue = new WebGPUQueue(this);
        if (queue.initialize(info)) {
            return queue;
        }
        return null!;
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: GFXTexture, regions: GFXBufferTextureCopy[]) {
        WebGPUCmdFuncCopyBuffersToTexture(
            this,
            buffers,
            (texture as WebGPUTexture).gpuTexture,
            regions);
    }

    public copyTexImagesToTexture (
        texImages: TexImageSource[],
        texture: GFXTexture,
        regions: GFXBufferTextureCopy[]) {

        WebGPUCmdFuncCopyTexImagesToTexture(
            this,
            texImages,
            (texture as WebGPUTexture).gpuTexture,
            regions);
    }

    public copyFramebufferToBuffer (
        srcFramebuffer: GFXFramebuffer,
        dstBuffer: ArrayBuffer,
        regions: GFXBufferTextureCopy[]) {}

    public blitFramebuffer (src: GFXFramebuffer, dst: GFXFramebuffer, srcRect: GFXRect, dstRect: GFXRect, filter: GFXFilter) {}
}
