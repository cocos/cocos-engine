import { WebGPUBuffer } from './webgpu-buffer';
import { WebGPUDevice } from './webgpu-device';
import { WebGPUSampler } from './webgpu-sampler';
import { WebGPUTexture } from './webgpu-texture';

export class WebGPUDeviceManager {
    static get instance (): WebGPUDevice {
        return WebGPUDeviceManager._instance!;
    }
    static setInstance (instance: WebGPUDevice): void {
        WebGPUDeviceManager._instance = instance;
    }
    private static _instance: WebGPUDevice | null = null;
}

function hashCombine (hash, currHash: number): number {
    return currHash ^= (hash >>> 0) + 0x9e3779b9 + (currHash << 6) + (currHash >> 2);
}

export function hashCombineNum (val: number, currHash: number): number {
    const hash = 5381;
    return hashCombine((hash * 33) ^ val, currHash);
}

export function hashCombineStr (str: string, currHash: number): number {
    // DJB2 HASH
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hashCombine(hash, currHash);
}

export class DefaultResources {
    // hash, targetResource
    buffersDescLayout: Map<number, WebGPUBuffer> = new Map<number, WebGPUBuffer>();
    texturesDescLayout: Map<number, WebGPUTexture> = new Map<number, WebGPUTexture>();
    samplersDescLayout: Map<number, WebGPUSampler> = new Map<number, WebGPUSampler>();
    buffer!: WebGPUBuffer;
    texture!: WebGPUTexture;
    sampler!: WebGPUSampler;
}