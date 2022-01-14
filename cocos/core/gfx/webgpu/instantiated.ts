import glslangLoader from './lib/glslang.js';
import wasmDevice from './lib/webgpu_wasm.js';

export const glslalgWasmModule: any = {
    glslang: null,
};

export const nativeLib: any = {
    wasmBinary: null,
    nativeDevice: null,
};

export const webgpuAdapter: any = {
    adapter: null,
    device: null,
};

export function waitForWebGPUInstantiation (rootDir: string) {
    return Promise.all([
        glslangLoader('./cocos-js/glslang.wasm').then((res) => {
            glslalgWasmModule.glslang = res;
        }),
        new Promise<void>((resolve) => {
            fetch('./cocos-js/webgpu_wasm.wasm').then((response) => {
                response.arrayBuffer().then((buffer) => {
                    nativeLib.wasmBinary = buffer;
                    wasmDevice(nativeLib).then(resolve);
                }).catch((e) => {});
            }).catch((e) => {});
        }),
        new Promise<void>((resolve) => {
            (navigator as any).gpu.requestAdapter().then((adapter) => {
                adapter.requestDevice().then((device) => {
                    webgpuAdapter.adapter = adapter;
                    webgpuAdapter.device = device;
                    resolve();
                });
            });
        }),
    ]);
}
