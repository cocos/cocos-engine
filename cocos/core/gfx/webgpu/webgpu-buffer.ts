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
            this._usage = info.usage;
            this._memUsage = info.memUsage;
            this._size = info.size;
            this._stride = info.stride;
            this._flags = info.flags;
            const bufferInfo = new wgpuWasmModule.BufferInfoInstance();
            bufferInfo.usage = toWGPUNativeBufferUsage(info.usage);
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
        const buff = buffer as ArrayBuffer;
        //const data = new Uint8Array(buff);
        const bufferSize = size === undefined ? buff.byteLength : size;
        const utf8decoder = new TextDecoder('ascii'); // default 'utf-8' or 'utf8'
        // const u8arr = new Uint8Array([97, 65, 98, 66]);
        // console.log(utf8decoder.decode(u8arr));
        const str = utf8decoder.decode(buff);
        this._nativeBuffer.update(str, bufferSize);
    }
}
