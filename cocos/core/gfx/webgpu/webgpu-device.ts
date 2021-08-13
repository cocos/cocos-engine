import { ALIPAY, RUNTIME_BASED, BYTEDANCE, WECHAT, LINKSURE, QTT, COCOSPLAY, HUAWEI } from 'internal:constants';
import { Device } from '../base/device';
import { WebGPUGlue } from './lib/CocosGameWASM.js';

const wasmBase64 = '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';
const wasmBinary: Uint8Array = Uint8Array.from(atob(wasmBase64), c => c.charCodeAt(0));
const module = {
    wasm: wasmBinary,
};
WebGPUGlue(module);

export class WebGPUDevice extends Device {
    public initialize (info: DeviceInfo): boolean {
        return true;
    };

    public destroy (): void {

    };

    public resize (width: number, height: number): void {

    };

    public acquire (): void {

    };

    public present (): void {

    };

    public flushCommands (cmdBuffs: CommandBuffer[]): void {

    };

    public createCommandBuffer (info: CommandBufferInfo): CommandBuffer {

    };

    public createBuffer (info: BufferInfo | BufferViewInfo): Buffer {

    };

    public createTexture (info: TextureInfo | TextureViewInfo): Texture {

    };

    public createSampler (info: SamplerInfo): Sampler {

    };

    public createDescriptorSet (info: DescriptorSetInfo): DescriptorSet {

    };

    public createShader (info: ShaderInfo): Shader {

    };

    public createInputAssembler (info: InputAssemblerInfo): InputAssembler {

    };

    public createRenderPass (info: RenderPassInfo): RenderPass {

    };

    public createFramebuffer (info: FramebufferInfo): Framebuffer {

    };

    public createDescriptorSetLayout (info: DescriptorSetLayoutInfo): DescriptorSetLayout {

    };

    public createPipelineLayout (info: PipelineLayoutInfo): PipelineLayout {

    };

    public createPipelineState (info: PipelineStateInfo): PipelineState {

    };

    public createQueue (info: QueueInfo): Queue {

    };

    public createGlobalBarrier (info: GlobalBarrierInfo): GlobalBarrier {

    };

    public createTextureBarrier (info: TextureBarrierInfo): TextureBarrier {

    };

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]): void {

    };

    public copyTextureToBuffers (texture: Texture, buffers: ArrayBufferView[], regions: BufferTextureCopy[]): void {

    };

    public copyTexImagesToTexture (texImages: TexImageSource[], texture: Texture, regions: BufferTextureCopy[]): void {

    };

    public copyFramebufferToBuffer (srcFramebuffer: Framebuffer, dstBuffer: ArrayBuffer, regions: BufferTextureCopy[]): void {

    };
}

// ({
//     wasm: require('fs').readFileSync('CocosGameWASM.wasm'),
// });