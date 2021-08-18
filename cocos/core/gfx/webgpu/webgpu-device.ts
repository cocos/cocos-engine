/* eslint-disable @typescript-eslint/no-floating-promises */
import { ALIPAY, RUNTIME_BASED, BYTEDANCE, WECHAT, LINKSURE, QTT, COCOSPLAY, HUAWEI } from 'internal:constants';
// import wasmDevice from '@cocos/webgpu/lib/webgpu_wasm';
// import fs from 'fs';
import wasmDevice from './lib/webgpu_wasm.js';
import { Device } from '../base/device';
import { wasmBase64 } from './lib/tempArray.js';
import { DeviceInfo } from '../base/define';
// ({
//     wasm: require('fs').readFileSync('CocosGameWASM.wasm'),
// });

// import * as wasmDevice from './lib/webgpu_wasm';

// const wasmDevice = require('./lib/webgpu_wasm');
let wasmLoaded = false;
// let wgpuWasmModule;
// const imports = {};
// WebAssembly.instantiateStreaming(fetch('./lib/webgpu_wasm.wasm'), wgpuWasmModule)
//     .then((results) => {
//         wgpuWasmModule.wasm = results;
//         wasmDevice(wgpuWasmModule).then(() => {
//             wasmLoaded = true;
//             console.log(wgpuWasmModule);
//         });
//     });

const wasmBin: Uint8Array = Uint8Array.from(atob(wasmBase64), (c) => c.charCodeAt(0));
const wgpuWasmModule = {
    wasmBinary: wasmBin,
};

wasmDevice(wgpuWasmModule).then(() => {
    wasmLoaded = true;
    console.log(wgpuWasmModule);
});

export class WebGPUDevice extends Device {
    public initialize (info: DeviceInfo): Promise<boolean> {
        function init (): Promise<boolean> {
            return new Promise(((resolve, reject) => {
                (function waitForWasmLoading () {
                    if (wasmLoaded) {
                        const device = wgpuWasmModule.CCWGPUDevice.getInstance();
                        const deviceInfo = {};
                        deviceInfo.isAntiAlias = info.isAntialias;
                        deviceInfo.windowHandle = 0;
                        deviceInfo.width = info.width;
                        deviceInfo.height = info.height;
                        deviceInfo.pixelRatio = info.devicePixelRatio;

                        const bufferOffsets = new wgpuWasmModule.vector_int();
                        for (let i = 0; i < info.bindingMappingInfo.bufferOffsets.length; i++) {
                            bufferOffsets.push_back(info.bindingMappingInfo.bufferOffsets[i]);
                        }

                        const samplerOffsets = new wgpuWasmModule.vector_int();
                        for (let i = 0; i < info.bindingMappingInfo.samplerOffsets.length; i++) {
                            samplerOffsets.push_back(info.bindingMappingInfo.samplerOffsets[i]);
                        }

                        deviceInfo.bindingMappingInfo = {
                            bufferOffsets,
                            samplerOffsets,
                            flexibleSet: info.bindingMappingInfo.flexibleSet,
                        };

                        device.initialize(deviceInfo);
                        console.log('1');
                        return resolve(true);
                    }
                    setTimeout(waitForWasmLoading, 30);
                }());
            }));
        }
        return init();
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
