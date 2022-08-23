/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-void */
/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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
import { EDITOR } from 'internal:constants';
import { game } from '../core/game';
import { legacyCC } from '../core/global-exports';

// import glslangURL from '@cocos/webgpu/glslang.wasmurl';
// import webgpuURL from '@cocos/webgpu/webgpu_wasm.wasmurl';
// import glslangLoader from '@cocos/webgpu/glslang';
import wasmDevice from './webgpu_wasm';
import glslangLoader from './glslang';
import { polyfillGfx } from '../core/gfx/webgpu/webgpu-define';

export const glslalgWasmModule: any = {
    glslang: null,
};

export const gfx: any = legacyCC.gfx = {
    wasmBinary: null,
    nativeDevice: null,
};

export const webgpuAdapter: any = {
    adapter: null,
    device: null,
};

function waitForWebGPUInstantiation () {
    return Promise.all([
        glslangLoader('./glslang.wasm').then((res) => {
            glslalgWasmModule.glslang = res;
        }),
        new Promise<void>((resolve) => {
            //http://192.168.52.147:7456
            fetch('./webgpu_wasm.wasm').then((response) => {
                response.arrayBuffer().then((buffer) => {
                    gfx.wasmBinary = buffer;
                    wasmDevice(gfx).then(() => {
                        legacyCC.WebGPUDevice = gfx.CCWGPUDevice;
                        legacyCC.gfx.Device = gfx.CCWGPUDevice;
                        legacyCC.gfx.Swapchain = gfx.CCWGPUSwapchain;
                        legacyCC.gfx.Buffer = gfx.CCWGPUBuffer;
                        legacyCC.gfx.Texture = gfx.CCWGPUTexture;
                        legacyCC.gfx.Sampler = gfx.CCWGPUSampler;
                        legacyCC.gfx.Shader = gfx.CCWGPUShader;
                        legacyCC.gfx.InputAssembler = gfx.CCWGPUInputAssembler;
                        legacyCC.gfx.RenderPass = gfx.CCWGPURenderPass;
                        legacyCC.gfx.Framebuffer = gfx.CCWGPUFramebuffer;
                        legacyCC.gfx.DescriptorSet = gfx.CCWGPUDescriptorSet;
                        legacyCC.gfx.DescriptorSetLayout = gfx.CCWGPUDescriptorSetLayout;
                        legacyCC.gfx.PipelineLayout = gfx.CCWGPUPipelineLayout;
                        legacyCC.gfx.PipelineState = gfx.CCWGPUPipelineState;
                        legacyCC.gfx.CommandBuffer = gfx.CCWGPUCommandBuffer;
                        legacyCC.gfx.Queue = gfx.CCWGPUQueue;
                        polyfillGfx();
                        resolve();
                    });
                });
            });
        }),
        new Promise<void>((resolve) => {
            (navigator as any).gpu.requestAdapter().then((adapter) => {
                adapter.requestDevice().then((device) => {
                    webgpuAdapter.adapter = adapter;
                    webgpuAdapter.device = device;
                    console.log(gfx);
                    resolve();
                });
            });
        }),
    ]).then(() => Promise.resolve());
}

game.onPreInfrastructureInitDelegate.add(waitForWebGPUInstantiation);
