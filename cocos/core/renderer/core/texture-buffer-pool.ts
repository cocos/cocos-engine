/**
 * @hidden
 */

import { getTypedArrayConstructor, GFXBufferTextureCopy, GFXFormat, GFXFormatInfos, GFXTextureType, GFXTextureUsageBit, GFXTextureFlagBit } from '../../gfx/define';
import { GFXDevice } from '../../gfx/device';
import { GFXTexture } from '../../gfx/texture';

export function nearestPOT (num: number): number {
    --num;
    num |= num >> 16;
    num |= num >> 8;
    num |= num >> 4;
    num |= num >> 2;
    num |= num >> 1;
    ++num;
    return num;
}

export interface ITextureBuffer {
    texture: GFXTexture;
    size: number;
    start: number;
    end: number;
}

export interface ITextureBufferHandle {
    chunkIdx: number;
    start: number;
    end: number;
    texture: GFXTexture;
}

export interface ITextureBufferPoolInfo {
    format: GFXFormat; // target texture format
    inOrderFree?: boolean; // will the handles be freed exactly in the order of their allocation?
    alignment?: number; // the data alignment for each handle allocated, in bytes
    roundUpFn?: (size: number, formatSize: number) => number; // given a target size, how will the actual texture size round up?
}

function roundUp (n: number, alignment: number) {
    return Math.ceil(n / alignment) * alignment;
}

export class TextureBufferPool {

    private _device: GFXDevice;
    private _format = GFXFormat.UNKNOWN;
    private _formatSize = 0;
    private _chunks: ITextureBuffer[] = [];
    private _chunkCount = 0;
    private _handles: ITextureBufferHandle[] = [];
    private _region0 = new GFXBufferTextureCopy();
    private _region1 = new GFXBufferTextureCopy();
    private _region2 = new GFXBufferTextureCopy();
    private _roundUpFn: ((targetSize: number, formatSize: number) => number) | null = null;
    private _bufferViewCtor: TypedArrayConstructor = Uint8Array;
    private _channels = 4;
    private _alignment = 1;

    public constructor (device: GFXDevice) {
        this._device = device;
    }

    public initialize (info: ITextureBufferPoolInfo) {
        const formatInfo = GFXFormatInfos[info.format];
        this._format = info.format;
        this._formatSize = formatInfo.size;
        this._channels = formatInfo.count;
        this._bufferViewCtor = getTypedArrayConstructor(formatInfo);
        this._roundUpFn = info.roundUpFn || null;
        this._alignment = info.alignment || 1;
        if (info.inOrderFree) { this.alloc = this._McDonaldAlloc; }
    }

    public destroy () {
        for (let i = 0; i < this._chunkCount; ++i) {
            const chunk = this._chunks[i];
            chunk.texture.destroy();
        }
        this._chunks.length = 0;
        this._handles.length = 0;
    }

    public alloc (size: number, chunkIdx?: number) {
        size = roundUp(size, this._alignment);

        let index = -1;
        let start = -1;
        if (chunkIdx !== undefined) {
            index = chunkIdx;
            start = this._findAvailableSpace(size, index);
        }

        if (start < 0) {
            for (let i = 0; i < this._chunkCount; ++i) {
                index = i;
                start = this._findAvailableSpace(size, index);
                if (start >= 0) { break; }
            }
        }

        if (start >= 0) {
            const chunk = this._chunks[index];
            chunk.start += size;
            const handle: ITextureBufferHandle = {
                chunkIdx: index,
                start,
                end: start + size,
                texture: chunk.texture,
            };
            this._handles.push(handle);
            return handle;
        }

        // create a new one
        const targetSize = Math.sqrt(size / this._formatSize);
        const texLength = this._roundUpFn && this._roundUpFn(targetSize, this._formatSize) || Math.max(1024, nearestPOT(targetSize));
        const newChunk = this._chunks[this.createChunk(texLength)];

        newChunk.start += size;
        const texHandle: ITextureBufferHandle = {
            chunkIdx: this._chunkCount - 1,
            start: 0,
            end: size,
            texture: newChunk.texture,
        };
        this._handles.push(texHandle);
        return texHandle;
    }

    public free (handle: ITextureBufferHandle) {
        for (let i = 0; i < this._handles.length; ++i) {
            if (this._handles[i] === handle) {
                this._chunks[handle.chunkIdx].end = handle.end;
                this._handles.splice(i, 1);
                return;
            }
        }
    }

    public createChunk (length: number) {
        const texSize = length * length * this._formatSize;

        console.info('TextureBufferPool: Allocate chunk ' + this._chunkCount + ', size: ' + texSize + ', format: ' + this._format);

        const texture: GFXTexture = this._device.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED | GFXTextureUsageBit.TRANSFER_DST,
            format: this._format,
            width: length,
            height: length,
            mipLevel: 1,
        });

        const chunk: ITextureBuffer = {
            texture,
            size: texSize,
            start: 0,
            end: texSize,
        };
        this._chunks[this._chunkCount] = chunk;
        return this._chunkCount++;
    }

    public update (handle: ITextureBufferHandle, buffer: ArrayBuffer) {

        const buffers: ArrayBufferView[] = [];
        const regions: GFXBufferTextureCopy[] = [];
        const start = handle.start / this._formatSize;

        let remainSize = buffer.byteLength / this._formatSize;
        let offsetX = start % handle.texture.width;
        let offsetY = Math.floor(start / handle.texture.width);
        let copySize = Math.min(handle.texture.width - offsetX, remainSize);
        let begin = 0;

        if (offsetX > 0) {
            this._region0.texOffset.x = offsetX;
            this._region0.texOffset.y = offsetY;
            this._region0.texExtent.width = copySize;
            this._region0.texExtent.height = 1;

            buffers.push(new this._bufferViewCtor(buffer, begin * this._formatSize, copySize * this._channels));
            regions.push(this._region0);

            offsetX = 0;
            offsetY += 1;
            remainSize -= copySize;
            begin += copySize;
        }

        if (remainSize > 0) {
            this._region1.texOffset.x = offsetX;
            this._region1.texOffset.y = offsetY;

            if (remainSize > handle.texture.width) {
                this._region1.texExtent.width = handle.texture.width;
                this._region1.texExtent.height = Math.floor(remainSize / handle.texture.width);
                copySize = this._region1.texExtent.width * this._region1.texExtent.height;
            } else {
                copySize = remainSize;
                this._region1.texExtent.width = copySize;
                this._region1.texExtent.height = 1;
            }

            buffers.push(new this._bufferViewCtor(buffer, begin * this._formatSize, copySize * this._channels));
            regions.push(this._region1);

            offsetX = 0;
            offsetY += this._region1.texExtent.height;
            remainSize -= copySize;
            begin += copySize;
        }

        if (remainSize > 0) {
            this._region2.texOffset.x = offsetX;
            this._region2.texOffset.y = offsetY;
            this._region2.texExtent.width = remainSize;
            this._region2.texExtent.height = 1;

            buffers.push(new this._bufferViewCtor(buffer, begin * this._formatSize, remainSize * this._channels));
            regions.push(this._region2);
        }

        this._device.copyBuffersToTexture(buffers, handle.texture, regions);
    }

    private _findAvailableSpace (size: number, chunkIdx: number) {
        const chunk = this._chunks[chunkIdx];
        let isFound = false;
        let start = chunk.start;
        if ((start + size) <= chunk.size) {
            isFound = true;
        } else {
            start = 0; // try to find from head again
            const handles = this._handles.filter((h) => h.chunkIdx === chunkIdx).sort((a, b) => a.start - b.start);
            for (let i = 0; i < handles.length; i++) {
                const handle = handles[i];
                if ((start + size) <= handle.start) {
                    isFound = true;
                    break;
                }
                start = handle.end;
            }
            if (!isFound && (start + size) <= chunk.size) {
                isFound = true;
            }
        }
        return isFound ? start : -1;
    }

    // [McDonald 12] Efficient Buffer Management
    private _McDonaldAlloc (size: number) {
        size = roundUp(size, this._alignment);

        for (let i = 0; i < this._chunkCount; ++i) {
            const chunk = this._chunks[i];
            let isFound = false;
            let start = chunk.start;
            if ((start + size) <= chunk.end) {
                isFound = true;
            } else if (start > chunk.end) {
                if ((start + size) <= chunk.size) {
                    isFound = true;
                } else if (size <= chunk.end) {
                    // Try to find from head again.
                    chunk.start = start = 0;
                    isFound = true;
                }
            } else if (start === chunk.end) {
                chunk.start = start = 0;
                chunk.end = chunk.size;
                if (size <= chunk.end) {
                    isFound = true;
                }
            }
            if (isFound) {
                chunk.start += size;
                const handle: ITextureBufferHandle = {
                    chunkIdx: i,
                    start,
                    end: start + size,
                    texture: chunk.texture,
                };
                this._handles.push(handle);
                return handle;
            }
        }

        // create a new one
        const targetSize = Math.sqrt(size / this._formatSize);
        const texLength = this._roundUpFn && this._roundUpFn(targetSize, this._formatSize) || Math.max(1024, nearestPOT(targetSize));
        const newChunk = this._chunks[this.createChunk(texLength)];

        newChunk.start += size;
        const texHandle: ITextureBufferHandle = {
            chunkIdx: this._chunkCount,
            start: 0,
            end: size,
            texture: newChunk.texture,
        };
        this._handles.push(texHandle);
        return texHandle;
    }
}
