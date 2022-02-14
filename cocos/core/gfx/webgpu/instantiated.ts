import glslangURL from '@cocos/webgpu/glslang.wasmurl';
import webgpuURL from '@cocos/webgpu/webgpu.wasmurl';
import glslangLoader from '@cocos/webgpu/glslang';
import wasmDevice from '@cocos/webgpu/webgpu_wasm';

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
        glslangLoader(rootDir + glslangURL).then((res) => {
            glslalgWasmModule.glslang = res;
        }),
        new Promise<void>((resolve) => {
            fetch(rootDir + webgpuURL).then((response) => {
                response.arrayBuffer().then((buffer) => {
                    nativeLib.wasmBinary = buffer;
                    wasmDevice(nativeLib).then(resolve);
                }).catch((e) => { });
            }).catch((e) => { });
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
