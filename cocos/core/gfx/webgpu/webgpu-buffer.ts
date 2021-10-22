/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Buffer } from '../base/buffer';
import {
    BufferSource,
    BufferInfo,
    BufferViewInfo,
    DrawInfo,
    IndirectBuffer,
} from '../base/define';

import { toWGPUNativeBufferFlag, toWGPUNativeBufferMemUsage, toWGPUNativeBufferUsage } from './webgpu-commands';

import { nativeLib } from './webgpu-utils';

export class WebGPUBuffer extends Buffer {
    private _nativeBuffer;

    get nativeBuffer () {
        return this._nativeBuffer;
    }

    public initialize (info: BufferInfo | BufferViewInfo): boolean {
        const nativeDevice = nativeLib.nativeDevice;
        if ('buffer' in info) { // buffer view
            this._isBufferView = true;

            const buffer = info.buffer as WebGPUBuffer;
            this._usage = buffer.usage;
            this._memUsage = buffer.memUsage;
            this._size = this._stride = Math.ceil(info.range / 4) * 4;
            this._count = 1;
            this._flags = buffer.flags;

            const bufferViewInfo = new nativeLib.BufferViewInfoInstance();
            bufferViewInfo.setBuffer((info.buffer as WebGPUBuffer).nativeBuffer);
            bufferViewInfo.setOffset(info.offset);
            bufferViewInfo.setRange(info.range);
            this._nativeBuffer = nativeDevice.createBufferView(bufferViewInfo);
        } else { // buffer
            this._usage = info.usage;
            this._memUsage = info.memUsage;
            this._size = info.size;
            this._stride = info.stride;
            this._count = this._size / this._stride;
            this._flags = info.flags;
            const bufferInfo = new nativeLib.BufferInfoInstance();
            bufferInfo.setUsage(info.usage);
            bufferInfo.setMemUsage(info.memUsage);
            bufferInfo.setSize(info.size);
            bufferInfo.setStride(info.stride);
            bufferInfo.setFlags(info.flags);
            this._nativeBuffer = nativeDevice.createBuffer(bufferInfo);
        }

        return true;
    }

    public destroy () {
        this._nativeBuffer.destroy();
        this._nativeBuffer.delete();
    }

    public resize (size: number) {
        this._size = size;
        this._count = this._size / this._stride;
        this._nativeBuffer.resize(size);
    }

    public update (buffer: BufferSource, size?: number) {
        if (buffer instanceof IndirectBuffer) {
            const drawInfos = new nativeLib.DrawInfoList();
            for (let i = 0; i < buffer.drawInfos.length; i++) {
                const drawInfo = new nativeLib.DrawInfo();
                drawInfo.vertexCount = buffer.drawInfos[i].vertexCount;
                drawInfo.firstVertex = buffer.drawInfos[i].firstVertex;
                drawInfo.indexCount = buffer.drawInfos[i].indexCount;
                drawInfo.firstIndex = buffer.drawInfos[i].firstIndex;
                drawInfo.vertexOffset = buffer.drawInfos[i].vertexOffset;
                drawInfo.instanceCount = buffer.drawInfos[i].instanceCount;
                drawInfo.firstInstance = buffer.drawInfos[i].firstInstance;
                drawInfos.push_back(drawInfo);
            }
            this._nativeBuffer.updateDrawInfo(drawInfos);
        } else {
            const buff = buffer;
            let data;
            let rawBuffer;
            if ('buffer' in buff) {
                // es-lint as any
                rawBuffer = (buff as any).buffer;
                data = new Uint8Array((buff as any).buffer, (buff as any).byteOffset, (buff as any).byteLength);
            } else {
                rawBuffer = buff;
                data = new Uint8Array(rawBuffer);
            }
            const bufferSize = size === undefined ? buff.byteLength : size;
            this._nativeBuffer.update(data, bufferSize);
        }
    }
}
