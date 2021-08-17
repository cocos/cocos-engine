import { ALIPAY, RUNTIME_BASED, BYTEDANCE, WECHAT, LINKSURE, QTT, COCOSPLAY, HUAWEI } from 'internal:constants';
// import wasmDevice from '@cocos/webgpu/lib/webgpu_wasm';
import wasmDevice from './lib/webgpu_wasm';
import { Device } from '../base/device';
import { wasmBase64 } from './lib/tempArray.js';
// ({
//     wasm: require('fs').readFileSync('CocosGameWASM.wasm'),
// });

// import * as wasmDevice from './lib/webgpu_wasm';

// const wasmDevice = require('./lib/webgpu_wasm');

let wasmLoaded = false;
const wasmBin: Uint8Array = Uint8Array.from(atob(wasmBase64), (c) => c.charCodeAt(0));
const wgpuWasmModule = {
    wasmBinary: wasmBin,
};

let callBack = (() => { });

wasmDevice(wgpuWasmModule).then(() => {
    wasmLoaded = true;
    console.log(wgpuWasmModule);
    callBack();
});

export class WebGPUDevice extends Device {
    public initialize (info: DeviceInfo): boolean {
        callBack = (() => {
            const device = new wgpuWasmModule.Device();
            device.initialize(info);
            console.log('1');
        });

        if (wasmLoaded) {
            callBack();
        }

        return true;
    }

    public destroy (): void {

    }

    public resize (width: number, height: number): void {

    }

    public acquire (): void {

    }

    public present (): void {

    }

    public flushCommands (cmdBuffs: CommandBuffer[]): void {

    }

    public createCommandBuffer (info: CommandBufferInfo): CommandBuffer {

    }

    public createBuffer (info: BufferInfo | BufferViewInfo): Buffer {

    }

    public createTexture (info: TextureInfo | TextureViewInfo): Texture {

    }

    public createSampler (info: SamplerInfo): Sampler {

    }

    public createDescriptorSet (info: DescriptorSetInfo): DescriptorSet {

    }

    public createShader (info: ShaderInfo): Shader {

    }

    public createInputAssembler (info: InputAssemblerInfo): InputAssembler {

    }

    public createRenderPass (info: RenderPassInfo): RenderPass {

    }

    public createFramebuffer (info: FramebufferInfo): Framebuffer {

    }

    public createDescriptorSetLayout (info: DescriptorSetLayoutInfo): DescriptorSetLayout {

    }

    public createPipelineLayout (info: PipelineLayoutInfo): PipelineLayout {

    }

    public createPipelineState (info: PipelineStateInfo): PipelineState {

    }

    public createQueue (info: QueueInfo): Queue {

    }

    public createGlobalBarrier (info: GlobalBarrierInfo): GlobalBarrier {

    }

    public createTextureBarrier (info: TextureBarrierInfo): TextureBarrier {

    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]): void {

    }

    public copyTextureToBuffers (texture: Texture, buffers: ArrayBufferView[], regions: BufferTextureCopy[]): void {

    }

    public copyTexImagesToTexture (texImages: TexImageSource[], texture: Texture, regions: BufferTextureCopy[]): void {

    }

    public copyFramebufferToBuffer (srcFramebuffer: Framebuffer, dstBuffer: ArrayBuffer, regions: BufferTextureCopy[]): void {

    }
}
