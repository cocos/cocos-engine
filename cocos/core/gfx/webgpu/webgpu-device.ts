/* eslint-disable @typescript-eslint/no-floating-promises */
import { ALIPAY, RUNTIME_BASED, BYTEDANCE, WECHAT, LINKSURE, QTT, COCOSPLAY, HUAWEI } from 'internal:constants';
// import wasmDevice from '@cocos/webgpu/lib/webgpu_wasm';
// import fs from 'fs';
import { resolve } from 'path/posix';
import wasmDevice from './lib/webgpu_wasm.js';
import { Device } from '../base/device';
import { wasmBase64 } from './lib/tempArray.js';
import { DeviceInfo, RenderPassInfo, ColorAttachment, SampleCount } from '../base/define';
// ({
//     wasm: require('fs').readFileSync('CocosGameWASM.wasm'),
// });

// import * as wasmDevice from './lib/webgpu_wasm';

// const wasmDevice = require('./lib/webgpu_wasm');
let wasmLoaded = false;
const initialized = false;
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
    private _nativeDevice = undefined;

    public initialize (info: DeviceInfo): Promise<boolean> {
        async function getDevice () {
            const adapter = await navigator.gpu.requestAdapter();
            const device = await adapter.requestDevice();
            wgpuWasmModule.preinitializedWebGPUDevice = device;
            console.log(adapter);
        }
        const launch = (): boolean => {
            this._nativeDevice = wgpuWasmModule.CCWGPUDevice.getInstance();
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

            this._nativeDevice?.initialize(deviceInfo);
            return true;
        };

        function init (): Promise<boolean> {
            const poll = (resolve) => {
                if (wasmLoaded) {
                    return resolve(getDevice().then(() => launch()));
                } else {
                    setTimeout((_) => {
                        poll(resolve);
                        console.log('s');
                    }, 30);
                }
            };

            return new Promise(poll);
        }

        return init().then(() => {
            console.log('111');
            return true;
        });
    }

    public destroy (): void {
        this._nativeDevice?.destroy();
        this._nativeDevice?.delete();
    }

    public resize (width: number, height: number): void {
        this._nativeDevice?.resize(width, height);
    }

    public acquire (): void {
        this._nativeDevice?.acquire();
    }

    public present (): void {
        this._nativeDevice?.present();
    }

    public flushCommands (cmdBuffs: CommandBuffer[]): void {
        this._nativeDevice?.flushCommands(cmdBuffs);
    }

    public createCommandBuffer (info: CommandBufferInfo): CommandBuffer {
        this._nativeDevice?.createCommandBuffer(info);
    }

    public createBuffer (info: BufferInfo | BufferViewInfo): Buffer {
        this._nativeDevice?.createBuffer(info);
    }

    public createTexture (info: TextureInfo | TextureViewInfo): Texture {
        this._nativeDevice?.createTexture(info);
    }

    public createSampler (info: SamplerInfo): Sampler {
        this._nativeDevice?.createSampler(info);
    }

    public createDescriptorSet (info: DescriptorSetInfo): DescriptorSet {
        this._nativeDevice?.createDescriptorSet(info);
    }

    public createShader (info: ShaderInfo): Shader {
        this._nativeDevice?.createShader(info);
    }

    public createInputAssembler (info: InputAssemblerInfo): InputAssembler {
        this._nativeDevice?.createInputAssembler(info);
    }

    public createRenderPass (info: RenderPassInfo): RenderPass {
        const colorVec = new wgpuWasmModule.ColorAttachmentList();
        for (let i = 0; i < info.colorAttachments.length; i++) {
            const origin = info.colorAttachments[i];
            const color = new wgpuWasmModule.ColorAttachmentInstance();
            color.format = origin.format;
            color.sampleCount = origin.sampleCount;
            color.loadOp = origin.loadOp;
            color.storeOp = origin.storeOp;
            const beginAccesses = new wgpuWasmModule.AccessTypeList();
            for (let left = 0; left < origin.beginAccesses.length; left++) {
                beginAccesses.push_back(origin.beginAccesses[left]);
            }
            color.beginAccesses = beginAccesses;

            const endAccesses = new wgpuWasmModule.AccessTypeList();
            for (let right = 0; right < origin.endAccesses.length; right++) {
                endAccesses.push_back(origin.endAccesses[right]);
            }
            color.endAccesses = endAccesses;
            color.isGeneralLayout = origin.isGeneralLayout;

            colorVec.push_back(color);
        }

        const depthStencil = new wgpuWasmModule.DepthStencilAttachmentInstance();
        depthStencil.format = info.depthStencilAttachment.format;
        depthStencil.sampleCount = info.depthStencilAttachment.sampleCount;
        depthStencil.depthLoadOp = info.depthStencilAttachment.depthLoadOp;
        depthStencil.depthStoreOp = info.depthStencilAttachment.depthStoreOp;
        depthStencil.stencilLoadOp = info.depthStencilAttachment.stencilLoadOp;
        depthStencil.stencilStoreOp = info.depthStencilAttachment.stencilStoreOp;
        const beginAccesses = new wgpuWasmModule.AccessTypeList();
        for (let i = 0; i < info.depthStencilAttachment.beginAccesses.length; i++) {
            beginAccesses.push_back(info.depthStencilAttachment.beginAccesses[i]);
        }
        depthStencil.beginAccesses = beginAccesses;
        const endAccesses = new wgpuWasmModule.AccessTypeList();
        for (let i = 0; i < info.depthStencilAttachment.endAccesses.length; i++) {
            endAccesses.push_back(info.depthStencilAttachment.endAccesses[i]);
        }
        depthStencil.endAccesses = endAccesses;
        depthStencil.isGeneralLayout = info.depthStencilAttachment.isGeneralLayout;

        const subpasses = new wgpuWasmModule.SubpassInfoList();
        for (let i = 0; i < info.subpasses.length; i++) {
            const originSubpass = info.subpasses[i];
            const subpass = new wgpuWasmModule.SubpassInfoInstance();
            const inputs = new wgpuWasmModule.vector_uint();
            for (let j = 0; j < originSubpass.inputs.length; j++) {
                inputs.push_back(originSubpass.inputs[i]);
            }
            subpass.inputs = inputs;
            const colors = new wgpuWasmModule.vector_uint();
            for (let j = 0; j < originSubpass.colors.length; j++) {
                colors.push_back(originSubpass.colors[i]);
            }
            subpass.colors = colors;
            const resolves = new wgpuWasmModule.vector_uint();
            for (let j = 0; j < originSubpass.resolves.length; j++) {
                resolves.push_back(originSubpass.resolves[i]);
            }
            subpass.resolves = resolves;
            const preserves = new wgpuWasmModule.vector_uint();
            for (let j = 0; j < originSubpass.preserves.length; j++) {
                preserves.push_back(originSubpass.preserves[i]);
            }
            subpass.preserves = preserves;
            subpass.depthStencil = originSubpass.depthStencil;
            subpass.depthStencilResolve = originSubpass.depthStencilResolve;
            subpass.depthResolveMode = originSubpass.depthResolveMode;
            subpass.stencilResolveMode = originSubpass.stencilResolveMode;

            subpasses.push_back(subpass);
        }

        const dependencies = new wgpuWasmModule.SubpassDependencyList();
        for (let i = 0; i < info.dependencies.length; i++) {
            const originDeps = info.dependencies[i];
            const dependency = new wgpuWasmModule.SubpassDependencyInstance();
            dependency.srcSubpass = originDeps.srcSubpass;
            dependency.dstSubpass = originDeps.dstSubpass;
            const srcAccesses = new wgpuWasmModule.AccessTypeList();
            for (let j = 0; j < originDeps.srcAccesses.length; j++) {
                srcAccesses.push_back(originDeps.srcAccesses[i]);
            }
            dependency.srcAccesses = srcAccesses;
            const dstAccesses = new wgpuWasmModule.AccessTypeList();
            for (let j = 0; j < originDeps.dstAccesses.length; j++) {
                dstAccesses.push_back(originDeps.dstAccesses[i]);
            }
            dependency.dstAccesses = dstAccesses;
            dependencies.push_back(dependency);
        }

        const renderPassInfo = {
            colorAttachments: colorVec,
            depthStencilAttachment: depthStencil,
            subpasses,
            dependencies,
        };

        this._nativeDevice?.createRenderPass(renderPassInfo);
    }

    public createFramebuffer (info: FramebufferInfo): Framebuffer {
        this._nativeDevice?.createFramebuffer(info);
    }

    public createDescriptorSetLayout (info: DescriptorSetLayoutInfo): DescriptorSetLayout {
        this._nativeDevice?.createDescriptorSetLayout(info);
    }

    public createPipelineLayout (info: PipelineLayoutInfo): PipelineLayout {
        this._nativeDevice?.createPipelineLayout(info);
    }

    public createPipelineState (info: PipelineStateInfo): PipelineState {
        this._nativeDevice?.createPipelineState(info);
    }

    public createQueue (info: QueueInfo): Queue {
        this._nativeDevice?.createQueue(info);
    }

    public createGlobalBarrier (info: GlobalBarrierInfo): GlobalBarrier {
        this._nativeDevice?.createGlobalBarrier(info);
    }

    public createTextureBarrier (info: TextureBarrierInfo): TextureBarrier {
        this._nativeDevice?.createTextureBarrier(info);
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]): void {
        this._nativeDevice?.copyBuffersToTexture(buffers, texture, regions);
    }

    public copyTextureToBuffers (texture: Texture, buffers: ArrayBufferView[], regions: BufferTextureCopy[]): void {
        this._nativeDevice?.copyTextureToBuffers(texture, buffers, regions);
    }

    public copyTexImagesToTexture (texImages: TexImageSource[], texture: Texture, regions: BufferTextureCopy[]): void {
        this._nativeDevice?.copyTextureToBuffers(texImages, texture, regions);
    }

    // deprecated
    public copyFramebufferToBuffer (srcFramebuffer: Framebuffer, dstBuffer: ArrayBuffer, regions: BufferTextureCopy[]): void {
        // this._nativeDevice?.copyTextureToBuffers(srcFramebuffer, dstBuffer, regions);
    }
}
