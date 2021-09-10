import { Buffer } from '../base/buffer';
import {
    BufferFlagBit,
    BufferUsageBit,
    IndirectBuffer,
    BufferSource,
    BufferInfo,
    BufferViewInfo,
} from '../base/define';

import { toWGPUNativeBufferFlag, toWGPUNativeBufferMemUsage, toWGPUNativeBufferUsage } from './webgpu-commands';

import { wgpuWasmModule } from './webgpu-utils';

export class WebGPUBuffer extends Buffer {
    private _nativeBuffer;

    get nativeBuffer () {
        return this._nativeBuffer;
    }

    public initialize (info: BufferInfo | BufferViewInfo): boolean {
        const nativeDevice = wgpuWasmModule.nativeDevice;
        if ('buffer' in info) { // buffer view
            const bufferViewInfo = new wgpuWasmModule.BufferViewInfoInstance();
            bufferViewInfo.setBuffer((info.buffer as WebGPUBuffer).nativeBuffer);
            bufferViewInfo.setOffset(info.offset);
            bufferViewInfo.setRange(info.range);
            this._nativeBuffer = nativeDevice.createBufferView(bufferViewInfo);
        } else { // buffer
            const bufferInfo = new wgpuWasmModule.BufferInfoInstance();

            const usageStr = BufferUsageBit[info.usage];
            bufferInfo.usage = wgpuWasmModule.BufferUsage[usageStr];

            bufferInfo.memUsage = toWGPUNativeBufferMemUsage(info.memUsage);
            bufferInfo.size = info.size;
            bufferInfo.stride = info.stride;
            bufferInfo.flags = toWGPUNativeBufferFlag(info.flags);
            this._nativeBuffer = nativeDevice.createBuffer(bufferInfo);
        }

        return true;
    }

    public destroy () {
        this._nativeBuffer.destroy();
        this._nativeBuffer.delete();
    }

    public resize (size: number) {
        this._nativeBuffer.resize(size);
    }

    public update (buffer: BufferSource, size?: number) {
        if (size === undefined) {
            const buff = buffer as ArrayBuffer;
            const data = new Uint8Array(buff);
            this._nativeBuffer.update(data.buffer, data.length);
        } else {
            const buff = buffer as ArrayBuffer;
            const data = new Uint8Array(buff);
            this._nativeBuffer.update(data.buffer, size);
        }
    }
}
