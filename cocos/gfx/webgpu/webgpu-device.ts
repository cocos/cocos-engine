import glslang from '@webgpu/glslang/dist/web-devel/glslang';
import { DescriptorSet } from '../base/descriptor-set';
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
import { PipelineLayout } from '../base/pipeline-layout';
import { DescriptorSetLayout } from '../base/descriptor-set-layout';
import { Texture } from '../base/texture';
import { WebGPUDescriptorSet } from './webgpu-descriptor-set';
import { WebGPUBuffer } from './webgpu-buffer';
import { WebGPUCommandBuffer } from './webgpu-command-buffer';
import { WebGPUFramebuffer } from './webgpu-framebuffer';
import { WebGPUInputAssembler } from './webgpu-input-assembler';
import { WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';
import { WebGPUPipelineLayout } from './webgpu-pipeline-layout';
import { WebGPUPipelineState } from './webgpu-pipeline-state';
import { WebGPUQueue } from './webgpu-queue';
import { WebGPURenderPass } from './webgpu-render-pass';
import { WebGPUSampler } from './webgpu-sampler';
import { WebGPUShader } from './webgpu-shader';
import { WebGPUStateCache } from './webgpu-state-cache';
import { WebGPUTexture } from './webgpu-texture';
// import { WebGPUCmdFuncCopyBuffersToTexture, WebGPUCmdFuncCopyTexImagesToTexture } from './webgpu-commands';
import {
    Filter, Format,
    QueueType, Feature, BufferTextureCopy, Rect, DescriptorSetInfo,
    BufferInfo, BufferViewInfo, CommandBufferInfo, DeviceInfo, BindingMappingInfo,
    FramebufferInfo, InputAssemblerInfo, QueueInfo, RenderPassInfo, SamplerInfo,
    ShaderInfo, PipelineLayoutInfo, DescriptorSetLayoutInfo, TextureInfo, TextureViewInfo, GeneralBarrierInfo, TextureBarrierInfo,
    SwapchainInfo,
    BufferBarrierInfo,
    API,
    FormatFeatureBit,
    FormatFeature,
    TextureType,
    TextureUsageBit,
    TextureFlagBit,
    SampleCount,
    BufferUsageBit,
    MemoryUsageBit,
    BufferFlagBit,
} from '../base/define';
import { WebGPUCommandAllocator } from './webgpu-command-allocator';
import { GeneralBarrier } from '../base/states/general-barrier';
import { TextureBarrier } from '../base/states/texture-barrier';
import { BufferBarrier } from '../base/states/buffer-barrier';
import { Swapchain } from '../base/swapchain';
import { WebGPUSwapchain } from './webgpu-swapchain';
import { WebGPUDeviceManager } from './define';
import { IWebGPUBindingMapping } from './webgpu-gpu-objects';
import { debug } from '../../core';

export class WebGPUDevice extends Device {
    public createSwapchain(info: Readonly<SwapchainInfo>): Swapchain {
        const swapchain = new WebGPUSwapchain();
        this._swapchain = swapchain;
        swapchain.initialize(info);
        return swapchain;
    }
    public getSampler(info: Readonly<SamplerInfo>): Sampler {
        const hash = Sampler.computeHash(info);
        if (!this._samplers.has(hash)) {
            this._samplers.set(hash, new WebGPUSampler(info, hash));
        }
        return this._samplers.get(hash)!;
    }
    public getSwapchains(): readonly Swapchain[] {
        return [this._swapchain as Swapchain];
    }
    public getGeneralBarrier(info: Readonly<GeneralBarrierInfo>): GeneralBarrier {
        const hash = GeneralBarrier.computeHash(info);
        if (!this._generalBarrierss.has(hash)) {
            this._generalBarrierss.set(hash, new GeneralBarrier(info, hash));
        }
        return this._generalBarrierss.get(hash)!;
    }
    public getTextureBarrier(info: Readonly<TextureBarrierInfo>): TextureBarrier {
        const hash = TextureBarrier.computeHash(info);
        if (!this._textureBarriers.has(hash)) {
            this._textureBarriers.set(hash, new TextureBarrier(info, hash));
        }
        return this._textureBarriers.get(hash)!;
    }
    public getBufferBarrier(info: Readonly<BufferBarrierInfo>): BufferBarrier {
        const hash = BufferBarrier.computeHash(info);
        if (!this._bufferBarriers.has(hash)) {
            this._bufferBarriers.set(hash, new BufferBarrier(info, hash));
        }
        return this._bufferBarriers.get(hash)!;
    }
    public copyTextureToBuffers(texture: Readonly<Texture>, buffers: ArrayBufferView[], regions: readonly BufferTextureCopy[]): void {
        throw new Error('Method not implemented.');
    }
    public flushCommands (cmdBuffs: CommandBuffer[]): void {}


    get isPremultipliedAlpha (): boolean {
        if(!this._gpuConfig) {
            return false;
        }
        return this._gpuConfig.alphaMode === 'premultiplied';
    }

    get multiDrawIndirectSupport () {
        return this._multiDrawIndirect;
    }

    get defaultDepthStencilTex () {
        return this._defaultDepthStencilTex;
    }

    get bindingMappings (): IWebGPUBindingMapping {
        return this._bindingMappings!;
    }

    get context (): GPUCanvasContext {
        return this._context!;
    }

    public stateCache: WebGPUStateCache = new WebGPUStateCache();
    public cmdAllocator: WebGPUCommandAllocator = new WebGPUCommandAllocator();
    public nullTex2D: WebGPUTexture | null = null;
    public nullTexCube: WebGPUTexture | null = null;
    public defaultDescriptorResource;

    private _adapter: GPUAdapter | null | undefined = null;
    private _device: GPUDevice | null | undefined = null;
    private _context: GPUCanvasContext | null = null;
    private _swapchain: WebGPUSwapchain | null = null;
    private _glslang;
    private _bindingMappings: IWebGPUBindingMapping | null = null;
    private _multiDrawIndirect = false;
    private _defaultDepthStencilTex: GPUTexture | null = null;
    private _gpuConfig: GPUCanvasConfiguration | null = null;
    protected _textureExclusive = new Array<boolean>(Format.COUNT);

    public initialize (info: Readonly<DeviceInfo>): boolean {
        WebGPUDeviceManager.setInstance(this);
        this.initDevice(info);
        return true;
    }

    set gpuConfig (config: GPUCanvasConfiguration) {
        this._gpuConfig = config;
    }

    get gpuConfig (): GPUCanvasConfiguration {
        return this._gpuConfig!;
    }

    protected initFormatFeatures (exts: GPUSupportedFeatures): void {
        this._formatFeatures.fill(FormatFeatureBit.NONE);

        this._textureExclusive.fill(true);

        let tempFeature: FormatFeature = FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE
            | FormatFeatureBit.STORAGE_TEXTURE | FormatFeatureBit.LINEAR_FILTER | FormatFeatureBit.VERTEX_ATTRIBUTE;

        this._formatFeatures[Format.R8] = tempFeature;
        this._formatFeatures[Format.RG8] = tempFeature;
        this._formatFeatures[Format.RGB8] = tempFeature;
        this._formatFeatures[Format.RGBA8] = tempFeature;

        tempFeature = FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE
            | FormatFeatureBit.STORAGE_TEXTURE | FormatFeatureBit.LINEAR_FILTER;

        this._formatFeatures[Format.R8SN] = tempFeature;
        this._formatFeatures[Format.RG8SN] = tempFeature;
        this._formatFeatures[Format.RGB8SN] = tempFeature;
        this._formatFeatures[Format.RGBA8SN] = tempFeature;
        this._formatFeatures[Format.R5G6B5] = tempFeature;
        this._formatFeatures[Format.RGBA4] = tempFeature;
        this._formatFeatures[Format.RGB5A1] = tempFeature;
        this._formatFeatures[Format.RGB10A2] = tempFeature;

        this._formatFeatures[Format.SRGB8] = tempFeature;
        this._formatFeatures[Format.SRGB8_A8] = tempFeature;

        this._formatFeatures[Format.R11G11B10F] = tempFeature;
        this._formatFeatures[Format.RGB9E5] = tempFeature;

        this._formatFeatures[Format.DEPTH] = tempFeature;
        this._formatFeatures[Format.DEPTH_STENCIL] = tempFeature;

        this._formatFeatures[Format.RGB10A2UI] = FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.STORAGE_TEXTURE
            | FormatFeatureBit.SAMPLED_TEXTURE | FormatFeatureBit.LINEAR_FILTER;

        tempFeature = FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE
            | FormatFeatureBit.STORAGE_TEXTURE | FormatFeatureBit.VERTEX_ATTRIBUTE;

        this._formatFeatures[Format.R16F] = tempFeature;
        this._formatFeatures[Format.RG16F] = tempFeature;
        this._formatFeatures[Format.RGB16F] = tempFeature;
        this._formatFeatures[Format.RGBA16F] = tempFeature;

        tempFeature = FormatFeatureBit.STORAGE_TEXTURE | FormatFeatureBit.SAMPLED_TEXTURE | FormatFeatureBit.VERTEX_ATTRIBUTE;

        this._formatFeatures[Format.R32F] = tempFeature;
        this._formatFeatures[Format.RG32F] = tempFeature;
        this._formatFeatures[Format.RGB32F] = tempFeature;
        this._formatFeatures[Format.RGBA32F] = tempFeature;

        this._formatFeatures[Format.RGB10A2UI] = FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.STORAGE_TEXTURE
            | FormatFeatureBit.SAMPLED_TEXTURE | FormatFeatureBit.LINEAR_FILTER;

        tempFeature = FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.STORAGE_TEXTURE
            | FormatFeatureBit.SAMPLED_TEXTURE | FormatFeatureBit.LINEAR_FILTER | FormatFeatureBit.VERTEX_ATTRIBUTE;

        this._formatFeatures[Format.R8I] = tempFeature;
        this._formatFeatures[Format.R8UI] = tempFeature;
        this._formatFeatures[Format.R16I] = tempFeature;
        this._formatFeatures[Format.R16UI] = tempFeature;
        this._formatFeatures[Format.R32I] = tempFeature;
        this._formatFeatures[Format.R32UI] = tempFeature;

        this._formatFeatures[Format.RG8I] = tempFeature;
        this._formatFeatures[Format.RG8UI] = tempFeature;
        this._formatFeatures[Format.RG16I] = tempFeature;
        this._formatFeatures[Format.RG16UI] = tempFeature;
        this._formatFeatures[Format.RG32I] = tempFeature;
        this._formatFeatures[Format.RG32UI] = tempFeature;

        this._formatFeatures[Format.RGB8I] = tempFeature;
        this._formatFeatures[Format.RGB8UI] = tempFeature;
        this._formatFeatures[Format.RGB16I] = tempFeature;
        this._formatFeatures[Format.RGB16UI] = tempFeature;
        this._formatFeatures[Format.RGB32I] = tempFeature;
        this._formatFeatures[Format.RGB32UI] = tempFeature;

        this._formatFeatures[Format.RGBA8I] = tempFeature;
        this._formatFeatures[Format.RGBA8UI] = tempFeature;
        this._formatFeatures[Format.RGBA16I] = tempFeature;
        this._formatFeatures[Format.RGBA16UI] = tempFeature;
        this._formatFeatures[Format.RGBA32I] = tempFeature;
        this._formatFeatures[Format.RGBA32UI] = tempFeature;

        this._textureExclusive[Format.R8] = false;
        this._textureExclusive[Format.RG8] = false;
        this._textureExclusive[Format.RGB8] = false;
        this._textureExclusive[Format.R5G6B5] = false;
        this._textureExclusive[Format.RGBA4] = false;

        this._textureExclusive[Format.RGB5A1] = false;
        this._textureExclusive[Format.RGBA8] = false;
        this._textureExclusive[Format.RGB10A2] = false;
        this._textureExclusive[Format.RGB10A2UI] = false;
        this._textureExclusive[Format.SRGB8_A8] = false;

        this._textureExclusive[Format.R8I] = false;
        this._textureExclusive[Format.R8UI] = false;
        this._textureExclusive[Format.R16I] = false;
        this._textureExclusive[Format.R16UI] = false;
        this._textureExclusive[Format.R32I] = false;
        this._textureExclusive[Format.R32UI] = false;

        this._textureExclusive[Format.RG8I] = false;
        this._textureExclusive[Format.RG8UI] = false;
        this._textureExclusive[Format.RG16I] = false;
        this._textureExclusive[Format.RG16UI] = false;
        this._textureExclusive[Format.RG32I] = false;
        this._textureExclusive[Format.RG32UI] = false;

        this._textureExclusive[Format.RGBA8I] = false;
        this._textureExclusive[Format.RGBA8UI] = false;
        this._textureExclusive[Format.RGBA16I] = false;
        this._textureExclusive[Format.RGBA16UI] = false;
        this._textureExclusive[Format.RGBA32I] = false;
        this._textureExclusive[Format.RGBA32UI] = false;

        this._textureExclusive[Format.DEPTH] = false;
        this._textureExclusive[Format.DEPTH_STENCIL] = false;

        if (exts.has('float32-filterable')) {
            this._formatFeatures[Format.R32F] |= FormatFeatureBit.RENDER_TARGET;
            this._formatFeatures[Format.RG32F] |= FormatFeatureBit.RENDER_TARGET;
            this._formatFeatures[Format.RGBA32F] |= FormatFeatureBit.RENDER_TARGET;

            this._textureExclusive[Format.R32F] = false;
            this._textureExclusive[Format.RG32F] = false;
            this._textureExclusive[Format.RGBA32F] = false;
            
            this._formatFeatures[Format.RGB32F] |= FormatFeatureBit.LINEAR_FILTER;
            this._formatFeatures[Format.RGBA32F] |= FormatFeatureBit.LINEAR_FILTER;
            this._formatFeatures[Format.R32F] |= FormatFeatureBit.LINEAR_FILTER;
            this._formatFeatures[Format.RG32F] |= FormatFeatureBit.LINEAR_FILTER;
        }

        if (exts.has('shader-f16')) {
            this._textureExclusive[Format.R16F] = false;
            this._textureExclusive[Format.RG16F] = false;
            this._textureExclusive[Format.RGBA16F] = false;
            
            this._formatFeatures[Format.RGB16F] |= FormatFeatureBit.LINEAR_FILTER;
            this._formatFeatures[Format.RGBA16F] |= FormatFeatureBit.LINEAR_FILTER;
            this._formatFeatures[Format.R16F] |= FormatFeatureBit.LINEAR_FILTER;
            this._formatFeatures[Format.RG16F] |= FormatFeatureBit.LINEAR_FILTER;
        }

        const compressedFeature: FormatFeature = FormatFeatureBit.SAMPLED_TEXTURE | FormatFeatureBit.LINEAR_FILTER;

        if (exts.has('texture-compression-etc2')) {
            this._formatFeatures[Format.ETC2_RGB8] = compressedFeature;
            this._formatFeatures[Format.ETC2_RGBA8] = compressedFeature;
            this._formatFeatures[Format.ETC2_SRGB8] = compressedFeature;
            this._formatFeatures[Format.ETC2_SRGB8_A8] = compressedFeature;
            this._formatFeatures[Format.ETC2_RGB8_A1] = compressedFeature;
            this._formatFeatures[Format.ETC2_SRGB8_A1] = compressedFeature;
        }

        if (exts.has('texture-compression-bc')) {
            this._formatFeatures[Format.BC1] = compressedFeature;
            this._formatFeatures[Format.BC1_ALPHA] = compressedFeature;
            this._formatFeatures[Format.BC1_SRGB] = compressedFeature;
            this._formatFeatures[Format.BC1_SRGB_ALPHA] = compressedFeature;
            this._formatFeatures[Format.BC2] = compressedFeature;
            this._formatFeatures[Format.BC2_SRGB] = compressedFeature;
            this._formatFeatures[Format.BC3] = compressedFeature;
            this._formatFeatures[Format.BC3_SRGB] = compressedFeature;
        }

        // if (exts.WEBGL_compressed_texture_pvrtc) {
        //     this._formatFeatures[Format.PVRTC_RGB2] = compressedFeature;
        //     this._formatFeatures[Format.PVRTC_RGBA2] = compressedFeature;
        //     this._formatFeatures[Format.PVRTC_RGB4] = compressedFeature;
        //     this._formatFeatures[Format.PVRTC_RGBA4] = compressedFeature;
        // }

        if (exts.has('texture-compression-astc')) {
            this._formatFeatures[Format.ASTC_RGBA_4X4] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_5X4] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_5X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_6X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_6X6] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_8X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_8X6] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_8X8] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_10X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_10X6] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_10X8] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_10X10] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_12X10] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_12X12] = compressedFeature;

            this._formatFeatures[Format.ASTC_SRGBA_4X4] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_5X4] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_5X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_6X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_6X6] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_8X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_8X6] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_8X8] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_10X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_10X6] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_10X8] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_10X10] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_12X10] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_12X12] = compressedFeature;
        }
    }

    private async initDevice (info: Readonly<DeviceInfo>): Promise<boolean> {
        const gpu = navigator.gpu;
        this._adapter = await gpu?.requestAdapter();
        this._device = await this._adapter?.requestDevice();
        
        this._glslang = await glslang();

        // WebGL2DeviceManager.setInstance(this);
        this._gfxAPI = API.WEBGPU;

        const mapping = this._bindingMappingInfo = info.bindingMappingInfo;
        const blockOffsets: number[] = [];
        const samplerTextureOffsets: number[] = [];
        const firstSet = mapping.setIndices[0];
        blockOffsets[firstSet] = 0;
        samplerTextureOffsets[firstSet] = 0;
        for (let i = 1; i < mapping.setIndices.length; ++i) {
            const curSet = mapping.setIndices[i];
            const prevSet = mapping.setIndices[i - 1];
            // accumulate the per set offset according to the specified capacity
            blockOffsets[curSet] = mapping.maxBlockCounts[prevSet] + blockOffsets[prevSet];
            samplerTextureOffsets[curSet] = mapping.maxSamplerTextureCounts[prevSet] + samplerTextureOffsets[prevSet];
        }
        for (let i = 0; i < mapping.setIndices.length; ++i) {
            const curSet = mapping.setIndices[i];
            // textures always come after UBOs
            samplerTextureOffsets[curSet] -= mapping.maxBlockCounts[curSet];
        }
        this._bindingMappings = {
            blockOffsets,
            samplerTextureOffsets,
            flexibleSet: mapping.setIndices[mapping.setIndices.length - 1],
        };

        const canvas = Device.canvas as HTMLCanvasElement;
        this._context = canvas.getContext('webgpu')!;
        const device: GPUDevice = this._device as GPUDevice;

        const adapterInfo = await this._adapter!.requestAdapterInfo();;
        this._vendor = adapterInfo.vendor;
        this._renderer = adapterInfo.device;
        const description = adapterInfo.description;

        this._defaultDepthStencilTex = device.createTexture({
            size: {
                width: canvas.width,
                height: canvas.height,
                depthOrArrayLayers: 1,
            },
            format: 'depth24plus-stencil8',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
        const limits = device.limits;
        this._caps.clipSpaceMinZ = 0.0;
        this._caps.uboOffsetAlignment = 256;
        this._caps.maxUniformBufferBindings = 12;
        this._caps.maxVertexAttributes = limits.maxVertexAttributes;
        this._caps.maxUniformBufferBindings = limits.maxUniformBufferBindingSize;
        this._caps.maxTextureSize = limits.maxTextureDimension2D;
        this._caps.maxArrayTextureLayers = limits.maxTextureArrayLayers;
        this._caps.max3DTextureSize = limits.maxTextureDimension3D;
        this._caps.uboOffsetAlignment  = limits.minUniformBufferOffsetAlignment;

        const features = this._adapter!.features;
        // FIXME: require by query
        this._multiDrawIndirect = false;

        this._features.fill(false);
        this._features[Feature.ELEMENT_INDEX_UINT] = true;
        this._features[Feature.INSTANCED_ARRAYS] = true;
        this._features[Feature.MULTIPLE_RENDER_TARGETS] = true;
        this._features[Feature.BLEND_MINMAX] = true;
        this.initFormatFeatures(features);

        this._queue = this.createQueue(new QueueInfo(QueueType.GRAPHICS));
        this._cmdBuff = this.createCommandBuffer(new CommandBufferInfo(this._queue));

        const texInfo = new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.NONE,
            Format.RGBA8,
            16,
            16,
            TextureFlagBit.NONE,
            1,
            1,
            SampleCount.X1,
            1,
        );
        const defaultDescTexResc = this.createTexture(texInfo);

        const bufferInfo = new BufferInfo(
            BufferUsageBit.NONE,
            MemoryUsageBit.NONE,
            16,
            16, // in bytes
            BufferFlagBit.NONE,
        );
        const defaultDescBuffResc = this.createBuffer(bufferInfo);

        const samplerInfo = new SamplerInfo();
        const defaultDescSmplResc = this.getSampler(samplerInfo);

        this.defaultDescriptorResource = {
            buffer: defaultDescBuffResc,
            texture: defaultDescTexResc,
            sampler: defaultDescSmplResc,
        };
        let compressedFormat = '';

        if (this.getFormatFeatures(Format.ETC_RGB8)) {
            compressedFormat += 'etc1 ';
        }

        if (this.getFormatFeatures(Format.ETC2_RGB8)) {
            compressedFormat += 'etc2 ';
        }

        if (this.getFormatFeatures(Format.BC1)) {
            compressedFormat += 'dxt ';
        }

        if (this.getFormatFeatures(Format.PVRTC_RGB2)) {
            compressedFormat += 'pvrtc ';
        }

        if (this.getFormatFeatures(Format.ASTC_RGBA_4X4)) {
            compressedFormat += 'astc ';
        }
        debug('WebGPU device initialized.');
        debug(`RENDERER: ${this._renderer}`);
        debug(`VENDOR: ${this._vendor}`);
        debug(`DESCRIPTION: ${description}`);
        debug(`COMPRESSED_FORMAT: ${compressedFormat}`);
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
            (res.value as WebGPUSampler).destroy();
            res = it.next();
        }

        this._swapchain = null;
    }

    public resize (width: number, height: number) {

    }

    public acquire () {}

    get nativeDevice () {
        return this._device;
    }

    public glslang () {
        return this._glslang;
    }

    public present () {
        const queue = (this._queue as unknown as WebGPUQueue);
        this._numDrawCalls = queue.numDrawCalls;
        this._numInstances = queue.numInstances;
        this._numTris = queue.numTris;
        queue.clear();
    }

    public createCommandBuffer (info: CommandBufferInfo): CommandBuffer {
        const cmdBuff = new WebGPUCommandBuffer();
        if (cmdBuff.initialize(info)) {
            return cmdBuff;
        }
        return null!;
    }

    public createBuffer (info: BufferInfo | BufferViewInfo): Buffer {
        const buffer = new WebGPUBuffer();
        if (buffer.initialize(info)) {
            return buffer;
        }
        return null!;
    }

    public createTexture (info: TextureInfo | TextureViewInfo): Texture {
        const texture = new WebGPUTexture();
        if (texture.initialize(info)) {
            return texture;
        }
        return null!;
    }

    public createDescriptorSet (info: DescriptorSetInfo): DescriptorSet {
        const descriptorSet = new WebGPUDescriptorSet();
        if (descriptorSet.initialize(info)) {
            return descriptorSet;
        }
        return null!;
    }

    public createShader (info: Readonly<ShaderInfo>): Shader {
        const shader = new WebGPUShader();
        shader.initialize(info);
        return shader;
    }

    public createInputAssembler (info: Readonly<InputAssemblerInfo>): InputAssembler {
        const inputAssembler = new WebGPUInputAssembler();
        inputAssembler.initialize(info);
        return inputAssembler;
    }

    public createRenderPass (info: Readonly<RenderPassInfo>): RenderPass {
        const renderPass = new WebGPURenderPass();
        renderPass.initialize(info);
        return renderPass;
    }

    public createFramebuffer (info: Readonly<FramebufferInfo>): Framebuffer {
        const framebuffer = new WebGPUFramebuffer();
        framebuffer.initialize(info);
        return framebuffer;
    }

    public createDescriptorSetLayout (info: DescriptorSetLayoutInfo): DescriptorSetLayout {
        const descriptorSetLayout = new WebGPUDescriptorSetLayout();
        if (descriptorSetLayout.initialize(info)) {
            return descriptorSetLayout;
        }
        return null!;
    }

    public createPipelineLayout (info: PipelineLayoutInfo): PipelineLayout {
        const pipelineLayout = new WebGPUPipelineLayout();
        if (pipelineLayout.initialize(info)) {
            return pipelineLayout;
        }
        return null!;
    }

    public createPipelineState (info: Readonly<PipelineStateInfo>): PipelineState {
        const pipelineState = new WebGPUPipelineState();
        pipelineState.initialize(info)
        return pipelineState;
    }

    public createQueue (info: QueueInfo): Queue {
        const queue = new WebGPUQueue();
        if (queue.initialize(info)) {
            return queue;
        }
        return null!;
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]) {
        // WebGPUCmdFuncCopyBuffersToTexture(
        //     this,
        //     buffers,
        //     (texture as unknown as WebGPUTexture).gpuTexture,
        //     regions,
        // );
    }

    public copyTexImagesToTexture (
        texImages: TexImageSource[],
        texture: Texture,
        regions: BufferTextureCopy[],
    ) {
        // WebGPUCmdFuncCopyTexImagesToTexture(
        //     this,
        //     texImages,
        //     (texture as unknown as WebGPUTexture).gpuTexture,
        //     regions,
        // );
    }

    public copyFramebufferToBuffer (
        srcFramebuffer: Framebuffer,
        dstBuffer: ArrayBuffer,
        regions: BufferTextureCopy[],
    ) { }

    public blitFramebuffer (src: Framebuffer, dst: Framebuffer, srcRect: Rect, dstRect: Rect, filter: Filter) { }
}
