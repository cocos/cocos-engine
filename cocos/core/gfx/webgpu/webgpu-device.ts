/* eslint-disable @typescript-eslint/no-floating-promises */
import { ALIPAY, RUNTIME_BASED, BYTEDANCE, WECHAT, LINKSURE, QTT, COCOSPLAY, HUAWEI } from 'internal:constants';
// import wasmDevice from '@cocos/webgpu/lib/webgpu_wasm';
// import fs from 'fs';
import { resolve } from 'path/posix';
import { Device } from '../base/device';
import { DeviceInfo, RenderPassInfo, ColorAttachment, SampleCount, FramebufferInfo } from '../base/define';
import { RenderPass } from '../base/render-pass';
import { wgpuWasmModule } from './webgpu-utils';
import { WebGPURenderPass } from './webgpu-render-pass';
import { WebGPUFramebuffer } from './webgpu-framebuffer';

export class WebGPUDevice extends Device {
    private _nativeDevice = undefined;

    get nativeDevice () {
        return this._nativeDevice;
    }

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
                if (wgpuWasmModule.wasmLoaded) {
                    return resolve(getDevice().then(() => launch()));
                } else {
                    setTimeout((_) => {
                        poll(resolve);
                    }, 30);
                }
            };

            return new Promise(poll);
        }

        return init().then(() => true);
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
        const renderPass = new WebGPURenderPass(this);
        if (renderPass.initialize(info)) {
            return renderPass;
        }
        return null!;
    }

    public createFramebuffer (info: FramebufferInfo): Framebuffer {
        const framebuffer = new WebGPUFramebuffer(this);
        if (framebuffer.initialize(info)) {
            return framebuffer;
        }
        return null!;
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
